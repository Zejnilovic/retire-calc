import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import i18n from '../i18n';

interface LocaleContextType {
  currency: string;
  setCurrency: (c: string) => void;
  language: string;
  changeLanguage: (lng: string) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  currency: 'CZK',
  setCurrency: () => {},
  language: 'cs',
  changeLanguage: () => {},
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState('CZK');
  const [language, setLanguage] = useState(i18n.language);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };
  return (
    <LocaleContext.Provider value={{ currency, setCurrency, language, changeLanguage }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
