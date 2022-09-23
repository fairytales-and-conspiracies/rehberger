/* eslint-disable import/prefer-default-export */
export const padZeroes = (num, padding) => {
  let res = num.toString();
  const zeroes = padding || 4;
  while (res.length < zeroes) {
    res = `0${res}`;
  }
  return res;
};
