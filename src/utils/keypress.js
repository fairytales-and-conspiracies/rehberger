/* eslint-disable import/prefer-default-export */
export const onEnterPress = (callback) => (event) => {
  const code = event.keyCode ? event.keyCode : event.which;
  if (code === 13) {
    callback();
  }
};
