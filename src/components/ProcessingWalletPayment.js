import Image from 'next/image';

const ProcessingWalletPayment = () => {
  return (
    <div className="processing-wallet-payment">
      <h2 className="processing-wallet-payment__heading">
        YOUR PAYMENT IS BEING PROCESSED
      </h2>
      <p className="processing-wallet-payment__info">
        Thank you for your patience.
      </p>
      <div className="processing-wallet-payment__image">
        <Image
          alt="Processing payment"
          layout="fill"
          src="/img/loading-diamonds.svg"
        />
      </div>
    </div>
  );
};

export default ProcessingWalletPayment;
