import { translations } from './translations';

export function getTranslation(lang, key) {
  const dict = translations[lang] || translations.fr;
  return dict[key] || key;
}

export function useTranslation(lang) {
  return {
    t: (key) => getTranslation(lang, key),
    lang
  };
}
