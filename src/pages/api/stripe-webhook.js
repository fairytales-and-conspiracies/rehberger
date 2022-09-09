import { buffer } from 'micro';

import dbConnect from '@lib/dbConnect';
import sendError, { sendErrorWithMessage } from '@lib/errorHandling';
import sendMail from '@lib/sendMail';
import stripe from '@lib/stripe';
import Frame from '@models/Frame';
import Order from '@models/Order';
import { ErrorTypes } from '@static-data/errors';
import TransactionStatus from '@static-data/transaction-status';

const { STRIPE_WEBHOOK_SECRET } = process.env;

const updateOrder = async (confirmationKey) => {
  let order;
  try {
    order = await Order.findOne({ confirmationKey });
    const filter = { _id: { $in: [] } };
    order.frames.forEach(async (frame) => {
      // eslint-disable-next-line no-underscore-dangle
      const id = frame._id.toString();
      // eslint-disable-next-line no-underscore-dangle
      filter._id.$in.push(id);
    });
    await Frame.updateMany(filter, { sold: true });

    const transactionSuccessful = {
      transactionStatus: TransactionStatus.SUCCESSFUL,
    };
    await Order.updateOne({ confirmationKey }, transactionSuccessful);
    Object.assign(order, transactionSuccessful);
  } catch (err) {
    order = null;
  }
  return order;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    let event;

    await dbConnect();

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
    }

    if (event && event.type === 'checkout.session.completed') {
      const confirmationKey = event.data.object.client_reference_id;
      const order = await updateOrder(confirmationKey);

      if (order) {
        sendMail(true, order).catch(console.error);
        res.status(201).json({ success: true, data: order });
      } else {
        sendError(res, ErrorTypes.TRANSACTION_CREATION_UNSUCCESSFUL);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    sendError(res, ErrorTypes.METHOD_NOT_ALLOWED);
  }
};

export default handler;
