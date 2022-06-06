import Header from '@components/Header';
import ShippingFormWrapper from '@components/ShippingFormWrapper';
import ShoppingCartViewer from '@components/ShoppingCartViewer';

export default function ShoppingCart() {
  return (
    <div className="bg-primary">
      <Header />
      <main className="shopping-cart">
        <ShoppingCartViewer></ShoppingCartViewer>
        <ShippingFormWrapper></ShippingFormWrapper>
      </main>
    </div>
  );
}
