import Image from 'next/image';

import wallets from '@/static-data/wallets';

const ConnectWalletModal = ({ closeModal, selectWallet, visible }) => {
  return (
    <div
      className={`connect-wallet-modal ${
        visible ? 'connect-wallet-modal--visible' : ''
      }`}
    >
      <div className="connect-wallet-modal__backdrop">
        <div className="connect-wallet-modal__main">
          <div className="connect-wallet-modal__top-section">
            <h3 className="connect-wallet-modal__heading">Connect wallet</h3>
            <button
              className="connect-wallet-modal__close btn"
              onClick={closeModal}
              type="button"
            >
              <Image
                alt="Close"
                height="35"
                src="/img/icons/close.svg"
                width="35"
              />
            </button>
            <p className="connect-wallet-modal__subheading">
              Please select your wallet
            </p>
          </div>
          <div className="connect-wallet-modal__wallets">
            <button
              className="btn btn--primary connect-wallet-modal__btn"
              onClick={() => selectWallet(wallets.METAMASK)}
              type="button"
            >
              MetaMask
              <span className="connect-wallet-modal__btn-icon">
                <Image alt="MetaMask" layout="fill" src="/img/metamask.svg" />
              </span>
            </button>
            <button
              className="btn btn--primary connect-wallet-modal__btn"
              onClick={() => selectWallet(wallets.WALLET_CONNECT)}
              type="button"
            >
              WalletConnect
              <span className="connect-wallet-modal__btn-icon">
                <Image
                  alt="WalletConnect"
                  layout="fill"
                  src="/img/walletconnect.svg"
                />
              </span>
            </button>
            <button
              className="btn btn--primary connect-wallet-modal__btn"
              onClick={() => selectWallet(wallets.COINBASE)}
              type="button"
            >
              Coinbase Wallet
              <span className="connect-wallet-modal__btn-icon">
                <Image
                  alt="Coinbase Wallet"
                  layout="fill"
                  src="/img/coinbase.svg"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
