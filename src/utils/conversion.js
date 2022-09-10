// eslint-disable-next-line import/prefer-default-export
export const getEthToEurRate = (eth) => {
  const parsedEth = parseFloat(eth);

  return (parsedEth * 1500).toFixed(2);
};
