import { ReactNode, useEffect, useMemo, useState } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// project-imports
import useConfig from 'hooks/useConfig';

// types
import { I18n } from 'types/config';

// load locales files
function loadLocaleData(locale: I18n) {
  switch (locale) {
    case 'fr':
      return import('utils/locales/fr.json');
    case 'ro':
      return import('utils/locales/ro.json');
    case 'tr':
      return import('utils/locales/tr.json');
    case 'zh':
      return import('utils/locales/zh.json');
    case 'en':
    default:
      return import('utils/locales/en.json');
  }
}

// ==============================|| LOCALIZATION ||============================== //

interface Props {
  children: ReactNode;
}

export default function Locales({ children }: Props) {
  const { i18n } = useConfig();

  const [messages, setMessages] = useState<Record<string, unknown> | Record<string, MessageFormatElement[]> | undefined>();
  const localeDataPromise = useMemo(() => loadLocaleData(i18n), [i18n]);

  useEffect(() => {
    localeDataPromise.then((d) => {
      setMessages(d.default as Record<string, unknown> | Record<string, MessageFormatElement[]> | undefined);
    });
  }, [localeDataPromise]);

  return (
    <>
      {messages && (
        <IntlProvider
          locale={i18n}
          defaultLocale="en"
          messages={messages as Record<string, string> | Record<string, MessageFormatElement[]>}
        >
          {children}
        </IntlProvider>
      )}
    </>
  );
}
