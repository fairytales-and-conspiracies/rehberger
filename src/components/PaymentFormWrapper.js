import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import ChoosePaymentMethod from '@/components/ChoosePaymentMethod';
import ConfirmPaymentMethod from '@/components/ConfirmPaymentMethod';
import PaymentFormInfo from '@/components/PaymentFormInfo';
import PaymentFormInputs from '@/components/PaymentFormInputs';
import ProcessingWalletPayment from '@/components/ProcessingWalletPayment';
import SecurityQuestion from '@/components/SecurityQuestion';
import SomeFramesSold from '@/components/SomeFramesSold';
import ThankYou from '@/components/ThankYou';
import PaymentContext from '@/context/PaymentContext';
import ShoppingCartContext from '@/context/ShoppingCartContext';

export default function PaymentFormWrapper({ isCheckout, setIsCheckout }) {
  const router = useRouter();
  const { query } = router;

  const {
    alreadySoldFrames,
    choosePaymentMethod,
    confirmPaymentMethod,
    isPaymentBeingProcessed,
    pay,
    paymentMethod,
    setAlreadySoldFrames,
    setChoosePaymentMethod,
    setConfirmPaymentMethod,
    setPaymentMethod,
    setShippingInfoFormSubmitted,
    setTransactionPassed,
    shippingInfoFormSubmitted,
    transactionPassed,
  } = useContext(PaymentContext);
  const { removeAllFromCart, selectedFrames } = useContext(ShoppingCartContext);

  useEffect(() => {
    const thankYou = query['thank-you'] !== undefined;
    const paymentMethodValue = thankYou ? 'CARD' : '';

    if (thankYou) {
      removeAllFromCart();
      setPaymentMethod(paymentMethodValue);
      setTransactionPassed(true);
    }
  }, [query]);

  const goBack = () => {
    if (confirmPaymentMethod) {
      setConfirmPaymentMethod(false);
    } else if (paymentMethod) {
      setPaymentMethod('');
    } else if (choosePaymentMethod) {
      setChoosePaymentMethod(false);
    } else if (shippingInfoFormSubmitted) {
      setShippingInfoFormSubmitted(false);
    }
  };

  const haveFramesBeenSold = alreadySoldFrames && alreadySoldFrames.length > 0;

  const showMainFlow =
    !transactionPassed && !isPaymentBeingProcessed && !haveFramesBeenSold;

  return (
    <div
      className={`payment-form${
        isCheckout ? '' : ' payment-form--hidden-small-devices'
      }`}
    >
      {isPaymentBeingProcessed && <ProcessingWalletPayment />}
      {transactionPassed && <ThankYou />}
      {haveFramesBeenSold && (
        <>
          <SomeFramesSold />
          <button
            className="btn btn--primary"
            disabled={!selectedFrames || !selectedFrames.length}
            onClick={() => {
              setAlreadySoldFrames([]);
              pay();
            }}
            type="button"
          >
            Proceed
          </button>
          <Link href="/#nfts">
            <a className="btn btn--tertiary">Select more NFTs</a>
          </Link>
        </>
      )}
      {showMainFlow && (
        <>
          {!shippingInfoFormSubmitted && <PaymentFormInputs />}
          {shippingInfoFormSubmitted && !choosePaymentMethod && (
            <PaymentFormInfo />
          )}
          {choosePaymentMethod && !paymentMethod && <ChoosePaymentMethod />}
          {!!paymentMethod && !confirmPaymentMethod && <ConfirmPaymentMethod />}
          {paymentMethod === 'CARD' && confirmPaymentMethod && (
            <SecurityQuestion />
          )}
          {shippingInfoFormSubmitted && (
            <button
              className="btn btn--tertiary"
              onClick={goBack}
              type="button"
            >
              Back
            </button>
          )}
          {!shippingInfoFormSubmitted && (
            <button
              className="btn btn--tertiary payment-form__back-btn-small-devices"
              onClick={() => setIsCheckout(false)}
              type="button"
            >
              Back
            </button>
          )}
        </>
      )}
    </div>
  );
}
