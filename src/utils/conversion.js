export const ethToEur = (eth, rate) => {
  const parsedEth = parseFloat(eth);

  return rate !== undefined ? (parsedEth * rate).toFixed(2) : undefined;
};

export const formatPrice = (
  eth,
  rate,
  unit = 'EUR',
  isUnitAfter = true,
  nbSpaces = 1
) => {
  const price = ethToEur(eth, rate);
  const priceNumberFormatted = price?.toString().replace('.', ',');
  const spaces = new Array(nbSpaces + 1).join(' ');

  return priceNumberFormatted
    ? isUnitAfter
      ? `${priceNumberFormatted}${spaces}${unit}`
      : `${unit}${spaces}${priceNumberFormatted}`
    : '';
};
