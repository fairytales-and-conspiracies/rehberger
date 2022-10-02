import crypto from 'crypto';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import TransactionStatus from '@/static-data/transaction-status';
import { ethToEur } from '@/utils/conversion';
import { padZeroes } from '@/utils/string';
import calculateVat from '@/utils/vat';
import stripe from '@/lib/stripe';
import mongoose from 'mongoose';
import Frame from '@/models/Frame';
import { ErrorTypes } from '@/static-data/errors';
import uniCryptConvert from '@/lib/unicrypt';

const { CURRENCY, SERVER_URL, STRIPE_SESSION_EXPIRATION_TIME_SECONDS } =
  process.env;

const NFT_PRICE_ETH = parseFloat(process.env.NEXT_PUBLIC_NFT_PRICE_ETH);

export const orderFramesMongoFilter = (frames) => {
  const filter = { _id: { $in: [] } };
  frames.forEach(async (frame) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = frame._id.toString();
    // eslint-disable-next-line no-underscore-dangle
    filter._id.$in.push(id);
  });
  return filter;
};

const createOrder = async (req) => {
  const { customer, frames } = req.body;
  const { country, vatNo } = customer;

  const ethToEurRate = await uniCryptConvert({
    source_currency: 'ETH',
    destination_currency: 'EUR',
  });

  const quantity = frames.length;
  const filter = orderFramesMongoFilter(frames);
  const framePriceETH = NFT_PRICE_ETH;
  const framePriceEUR = ethToEur(NFT_PRICE_ETH, ethToEurRate);
  const totalPriceETH = framePriceETH * quantity;
  const totalPriceEUR = framePriceEUR * quantity;
  const vat = calculateVat(country, vatNo);
  const netPriceETH = totalPriceETH / (1.0 + vat);
  const netPriceEUR = parseFloat((totalPriceEUR / (1.0 + vat)).toFixed(2));

  const body = {
    confirmationKey: crypto.randomBytes(16).toString('hex'),
    customer,
    claimed: false,
    framePriceETH,
    framePriceEUR,
    frames,
    quantity,
    netPriceETH,
    netPriceEUR,
    orderCreatedTimestamp: Date.now(),
    paymentMethod: 'CARD',
    toBeClaimed: true,
    totalPriceETH,
    totalPriceEUR,
    transactionStatus: TransactionStatus.PENDING,
    vat,
  };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const nbAlreadySoldFrames = await Frame.find({
      ...filter,
      sold: true,
    }).session(session);

    if (nbAlreadySoldFrames > 0) {
      throw Error('Some of the selected frames for checkout are already sold');
    }

    await Order.create([body], { session });

    await session.commitTransaction();
    return body;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
};

const stripeCheckout = async (order) => {
  const session = await stripe.checkout.sessions.create({
    cancel_url: `${SERVER_URL}/shopping-cart`,
    client_reference_id: order.confirmationKey,
    line_items: order.frames.map((item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: `${item.video}_${padZeroes(item.frame, 4)}`,
        },
        unit_amount: Math.round(order.framePriceEUR * 100),
      },
      quantity: 1,
    })),
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${SERVER_URL}/shopping-cart?thank-you`,
    expires_at:
      Math.round(Date.now() / 1000) +
      parseInt(STRIPE_SESSION_EXPIRATION_TIME_SECONDS, 10), // Minimum 30m
  });

  return session.url;
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res
      .status(400)
      .json({ success: false, error: ErrorTypes.METHOD_NOT_ALLOWED });
    return;
  }

  await dbConnect();

  try {
    const order = await createOrder(req);
    const url = await stripeCheckout(order);
    res.status(200).json({ success: true, url });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

export default handler;
