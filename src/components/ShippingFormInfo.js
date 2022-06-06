import { useWeb3 } from '@3rdweb/hooks';

export default function SubmittedFormInfo({
  confirm,
  transactionPassed,
  values,
}) {
  const { address, connectWallet } = useWeb3();

  const onConfirmClick = () => {
    if (!!address) {
      confirm(values);
    } else {
      connectWallet('injected');
    }
  };

  return (
    <>
      <div className="shipping-form__info-row">
        <span className="shipping-form__info-label">Name:</span>
        <span className="shipping-form__info">{`${values.firstName} ${values.lastName}`}</span>
      </div>
      <div className="shipping-form__info-row">
        <span className="shipping-form__info-label">Address:</span>
        <span className="shipping-form__info">
          {values.addressLine1}
          {values.addressLine2 && (
            <>
              <br />
              {values.addressLine2}
            </>
          )}
        </span>
      </div>
      <div className="shipping-form__info-row">
        <span className="shipping-form__info-label">Country:</span>
        <span className="shipping-form__info">{values.country}</span>
      </div>
      {values.region && (
        <div className="shipping-form__info-row">
          <span className="shipping-form__info-label">State/Province:</span>
          <span className="shipping-form__info">{values.region}</span>
        </div>
      )}
      <div className="shipping-form__info-row">
        <span className="shipping-form__info-label">City:</span>
        <span className="shipping-form__info">{values.city}</span>
      </div>
      <div className="shipping-form__info-row">
        <span className="shipping-form__info-label">Postal code:</span>
        <span className="shipping-form__info">{values.postalCode}</span>
      </div>
      <button className="btn btn--primary" onClick={onConfirmClick}>
        {!!address ? 'Confirm' : 'Connect wallet to pay'}
      </button>
      {transactionPassed && (
        <div
          className="shipping-form__success-message"
          onClick={onPayWithStripeClick}
        >
          You purchased your NFTs!
        </div>
      )}
      {transactionPassed === false && (
        <div className="shipping-form__error-message error">
          There has been an error with the transaction.
        </div>
      )}
    </>
  );
}
