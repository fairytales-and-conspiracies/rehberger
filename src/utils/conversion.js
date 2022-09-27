// eslint-disable-next-line import/prefer-default-export
export const ethToEur = (eth, rate) => {
  const parsedEth = parseFloat(eth);

  const result = rate !== undefined ? (parsedEth * rate).toFixed(2) : '';
  console.log('ethToEur result', {parsedEth, rate, result})
  return result;
};
