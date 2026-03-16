# 系统架构文档

本文档描述了Octo服务知识管理系统的整体架构设计。

## 目录

- [概述](#概述)
- [前端架构](#前端架构)
- [后端架构](#后端架构)
- [数据流](#数据流)
- [窗口系统设计](#窗口系统设计)
- [国际化架构](#国际化架构)
- [API设计](#api设计)

## 概述

Octo是一个基于Web的服务知识管理平台，采用前后端分离架构：

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   前端 (React)  │◄──────►│  后端 (Spring) │
│                 │         │                 │
│   - React 18    │  REST   │   - Spring Boot │
│   - Ant Design  │   API   │   - JPA/Hibernate │
│   - i18next     │         │   - SQLite       │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
```

**注意：**数据库已从 PostgreSQL 迁移到 SQLite，更适合本地工具使用场景。详见 [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md)。

## 前端架构

### 技术栈

- **React 18.2.0** - UI框架
- **Ant Design 5.12.0** - UI组件库
- **Vite 5.4.21** - 构建工具
- **i18next + react-i18next** - 国际化
- **Axios** - HTTP客户端
- **React Context API** - 状态管理

### 目录结构

```
frontend/src/
├── api/                    # API接口定义
│   └── api.js            # 所有API调用
├── components/             # 可复用组件
│   ├── APIList.jsx        # API列表组件
│   ├── Dock.jsx          # 底部导航栏
│   ├── Dock.css
│   ├── KnowledgeAnalysis.jsx # 知识分析组件
│   ├── RepositoryManage.jsx # 仓库管理组件
│   ├── SystemConfig.jsx   # 系统配置组件
│   ├── WindowContainer.jsx # 窗口容器
│   ├── WindowContainer.css
│   ├── WindowManagerContext.jsx # 窗口管理Context
│   └── App.css
├── contexts/               # React Context
│   └── LanguageContext.tsx # 语言状态管理
├── i18n/                  # 国际化配置
│   ├── index.ts          # i18n初始化
│   ├── zh-CN.json       # 中文翻译
│   └── en-US.json       # 英文翻译
├── pages/                 # 页面组件
│   └── ServiceKnowledge.jsx # 服务知识页面
├── services/              # 业务逻辑服务
│   └── serviceRepositoryService.js
├── App.jsx                 # 主应用组件
├── main.jsx                # 应用入口
└── index.css              # 全局样式
```

### 组件层次结构

```
App (根组件)
├── I18nextProvider (国际化Provider)
│   └── LanguageProvider (语言状态Provider)
│       └── WindowManagerProvider (窗口状态Provider)
│           ├── Dock (底部导航栏)
│           └── WindowContainer (窗口容器)
│               └── Window (单个窗口)
│                   └── ServiceKnowledge (服务知识页面)
│                       ├── ServiceList (服务列表)
│                       ├── RepositoryManage (仓库管理)
│                       ├── KnowledgeAnalysis (知识分析)
│                       └── APIList (API列表)
```

### 状态管理

使用React Context API进行状态管理：

1. **WindowManagerContext**
   - 管理所有窗口的状态
   - 提供窗口操作方法

2. **LanguageContext**
   - 管理当前语言
   - 提供语言切换方法

## 后端架构

### 技术栈

- **Java 17**
- **Spring Boot**
- **Spring Data JPA**
- **Hibernate**
- **SQLite** - 本地工具数据库，零配置

### 分层架构

```
┌─────────────────────────────────────┐
│   Controller Layer (控制层)        │
│   ServiceKnowledgeController       │
│   - REST API端点                   │
│   - 请求验证                         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Service Layer (服务层)            │
│   ServiceKnowledgeService          │
│   - 业务逻辑                          │
│   - 事务管理                          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Repository Layer (数据访问层)      │
│   ServiceKnowledgeRepository       │
│   - 数据库操作                        │
│   - CRUD接口                        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Database (数据库)                  │
│   MySQL                            │
│   - 表存储                             │
│   - 索引优化                          │
└─────────────────────────────────────┘
```

### 实体模型

**ServiceKnowledge**
- id: Long (主键，IDENTITY 策略)
- serviceName: String (服务名称)
- version: String (版本)
- knowledge: TEXT (SQLite 使用 TEXT 存储 JSON 字符串，而非 JSONB)
- createdAt: LocalDateTime (创建时间)
- updatedAt: LocalDateTime (更新时间)

**SQLite 特定配置：**
- 使用 `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- JSON 字段使用 `@Lob` 和 `columnDefinition = "TEXT"`
- TEXT 类型最大可存储 1GB 数据

## 数据流

### 服务知识管理流程

```
用户操作
   │
   ├─→ 添加服务
   │    ├─→ 创建服务实体
   │    └─→ 保存到数据库
   │
   ├─→ 添加仓库
   │    ├─→ 创建仓库关联
   │    └─→ 更新服务
   │
   ├─→ 开始分析
   │    ├─→ 获取服务代码
   │    ├─→ 调用分析服务
   │    ├─→ 提取API信息
   │    └─→ 保存知识数据
   │
   └─→ 查看API
        └─→ 解析知识数据
             └─→ 显示API列表
```

### 窗口系统流程

```
用户点击Dock图标
   │
   ├─→ 窗口未打开？
   │    └─→ openWindow(windowId)
   │         ├─→ 更新isOpen状态
   │         └─→ 窗口打开
   │
   └─→ 窗口已打开？
        └─→ switchToWindow(windowId)
             ├─→ 更新activeWindowId
             ├─→ 如果最小化，恢复窗口
             └─→ 窗口激活
```

## 窗口系统设计

### 设计理念

采用Mac OS风格的窗口系统，提供类似桌面的用户体验：

- 独立窗口，可拖拽
- 支持最大化、最小化
- 窗口层级管理（z-index）
- 流畅的打开/关闭动画

### 状态管理

每个窗口维护以下状态：

```javascript
{
  id: 'services',              // 窗口ID
  title: '服务列表',             // 窗口标题
  icon: '📊',                   // 窗口图标
  component: ServiceKnowledge,     // 窗口内容组件
  isOpen: false,                // 是否打开
  isMaximized: false,            // 是否最大化
  isMinimized: false,            // 是否最小化
  position: { x: 100, y: 100 }, // 窗口位置
  zIndex: 50                    // z-index层级
}
```

### 交互行为

1. **打开窗口**
   - 从Dock点击图标
   - 设置isOpen=true
   - 激活窗口（设置activeWindowId）

2. **关闭窗口**
   - 点击窗口关闭按钮
   - 设置isOpen=false
   - 隐藏窗口

3. **最大化窗口**
   - 点击最大化按钮
   - 设置isMaximized=true
   - 窗口占据整个屏幕

4. **最小化窗口**
   - 点击最小化按钮
   - 设置isMinimized=true
   - 窗口隐藏到Dock

5. **拖拽窗口**
   - 鼠标拖拽标题栏
   - 更新position状态
   - 持续化新位置

6. **切换窗口**
   - 点击已打开的窗口
   - 设置activeWindowId
   - 提升z-index

## 国际化架构

### 技术实现

使用i18next和react-i18next实现国际化：

```
┌─────────────────────────────────────┐
│   i18next Instance                  │
│   - 资源加载                        │
│   - 语言检测                        │
│   - 语言切换                        │
└──────────────┬──────────────────────┘
               │
               │ .use(initReactI18next)
               ▼
┌─────────────────────────────────────┐
│   react-i18next                   │
│   - useTranslation Hook            │
│   - I18nextProvider              │
│   - Trans组件                        │
└─────────────────────────────────────┘
```

### 资源结构

```
src/i18n/
├── index.ts           # i18n配置和初始化
├── zh-CN.json        # 中文翻译资源
└── en-US.json        # 英文翻译资源
```

### 翻译键结构

使用分层结构组织翻译：

```
{
  "common": {
    "add": "添加",
    "save": "保存",
    "cancel": "取消"
  },
  "serviceList": {
    "title": "服务列表",
    "addService": "添加服务"
  },
  "repository": {
    "manageTitle": "管理代码仓库"
  }
}
```

### 语言切换流程

```
用户选择语言
   │
   ├─→ 调用changeLanguage(lng)
   │    ├─→ 保存到localStorage
   │    ├─→ 调用i18n.changeLanguage(lng)
   │    └─→ 刷新页面（window.location.reload()）
   │
   └─→ 页面重新加载
        └─→ i18n初始化
             ├─→ 从localStorage读取语言
             └─→ 加载对应语言资源
```

## API设计

### RESTful规范

所有API遵循RESTful设计原则：

| 方法 | 路径 | 描述 |
|-----|-------|------|
| GET | /api/service-knowledge | 获取所有服务 |
| GET | /api/service-knowledge/{id} | 获取单个服务 |
| POST | /api/service-knowledge | 创建服务 |
| PUT | /api/service-knowledge/{id} | 更新服务 |
| DELETE | /api/service-knowledge/{id} | 删除服务 |

### 请求/响应格式

**请求示例：**
```json
{
  "serviceName": "user-service",
  "version": "1.0.0"
}
```

**响应示例：**
```json
{
  "id": 1,
  "serviceName": "user-service",
  "version": "1.0.0",
  "knowledge": "{\"api_endpoints\": [...]}",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

### 错误处理

HTTP状态码：

- 200 OK - 请求成功
- 201 Created - 创建成功
- 400 Bad Request - 请求参数错误
- 404 Not Found - 资源不存在
- 500 Internal Server Error - 服务器错误

错误响应格式：
```json
{
  "message": "Service name is required",
  "code": "VALIDATION_ERROR"
}
```

## 安全考虑

### 前端安全

1. **XSS防护**
   - React自动转义JSX中的内容
   - 避免使用dangerouslySetInnerHTML

2. **CSRF防护**
   - 使用SameSite Cookie
   - 验证请求来源

### 后端安全

1. **输入验证**
   - 所有请求参数必须验证
   - 使用DTO进行数据绑定和验证

2. **SQL注入防护**
   - 使用JPA/Hibernate，参数化查询

3. **认证授权**
   - 实现用户认证
   - 基于角色的访问控制（RBAC）

## 性能优化

### 前端优化

1. **代码分割**
   - 使用React.lazy()动态加载组件
   - 路由级别分割

2. **缓存**
   - 使用浏览器缓存静态资源
   - 缓存API响应

3. **虚拟化**
   - 大列表使用虚拟滚动

### 后端优化

1. **数据库索引**
   - 为常用查询字段创建索引
   - 优化JOIN查询

2. **分页**
   - API返回分页数据
   - 避免大量数据传输

3. **缓存**
   - Redis缓存热点数据
   - 减少数据库查询

---

**最后更新：2024年3月**
