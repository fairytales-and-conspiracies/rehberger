import Image from 'next/image';
import { useContext } from 'react';

import PaymentContext from '@/context/PaymentContext';
import { formatPrice } from '@/utils/conversion';
import UniCryptContext from '@/context/UniCryptContext';

const NFT_PRICE_ETH = process.env.NEXT_PUBLIC_NFT_PRICE_ETH;
const NFT_PRICE_ETH_STRING = NFT_PRICE_ETH.replace('.', ',');

const NFTPrice = ({ inShoppingCart, isTotalPrice }) => {
  const { shippingInfoFormSubmitted, totalPrice, vat } =
    useContext(PaymentContext);

  const { ethToEurRate } = useContext(UniCryptContext);

  const nftPriceInEurosString = formatPrice(NFT_PRICE_ETH, ethToEurRate);

  const totalPriceInEurosString = (price) => {
    return formatPrice(price, ethToEurRate, '€', false, 0);
  };

  return (
    <div className="nft-price">
      <span className="nft-price__eth">
        {isTotalPrice ? 'Total: ' : ''}
        <span
          className={`nft-price__eth-icon ${
            isTotalPrice ? 'nft-price__eth-icon--total-price' : ''
          }`}
        >
          {isTotalPrice && (
            <Image alt="Ether" layout="fill" src="/img/eth.svg" />
          )}
          {!isTotalPrice && (
            <Image
              alt="Ether"
              height={inShoppingCart ? '18' : '23'}
              src="/img/eth.svg"
              width={inShoppingCart ? '11' : '14'}
            />
          )}
        </span>
        {isTotalPrice
          ? totalPrice.toString().replace('.', ',')
          : NFT_PRICE_ETH_STRING}
      </span>
      <span
        className={`nft-price__eur ${
          inShoppingCart || isTotalPrice ? 'nft-price__eur--next-line' : ''
        } ${isTotalPrice ? 'nft-price__eur--total-price' : ''}`}
      >
        {!isTotalPrice &&
          (inShoppingCart
            ? `${nftPriceInEurosString}`
            : `/${nftPriceInEurosString}`)}
        {isTotalPrice && <>{totalPriceInEurosString(totalPrice)}</>}
      </span>
      <span
        className={`nft-price__tax-included ${
          isTotalPrice && shippingInfoFormSubmitted
            ? 'nft-price__tax-included--visible'
            : ''
        }`}
      >
        {vat > 0
          ? `${parseInt(vat * 100, 10)}% sales tax included`
          : 'No sales tax'}
      </span>
    </div>
  );
};

export default NFTPrice;
