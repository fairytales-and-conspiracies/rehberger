import HDWalletProvider from '@truffle/hdwallet-provider';
import crypto from 'crypto';
import Web3 from 'web3';

import { address } from '@/contract/fairytalesAndConspiracies';
import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import sendMail from '@/lib/sendMail';
import stripe from '@/lib/stripe';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import emailTypes from '@/static-data/email-types';
import { ErrorTypes } from '@/static-data/errors';
import TransactionStatus from '@/static-data/transaction-status';
import niceInvoice from '@/templates/niceInvoice';
import { ethToEur } from '@/utils/conversion';
import { padZeroes } from '@/utils/string';
import calculateVat from '@/utils/vat';

const {
  MNEMONIC,
  CURRENCY,
  SERVER_URL,
  STRIPE_SESSION_EXPIRATION_TIME_SECONDS,
} = process.env;

const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;
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

export const sendMailForPurchasedOrder = (order) => {
  const { frames } = order;
  const invoice = niceInvoice(order);
  const attachments = [
    { filename: 'Invoice.pdf', content: invoice },
    { filename: 'Terms.pdf', path: './public/doc/terms.pdf' },
  ];
  sendMail(emailTypes.NFTsPurchased, { order, frames }, attachments).catch(
    console.error
  );
};

const getWeb3 = () => {
  const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);
  const web3 = new Web3(provider);
  return web3;
};

let web3 = getWeb3();

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

  const netPriceETH = totalPriceETH / (1.0 + vat);
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
  const session = await stripe.checkout.sessions.create({
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
    expires_at:
      Math.round(Date.now() / 1000) +
      parseInt(STRIPE_SESSION_EXPIRATION_TIME_SECONDS, 10), // Minimum 30m
  });
  return session.url;
};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        let order;
        const { frames, paymentMethod, transactionHash } = req.body;

        // For wallet payments, we have to make sure that a valid
        // transaction has taken place. For Stripe payments, this
        // is before the transaction is confirmed - the Stripe webhook
        // receives the transactions after it has been confirmed.
        if (paymentMethod === 'CARD') {
          order = await createOrder(req);
          try {
            const url = await checkout(
              order.confirmationKey,
              frames,
              order.framePriceEUR * 100
            );
            res.status(200).json({ success: true, url });
          } catch (err) {
            console.error('Error sending data to Stripe: ', err);
            res.status(400).json({ success: false, error: err });
          }
          return;
        }

        if (transactionHash) {
          if (!web3) {
            web3 = getWeb3();
          }
          const transactionReceipt = await web3.eth.getTransactionReceipt(
            transactionHash
          );

          if (
            transactionReceipt &&
            transactionReceipt.to === address.toLowerCase()
          ) {
            const ordersWithTransaction = await Order.find({ transactionHash });
            if (!ordersWithTransaction || ordersWithTransaction.length === 0) {
              order = await createOrder(req);
              if (order) {
                sendMailForPurchasedOrder(order, frames);
              }
            }
          }
        }

        if (order) {
          res.status(201).json({ success: true, data: order });
        } else {
          sendError(res, ErrorTypes.TRANSACTION_CREATION_UNSUCCESSFUL);
        }
      } catch (err) {
        // sendMail(false, err).catch(console.error);
        res.status(400).json({ success: false, err });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
