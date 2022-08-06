import {
  useAddress,
  useDisconnect,
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
} from '@thirdweb-dev/react';

const METAMASK = 1;
const WALLETCONNECT = 2;
const COINBASE = 3;

export default function ConnectWalletButton() {
  const address = useAddress();

  const connectWithCoinbase = useCoinbaseWallet();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();

  const connectWallet = (type) => {
    switch (type) {
      case METAMASK:
      default:
        connectWithMetamask();
        break;

      case WALLETCONNECT:
        connectWithWalletConnect();
        break;

      case COINBASE:
        connectWithCoinbase();
        break;
    }
  };

  return (
    <button
      className="btn btn--primary"
      disabled={INTERIM}
      {...(!address && { onClick: () => connectWallet('injected') })}
    >
      {!!address
        ? `${address.slice(0, 5)}...${address.slice(
            address.length - 5,
            address.length - 1
          )}`
        : '+ Connect wallet'}
    </button>
  );
}
