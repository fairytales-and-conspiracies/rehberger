import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

import sendError from '@/lib/errorHandling';
import { ErrorTypes } from '@/static-data/errors';
import sendTransaction from '@/utils/sendTransaction';

const provider = new HDWalletProvider(
  'nerve blame win address example frost polar borrow dance wild deposit mesh',
  'https://rinkeby.infura.io/v3/81dd09aa70844f89bdb5cf263e13b916'
);
const web3 = new Web3(provider);

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { address, selectedFrames, values } = req.body;
        const tx = await sendTransaction(address, selectedFrames, values, web3);

        if (!tx) {
          sendError(res, ErrorTypes.GENERIC_ERROR);
        }

        console.log('Transaction', tx);
      } catch (err) {
        sendError(res, ErrorTypes.GENERIC_ERROR);
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
