import React, { useState } from 'react'
import { useWindowManager } from './WindowManagerContext'
import { useTranslation } from 'react-i18next'
import { useLanguageContext } from '../contexts/LanguageContext'
import { SettingOutlined } from '@ant-design/icons'
import SystemConfig from './SystemConfig'
import './Dock.css'

/**
 * Dock Navigation Component
 * Mac OS-style dock，支持窗口内外两种定位模式
 * 正常模式：固定在窗口底部
 * 最大化模式：移到窗口外（bottom: -60px），z-index最高
 */
const Dock = () => {
  const { windows, openWindow, switchToWindow, isAnyWindowMaximized } = useWindowManager()
  const { t } = useTranslation()
  const [systemConfigVisible, setSystemConfigVisible] = useState(false)
  const { currentLanguage, changeLanguage } = useLanguageContext()

  // 处理菜单项点击 - 打开/激活窗口
  const handleMenuClick = (windowId) => {
    const window = windows.find(w => w.id === windowId)
    if (!window.isOpen) {
      // 窗口未打开，打开窗口
      openWindow(windowId)
    } else {
      // 窗口已打开（包括最小化或最大化状态），激活它
      switchToWindow(windowId)
    }
  }

  // 处理语言切换
  const handleLanguageChange = (lng) => {
    changeLanguage(lng);
    setSystemConfigVisible(false);
  };

  return (
    <>
      <div className={`dock ${isAnyWindowMaximized ? 'dock-maximized' : ''}`}>
        {windows.map((window) => (
          <div
            key={window.id}
            className={`dock-item ${window.isOpen ? 'active' : ''} ${
              window.isMinimized ? 'minimized' : ''
            }`}
            onClick={() => handleMenuClick(window.id)}
          >
            {/* 最小化标识 */}
            {window.isMinimized && <div className="dock-minimize-indicator">−</div>}
            {/* Icon */}
            <div className="dock-icon">{window.icon}</div>
            {/* Label */}
            <div className="dock-label">{window.title}</div>
          </div>
        ))}
        {/* 系统配置菜单项 */}
        <div
          className="dock-item"
          onClick={() => setSystemConfigVisible(true)}
        >
          <div className="dock-icon"><SettingOutlined /></div>
          <div className="dock-label">{t('systemConfig.title')}</div>
        </div>
      </div>

      <SystemConfig
        visible={systemConfigVisible}
        onClose={() => setSystemConfigVisible(false)}
      />
    </>
  )
}

export default Dock
