import {
  useAddress,
  useDisconnect,
  useMetamask,
  useCoinbaseWallet,
} from '@thirdweb-dev/react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { createContext, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

import { address as contractAddress, abi } from '@contract/exampleContract';
import wallets from '@static-data/wallets';

const Web3Context = createContext();

const ADDRESS_FROM = process.env.NEXT_PUBLIC_ADDRESS_FROM;

let walletConnectProvider;

export function Web3Provider({ children }) {
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [web3, setWeb3] = useState(null);

  const thirdWebAddress = useAddress();

  // # WalletConnect part
  const walletConnectProviderCallback = () => {
    walletConnectProvider.on('accountsChanged', (accounts) => {
      if (address !== accounts[0]) {
        setAddress(accounts[0]);
      }
    });

    walletConnectProvider.on('disconnect', () => {
      setAddress(null);
    });
  };

  const setWalletConnectProvider = () => {
    walletConnectProvider = new WalletConnectProvider({
      infuraId: '81dd09aa70844f89bdb5cf263e13b916',
    });
    walletConnectProviderCallback();
  };

  const removeWalletConnectProvider = () => {
    localStorage.removeItem('walletconnect');
    walletConnectProvider = null;
  };

  useEffect(() => {
    if (localStorage.getItem('walletconnect')) {
      setWalletConnectProvider();
    }
  }, []);

  const connectWithWalletConnect = async () => {
    try {
      if (!walletConnectProvider) {
        setWalletConnectProvider();
        if (walletConnectProvider.wc.session.connected) {
          await walletConnectProvider.wc.killSession();
        }
      }
      await walletConnectProvider.enable();
    } catch (err) {
      if (walletConnectProvider) {
        removeWalletConnectProvider();
      }
    }
  };

  const disconnectWalletConnect = () => {
    removeWalletConnectProvider();
  };
  // # End WalletConnect part

  const connectWithCoinbase = useCoinbaseWallet();
  const connectWithMetamask = useMetamask();

  const disconnectThirdWeb = useDisconnect();

  // thirdWebAddress refers to either Metamask or Coinbase address
  useEffect(() => {
    if (thirdWebAddress) {
      setAddress(thirdWebAddress);
    }
  }, [thirdWebAddress]);

  const getWeb3 = (web3Provider) => {
    let providedWeb3;
    if (web3Provider) {
      providedWeb3 = new Web3(web3Provider);
    } else if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' });
      providedWeb3 = new Web3(window.ethereum);
    }
    setWeb3(providedWeb3);
    return providedWeb3;
  };

  useEffect(() => {
    const providedWeb3 = getWeb3(walletConnectProvider);

    if (providedWeb3) {
      const web3Contract = new providedWeb3.eth.Contract(abi, contractAddress);
      setContract(web3Contract);
    }
  }, [address]);

  const connectWallet = (type) => {
    setWalletType(type);

    switch (type) {
      case wallets.METAMASK:
        connectWithMetamask();
        break;
      case wallets.COINBASE:
        connectWithCoinbase();
        break;
      case wallets.WALLET_CONNECT:
        connectWithWalletConnect();
        break;
      default:
        setAddress(null);
        setContract(null);
        setWalletType(null);
        setWeb3(null);
        break;
    }
  };

  const disconnectWallet = async () => {
    if (thirdWebAddress) {
      disconnectThirdWeb();
    } else {
      disconnectWalletConnect();
    }

    connectWallet(null);
  };

  const sendTransaction = async (selectedFrames) => {
    try {
      let tokenIds = selectedFrames.map((frame) => frame.frame);
      // TODO: Remove this next line which is only for testing purposes
      // 77 -93 245 333 548 570 -719
      tokenIds = [77, 245];
      const amounts = Array(tokenIds.length).fill(1);

      const tx = await contract.methods
        .buyNFTs(ADDRESS_FROM, address, tokenIds, amounts, '0x00')
        .send({
          from: address,
          value: web3.utils.toWei(
            (tokenIds.length * 0.001).toString(),
            'ether'
          ),
        });

      console.log('Transaction: ', tx);
      return tx;
    } catch (err) {
      console.log('Error: ', err);
      return null;
    }
  };

  const memoizedValue = useMemo(
    () => ({
      address,
      connectWallet,
      contract,
      disconnectWallet,
      getWeb3,
      sendTransaction,
      walletType,
      web3,
    }),
    [
      address,
      connectWallet,
      contract,
      disconnectWallet,
      getWeb3,
      sendTransaction,
      walletType,
      web3,
    ]
  );

  return (
    <Web3Context.Provider value={memoizedValue}>
      {children}
    </Web3Context.Provider>
  );
}

export default Web3Context;
