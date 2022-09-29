import crypto from 'crypto';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import TransactionStatus from '@/static-data/transaction-status';
import { ethToEur } from '@/utils/conversion';
import { padZeroes } from '@/utils/string';
import calculateVat from '@/utils/vat';
import stripe from '@/lib/stripe';

const { CURRENCY, SERVER_URL, STRIPE_SESSION_EXPIRATION_TIME_SECONDS } =
  process.env;

const NFT_PRICE_ETH = parseFloat(process.env.NEXT_PUBLIC_NFT_PRICE_ETH);

const createOrder = (req) => {
  const { customer, frames, ethToEurRate } = req.body;
  const { country, vatNo } = customer;

  const quantity = frames.length;
  const framePriceETH = NFT_PRICE_ETH;
  const framePriceEUR = ethToEur(NFT_PRICE_ETH, ethToEurRate);
  const totalPriceETH = framePriceETH * quantity;
  const totalPriceEUR = framePriceEUR * quantity;
  const vat = calculateVat(country, vatNo);
  const netPriceETH = parseFloat((totalPriceETH / (1.0 + vat)).toFixed(2));
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

  Order.create(body);

  return body;
};

const stripeCheckout = async (order) => {
  const data = {
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
      parseInt(STRIPE_SESSION_EXPIRATION_TIME_SECONDS, 10), // Minimum 30m.
  };

  try {
    const session = await stripe.checkout.sessions.create(data);
    return session.url;
  } catch (e) {
    return { e, stripeData: data };
  }
};

const handler = async (req, res) => {
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
