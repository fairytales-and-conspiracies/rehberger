import { useWeb3 } from '@3rdweb/hooks';

export default function SubmittedFormInfo({
  setChoosePaymentMethod,
  transactionPassed,
  values,
}) {
  const { address, connectWallet } = useWeb3();

  // const onConfirmClick = () => {
  //   if (!!address) {
  //     confirm(values);
  //   } else {
  //     connectWallet('injected');
  //   }
  // };

  return (
    <>
      <h2 className="payment-form__heading">Confirmation</h2>
      <p className="payment-form__text">
        Your personal information will be stored and used solely for shipping
        and delivery purposes
      </p>
      <div className="payment-form__info-row">
        <span className="payment-form__info-label">Name:</span>
        <span className="payment-form__info">{`${values.firstName} ${values.lastName}`}</span>
      </div>
      <div className="payment-form__info-row">
        <span className="payment-form__info-label">Email:</span>
        <span className="payment-form__info">{values.email}</span>
      </div>
      <div className="payment-form__info-row">
        <span className="payment-form__info-label">Address:</span>
        <span className="payment-form__info">
          {values.addressLine1}
          {values.addressLine2 && (
            <>
              <br />
              {values.addressLine2}
            </>
          )}
        </span>
      </div>
      <div className="payment-form__info-row">
        <span className="payment-form__info-label">Country:</span>
        <span className="payment-form__info">{values.country}</span>
      </div>
      {values.region && (
        <div className="payment-form__info-row">
          <span className="payment-form__info-label">State/Province:</span>
          <span className="payment-form__info">{values.region}</span>
        </div>
      )}
      <div className="payment-form__info-row">
        <span className="payment-form__info-label">City:</span>
        <span className="payment-form__info">{values.city}</span>
      </div>
      <div className="payment-form__info-row">
        <span className="payment-form__info-label">Postal code:</span>
        <span className="payment-form__info">{values.postalCode}</span>
      </div>
      <button
        className="btn btn--primary"
        onClick={() => setChoosePaymentMethod(true)}
      >
        Choose payment method
      </button>
      {transactionPassed && (
        <div
          className="payment-form__success-message"
          onClick={onPayWithStripeClick}
        >
          You purchased your NFTs!
        </div>
      )}
      {transactionPassed === false && (
        <div className="payment-form__error-message error">
          There has been an error with the transaction.
        </div>
      )}
    </>
  );
}
