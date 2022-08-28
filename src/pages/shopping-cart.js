import { useState } from 'react';

import Header from '@components/Header';
import PaymentFormWrapper from '@components/PaymentFormWrapper';
import ShoppingCartViewer from '@components/ShoppingCartViewer';

export default function ShoppingCart() {
  const [isCheckout, setIsCheckout] = useState();

  return (
    <div className="bg-primary">
      <Header />
      <main className="shopping-cart">
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
