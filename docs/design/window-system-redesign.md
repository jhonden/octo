# 窗口系统 + 可切换导航栏 - 重构设计文档

> **设计日期**: 2026-03-14
> **设计版本**: v1.0
> **设计师**: Claude Sonnet 4.5
> **状态**: 待实施

---

## 一、设计动机

### 1.1 原有问题

**用户体验问题：**
- 子菜单体验复杂（悬停容易消失，点击困难）
- 底部菜单半透明，受内容背景色影响
- 子菜单内容混合在主页面中，缺乏层次感
- 缺乏"桌面APP"的直观操作体验

### 1.2 用户需求

**明确表达的需求：**
> "在web应用里不合适，我想底部就不要子菜单了，只要一级菜单，用户点击某个一级菜单，你就打开这个一级菜单的窗口，就像打开一个桌面应用的APP一样，子菜单放到这个窗口里，并且内容区域的滚动条只能在这个窗口里，窗口的底部就紧挨着底部导航的顶部"

**核心需求：**
1. 每个一级菜单对应一个独立窗口
2. 窗口内容完全自包含（模块的完整功能）
3. 底部导航栏（一级菜单）在窗口最大化时移出窗口外，完全被窗口内容覆盖
4. 窗口固定大小（默认1200x800），最大化时可全屏
5. 窗口可拖拽（可选）

---

## 二、设计方案

### 2.1 整体架构

```
┌─────────────────────────────────┐
│      顶部导航栏（60px高）           │
│  ┌─────────────────────────────────┤
│  窗口内容区                     │
│  ┌─────────────────────────────────┤
│                         │
│         ┌───────────────────────┐│
│         │         [窗口1]        │
│         │                      [窗口2]        │
│         └───────────────────────┘│
│  ┌─────────────────────────────────┘│
│      底部导航栏（0px）            │
│  ┌─────────────────────────────────┤
│  ┌─────────────────────────────────┘│
└───────────────────────────────────┘
```

**特点：**
- **窗口管理器**：打开、关闭、最小化、最大化、恢复、切换
- **固定窗口大小**：默认1200x800，最大化时可全屏
- **导航栏智能定位**：正常时固定在窗口底部，最大化时移到窗口外
- **多窗口支持**：最多4个窗口同时打开
- **独立内容**：每个窗口管理自己的状态

---

### 2.2 组件分层

```
App.jsx (主应用)
├── WindowManager (状态管理)
│   └── WindowContainer (窗口容器)
│         ├── ServiceKnowledgeWindow
│         ├── DesignSpaceWindow
│         ├── SkillsWindow
│         └── MCPIntegrationWindow
└── Dock (导航栏，固定高度60px)
```

**组件职责：**
- **WindowManager**: 全局窗口状态管理
- **WindowContainer**: 窗口容器布局，窗口拖拽
- **各Window组件**: 模块功能实现
- **Dock**: 一级菜单，支持窗口内外两种定位模式

---

### 2.3 窗口系统状态管理

**全局状态（App.jsx中）：**
```javascript
const [windows, setWindows] = useState([
  { id: 1, title: '服务知识', component: ServiceKnowledgeWindow, isOpen: false, isMaximized: false, position: { x: 50, y: 50 }, size: 'normal' },
  // ...
])

const activeWindowId = useState(null)
const isMaximized = useState(false)
```

**窗口状态定义：**
- `isOpen`: 窗口是否打开
- `isMaximized`: 窗口是否最大化
- `position`: 窗口位置（x, y坐标）
- `size`: 'normal' | 'maximized' | 'minimized'

**窗口管理函数：**
- `openWindow(windowId)`: 打开指定窗口
- `closeWindow(windowId)`: 关闭指定窗口
- `minimizeWindow(windowId)`: 最小化指定窗口
- `maximizeWindow(windowId)`: 最大化指定窗口
- `restoreWindow(windowId)`: 恢复指定窗口（从最大化到正常）
- `switchToWindow(windowId)`: 切换到指定窗口

---

### 2.4 导航栏设计

#### 导航栏组成

**菜单项（一级菜单）：**
- 仪表盘 (📊)
- 服务知识 (📚)
- 设计空间 (💼)
- 技能管理 (⚙️)
- MCP集成 (🔌)

#### 导航栏样式

**正常模式（窗口非最大化）：**
- 容器：固定高度 60px
- 定位：`position: fixed`
- 位置：`bottom: 0`
- 对齐：`left: 50%`
- 背景色：`#1a1a2e`（深蓝灰）
- 激活项：`#3b82f6`（亮蓝）+ `box-shadow: 0 0 12px rgba(59, 130, 246, 0.5)`
- 文字：`#ffffff`

**最大化模式（窗口最大化时）：**
- 容器：固定高度 60px
- 定位：`position: fixed`
- 位置：`bottom: -60px`
- 对齐：`left: 50%`
- z-index：`9999`（最高层级）
- 添加按钮：最大化/恢复
- 样式：`position: absolute; bottom: 0; right: 20px;`

#### CSS实现

**Dock容器（正常模式）：**
```css
.dock {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  background: #1a1a2e;
  border-radius: 12px;
  padding: 0 24px;
  height: 60px;
  display: flex;
  gap: 20px;
}

.dock-item {
  position: relative;
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dock-item.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3));
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}
```

**Dock容器（最大化模式）：**
```css
.dock.docked-out {
  position: fixed;
  bottom: -60px;
  left: 50%;
  z-index: 9999;
  background: #1a1a2e;
  border-radius: 12px;
  padding: 0 24px;
  height: 60px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
```

**最大化/恢复按钮：**
```css
.dock-controls {
  position: absolute;
  right: 20px;
  top: 15px;
  display: flex;
  gap: 8px;
}

.dock-control {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dock-control:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

---

### 2.5 技术实现细节

#### 窗口管理器实现

**数据结构：**
```typescript
interface WindowState {
  id: string
  title: string
  component: React.Component
  isOpen: boolean
  isMaximized: boolean
  position: { x: number, y: number }
  size: 'normal' | 'maximized' | 'minimized'
}
}
```

**窗口拖拽：**
- 使用 React DnD Kit 或 react-draggable
- 初始位置在 CSS Grid中定义
- onDragEnd 更新窗口position状态

**窗口切换：**
- 使用z-index控制显示/隐藏
- CSS transitions实现缩放效果

#### React Portal使用

```javascript
import { createPortal } from 'react-dom';
import { useWindowManager } from './WindowManager';

<WindowManager.Provider>
  <WindowManager.Consumer>
    {({ windows, activeWindowId, openWindow, closeWindow, maximizeWindow, minimizeWindow, restoreWindow }) => (
      <div className="window-container">
        {windows.map(window => (
          <Portal key={window.id} container={document.body}>
            <Window
              window={window}
              onClose={() => closeWindow(window.id)}
            />
          </Portal>
        ))}
      </div>
    )}
    </WindowManager.Consumer>
  </WindowManager.Provider>

<Window>
  {({
    window
  }) => (
    <div className="window-content">
      {window.component}
    </div>
  )
}
```

#### 窗口内容组件示例（ServiceKnowledgeWindow）

```typescript
interface ServiceKnowledgeWindowProps {
  window: WindowState
  onClose: () => void
}

const ServiceKnowledgeWindow: React.memo<ServiceKnowledgeWindowProps>(({ window, onClose }) => {
  // 完整的服务知识管理界面
  // ...
})
```

---

## 三、文件结构

```
frontend/src/
├── components/
│   ├── WindowManager.jsx          # 窗口管理器
│   ├── WindowContainer.jsx       # 窗口容器
│   └── Dock.jsx                  # 导航栏（已存在，需重构）
│       ├── windows/
│       │   ├── ServiceKnowledgeWindow.jsx
│       │   ├── DesignSpaceWindow.jsx
│       │   ├── SkillsWindow.jsx
│       │   └── MCPIntegrationWindow.jsx
│
└── pages/
    ├── ServiceKnowledge.jsx       # 窗口内容（独立窗口）
    ├── DesignSpace.jsx
    ├── SkillsWindow
    └── MCPIntegrationWindow
├── App.jsx                     # 主应用（状态管理）
└── WindowManagerContext.jsx       # Context Provider
└── index.css                    # 样式
```

---

## 四、开发任务清单

### 阶段1：基础设施（2小时）

- [ ] 创建 WindowManager 组件
- [ ] 创建 WindowContainer 组件
- [ ] 实现 窗口拖拽功能
- [ ] 添加窗口切换动画
- [ ] 重构 App.jsx 状态管理
- [ ] 重构 Dock.jsx 支持内外定位模式
- [ ] 创建 ServiceKnowledgeWindow 组件基础结构
- [ ] 测试窗口系统基础功能

### 阶段2：服务知识管理窗口（2小时）

- [ ] 实现服务列表表格
- [ ] 实现创建服务弹窗
- [ ] 实现编辑服务弹窗
- [ ] 集成 WindowManager 集成
- [ ] 测试窗口打开/关闭

### 阶段3：其他窗口（1小时）

- [ ] 创建 DesignSpaceWindow 基础结构
- [ ] 创建 SkillsWindow 基础结构
- [ ] 创建 MCPIntegrationWindow 基础结构

### 阶段4：完善导航栏（30分钟）

- [ ] 实现最大化/恢复按钮
- [ ] 完善两种定位模式切换
- [ ] 添加过渡动画
- [ ] 深色主题样式

### 阶段5：集成测试（30分钟）

- [ ] 完整测试所有窗口功能
- [ ] 测试窗口最大化时导航栏行为
- [ ] 性能优化和bug修复

---

## 五、技术债务和风险

### 5.1 技术债务

- **现有代码需要迁移**
  - Dock.jsx：子菜单逻辑删除，fan菜单逻辑删除
  - App.jsx：页面路由逻辑完全重写
  - 需要创建大量新组件

- **性能考虑**
  - 多窗口同时打开可能影响性能
  - Portal渲染开销

### 5.2 风险评估

**高风险：**
- 架构重大变更，可能引入新的bug
- 时间估算可能不准确

**风险缓解：**
- 分阶段实施，每阶段完成后测试
- 保持现有单页面作为回退方案

### 5.3 回退方案

如果窗口系统实现遇到严重问题，可以：
1. 回退到当前子菜单方案
2. 或实现混合方案（保留子菜单，但简化交互）

---

## 六、后续扩展方向

### 6.1 多窗口管理

- 窗口标签页（类似浏览器标签页）
- 窗口预设布局保存
- 窗口快捷键管理

### 6.2 高级窗口功能

- 窗口拆分（类似浏览器开发工具）
- 开发者工具面板
- 性能监控面板

### 6.3 协作功能

- 窗口间数据传递（IPC/WebSocket）

---

**设计文档版本历史**

v0.1 (2026-03-14) - 初始设计 - 子菜单方案
v1.0 (2026-03-14) - 窗口系统 + 可切换导航栏 - 重构设计

---

**状态**: ⏳️ 准备开始实施

**下一步**: 等待用户确认后开始分阶段实施
