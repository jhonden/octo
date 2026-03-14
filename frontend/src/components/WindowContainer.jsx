import React from 'react'
import { createPortal } from 'react-dom'
import { useWindowManager } from './WindowManagerContext'
import ServiceKnowledge from '../pages/ServiceKnowledge'
import './WindowContainer.css'

/**
 * 窗口组件
 * 渲染单个可拖拽、可最大化的窗口
 */
const Window = ({ windowData, isActive, onClose, onMaximize, onRestore, onMinimize, onMouseDown }) => {
  const { updateWindowPosition } = useWindowManager()

  // 窗口拖拽状态
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const [windowPosition, setWindowPosition] = React.useState(windowData.position)

  // 处理拖拽开始
  const handleDragStart = (e) => {
    if (windowData.isMaximized) return // 最大化时不允许拖拽

    setIsDragging(true)
    setDragStart({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
  }

  // 处理拖拽中
  const handleDragMove = (e) => {
    if (!isDragging || windowData.isMaximized) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    setWindowPosition({ x: newX, y: newY })
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (!isDragging || windowData.isMaximized) return

    setIsDragging(false)
    updateWindowPosition(windowData.id, windowPosition.x, windowPosition.y)
  }

  // 全局监听鼠标移动和释放
  React.useEffect(() => {
    if (isDragging) {
      // 使用浏览器的全局 window 对象
      const browserWindow = window
      browserWindow.addEventListener('mousemove', handleDragMove)
      browserWindow.addEventListener('mouseup', handleDragEnd)
      return () => {
        browserWindow.removeEventListener('mousemove', handleDragMove)
        browserWindow.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, windowPosition, dragStart])

  // 窗口样式
  const windowStyle = {
    left: windowData.isMaximized ? 0 : `${windowPosition.x}px`,
    top: windowData.isMaximized ? 0 : `${windowPosition.y}px`,
    width: windowData.isMaximized ? '100%' : '1200px',
    height: windowData.isMaximized ? '100%' : '800px',
    zIndex: isActive ? 100 : 50,
  }

  // 渲染窗口内容组件
  const renderContent = () => {
    switch (windowData.id) {
      case 'services':
        return <ServiceKnowledge />
      case 'dashboard':
      case 'spaces':
      case 'skills':
      case 'mcp':
      default:
        return (
          <div style={{ padding: '24px' }}>
            <h1>{windowData.title}</h1>
            <p>当前窗口: {windowData.id}</p>
            <p>这个功能正在开发中...</p>
          </div>
        )
    }
  }

  return (
    <div
      className={`window ${isActive ? 'window-active' : ''} ${
        windowData.isMaximized ? 'window-maximized' : ''
      }`}
      style={windowStyle}
      onMouseDown={onMouseDown}
    >
      {/* 窗口标题栏 */}
      <div
        className="window-header"
        onMouseDown={handleDragStart}
        style={{ cursor: windowData.isMaximized ? 'default' : 'move' }}
      >
        <div className="window-title">
          <span className="window-title-icon">{windowData.icon}</span>
          <span>{windowData.title}</span>
        </div>
        <div className="window-controls">
          <button
            className="window-control window-control-minimize"
            onClick={() => onMinimize(windowData.id)}
            title="最小化"
          >
            <span>−</span>
          </button>
          {windowData.isMaximized ? (
            <button
              className="window-control window-control-restore"
              onClick={() => onRestore(windowData.id)}
              title="恢复"
            >
              <span>◻</span>
            </button>
          ) : (
            <button
              className="window-control window-control-maximize"
              onClick={() => onMaximize(windowData.id)}
              title="最大化"
            >
              <span>□</span>
            </button>
          )}
          <button
            className="window-control window-control-close"
            onClick={() => onClose(windowData.id)}
            title="关闭"
          >
            <span>✕</span>
          </button>
        </div>
      </div>

      {/* 窗口内容区 */}
      <div className="window-content">
        {renderContent()}
      </div>
    </div>
  )
}

/**
 * 窗口容器
 * 使用React Portal渲染所有打开的窗口
 */
const WindowContainer = () => {
  const {
    windows,
    activeWindowId,
    closeWindow,
    maximizeWindow,
    restoreWindow,
    minimizeWindow,
    switchToWindow,
  } = useWindowManager()

  // 获取所有打开且未最小化的窗口
  const openWindows = windows.filter(w => w.isOpen && !w.isMinimized)

  if (openWindows.length === 0) {
    return null // 没有打开的窗口
  }

  // 使用Portal将窗口渲染到document.body
  return createPortal(
    <div className="window-container">
      {openWindows.map(windowData => (
        <Window
          key={windowData.id}
          windowData={windowData}
          isActive={windowData.id === activeWindowId}
          onClose={closeWindow}
          onMaximize={maximizeWindow}
          onRestore={restoreWindow}
          onMinimize={minimizeWindow}
          onMouseDown={() => switchToWindow(windowData.id)}
        />
      ))}
    </div>,
    document.body
  )
}

export default WindowContainer
