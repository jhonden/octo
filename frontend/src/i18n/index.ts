import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// 直接导入语言资源（同步）
import zhCNResources from './zh-CN.json';
import enUSResources from './en-US.json';

const resources = {
  'en-US': {
    translation: enUSResources
  },
  'zh-CN': {
    translation: zhCNResources
  }
};

// 初始化i18n实例
const savedLanguage = localStorage.getItem('app-language') || 'zh-CN';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    lng: savedLanguage,
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// 导出变更语言函数
export const changeLanguage = (lng: string) => {
  localStorage.setItem('app-language', lng);
  window.location.reload();
};

// 导出获取当前语言函数
export const getCurrentLanguage = () => {
  return localStorage.getItem('app-language') || 'zh-CN';
};

// 导出默认实例
export default i18n;
