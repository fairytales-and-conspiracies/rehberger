import Web3 from 'web3';

export default function getWeb3() {
  let web3;
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
  }

  return web3;
}
