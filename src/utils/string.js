/* eslint-disable import/prefer-default-export */
export const padZeroes = (num) => {
  num = num.toString();
  while (num.length < 4) {
    num = `0${num}`;
  }
  return num;
};
