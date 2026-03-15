import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentLanguage, changeLanguage as changeLanguageUtil } from '../i18n';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: getCurrentLanguage(),
  changeLanguage: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialLanguage = getCurrentLanguage();

  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);

  const changeLanguage = (lng: string) => {
    setCurrentLanguage(lng);
    changeLanguageUtil(lng);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }
  return context;
};
