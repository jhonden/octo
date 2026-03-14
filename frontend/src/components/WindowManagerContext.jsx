import React, { createContext, useContext, useState } from 'react'

// 创建WindowManager Context
const WindowManagerContext = createContext(null)

/**
 * 窗口管理器Provider
 * 管理所有窗口的状态：打开、关闭、最大化、恢复、最小化、切换
 */
export const WindowManagerProvider = ({ children }) => {
  // 窗口状态定义
  // 每个窗口包含：id, title, component, isOpen, isMaximized, isMinimized, position, size
  const [windows, setWindows] = useState([
    {
      id: 'dashboard',
      title: '仪表盘',
      icon: '📊',
      component: null, // 仪表盘使用默认内容
      isOpen: false,
      isMaximized: false,
      isMinimized: false,
      position: { x: 50, y: 50 },
      size: 'normal',
    },
    {
      id: 'services',
      title: '服务知识',
      icon: '📚',
      component: null, // 动态导入
      isOpen: false,
      isMaximized: false,
      isMinimized: false,
      position: { x: 100, y: 100 },
      size: 'normal',
    },
    {
      id: 'spaces',
      title: '设计空间',
      icon: '💼',
      component: null,
      isOpen: false,
      isMaximized: false,
      isMinimized: false,
      position: { x: 150, y: 150 },
      size: 'normal',
    },
    {
      id: 'skills',
      title: '技能管理',
      icon: '⚙️',
      component: null,
      isOpen: false,
      isMaximized: false,
      isMinimized: false,
      position: { x: 200, y: 200 },
      size: 'normal',
    },
    {
      id: 'mcp',
      title: 'MCP 集成',
      icon: '🔌',
      component: null,
      isOpen: false,
      isMaximized: false,
      isMinimized: false,
      position: { x: 250, y: 250 },
      size: 'normal',
    },
  ])

  // 当前激活的窗口ID
  const [activeWindowId, setActiveWindowId] = useState(null)

  // 全局是否处于最大化状态（任意窗口最大化时为true）
  const [isAnyWindowMaximized, setIsAnyWindowMaximized] = useState(false)

  /**
   * 打开指定窗口
   * @param {string} windowId - 窗口ID
   */
  const openWindow = (windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isOpen: true, isMinimized: false }
          : w
      )
    )
    setActiveWindowId(windowId)
  }

  /**
   * 关闭指定窗口
   * @param {string} windowId - 窗口ID
   */
  const closeWindow = (windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isOpen: false, isMaximized: false, isMinimized: false, size: 'normal' }
          : w
      )
    )

    // 如果关闭的是当前激活窗口，切换到其他打开的窗口或null
    if (activeWindowId === windowId) {
      const otherOpenWindows = windows.filter(
        w => w.id !== windowId && w.isOpen
      )
      if (otherOpenWindows.length > 0) {
        setActiveWindowId(otherOpenWindows[0].id)
      } else {
        setActiveWindowId(null)
      }
    }

    // 检查是否还有窗口处于最大化状态
    checkMaximizedState(windowId)
  }

  /**
   * 最小化指定窗口
   * @param {string} windowId - 窗口ID
   */
  const minimizeWindow = (windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isMaximized: false, isMinimized: true, size: 'minimized' }
          : w
      )
    )

    if (activeWindowId === windowId) {
      const otherOpenWindows = windows.filter(
        w => w.id !== windowId && w.isOpen && !w.isMinimized
      )
      if (otherOpenWindows.length > 0) {
        setActiveWindowId(otherOpenWindows[0].id)
      } else {
        setActiveWindowId(null)
      }
    }

    checkMaximizedState(windowId)
  }

  /**
   * 最大化指定窗口
   * @param {string} windowId - 窗口ID
   */
  const maximizeWindow = (windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isMaximized: true, size: 'maximized' }
          : w
      )
    )
    setIsAnyWindowMaximized(true)
    setActiveWindowId(windowId)
  }

  /**
   * 恢复指定窗口（从最大化或最小化到正常）
   * @param {string} windowId - 窗口ID
   */
  const restoreWindow = (windowId) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, isMaximized: false, isMinimized: false, size: 'normal' }
          : w
      )
    )
    setIsAnyWindowMaximized(false)
  }

  /**
   * 切换到指定窗口（激活窗口）
   * @param {string} windowId - 窗口ID
   */
  const switchToWindow = (windowId) => {
    // 如果窗口未打开，先打开
    const window = windows.find(w => w.id === windowId)
    if (!window.isOpen) {
      openWindow(windowId)
    } else if (window.isMinimized) {
      // 如果窗口已最小化，恢复它
      restoreWindow(windowId)
      setActiveWindowId(windowId)
    } else {
      setActiveWindowId(windowId)
    }
  }

  /**
   * 检查是否还有窗口处于最大化状态
   * @param {string} changedWindowId - 刚刚改变状态的窗口ID
   */
  const checkMaximizedState = (changedWindowId) => {
    const hasMaximizedWindow = windows.some(
      w => w.id !== changedWindowId && w.isMaximized && w.isOpen
    )
    setIsAnyWindowMaximized(hasMaximizedWindow)
  }

  /**
   * 更新窗口位置（用于拖拽）
   * @param {string} windowId - 窗口ID
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  const updateWindowPosition = (windowId, x, y) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === windowId
          ? { ...w, position: { x, y } }
          : w
      )
    )
  }

  const value = {
    windows,
    activeWindowId,
    isAnyWindowMaximized,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    switchToWindow,
    updateWindowPosition,
  }

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}

/**
 * 使用WindowManager Context的Hook
 */
export const useWindowManager = () => {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider')
  }
  return context
}
