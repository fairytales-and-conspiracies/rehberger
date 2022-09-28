import crypto from 'crypto';

import dbConnect from '@/lib/dbConnect';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import TransactionStatus from '@/static-data/transaction-status';
import { ethToEur } from '@/utils/conversion';
import { padZeroes } from '@/utils/string';
import calculateVat from '@/utils/vat';
import Stripe from 'stripe';

const { CURRENCY, SERVER_URL, STRIPE_SECRET_KEY } = process.env;

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

export const getNextOrderNumber = async () => {
  const orderArr = await Order.find().sort('-orderNumber').limit(1);
  const order = orderArr[0];
  if (!order || !order.orderNumber) {
    return 1;
  }

  return order.orderNumber + 1;
};

const fillOutRestOfOrderData = (customer, frames, ethToEurRate) => {
  const orderCreatedTimestamp = Date.now();
  const quantity = frames.length;

  const framePriceETH = NFT_PRICE_ETH;
  const framePriceEUR = ethToEur(NFT_PRICE_ETH, ethToEurRate);

  // Calculate the price so that if sales tax exists, it is
  // subtracted from the total price. In other words, the buyer
  // does not pay the tax, so the price per NFT is always the same,
  // as defined.
  const totalPriceETH = framePriceETH * quantity;
  const totalPriceEUR = framePriceEUR * quantity;

  const { country, vatNo } = customer;
  const vat = calculateVat(country, vatNo);

  const netPriceETH = parseFloat((totalPriceETH / (1.0 + vat)).toFixed(2));
  const netPriceEUR = parseFloat((totalPriceEUR / (1.0 + vat)).toFixed(2));
  return {
    orderCreatedTimestamp,
    quantity,
    framePriceETH,
    netPriceETH,
    totalPriceETH,
    framePriceEUR,
    netPriceEUR,
    totalPriceEUR,
    vat,
  };
};

const createOrder = async (req) => {
  const { customer, frames, paymentMethod, ethToEurRate } = req.body;

  const isWalletPayment = paymentMethod === 'WALLET';
  const restOfOrderData = fillOutRestOfOrderData(
    customer,
    frames,
    ethToEurRate
  );
  const body = {
    ...req.body,
    frames,
    ...restOfOrderData,
    toBeClaimed: !isWalletPayment,
  };

  if (isWalletPayment) {
    body.transactionStatus = TransactionStatus.SUCCESSFUL;
    body.transactionSuccessfulTimestamp = body.orderCreatedTimestamp;
    body.orderNumber = await getNextOrderNumber();
    body.invoiceNumber = `NFT${padZeroes(body.orderNumber, 6)}`;

    const filter = orderFramesMongoFilter(frames);
    await Frame.updateMany(filter, { sold: true });
  } else {
    body.claimed = false;
    body.confirmationKey = crypto.randomBytes(16).toString('hex');
    body.transactionStatus = TransactionStatus.PENDING;
  }

  let order;
  try {
    order = await Order.create(body);
  } catch (err) {
    order = null;
  }
  return order;
};

const checkout = async (confirmationKey, items, priceInCents) => {
  const session = await Stripe(STRIPE_SECRET_KEY).checkout.sessions.create({
    cancel_url: `${SERVER_URL}/shopping-cart`,
    client_reference_id: confirmationKey,
    line_items: items.map((item) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: `${item.video}_${padZeroes(item.frame, 4)}`,
        },
        unit_amount: priceInCents,
      },
      quantity: 1,
    })),
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${SERVER_URL}/shopping-cart?thank-you`,
  });
  return session;
};

const handler = async (req, res) => {
  console.log('SIGURICA', req);

  await dbConnect();

  // const { frames, paymentMethod, transactionHash } = req.body;
  const order = await createOrder(req);

  const { frames } = req.body;

  const session = await checkout(
    order.confirmationKey,
    frames,
    order.framePriceEUR * 100
  );

  res.status(201).json({ success: true, data: session });
};

export default handler;
