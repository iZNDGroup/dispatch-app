import { getPhraseBook } from "../services/localization";

let phraseBook = null;

export const configurePhraseBook = () => {
  if (phraseBook) {
    throw new Error("configurePhraseBook should only be called once");
  }
  return getPhraseBook("DispatchApp").then(response => {
    phraseBook = response;
  });
};

export const localize = phrase => {
  if (!phraseBook) {
    throw new Error("configurePhraseBook must be called before localize");
  }
  const localizedValue = phraseBook[phrase];
  if (!localizedValue) {
    console.debug("### localize phrase not found", phrase);
    return phrase;
  }
  return localizedValue;
};
