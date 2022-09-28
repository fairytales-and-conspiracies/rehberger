import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { createContext, useEffect, useMemo, useState } from 'react';

import {
  address as contractAddress,
  abi,
} from '@/contract/fairytalesAndConspiracies';
import wallets from '@/static-data/wallets';
import { getTokenId } from '@/utils/contract';

const Web3Context = createContext();

const ADDRESS_FROM = process.env.NEXT_PUBLIC_ADDRESS_FROM;
const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;
const INFURA_KEY = INFURA_URL.split('/')[INFURA_URL.split('/').length - 1];

const CoinbaseWallet = new WalletLinkConnector({
  appName: 'Web3-react Demo',
  supportedChainIds: [1, 4],
  url: INFURA_URL,
});

const WalletConnect = new WalletConnectConnector({
  bridge: 'https://bridge.walletconnect.org',
  chainId: 4,
  infuraId: INFURA_KEY,
  qrcode: true,
  supportedChainIds: [1, 4],
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 4],
});

export function Web3Provider({ children }) {
  const {
    account: address,
    activate,
    deactivate,
    library: web3,
  } = useWeb3React();

  const [contract, setContract] = useState(null);
  const [walletType, setWalletType] = useState(null);

  useEffect(() => {
    if (web3) {
      const web3Contract = new web3.eth.Contract(abi, contractAddress);
      setContract(web3Contract);
    }
  }, [address]);

  const connectWallet = (type) => {
    setWalletType(type);

    switch (type) {
      case wallets.METAMASK:
        activate(Injected);
        break;
      case wallets.COINBASE:
        activate(CoinbaseWallet);
        break;
      case wallets.WALLET_CONNECT:
        activate(WalletConnect);
        break;
      default:
        deactivate();
        setContract(null);
        setWalletType(null);
        break;
    }
  };

  const disconnectWallet = () => {
    deactivate();
  };

  const sendTransaction = async (selectedFrames) => {
    try {
      const tokenIds = selectedFrames.map((frame) => getTokenId(frame));
      const amounts = Array(tokenIds.length).fill(1);

      console.log('Token Ids: ', tokenIds);

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
      sendTransaction,
      walletType,
      web3,
    }),
    [
      address,
      connectWallet,
      contract,
      disconnectWallet,
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
