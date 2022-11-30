import { useContext } from 'react';

import ConnectWalletContext from '@/context/ConnectWalletContext';
import PaymentContext from '@/context/PaymentContext';
import Web3Context from '@/context/Web3Context';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function ConnectWalletButton({ className, isPayButton }) {
  const { setIsConnectWalletOpen } = useContext(ConnectWalletContext);
  const { pay } = useContext(PaymentContext);
  const { address, disconnectWallet } = useContext(Web3Context);

  return (
    <button
      className={`btn btn--primary ${className}`}
      disabled={INTERIM}
      type="button"
      onClick={() => {
        if (!address) {
          setIsConnectWalletOpen(true);
        } else if (isPayButton) {
          pay();
        } else {
          disconnectWallet();
        }
      }}
    >
      {address &&
        (isPayButton
          ? 'Pay'
          : `${address.slice(0, 6)}...${address.slice(
              address.length - 4,
              address.length
            )}`)}
      {!address && '+ Connect wallet'}
    </button>
  );
}
