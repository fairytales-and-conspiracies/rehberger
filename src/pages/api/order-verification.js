import mongoose from 'mongoose';

import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import sendMail from '@/lib/sendMail';
import Order from '@/models/Order';
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
  const { answer, question } = req.body;
  const { _id: orderBuffer } = order;

  if (order.question === question && order.answer === answer) {
    const updatedOrder = await updateOrderForClaimedNFTs(
      orderBuffer.toString()
    );
    sendMail(true, updatedOrder).catch(console.error);
  } else {
    sendError(res, ErrorTypes.INCORRECT_SECURITY_QUESTION_ANSWER);
  }
};

const forOrderVerificationNoSecurityQuestion = async (res, order) => {
  const { _id: orderBuffer } = order;
  const updatedOrder = await updateOrderForClaimedNFTs(orderBuffer.toString());
  sendMail(true, updatedOrder).catch(console.error);
  res.status(201).json({ success: true, data: order });
};

const forOrderVerificationSecurityQuestion = (res, order) => {
  const { noSecurityQuestion, question: orderQuestion } = order;
  res.status(201).json({
    success: true,
    data: {
      noSecurityQuestion,
      question: orderQuestion,
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
  else if (order.noSecurityQuestion) {
    forOrderVerificationNoSecurityQuestion(res, order);
  }

  // In case there is a security question, do not send the whole
  // order, since the question and answer can potentially be seen
  // on the frontend
  else {
    forOrderVerificationSecurityQuestion(res, order);
  }
};

export default handler;
