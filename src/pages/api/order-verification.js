import mongoose from 'mongoose';

import {
  address as contractAddress,
  abi,
} from '@/contract/FairytalesAndConspiracies';
import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import { orderFramesMongoFilter } from '@/lib/orders';
import sendMail from '@/lib/sendMail';
import getWeb3 from '@/lib/web3';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import emailTypes from '@/static-data/email-types';
import { ErrorTypes } from '@/static-data/errors';
import { getTokenIdFromFrame } from '@/utils/contract';
import { getSuccessfulFramesFromContractCallWithReturnTokensEvent } from '@/utils/orders';

const { NEXT_PUBLIC_ADDRESS_FROM: ADDRESS_FROM } = process.env;

const claimFlow = async (res, order, walletAddress) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let claimedFrames;
  let failedToClaimFrames;
  let updatedOrder;

  try {
    const {
      _id: orderBuffer,
      frames: orderFrameRefs,
      failedFrames: failedFrameRefs,
    } = order;
    const orderNumber = orderBuffer.toString();

    const filter = orderFramesMongoFilter(orderFrameRefs);
    const failedFilter = orderFramesMongoFilter(failedFrameRefs);
    const allFrames = await Frame.find(filter).session(session);
    const failedFrames = await Frame.find(failedFilter).session(session);

    const frames = allFrames.filter(
      (frame) =>
        !failedFrames.find(
          (failedFrame) =>
            frame.video === failedFrame.video &&
            frame.frame === failedFrame.frame
        )
    );

    const web3 = getWeb3();
    const contract = new web3.eth.Contract(abi, contractAddress);
    const tokenIds = frames.map(getTokenIdFromFrame);

    const tx = await contract.methods.claimNFTs(walletAddress, tokenIds).send({
      from: ADDRESS_FROM,
    });

    claimedFrames = getSuccessfulFramesFromContractCallWithReturnTokensEvent(
      tx,
      frames
    );

    failedToClaimFrames = frames.filter(
      (frame) =>
        !claimedFrames.find(
          // eslint-disable-next-line no-underscore-dangle
          (claimedFrame) => claimedFrame._id.equals(frame._id)
        )
    );

    const update = {
      claimed: true,
      claimedTransactionHash: tx?.transactionHash,
      claimedTimestamp: Date.now(),
    };

    const orderCheckIfClaimed = await Order.findById(
      mongoose.Types.ObjectId(orderNumber)
    ).session(session);

    if (orderCheckIfClaimed.claimed) {
      session.abortTransaction();
      sendError(res, ErrorTypes.ALREADY_CLAIMED);
      return;
    }

    updatedOrder = await Order.findByIdAndUpdate(
      mongoose.Types.ObjectId(orderNumber),
      update,
      {
        lean: true,
      }
    );

    Object.assign(updatedOrder, update);

    updatedOrder.claimed = true;
  } catch (err) {
    session.abortTransaction();
  } finally {
    session.endSession();
  }

  if (updatedOrder && updatedOrder.claimed) {
    const mailSent = await sendMail(emailTypes.NFTsClaimed, {
      frames: claimedFrames,
      failedFrames: failedToClaimFrames,
      order: updatedOrder,
      walletAddress,
    }).catch(console.error);

    if (claimedFrames.length > 0) {
      res.status(201).json({ success: true, data: { order, mailSent } });
    } else {
      sendError(res, ErrorTypes.ERROR_CLAIMING);
    }
  } else {
    sendError(res, ErrorTypes.GENERIC_ERROR);
  }
};

const forSecurityVerification = async (req, res, order) => {
  const { answer, question, walletAddress } = req.body;

  if (order.question === question && order.answer === answer) {
    await claimFlow(res, order, walletAddress);
  } else {
    sendError(res, ErrorTypes.INCORRECT_SECURITY_QUESTION_ANSWER);
  }
};

const forOrderVerificationNoSecurityQuestion = async (req, res, order) => {
  const { walletAddress } = req.body;
  await claimFlow(res, order, walletAddress);
};

const forOrderVerificationSecurityQuestion = (res, order) => {
  const { noSecurityQuestion, question: orderQuestion } = order;
  res.status(201).json({
    success: true,
    data: {
      order: {
        noSecurityQuestion,
        question: orderQuestion,
      },
    },
  });
};

const handler = async (req, res) => {
  await dbConnect();

  let order;
  const { confirmationKey, securityVerification } = req.body;

  // This is when a customer that has paid by card wants to
  // claim their NFT
  try {
    order = await Order.findOne({ confirmationKey });
  } catch (err) {
    console.log('Error: ', err);

    // If order does not exist
    if (!!err.name && err.name === 'CastError') {
      sendError(res, ErrorTypes.NO_ORDER_FOUND);
    }

    // If there is another unexpected error
    else {
      sendError(res, ErrorTypes.GENERIC_ERROR);
    }
    return;
  }

  if (order.claimed) {
    sendError(res, ErrorTypes.ALREADY_CLAIMED);
  }

  // After submitting security question and answer form
  else if (securityVerification) {
    forSecurityVerification(req, res, order);
  }

  // After submitting the order verification form,
  // before submitting the security question and answer form
  // Check for undefined because in that case we do not want to
  // ask for a question / answer we did not store
  else if (order.noSecurityQuestion || order.noSecurityQuestion === undefined) {
    forOrderVerificationNoSecurityQuestion(req, res, order);
  }

  // In case there is a security question, do not send the whole
  // order, since the question and answer can potentially be seen
  // on the frontend
  else {
    forOrderVerificationSecurityQuestion(res, order);
  }
};

export default handler;
