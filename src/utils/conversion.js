// eslint-disable-next-line import/prefer-default-export
export const ethToEur = (eth, rate) => {
  const parsedEth = parseFloat(eth);

  return rate !== undefined ? (parsedEth * rate).toFixed(2) : '';
};
