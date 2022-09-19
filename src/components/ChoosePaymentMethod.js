import { useContext } from 'react';

import PaymentContext from '@/context/PaymentContext';

export default function ChoosePaymentMethod() {
  const { setPaymentMethod } = useContext(PaymentContext);

  return (
    <>
      <h2 className="payment-form__heading">Choose payment method</h2>
      <p className="payment-form__text">
        Choose your preferred payment method below.
      </p>
      <div className="choose-payment-method">
        <p className="choose-payment-method__paragraph">
          If you already have a wallet, make sure to choose the option to
          purchase NFTs using your wallet.
        </p>
        <p className="choose-payment-method__paragraph">
          Don’t have a wallet at the moment? No worries! By choosing Stripe, you
          will be able to buy NFTs using your debit/credit card.
        </p>
        <button
          className="btn btn--primary"
          onClick={() => {
            setPaymentMethod('WALLET');
          }}
          type="button"
        >
          Pay with wallet
        </button>
        <button
          className="btn btn--primary"
          onClick={() => {
            setPaymentMethod('CARD');
          }}
          type="button"
        >
          Pay with card
        </button>
      </div>
    </>
  );
}
