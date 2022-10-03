import { useContext } from 'react';

import ConnectWalletButton from '@/components/ConnectWalletButton';
import PaymentContext from '@/context/PaymentContext';

export default function ConfirmPaymentMethod() {
  const { paymentMethod, setConfirmPaymentMethod } = useContext(PaymentContext);

  return (
    <>
      <h2 className="payment-form__heading">Confirm payment method</h2>
      {paymentMethod === 'WALLET' && (
        <div className="confirm-payment-method">
          <p className="confirm-payment-method__heading confirm-payment-method__heading--wallet">
            Already have a wallet?
          </p>
          <div className="confirm-payment-method__info">
            Already have a wallet? Connect your MetaMask, Coinbase Wallet or
            WalletConnect by clicking “Connect wallet” button bellow or in the
            top right corner of the page and simply follow the instructions.
          </div>
          <ConnectWalletButton isPayButton />
        </div>
      )}
      {paymentMethod === 'CARD' && (
        <div className="confirm-payment-method">
          <p className="confirm-payment-method__heading">
            Have no wallet at the moment? We got you covered:
          </p>
          <ul className="confirm-payment-method__points">
            <li className="confirm-payment-method__point">
              When you confirm debit/cradit card as payment method, you will be
              taken to Stripe platform to complete the purchase.
            </li>
            <li className="confirm-payment-method__point">
              Once you complete the purchase of NFTs using debit/credit card,
              your NFTs will safely remain under our guardianship for the time
              being.
            </li>
            <li className="confirm-payment-method__point">
              When you create a [non-custodial] wallet and when your payment is
              complete, just submit your wallet address via link sent in your
              confirmation email and we will transfer your NFTs to you – with no
              complications and at no extra cost!
            </li>
            <li className="confirm-payment-method__point">
              If you already have an Ethereum wallet but still prefer to pay for
              your NFTs using MasterCard or VISA, you absolutely can! Just send
              us your wallet address via link sent in the email after you
              complete the payment.
            </li>
          </ul>
          <button
            className="confirm-payment-method__confirm-btn--smaller-font btn btn--primary"
            onClick={() => setConfirmPaymentMethod(true)}
            type="button"
          >
            Yes, I want to pay with card
          </button>
        </div>
      )}
    </>
  );
}
