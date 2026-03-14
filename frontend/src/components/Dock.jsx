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
  const { windows, openWindow, closeWindow, isAnyWindowMaximized } = useWindowManager()

  // 处理菜单项点击 - 打开/关闭窗口
  const handleMenuClick = (windowId) => {
    const window = windows.find(w => w.id === windowId)
    if (window.isOpen) {
      // 窗口已打开，切换到该窗口
      if (window.isMaximized) {
        // 如果已最大化，不做任何操作
        return
      }
      // 否则切换到该窗口（激活）
      // window is already open and active
    } else {
      // 窗口未打开，打开窗口
      openWindow(windowId)
    }
  }

  return (
    <div className={`dock ${isAnyWindowMaximized ? 'dock-maximized' : ''}`}>
      {windows.map((window) => (
        <div
          key={window.id}
          className={`dock-item ${window.isOpen ? 'active' : ''}`}
          onClick={() => handleMenuClick(window.id)}
        >
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
