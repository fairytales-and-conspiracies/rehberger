import HDWalletProvider from '@truffle/hdwallet-provider';
import mongoose from 'mongoose';
import Web3 from 'web3';

import { address } from '@/contract/FairytalesAndConspiracies';
import dbConnect from '@/lib/dbConnect';
import { finishOrder } from '@/lib/orders';
import uniCryptConvert from '@/lib/unicrypt';
import Frame from '@/models/Frame';
import Order from '@/models/Order';
import { ErrorTypes } from '@/static-data/errors';
import TransactionStatus from '@/static-data/transaction-status';
import { ethToEur } from '@/utils/conversion';
import { padZeroes } from '@/utils/string';
import calculateVat from '@/utils/vat';

const { INFURA_URL } = process.env;
const { MNEMONIC } = process.env;
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
  const { customer, frames, transactionHash } = req.body;
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
  const orderCreatedTimestamp = Date.now();

  const web3 = getWeb3();
  const transactionReceipt = await web3.eth.getTransactionReceipt(
    transactionHash
  );

  if (!transactionReceipt) {
    throw Error('No transaction receipt for given hash!');
  }

  if (transactionReceipt.to.toLowerCase() !== address.toLowerCase()) {
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

    const lastOrderNumber = await Order.countDocuments({
      transactionStatus: {
        $in: [
          TransactionStatus.SUCCESSFUL,
          TransactionStatus.PARTIALLY_SUCCESSFUL,
        ],
      },
    }).session(session);
    const orderNumber = lastOrderNumber + 1;

    const alreadySoldFrames = await Frame.find({
      ...filter,
      sold: true,
    }).session(session);

    const transactionStatus =
      alreadySoldFrames.length === 0
        ? TransactionStatus.SUCCESSFUL
        : alreadySoldFrames.length !== frames.length
        ? TransactionStatus.PARTIALLY_SUCCESSFUL
        : TransactionStatus.FAILED;

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

    await Order.create([body], { session });

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
    await finishOrder(order, order.frames);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    // TODO: Send mail to us instead since we cant send the mail to user (with proper info) in this case
    res.status(400).json({ success: false, error: err });
  }
};

export default handler;
