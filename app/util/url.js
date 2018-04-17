// See https://github.com/ansman/validate.js/blob/7b0b45c208a06894eb7a2950501ccdfc44465eb4/validate.js#L1090
export const isUrl = value => {
  const schemes = ["http", "https"];
  const pattern =
    "^" +
    "(?:(?:" +
    schemes.join("|") +
    ")://)" +
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))?" +
    ")" +
    "(?::\\d{2,5})?" +
    "(?:[/?#]\\S*)?" +
    "$";
  var regExp = new RegExp(pattern, "i");
  return regExp.exec(value);
};

export const cleanUrl = value => {
  value = value.toLowerCase();
  const dirtyValues = ["/gpsgateserver", "/ggs"];
  return dirtyValues.reduce((cleanValue, dirtyValue) => {
    const end = cleanValue.lastIndexOf(dirtyValue);
    if (end > 0) {
      cleanValue = cleanValue.substring(0, end);
    }
    return cleanValue;
  }, value);
};
