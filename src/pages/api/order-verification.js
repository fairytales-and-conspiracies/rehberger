import mongoose from 'mongoose';

import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import { orderFramesMongoFilter } from '@/lib/orders';
import sendMail from '@/lib/sendMail';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import emailTypes from '@/static-data/email-types';
import { ErrorTypes } from '@/static-data/errors';

const updateOrderForClaimedNFTs = async (orderNumber) => {
  const order = await Order.findByIdAndUpdate(
    mongoose.Types.ObjectId(orderNumber),
    {
      claimed: true,
    },
    {
      lean: true,
    }
  );
  order.claimed = true;
  return order;
};

const forSecurityVerification = async (req, res, order) => {
  const { answer, question, walletAddress } = req.body;
  const { _id: orderBuffer, frames: orderFrameRefs } = order;

  if (order.question === question && order.answer === answer) {
    const updatedOrder = await updateOrderForClaimedNFTs(
      orderBuffer.toString()
    );
    const filter = orderFramesMongoFilter(orderFrameRefs);
    const frames = await Frame.find(filter);
    const mailSent = await sendMail(emailTypes.NFTsClaimed, {
      frames,
      order: updatedOrder,
      walletAddress,
    }).catch(console.error);
    res.status(201).json({ success: true, data: { order, mailSent } });
  } else {
    sendError(res, ErrorTypes.INCORRECT_SECURITY_QUESTION_ANSWER);
  }
};

const forOrderVerificationNoSecurityQuestion = async (req, res, order) => {
  const { walletAddress } = req.body;
  const { _id: orderBuffer, frames: orderFrameRefs } = order;
  const updatedOrder = await updateOrderForClaimedNFTs(orderBuffer.toString());
  const filter = orderFramesMongoFilter(orderFrameRefs);
  const frames = await Frame.find(filter);
  const mailSent = await sendMail(emailTypes.NFTsClaimed, {
    frames,
    order: updatedOrder,
    walletAddress,
  }).catch(console.error);
  res.status(201).json({ success: true, data: { order, mailSent } });
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

  // After submitting security question and answer form
  if (securityVerification) {
    forSecurityVerification(req, res, order);
  }

  // After submitting the order verificatio form,
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
