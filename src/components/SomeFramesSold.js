import { useContext } from 'react';

import PaymentContext from '@/context/PaymentContext';

const SomeFramesSold = () => {
  const { alreadySoldFrames } = useContext(PaymentContext);

  return (
    <>
      <h2 className="payment-form__heading">Please note</h2>
      <p className="payment-form__text">
        While you were in the process of purchasing NFTs, the following have
        been recently sold and therefore removed from your shopping cart:
      </p>
      <ul className="some-frames-sold__frames">
        {alreadySoldFrames.map((frame) => (
          <li key={`${frame.video}_${frame.frame}`}>
            {frame.video}_{frame.frame}
          </li>
        ))}
      </ul>
      <p className="some-frames-sold__text">
        You may go back and choose more NFTs if necessary. If you wish to
        proceed as is, click the Proceed button.
      </p>
    </>
  );
};

export default SomeFramesSold;
