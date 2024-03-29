import { buffer } from 'micro';
import mongoose from 'mongoose';

import {
  address as contractAddress,
  abi,
} from '@/contract/FairytalesAndConspiracies';
import dbConnect from '@/lib/dbConnect';
import { sendErrorWithMessage } from '@/lib/errorHandling';
import { finishOrder, orderFramesMongoFilter } from '@/lib/orders';
import stripe from '@/lib/stripe';
import getWeb3 from '@/lib/web3';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import { ErrorTypes } from '@/static-data/errors';
import TransactionStatus from '@/static-data/transaction-status';
import { getTokenIdFromFrame } from '@/utils/contract';
import { getSuccessfulFramesFromContractCallWithReturnTokensEvent } from '@/utils/orders';
import { padZeroes } from '@/utils/string';

const { STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_ADDRESS_FROM: ADDRESS_FROM } =
  process.env;

const lockFrames = async (lockableFrames) => {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(abi, contractAddress);
  const tokenIds = lockableFrames.map(getTokenIdFromFrame);

  const tx = await contract.methods.lockNFTs(tokenIds).send({
    from: ADDRESS_FROM,
  });

  const lockedFrames = getSuccessfulFramesFromContractCallWithReturnTokensEvent(
    tx,
    lockableFrames
  );

  return {
    lockedFrames,
    transactionHash: tx?.transactionHash,
  };
};

const updateOrder = async (confirmationKey) => {
  let order;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    order = await Order.findOne({ confirmationKey }).session(session);

    if (order.transactionStatus !== TransactionStatus.PENDING) {
      // Workaround because error sending not working as expected.
      await session.abortTransaction();
      return {
        alreadyUpdated: true,
      };
    }

    const allFramesFilter = orderFramesMongoFilter(order.frames);

    const lockableFrames = await Frame.find({
      ...allFramesFilter,
      sold: false,
    }).session(session);

    const { frames } = order;

    const { lockedFrames, transactionHash } =
      lockableFrames.length > 0 ? await lockFrames(lockableFrames) : [];

    const lastOrderNumber = await Order.countDocuments({
      transactionStatus: {
        $in: [
          TransactionStatus.SUCCESSFUL,
          TransactionStatus.PARTIALLY_SUCCESSFUL,
        ],
      },
    }).session(session);
    const orderNumber = lastOrderNumber + 1;

    const lockedFramesFilter = orderFramesMongoFilter(lockedFrames);

    const claimableFrames = await Frame.find({
      ...lockedFramesFilter,
      sold: false,
    }).session(session);

    const transactionStatus =
      claimableFrames.length === 0
        ? TransactionStatus.FAILED
        : claimableFrames.length !== frames.length
        ? TransactionStatus.PARTIALLY_SUCCESSFUL
        : TransactionStatus.SUCCESSFUL;

    const update = {
      failedFrames: order.frames.filter(
        (frame) =>
          !claimableFrames.find(
            // eslint-disable-next-line no-underscore-dangle
            (claimableFrame) => claimableFrame._id.equals(frame._id)
          )
      ),
      invoiceNumber: `NFT${padZeroes(orderNumber, 6)}`,
      orderNumber,
      transactionHash,
      transactionStatus,
      transactionSuccessfulTimestamp: Date.now(),
    };

    Object.assign(order, update);

    await Order.updateOne({ confirmationKey }, update).session(session);

    await Frame.updateMany(lockedFramesFilter, { sold: true }, { session });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    // TODO: sendMailForFailedToUpdateOrder(order); - For us
    // TODO: sendMailForPurchasedOrderNoClarity(order); - For user
    throw err;
  } finally {
    await session.endSession();
  }

  return order;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res
      .status(400)
      .json({ success: false, error: ErrorTypes.METHOD_NOT_ALLOWED });
    return;
  }

  let event;
  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    sendErrorWithMessage(res, `Webhook error: ${err.message}`);
    return;
  }

  await dbConnect();

  if (event?.type !== 'checkout.session.completed') {
    res.status(400).json({
      success: false,
      error: `Stripe checkout session not completed!`,
    });
    return;
  }

  // From this moment we consider that they successfully payed

  const confirmationKey = event.data.object.client_reference_id;

  let order;
  try {
    order = await updateOrder(confirmationKey);
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }

  // Workaround because error sending not working as expected.
  if (order && order.alreadyUpdated) {
    res.status(201).json({
      success: true,
      data: { message: 'Response to resent webhook' },
    });
  } else {
    try {
      const allFramesFilter = orderFramesMongoFilter(order.frames);
      const failedFramesFilter = orderFramesMongoFilter(order.failedFrames);
      const allFrames = await Frame.find(allFramesFilter);
      const failedFrames = await Frame.find(failedFramesFilter);

      const successfulFrames = allFrames.filter(
        (frame) =>
          !failedFrames.find(
            (failedFrame) =>
              frame.video === failedFrame.video &&
              frame.frame === failedFrame.frame
          )
      );

      if (order && allFrames) {
        await finishOrder(order, successfulFrames, failedFrames); // TODO: Alter this email template to distinguish between failed and sold frames
        res.status(201).json({ success: true, data: order });
      } else {
        // TODO: Send mail to us instead since we cant send the mail to user (with proper info) in this case
        res.status(400).json({
          success: false,
          error: 'Do not have proper order and frames info',
        });
      }
    } catch (err) {
      res.status(400).json({ success: false, error: err.toString() });
    }
  }
};

export default handler;
