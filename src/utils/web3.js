import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

export default function getWeb3() {
  let web3;
  if (window.ethereum) {
    // const provider = new Web3.providers.HttpProvider(window.ethereum);
    // const providedWeb3 = new Web3(provider);
    window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
  } else {
    // const provider = new HDWalletProvider(
    //   'nerve blame win address example frost polar borrow dance wild deposit mesh',
    //   'https://rinkeby.infura.io/v3/81dd09aa70844f89bdb5cf263e13b916'
    //   // 'REPLACE_WITH_YOUR_MNEMONIC',
    //   // remember to change this to your own phrase!
    //   // 'https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c'
    //   // remember to change this to your own endpoint!
    // );
    // web3 = new Web3(provider);
  }

  return web3;
}
