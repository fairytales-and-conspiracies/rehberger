import Web3 from 'web3';

export function web3Metamask() {
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(window.ethereum);
    return web3;
  }

  return null;
}
