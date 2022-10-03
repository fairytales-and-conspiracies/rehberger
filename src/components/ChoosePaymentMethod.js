import Link from 'next/link';
import { useContext, useState } from 'react';

import PaymentContext from '@/context/PaymentContext';

export default function ChoosePaymentMethod() {
  const { setPaymentMethod } = useContext(PaymentContext);

  const [agree, setAgree] = useState(false);

  return (
    <>
      <h2 className="payment-form__heading">Choose payment method</h2>
      <div className="choose-payment-method">
        <p className="choose-payment-method__paragraph">
          If you already have an Ethereum wallet, make sure to choose the option
          to purchase NFTs using your wallet.
        </p>
        <p className="choose-payment-method__paragraph">
          Don’t have a wallet at the moment? No worries! By choosing “Pay with
          card”, you will be able to buy NFTs using your debit/credit card.
        </p>
        <p className="choose-payment-method__paragraph">
          Please agree to the terms below to proceed.
        </p>
        <div className="choose-payment-method__input">
          <label
            className="choose-payment-method__label"
            htmlFor="agreeToTerms"
          >
            <input
              className="choose-payment-method__checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              onChange={(event) => setAgree(event.target.checked)}
              type="checkbox"
              value={agree}
            />{' '}
            I hereby agree to these legal{' '}
            <Link href="/doc/terms.pdf">
              <a className="link" target="_blank">
                terms
              </a>
            </Link>
          </label>
        </div>
        <button
          className="btn btn--primary"
          disabled={!agree}
          onClick={() => {
            setPaymentMethod('WALLET');
          }}
          type="button"
        >
          Pay with wallet
        </button>
        <button
          className="btn btn--primary"
          disabled={!agree}
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
