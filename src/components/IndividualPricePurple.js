import Image from 'next/image';

export default function IndividualPricePurple() {
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
          0,501
        </div>
      </div>
      <p className="individual-price-purple__euro-price">666,00 EUR</p>
    </div>
  );
}
