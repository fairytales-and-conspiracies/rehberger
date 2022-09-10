import { useContext } from 'react';

import Web3Context from '@/context/Web3Context';
import wallets from '@/static-data/wallets';

const INTERIM = process.env.NEXT_PUBLIC_INTERIM === 'true';

export default function ConnectWalletButton({ isPayButton, payWithWallet }) {
  const { address, connectWallet, disconnectWallet } = useContext(Web3Context);

  return (
    <button
      className="btn btn--primary"
      disabled={INTERIM}
      type="button"
      onClick={() => {
        if (!address) {
          connectWallet(wallets.METAMASK);
        } else if (isPayButton) {
          payWithWallet();
        } else {
          disconnectWallet();
        }
      }}
    >
      {address &&
        (isPayButton
          ? 'Pay'
          : `${address.slice(0, 5)}...${address.slice(
              address.length - 5,
              address.length - 1
            )}`)}
      {!address && '+ Connect wallet'}
    </button>
  );
}
