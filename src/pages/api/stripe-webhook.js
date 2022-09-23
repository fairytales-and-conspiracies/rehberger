import { buffer } from 'micro';

import dbConnect from '@/lib/dbConnect';
import sendError, { sendErrorWithMessage } from '@/lib/errorHandling';
import sendMail from '@/lib/sendMail';
import stripe from '@/lib/stripe';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import { getNextOrderNumber, orderFramesMongoFilter } from '@/pages/api/orders';
import emailTypes from '@/static-data/email-types';
import { ErrorTypes } from '@/static-data/errors';
import TransactionStatus from '@/static-data/transaction-status';
import niceInvoice from '@/templates/niceInvoice';
import { padZeroes } from '@/utils/string';

const { STRIPE_WEBHOOK_SECRET } = process.env;

const updateOrder = async (confirmationKey) => {
  let order;
  try {
    order = await Order.findOne({ confirmationKey });
    const { frames } = order;
    const filter = orderFramesMongoFilter(frames);
    await Frame.updateMany(filter, { sold: true });

    const nextOrderNumber = await getNextOrderNumber();
    const update = {
      invoiceNumber: `NFT${padZeroes(nextOrderNumber, 6)}`,
      orderNumber: nextOrderNumber,
      transactionStatus: TransactionStatus.SUCCESSFUL,
    };

    await Order.updateOne({ confirmationKey }, update);
    Object.assign(order, update);
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

      const filter = orderFramesMongoFilter(order.frames);
      const frames = await Frame.find(filter);

      if (order) {
        const invoice = niceInvoice(order, frames);
        const attachments = [{ filename: 'Invoice.pdf', content: invoice }];
        sendMail(
          emailTypes.NFTsPurchased,
          { order, frames },
          attachments
        ).catch(console.error);
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
