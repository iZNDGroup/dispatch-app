export const parseJson = text => {
  return new Function("return " + text)(); // eslint-disable-line no-new-func
};
