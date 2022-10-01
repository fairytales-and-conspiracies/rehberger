import { buffer } from 'micro';

import {
  address as contractAddress,
  abi,
} from '@/contract/FairytalesAndConspiracies';
import dbConnect from '@/lib/dbConnect';
import { sendErrorWithMessage } from '@/lib/errorHandling';
import stripe from '@/lib/stripe';
import getWeb3 from '@/lib/web3';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import {
  orderFramesMongoFilter,
  sendMailForPurchasedOrder,
} from '@/pages/api/orders';
import { ErrorTypes } from '@/static-data/errors';
import TransactionStatus from '@/static-data/transaction-status';
import { getTokenIdFromFrame } from '@/utils/contract';
import { padZeroes } from '@/utils/string';
import mongoose from 'mongoose';

const { STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_ADDRESS_FROM: ADDRESS_FROM } =
  process.env;

const lockFrames = async (lockableFrames) => {
  const web3 = getWeb3();
  console.log(`1 - ${web3}`);
  const contract = new web3.eth.Contract(abi, contractAddress);
  console.log(`2 - ${contract}`);
  const tokenIds = lockableFrames.map(getTokenIdFromFrame);
  console.log(`3 - ${tokenIds}`);

  const tx = await contract.methods.lockNFTs(tokenIds).send({
    from: ADDRESS_FROM,
  });
  console.log(`4 - ${tx}`);
  const tokensAsStrings = tx?.events?.returnTokens?.returnValues?.tokens?.[0];
  console.log(`5 - ${tokensAsStrings}`);
  const tokens = tokensAsStrings.map(parseInt);
  console.log(`6 - ${tokens}`);

  const lockedFrames =
    tokens && tokens.length > 0
      ? lockableFrames.filter((frame) =>
          tokens.include(getTokenIdFromFrame(frame))
        )
      : [];
  console.log(`7 - ${lockedFrames}`);
  return lockedFrames;
};

const updateOrder = async (confirmationKey) => {
  let allFramesFilter;
  let order;
  let lockableFrames;
  let update;
  let allFrames;

  const preLockSession = await mongoose.startSession();
  preLockSession.startTransaction();
  try {
    order = await Order.findOne({ confirmationKey }).session(preLockSession);

    allFramesFilter = orderFramesMongoFilter(order.frames);

    allFrames = await Frame.find(allFramesFilter);

    lockableFrames = await Frame.find({
      ...allFramesFilter,
      sold: false,
    }).session(preLockSession);

    await preLockSession.commitTransaction();
  } catch (e) {
    await preLockSession.abortTransaction();
    // TODO: sendMailForFailedToReadOrderData(order);
    sendMailForPurchasedOrder(order, allFrames);
    return;
  } finally {
    await preLockSession.endSession();
  }

  const { frames } = order;

  const lockedFrames =
    lockableFrames.length > 0 ? await lockFrames(lockableFrames) : [];

  const updateOrderSession = await mongoose.startSession();
  updateOrderSession.startTransaction();
  try {
    const lastOrderNumber = await Order.countDocuments().session(
      updateOrderSession
    );
    const orderNumber = lastOrderNumber + 1;

    const lockedFramesFilter = orderFramesMongoFilter(lockedFrames);

    const alreadySoldFrames = await Frame.find({
      ...lockedFramesFilter,
      sold: true,
    }).session(updateOrderSession);

    const transactionStatus =
      // eslint-disable-next-line no-nested-ternary
      alreadySoldFrames.length === 0
        ? TransactionStatus.SUCCESSFUL
        : alreadySoldFrames.length !== frames.length
        ? TransactionStatus.PARTIALLY_SUCCESSFUL
        : TransactionStatus.FAILED;

    update = {
      invoiceNumber: `NFT${padZeroes(orderNumber, 6)}`,
      orderNumber,
      transactionStatus,
    };

    await Order.updateOne({ confirmationKey }, update).session(
      updateOrderSession
    );

    await Frame.updateMany(
      lockedFramesFilter,
      { sold: true },
      { updateOrderSession }
    );

    await updateOrderSession.commitTransaction();
  } catch (e) {
    await updateOrderSession.abortTransaction();
    // TODO: sendMailForFailedToUpdateOrder(order); - For us
    // TODO: sendMailForPurchasedOrderNoClarity(order); - For user
  } finally {
    await updateOrderSession.endSession();
  }

  const updatedFrames = await Frame.find(allFramesFilter);

  Object.assign(order, update);
  sendMailForPurchasedOrder(order, updatedFrames); // TODO: Alter this email template to distinguish between failed and sold frames
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
  await updateOrder(confirmationKey);
  res.status(201).json({ success: true });
};

export default handler;
