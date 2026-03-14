# Octo UI 设计规范 v2.0

> **更新时间**：2026-03-14
> **设计状态**：已完成原型设计

## 1. 设计理念

### 1.1 视觉风格

**Design Workspace（设计工作空间）**

- 灵感来源：Mac OS Dock 桌面式导航
- 核心概念：为架构师创建"设计工作空间"，而非传统 Web 应用
- 品牌契合：扇形子菜单如同 Octo 章鱼的触须
- 视觉质感：液态配色、旋转光效、环境光效营造沉浸式体验

### 1.2 设计原则

- 创新性：突破传统 Web 应用导航模式
- 专业性：精致细节、流畅动画、玻璃态设计
- 品牌化：强化 Octo 品牌联想（章鱼触须隐喻）
- 高效性：悬停弹出子菜单，快速访问多级功能

## 2. 配色系统

### 2.1 液态主题配色

| 颜色 | 用途 | CSS值 | 说明 |
|------|------|-------|------|
| 背景 | 页面背景 | linear-gradient(180deg, #0c4a6e 0%, #1a1a2e 100%) | 深蓝色渐变，营造液态感 |
| 主色 | 主要按钮、强调 | #3b82f6 | 电蓝色，液态主色 |
| 主色深 | 渐变使用 | #2563eb | 深蓝色 |
| 强调色 | 亮色强调 | #60a5fa | 浅蓝色 |
| 文本 | 主要文本 | #ffffff | 白色 |
| 次级文本 | 辅助信息 | #e2e8f0 | 浅灰白色 |
| 弱化文本 | 辅助信息 | #94a3b8 | 中灰色 |
| 玻璃态背景 | Dock、卡片背景 | rgba(255,255,255,0.04) | 半透明白色 |
| 玻璃态边框 | 分隔线 | rgba(255,255,255,0.06) | 极淡边框 |

### 2.2 功能色

| 颜色 | 用途 | CSS值 |
|------|------|-------|
| 绿色 | 已发布、成功状态 | linear-gradient(135deg, #10b981 0%, #059669 100%) |

### 2.3 渐变效果

- 主背景：`linear-gradient(180deg, #0c4a6e 0%, #1a1a2e 100%)`
- 主按钮：`linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`
- 卡片旋转光效：`conic-gradient(from 45deg, transparent, rgba(59, 130, 246, 0.08), transparent 90deg)`

### 2.4 动画效果

```css
@keyframes rotate-glow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 3. 页面结构

### 3.1 Dock 导航布局

```
┌─────────────────────────────────────┐
│ 顶部导航栏（Header）                │
│  [Logo]  [设计工作空间]  [🔔👤] │
├─────────────────────────────────────┤
│                                     │
│         主内容区域                │
│                                     │
│                                     │
├─────────────────────────────────────┤
│         底部 Dock 导航              │
│     [📊] [📚] [💼]           │
└─────────────────────────────────────┘
```

### 3.2 页面功能区

1. **仪表盘**
   - 欢迎信息
   - 统计卡片（4个）：设计空间、服务知识、历史设计、个人模板
   - 快速入口卡片
   - 最近更新卡片

2. **服务知识**
   - 顶部操作：+ 添加服务知识按钮
   - 知识卡片网格：服务名、版本、状态、更新时间

3. **设计空间**
   - 顶部操作：+ 创建设计空间按钮
   - 空间卡片网格：名称、描述、服务数、连接状态

## 4. 组件设计

### 4.1 Dock 导航容器

```css
.dock {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;              /* 相邻菜单间距 */
  padding: 12px 24px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4),
              0 8px 20px rgba(59, 130, 246, 0.15),
              inset 0 2px 4px rgba(255,255,255,0.03);
}
```

### 4.2 Dock 图标项

```css
.dock-item {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dock-item:hover {
  transform: translateY(-6px) scale(1.1);
  background: rgba(255,255,255,0.08);
}

.dock-item.active {
  transform: translateY(-10px) scale(1.15);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3));
}
```

### 4.3 子菜单指示器

- 有子菜单的图标右上角显示小蓝点
- 颜色：#3b82f6
- 大小：8px
- 边框：1.5px solid rgba(255,255,255,0.9)
- 光晕：0 0 8px rgba(59, 130, 246, 0.6)

### 4.4 子菜单设计

**方案 A（备选）：气泡弹出**
- 垂直列表形式
- 悬停显示
- 简单实用

**方案 B（主要）：扇形弹出**

```css
.dock-fan-item {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}
```

扇形位置计算（半径 100px，以父菜单底部为圆心）：
- -60°: translate(-86px, -50px)
- -30°: translate(-50px, -87px)
- 0°: translate(0px, -100px)
- 30°: translate(50px, -87px)
- 60°: translate(86px, -50px)

> **待优化**：位置计算在实际开发时需要精修

### 4.5 卡片设计

```css
.stat-card, .info-card {
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 20px;
  padding: 32px; /* 统计卡片用 80px 40px */
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before, .info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: conic-gradient(from 45deg, transparent, rgba(59, 130, 246, 0.08), transparent 90deg);
  opacity: 0.3;
  transition: opacity 0.5s ease;
  animation: rotate-glow 5s linear infinite;
}

.stat-card:hover, .info-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3);
}
```

### 4.6 按钮设计

**主按钮**（如添加服务知识）：
- 渐变背景：`linear-gradient(135deg, #10b981 0%, #059669 100%)`（绿色）
- 边框：圆角 20px
- 发光效果：0 4px 12px rgba(16, 185, 129, 0.4)
- 悬停：translateY(-4px) scale(1.05)

**图标按钮**（通知、用户）：
- 透明背景
- 边框：1px solid rgba(255,255,255,0.06)
- 圆角：8px
- 悬停：background: rgba(59, 130, 246, 0.1), border-color: rgba(59, 130, 246, 0.3), scale(1.1)

## 5. 字体系统

### 5.1 字体选择

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### 5.2 字号层级

| 用途 | 大小 | 字重 |
|------|------|------|
| 页面标题 | 56px | 300 |
| 区域标题 | 22px | 500 |
| 卡片标题 | 18px | 600-700 |
| 卡片描述 | 14px | 400-600 |
| 统计数字 | 56px | 200-700 |
| 次级信息 | 11-13px | 500-600 |

## 6. 交互设计

### 6.1 加载状态

- 页面加载：骨架屏或加载动画
- 按钮加载：旋转图标或进度指示

### 6.2 悬停效果

- Dock 图标：translateY(-6px) scale(1.1)
- 卡片：边框变蓝 + 旋转光效增强 + translateY(-12px) scale(1.02)
- 按钮：brightness 提升 + translateY(-4px) scale(1.05)
- 子菜单：scale(1.15) + 高亮背景

### 6.3 过渡动画

```css
/* 弹性动画 - Dock 图标 */
cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* 流畅过渡 - 卡片悬停 */
cubic-bezier(0.4, 0, 0.2, 1)

/* 悬停动画时长 */
hover: 0.3s ease

/* 展开/收起动画时长 */
expand: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* 旋转动画时长 */
rotate: 5s linear infinite
```

### 6.4 子菜单交互

- 触发方式：悬停在父菜单上
- 显示时长：自动，鼠标移开时隐藏
- 子菜单选择：点击子菜单项设为 active
- 父菜单交互：有子菜单的父菜单点击不切换 active

## 7. 间距规范

| 用途 | 值 |
|------|-----|
| Dock 图标间距 | 20px |
| Dock 内边距 | 12px 24px |
| 主内容区上边距 | 80px |
| 主内容区左右边距 | 40px |
| 卡片间距 | 28px |
| 卡片内边距 | 32px（统计卡片 80px 40px）|

## 8. 圆角规范

| 组件 | 值 |
|------|-----|
| Dock 容器 | 20px |
| Dock 图标 | 14px |
| 卡片 | 20px |
| 按钮 | 20px |
| 图标按钮 | 8px |

## 9. 响应式设计

### 9.1 桌面端（当前实现）

- Dock 导航：固定底部，3 个主菜单
- 主内容区：自适应宽度
- 卡片网格：4 列（统计）、3 列（内容）

### 9.2 待扩展

- 平板端：Dock 图标缩小，子菜单扇形角度压缩
- 移动端：Dock 可收起，侧边栏导航替代

## 10. 环境光效

### 10.1 环境光装饰

```css
.ambient-light {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.ambient-light-1 {
  top: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
}

.ambient-light-2 {
  top: -100px;
  right: -150px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 60%);
}

.ambient-light-3 {
  bottom: 10%;
  right: -200px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
}
```

## 11. 设计原型文件

### 11.1 主要原型

`frontend-preview/ui-preview-dock.html`
- Dock 导航 + 液态主题 + 扇形子菜单

### 11.2 备选原型

- `ui-preview-liquid.html` - 液滴导航
- `ui-preview-radial.html` - 放射导航
- `ui-preview-dot.html` - 点阵导航
- `ui-preview-minimal.html` - 极简主题

### 11.3 设计案例文档

`docs/design/frontend-ui-design-case.md`

## 12. 技术实现建议

### 12.1 主题配置（推荐使用 Tailwind CSS 或 CSS Variables）

```css
:root {
  --bg-gradient: linear-gradient(180deg, #0c4a6e 0%, #1a1a2e 100%);
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-light: #60a5fa;
  --text-primary: #ffffff;
  --text-secondary: #e2e8f0;
  --bg-glass: rgba(255,255,255,0.04);
  --border-glass: rgba(255,255,255,0.06);
  --shadow-dock: 0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(59, 130, 246, 0.15);
  --easing-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 12.2 子菜单位置计算

使用 JavaScript 动态计算，考虑：
- 父菜单的精确位置
- 不同屏幕尺寸适配
- 子菜单项防重叠

---

**设计原型**：`frontend-preview/ui-preview-dock.html`
**设计案例**：`docs/design/frontend-ui-design-case.md`
