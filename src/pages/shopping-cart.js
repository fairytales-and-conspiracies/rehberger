import { useContext, useEffect, useState } from 'react';

import Header from '@/components/Header';
import NFTPrice from '@/components/NFTPrice';
import PaymentFormWrapper from '@/components/PaymentFormWrapper';
import ShoppingCartViewer from '@/components/ShoppingCartViewer';
import PaymentContext from '@/context/PaymentContext';
import UniCryptContext from '@/context/UniCryptContext';

export default function ShoppingCart() {
  const { setInitialState, transactionPassed } = useContext(PaymentContext);
  const { requestfetchRatePeriodically } = useContext(UniCryptContext);

  const [isCheckout, setIsCheckout] = useState();

  useEffect(() => {
    document.body.classList.remove('overflow-hidden');

    return () => {
      setInitialState();
    };
  }, []);

  useEffect(() => {
    requestfetchRatePeriodically(true);
    return () => requestfetchRatePeriodically(false);
  }, []);

  return (
    <div className="bg-primary shopping-cart">
      <Header />
      <main className="shopping-cart__main">
        <div className="cart-viewer__top-section">
          <h1
            className={`cart-viewer__heading${
              transactionPassed ? ' cart-viewer__heading--invisible' : ''
            }`}
          >
            Shopping cart
          </h1>
          <div className="cart-viewer__total-and-proceed-wrapper">
            <div className="cart-viewer__total">
              <NFTPrice isTotalPrice />
            </div>
            {!isCheckout && (
              <button
                className="cart-viewer__proceed-small-devices btn btn--primary"
                onClick={() => setIsCheckout(true)}
                type="button"
              >
                Proceed to checkout
              </button>
            )}
          </div>
        </div>
        <div className="shopping-cart__container">
          <ShoppingCartViewer
            isCheckout={isCheckout}
            setIsCheckout={setIsCheckout}
          />
          <PaymentFormWrapper
            isCheckout={isCheckout}
            setIsCheckout={setIsCheckout}
          />
        </div>
      </main>
    </div>
  );
}
