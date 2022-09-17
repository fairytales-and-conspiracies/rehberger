import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import ConnectWalletModal from '@/components/ConnectWalletModal';
import Web3Context from '@/context/Web3Context';

const ConnectWalletContext = createContext();

export function ConnectWalletProvider({ children }) {
  const { connectWallet } = useContext(Web3Context);

  const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);

  useEffect(() => {
    if (isConnectWalletOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isConnectWalletOpen]);

  const selectWallet = (walletType) => {
    connectWallet(walletType);
  };

  const memoizedValue = useMemo(
    () => ({
      isConnectWalletOpen,
      setIsConnectWalletOpen,
    }),
    [isConnectWalletOpen, setIsConnectWalletOpen]
  );

  return (
    <ConnectWalletContext.Provider value={memoizedValue}>
      {children}

      <ConnectWalletModal
        closeModal={() => setIsConnectWalletOpen(false)}
        selectWallet={selectWallet}
        visible={isConnectWalletOpen}
      />
    </ConnectWalletContext.Provider>
  );
}

export default ConnectWalletContext;
