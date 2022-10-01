/* eslint-disable no-unused-vars */
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

import {
  address as contractAddress,
  abi,
} from '@/contract/fairytalesAndConspiracies';
import sendMail from '@/lib/sendMail';
import emailTypes from '@/static-data/email-types';
import invoice from '@/templates/niceInvoice';
import dbConnect from '@/lib/dbConnect';
import { getNextOrderNumber } from '@/pages/api/orders';

const order = {
  customer: {
    firstName: 'First',
    lastName: 'Last',
    email: 'bulatovicnikola1990@gmail.com',
    addressLine1: 'Address 123',
    addressLine2: '',
    country: 'Germany',
    region: 'Alabama',
    city: 'Hanover',
    postalCode: '11111',
  },
  frames: ['6277ccf35c6580ff4f5a7974', '6277ccf35c6580ff4f5a7997'],
  quantity: 2,
  framePriceETH: 0.501,
  framePriceEUR: 751.5,
  netPriceETH: 0.84,
  netPriceEUR: 1263.03,
  totalPriceETH: 1.002,
  totalPriceEUR: 1503,
  vat: 0.19,
  paymentMethod: 'CARD',
  noSecurityQuestion: true,
  question: '',
  answer: '',
  transactionStatus: 'PENDING',
  confirmationKey: '362da3cb9b8aa54c5933a6351696f339',
  toBeClaimed: true,
  claimed: false,
  orderCreatedTimestamp: '1,663,751,443,450',
  orderNumber: 1,
  invoiceNumber: 'NFT000001',
  __v: 0,
};

const frames = [
  {
    video: 'IMAGINEYOURSELFWITHOUTAHOME',
    frame: 35,
    time: 1.7023644,
    sold: true,
  },
  {
    video: 'IMAGINEYOURSELFWITHOUTAHOME',
    frame: 45,
    time: 2.7023644,
    sold: true,
  },
];

const {
  MNEMONIC,
  CURRENCY,
  INFURA_URL,
  SERVER_URL,
  STRIPE_SESSION_EXPIRATION_TIME_SECONDS,
} = process.env;
const ADDRESS_FROM = process.env.NEXT_PUBLIC_ADDRESS_FROM;
const NFT_PRICE_ETH = process.env.NEXT_PUBLIC_NFT_PRICE_ETH;

const getWeb3 = () => {
  const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);
  const web3 = new Web3(provider);
  return web3;
};

const handler = async (req, res) => {
  // await dbConnect();

  const web3 = getWeb3();
  const contract = new web3.eth.Contract(abi, contractAddress);
  const tokenIds = [3, 14];

  try {
    const tx = await contract.methods.mintNFTs(ADDRESS_FROM, tokenIds).send({
      from: ADDRESS_FROM,
      value: web3.utils.toWei(
        (tokenIds.length * NFT_PRICE_ETH).toString(),
        'ether'
      ),
    });
    // const tx = await contract.methods.claimNFTs(ADDRESS_FROM, tokenIds).send({
    //   from: ADDRESS_FROM,
    // });
    // const tx = await contract.methods.lockNFTs(ADDRESS_FROM, tokenIds).send({
    //   from: ADDRESS_FROM,
    // });
    console.log('This is the transaction: ', tx);
  } catch (err) {
    console.log('ERRO: ', err);
  }
  res.status(201).json({ success: true, data: true });
  // const num = await getNextOrderNumber();
  // console.log('Loggy', num);

  // try {
  //   const pdf = invoice(order, frames);
  //   sendMail(emailTypes.NFTsPurchased, { order, frames }, [
  //     {
  //       // stream as an attachment
  //       filename: 'booyaka.pdf',
  //       content: pdf,
  //     },
  //   ]);
  //   res.status(201).json({ success: true, data: order });
  // } catch (err) {
  //   console.error('ERR: ', err);
  //   res.status(400).json({ success: false });
  // }
};

export default handler;
