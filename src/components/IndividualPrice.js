export default function IndividualPrice() {
  return (
    <div className="individual-price">
      {'Individual price'.split('').map((char, index) => (
        <span className={`individual-price__step-${index}`}>{char}</span>
      ))}
      <br />
      <div className="individual-price__price">
        {'666€'.split('').map((char, index) => (
          <span className={`individual-price__price-step-${index}`}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
