import React from 'react'
import { useWindowManager } from './WindowManagerContext'
import './Dock.css'

/**
 * Dock Navigation Component
 * Mac OS-style dock，支持窗口内外两种定位模式
 * 正常模式：固定在窗口底部
 * 最大化模式：移到窗口外（bottom: -60px），z-index最高
 */
const Dock = () => {
  const { windows, openWindow, switchToWindow, isAnyWindowMaximized } = useWindowManager()

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

  return (
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
    </div>
  )
}

export default Dock
