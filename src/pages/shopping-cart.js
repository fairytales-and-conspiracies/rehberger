import { useContext, useEffect, useState } from 'react';

import Header from '@/components/Header';
import PaymentFormWrapper from '@/components/PaymentFormWrapper';
import ShoppingCartViewer from '@/components/ShoppingCartViewer';
import PaymentContext from '@/context/PaymentContext';

export default function ShoppingCart() {
  const { setInitialState } = useContext(PaymentContext);

  const [isCheckout, setIsCheckout] = useState();

  useEffect(() => {
    document.body.classList.remove('overflow-hidden');

    return () => {
      setInitialState();
    };
  }, []);

  return (
    <div className="bg-primary shopping-cart">
      <Header />
      <main className="shopping-cart__main">
        <ShoppingCartViewer
          isCheckout={isCheckout}
          setIsCheckout={setIsCheckout}
        />
        <PaymentFormWrapper
          isCheckout={isCheckout}
          setIsCheckout={setIsCheckout}
        />
      </main>
    </div>
  );
}
