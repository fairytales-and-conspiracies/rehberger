import Image from 'next/image';

import { formatPrice } from '@/utils/conversion';
import { useContext } from 'react';
import UniCryptContext from '@/context/UniCryptContext';

const INDIVIDUAL_PRICE_TEXT = 'Individual price';
const NFT_PRICE_ETH = process.env.NEXT_PUBLIC_NFT_PRICE_ETH;
const NFT_PRICE_ETH_STRING = NFT_PRICE_ETH.replace('.', ',');

export default function IndividualPrice() {
  const { ethToEurRate } = useContext(UniCryptContext);

  const nftPriceInEurosString = formatPrice(NFT_PRICE_ETH, ethToEurRate);

  return (
    <div className="individual-price">
      <div className="individual-price__main">
        {INDIVIDUAL_PRICE_TEXT.split('').map((char, index) => (
          <span
            className={`individual-price__step-${index}`}
            key={INDIVIDUAL_PRICE_TEXT.substring(index)}
          >
            {char}
          </span>
        ))}
        <br />
        <div className="individual-price__price">
          <span className="individual-price__currency-eth">
            <Image alt="Ether" height="45px" src="/img/eth.svg" width="27px" />{' '}
          </span>
          {NFT_PRICE_ETH_STRING.split('').map((char, index) => (
            <span
              className={`individual-price__price-step-${index}`}
              key={NFT_PRICE_ETH_STRING.substring(index)}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <p className="individual-price__euro-price">
        {nftPriceInEurosString.split('').map((char, index) => (
          <span
            className={`individual-price__euro-price-step-${index}`}
            key={nftPriceInEurosString.substring(index)}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
