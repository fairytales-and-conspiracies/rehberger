import HDWalletProvider from '@truffle/hdwallet-provider';
import crypto from 'crypto';
import Web3 from 'web3';

import { address } from '@/contract/exampleContract';
import dbConnect from '@/lib/dbConnect';
import sendError from '@/lib/errorHandling';
import sendMail from '@/lib/sendMail';
import Order from '@/models/Order';
import { ErrorTypes } from '@/static-data/errors';
import TransactionStatus from '@/static-data/transaction-status';
import { getEthToEurRate } from '@/utils/conversion';
import { formatDateTime } from '@/utils/date';

const { INFURA_URL } = process.env;
const { MNEMONIC } = process.env;
const NFT_PRICE_ETH = parseFloat(process.env.NFT_PRICE_ETH);
// const SALES_TAX = parseFloat(process.env.NEXT_PUBLIC_SALES_TAX);

const getWeb3 = () => {
  const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);
  const web3 = new Web3(provider);
  return web3;
};

let web3 = getWeb3();

const fillOutRestOfOrderData = (frames) => {
  const orderCreatedTimestamp = formatDateTime(Date.now());
  const quantity = frames.length;
  const framePriceETH = NFT_PRICE_ETH;
  const netPriceETH = framePriceETH * quantity;
  const totalPriceETH = netPriceETH;
  const framePriceUSD = getEthToEurRate(NFT_PRICE_ETH);
  const netPriceUSD = framePriceUSD * quantity;
  const totalPriceUSD = netPriceUSD;
  return {
    orderCreatedTimestamp,
    quantity,
    framePriceETH,
    netPriceETH,
    totalPriceETH,
    framePriceUSD,
    netPriceUSD,
    totalPriceUSD,
  };
};

const createOrder = async (req) => {
  const { frames, paymentMethod } = req.body;

  const isWalletPayment = paymentMethod === 'WALLET';
  const restOfOrderData = fillOutRestOfOrderData(frames);
  const body = {
    ...req.body,
    frames,
    ...restOfOrderData,
    toBeClaimed: !isWalletPayment,
  };

  if (isWalletPayment) {
    body.transactionStatus = TransactionStatus.SUCCESSFUL;
    body.transactionSuccessfulTimestamp = body.orderCreatedTimestamp;
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

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        let order;
        const { paymentMethod, transactionHash } = req.body;

        // For wallet payments, we have to make sure that a valid
        // transaction has taken place. For Stripe payments, this
        // is before the transaction is confirmed - the Stripe webhook
        // receives the transactions after it has been confirmed.
        if (paymentMethod === 'CARD') {
          order = await createOrder(req);
        } else if (transactionHash) {
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
                sendMail(true, order).catch(console.error);
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

// This is when an order has been successfully created, either
// when we have received a successful response from a wallet
// or from Stripe

// else if (transactionStatus === 'SUCCESS') {
//   order = await Order.findByIdAndUpdate(
//     mongoose.Types.ObjectId(req.body._id),
//     {
//       confirmationKey,
//       transactionStatus,
//     },
//     {
//       lean: true,
//     }
//   );

//   const filter = { _id: { $in: [] } };
//   order.frames.forEach((frame) =>
//     filter['_id']['$in'].push(frame['_id'])
//   );
//   Frame.updateMany(filter, { sold: true });
//   order.claimed = false;
//   sendMail(true, order).catch(console.error);
// }
