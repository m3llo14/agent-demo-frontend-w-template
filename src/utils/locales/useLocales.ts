'use client';

import { useMemo } from 'react';
import useConfig from 'hooks/useConfig';
import en from './en.json';
import fr from './fr.json';
import ro from './ro.json';
import tr from './tr.json';
import zh from './zh.json';

const LOCALES: Record<string, any> = {
  en,
  fr,
  ro,
  tr,
  zh
};

// geçici: tarayıcı dili
const getDefaultLang = () => {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language.split('-')[0];
};

export default function useLocales() {
  const { i18n } = useConfig();
  const lang = i18n ?? getDefaultLang();

  const messages = LOCALES[lang] ?? LOCALES.en;

  const t = useMemo(() => {
    return (key: string) => {
      if (Object.prototype.hasOwnProperty.call(messages, key)) {
        return messages[key];
      }
      return key.split('.').reduce((acc: any, part) => acc?.[part], messages) ?? key;
    };
  }, [messages]);

  return { t, lang };
}
