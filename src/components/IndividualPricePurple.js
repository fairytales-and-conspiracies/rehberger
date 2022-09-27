import Image from 'next/image';

import { formatPrice } from '@/utils/conversion';
import UniCryptContext from '@/context/UniCryptContext';
import { useContext } from 'react';

const NFT_PRICE_ETH = process.env.NEXT_PUBLIC_NFT_PRICE_ETH;
const NFT_PRICE_ETH_STRING = NFT_PRICE_ETH.replace('.', ',');

export default function IndividualPricePurple() {
  const { getEthToEurRate } = useContext(UniCryptContext);

  const nftPriceInEurosString = formatPrice(NFT_PRICE_ETH, getEthToEurRate());

  return (
    <div className="individual-price-purple">
      <div className="individual-price-purple__main">
        <h5 className="individual-price-purple__heading">
          Individual NFT Price
        </h5>
        <div className="individual-price-purple__price">
          <span className="individual-price-purple__currency-eth">
            <Image alt="Ether" height="50px" src="/img/eth.svg" width="30px" />
          </span>
          {NFT_PRICE_ETH_STRING}
        </div>
      </div>
      <p className="individual-price-purple__euro-price">
        {nftPriceInEurosString}
      </p>
    </div>
  );
}
