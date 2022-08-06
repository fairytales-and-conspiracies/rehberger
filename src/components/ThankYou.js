import Link from 'next/link';

export default function ThankYou({ paymentMethod }) {
  return (
    <div className="thank-you">
      <h2 className="thank-you__heading">THANK YOU FOR YOUR PURCHASE!</h2>
      <p className="thank-you__payment-successful-info">
        Your payment was successful
      </p>
      <p className="thank-you__additional-info">
        {paymentMethod === 'WALLET' &&
          'Purchased NFTs were minted to your wallet! Please check your wallet.'}
        {paymentMethod === 'CARD' &&
          'Please check your email for confirmation and token IDs of your purchased NFTs. To have your NFTs transferred to your Ethereum wallet please follow the link provided to you in the confirmation email.'}
      </p>
      <Link href="/">
        <a className="btn btn--tertiary">Home</a>
      </Link>
    </div>
  );
}
