import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

const { MNEMONIC, INFURA_URL } = process.env;

export default function getWeb3() {
  const provider = new HDWalletProvider(MNEMONIC, INFURA_URL);
  const web3 = new Web3(provider);
  return web3;
}
