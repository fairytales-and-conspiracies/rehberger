import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

import { address } from '@/contract/fairytalesAndConspiracies';
import dbConnect from '@/lib/dbConnect';
import sendMail from '@/lib/sendMail';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import emailTypes from '@/static-data/email-types';
import TransactionStatus from '@/static-data/transaction-status';
import niceInvoice from '@/templates/niceInvoice';
import { ethToEur } from '@/utils/conversion';
import { padZeroes } from '@/utils/string';
import calculateVat from '@/utils/vat';
import mongoose from 'mongoose';

const { MNEMONIC } = process.env;

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

const getWeb3 = () => {
  const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);
  const web3 = new Web3(provider);
  return web3;
};

const createOrder = async (req) => {
  const { customer, ethToEurRate, frames, transactionHash } = req.body;
  const { country, vatNo } = customer;

  const quantity = frames.length;
  const filter = orderFramesMongoFilter(frames);
  const framePriceETH = NFT_PRICE_ETH;
  const framePriceEUR = ethToEur(NFT_PRICE_ETH, ethToEurRate);
  const totalPriceETH = framePriceETH * quantity;
  const totalPriceEUR = framePriceEUR * quantity;
  const vat = calculateVat(country, vatNo);
  const netPriceETH = parseFloat((totalPriceETH / (1.0 + vat)).toFixed(2));
  const netPriceEUR = parseFloat((totalPriceEUR / (1.0 + vat)).toFixed(2));
  const orderCreatedTimestamp = Date.now();

  const web3 = getWeb3();
  const transactionReceipt = await web3.eth.getTransactionReceipt(
    transactionHash
  );

  if (!transactionReceipt) {
    throw Error('No transaction receipt for given hash!');
  }

  if (transactionReceipt.to !== address.toLowerCase()) {
    throw Error('Provided transaction has no contract address as receiver!');
  }

  if (!transactionReceipt.status) {
    throw Error('Given transaction status is failed!');
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ordersWithTransaction = await Order.find({ transactionHash }).session(
      session
    );

    if (ordersWithTransaction && ordersWithTransaction.length !== 0) {
      throw Error('Order already created');
    }

    const lastOrderNumber = await Order.countDocuments().session(session);
    const orderNumber = lastOrderNumber + 1;

    const alreadySoldFrames = await Frame.find({
      ...filter,
      sold: true,
    }).session(session);

    const transactionStatus =
      // eslint-disable-next-line no-nested-ternary
      alreadySoldFrames.length === 0
        ? TransactionStatus.FAILED
        : alreadySoldFrames.length !== frames.length
        ? TransactionStatus.PARTIALLY_SUCCESSFUL
        : TransactionStatus.SUCCESSFUL;

    const body = {
      customer,
      framePriceETH,
      framePriceEUR,
      frames,
      failedFrames: alreadySoldFrames,
      invoiceNumber: `NFT${padZeroes(orderNumber, 6)}`,
      quantity,
      netPriceETH,
      netPriceEUR,
      orderCreatedTimestamp,
      orderNumber,
      paymentMethod: 'WALLET',
      toBeClaimed: false,
      totalPriceETH,
      totalPriceEUR,
      transactionHash,
      transactionStatus,
      transactionSuccessfulTimestamp: orderCreatedTimestamp,
      vat,
    };

    await Order.create(body, { session });

    await Frame.updateMany(filter, { sold: true }, { session });

    await session.commitTransaction();
    return body;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
};

export const sendMailForPurchasedOrder = (order) => {
  const { frames } = order;
  const invoice = niceInvoice(order, frames);
  const attachments = [
    { filename: 'Invoice.pdf', content: invoice },
    { filename: 'Terms.pdf', path: './public/doc/terms.pdf' },
  ];
  sendMail(emailTypes.NFTsPurchased, { order, frames }, attachments).catch(
    console.error
  );
};

const handler = async (req, res) => {
  await dbConnect();

  try {
    const order = await createOrder(req);
    sendMailForPurchasedOrder(order);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
};

export default handler;