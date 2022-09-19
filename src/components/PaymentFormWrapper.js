import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import ChoosePaymentMethod from '@/components/ChoosePaymentMethod';
import ConfirmPaymentMethod from '@/components/ConfirmPaymentMethod';
import PaymentFormInfo from '@/components/PaymentFormInfo';
import PaymentFormInputs from '@/components/PaymentFormInputs';
import ProcessingWalletPayment from '@/components/ProcessingWalletPayment';
import SecurityQuestion from '@/components/SecurityQuestion';
import ThankYou from '@/components/ThankYou';
import PaymentContext from '@/context/PaymentContext';
import ShoppingCartContext from '@/context/ShoppingCartContext';

export default function PaymentFormWrapper({ isCheckout, setIsCheckout }) {
  const router = useRouter();
  const { query } = router;

  const {
    isPaymentBeingProcessed,
    paymentMethod,
    setPaymentMethod,
    setShippingInfoFormSubmitted,
    setTransactionPassed,
    shippingInfoFormSubmitted,
    transactionPassed,
  } = useContext(PaymentContext);
  const { removeAllFromCart } = useContext(ShoppingCartContext);

  const [choosePaymentMethod, setChoosePaymentMethod] = useState(false);
  const [confirmPaymentMethod, setConfirmPaymentMethod] = useState(false);

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

  return (
    <div
      className={`payment-form${
        isCheckout ? '' : ' payment-form--hidden-small-devices'
      }`}
    >
      {isPaymentBeingProcessed && <ProcessingWalletPayment />}
      {transactionPassed && <ThankYou />}
      {!transactionPassed && !isPaymentBeingProcessed && (
        <>
          {!shippingInfoFormSubmitted && <PaymentFormInputs />}
          {shippingInfoFormSubmitted && !choosePaymentMethod && (
            <PaymentFormInfo setChoosePaymentMethod={setChoosePaymentMethod} />
          )}
          {choosePaymentMethod && !paymentMethod && <ChoosePaymentMethod />}
          {!!paymentMethod && !confirmPaymentMethod && (
            <ConfirmPaymentMethod
              setConfirmPaymentMethod={setConfirmPaymentMethod}
            />
          )}
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
