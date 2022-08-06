import Image from 'next/image';

export default function IndividualPrice() {
  return (
    <div className="individual-price">
      <div className="individual-price__main">
        {'Individual price'.split('').map((char, index) => (
          <span className={`individual-price__step-${index}`} key={index}>
            {char}
          </span>
        ))}
        <br />
        <div className="individual-price__price">
          <span className="individual-price__currency-eth">
            <Image alt="Ether" height="45px" src="/img/eth.svg" width="27px" />{' '}
          </span>
          {'0,501'.split('').map((char, index) => (
            <span
              className={`individual-price__price-step-${index}`}
              key={index}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <p className="individual-price__euro-price">
        {'666,00 EUR'.split('').map((char, index) => (
          <span
            className={`individual-price__euro-price-step-${index}`}
            key={index}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
