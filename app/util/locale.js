import i18n from "react-native-i18n";
import moment from "moment";
import "moment/min/locales";

const configureLocale = () => {
  i18n.fallbacks = true;
  let currentLocale = i18n.currentLocale();
  if (currentLocale) {
    currentLocale = currentLocale.toLowerCase();
    const locales = moment.locales();
    const tmp = [currentLocale, getLangCode(currentLocale)];
    for (const tmp2 of tmp) {
      if (locales.includes(tmp2)) {
        moment.locale(tmp2);
        break;
      }
    }
  }
  // console.debug("locale", currentLocale, moment.locale());
};

const getLangCode = locale => {
  const end = locale.indexOf("-");
  if (end > 0) {
    locale = locale.substring(0, end);
  }
  return locale;
};

export default configureLocale;
