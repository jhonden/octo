import React from 'react'
import { WindowManagerProvider } from './components/WindowManagerContext'
import WindowContainer from './components/WindowContainer'
import Dock from './components/Dock'
import './App.css'

/**
 * 主应用组件
 * 集成窗口系统管理器和导航栏
 */
function App() {
  return (
    <WindowManagerProvider>
      <div className="App">
        {/* 主内容区 - 显示默认仪表盘 */}
        <div className="main-content">
          <div className="dashboard-welcome">
            <h1>Octo - 设计工作空间</h1>
            <p>从底部导航栏选择一个窗口开始工作</p>
            <p>🚀 窗口系统已启用 - 点击底部菜单打开独立窗口</p>
          </div>
        </div>

        {/* 窗口容器 - 通过Portal渲染所有打开的窗口 */}
        <WindowContainer />

        {/* 底部导航栏 - 一级菜单 */}
        <Dock />
      </div>
    </WindowManagerProvider>
  )
}

export default App
