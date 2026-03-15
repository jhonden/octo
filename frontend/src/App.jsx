import React from 'react'
import { WindowManagerProvider } from './components/WindowManagerContext'
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import WindowContainer from './components/WindowContainer'
import Dock from './components/Dock'
import { LanguageProvider } from './contexts/LanguageContext'
import './App.css'
import i18n from './i18n'

/**
 * 主应用组件
 * 集成窗口系统管理器和导航栏
 */
function App() {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <WindowManagerProvider>
          <div className="App">
            {/* 主内容区 - 显示默认仪表盘 */}
            <div className="main-content">
              <div className="dashboard-welcome">
                <h1>{t('welcome.title')}</h1>
                <p>{t('welcome.subtitle')}</p>
                <p>{t('welcome.hint')}</p>
              </div>
            </div>

            {/* 窗口容器 - 通过Portal渲染所有打开的窗口 */}
            <WindowContainer />

            {/* 底部导航栏 - 一级菜单 */}
            <Dock />
          </div>
        </WindowManagerProvider>
      </LanguageProvider>
    </I18nextProvider>
  )
}

export default App
