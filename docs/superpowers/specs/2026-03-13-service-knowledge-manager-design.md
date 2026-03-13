# Octo - 设计文档

> **产品名：Octo**
> **Slogan：服务知识，触手可及**
> 设计日期：2026-03-13
> 版本：1.0.0
> 状态：草案

---

## 1. 系统概述

### 1.1 核心目标

辅助架构师快速高质量完成需求方案分析和设计，通过自动化服务知识提取和管理，为方案设计提供可靠的知识基础。

### 1.2 系统定位

- **服务知识管理**：自动分析微服务，提取职责、接口、依赖等知识
- **设计空间管理**：架构师的个人工作空间，支持历史设计管理、参考资料管理、模板沉淀
- **AI协作支持**：通过MCP协议与Claude Code等AI工具集成，实现人机协作设计

### 1.3 目标用户

主要用户：架构师/技术负责人

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Web系统                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 服务知识管理  │  │ 设计空间管理  │  │ MCP Server   │  │
│  │              │  │              │  │              │  │
│  │ - 分析       │  │ - 创建空间   │  │ - 工具暴露  │  │
│  │ - 存储       │  │ - 订阅服务   │  │ - 知识检索  │  │
│  │ - 检索       │  │ - Git管理   │  │ - 设计查询  │  │
│  │ - 审核       │  │ - 模板管理   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 市场空间     │  │ 技能管理     │  │ 任务管理     │  │
│  │              │  │              │  │              │  │
│  │ - 知识发布   │  │ - 适配器     │  │ - 任务清单   │  │
│  │ - 版本管理   │  │ - 模板引擎   │  │ - 配置管理   │  │
│  │ - 全文检索   │  │ - 智能转换   │  │ - 同步机制   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    MCP协议/文件系统
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    用户环境                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Claude Code  │  │ 约定目录     │  │ Git仓库      │  │
│  │ + Skills     │  │              │  │              │  │
│  │              │  │ - 服务代码   │  │ - 设计历史   │  │
│  │ - 分析服务   │  │ - 知识文档   │  │ - 版本管理   │  │
│  │ - 方案设计   │  │ - 设计空间   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心功能模块

| 模块 | 功能 | 说明 |
|------|------|------|
| 服务知识分析 | 自动提取服务知识 | 从代码仓库分析Spring Boot服务 |
| 市场空间 | 服务知识管理 | 知识发布、审核、检索 |
| 设计空间管理 | 个人工作空间 | 创建、订阅、Git管理 |
| 技能管理 | 通用适配器 | 多平台Skill安装、转换 |
| MCP Server | 知识服务 | 暴露工具给AI工具调用 |

---

## 3. 服务知识分析功能

### 3.1 工作流程

```
1. Web系统下载代码
   ↓
2. 生成task-list.json
   ↓
3. 用户在Claude Code启动分析
   ↓
4. Skill展示分析计划 → 用户确认
   ↓
5. Skill逐个分析服务，实时反馈
   ↓
6. 生成service-knowledge.json + .md
   ↓
7. Web系统同步到市场空间
```

### 3.2 约定目录结构

```
约定目录/
├── services/              # 服务代码目录
│   ├── user-service/
│   └── order-service/
├── service-knowledge/
│   ├── config/
│   │   ├── defaults.json     # 默认配置
│   │   └── user.json        # 用户配置
│   ├── task-list.json       # 任务清单
│   └── analysis-cache/      # 分析缓存
└── analysis-guide.md        # 操作指南
```

### 3.3 分析策略

**首次分析**：
- 深度分析，全量扫描
- 扫描：*.java、*.yaml、*.json、*.md
- 生成：service-knowledge.json + .md

**增量分析**：
- 基于git diff检测变更文件
- 优先使用git diff，失败则回退到文件扫描
- 只分析变更相关的文件

### 3.4 配置文件

**defaults.json**：
```json
{
  "analysis": {
    "type": "full",
    "timeout": 300000,
    "filePatterns": {
      "include": ["**/*.java", "**/*.yaml", "**/*.json"],
      "exclude": ["**/tests/**", "**/node_modules/**"]
    }
  },
  "performance": {
    "cacheEnabled": true,
    "parallelProcessing": true
  }
}
```

**task-list.json**：
```json
{
  "version": "1.0",
  "services": [
    {
      "name": "user-service",
      "path": "services/user-service",
      "framework": "Spring Boot 2.7.x"
    }
  ],
  "analysisConfig": {
    "mode": "incremental",
    "trigger": "git_diff"
  }
}
```

### 3.5 输出格式

**service-knowledge.json**（结构化）：
```json
{
  "metadata": {
    "serviceName": "user-service",
    "version": "1.0.0",
    "analysisTime": "2026-03-13T10:00:00Z"
  },
  "serviceInfo": {
    "name": "user-service",
    "description": "用户管理服务",
    "port": 8080
  },
  "functionalResponsibilities": [...],
  "apiEndpoints": [...],
  "dependencies": {
    "internal": [...],
    "external": [...]
  },
  "database": {...},
  "serviceGraph": {
    "mermaid": "graph TD..."
  }
}
```

**service-knowledge.md**（可读）：
```markdown
# user-service 知识文档

## 服务概览
...

## API接口
...

## 依赖关系

## 数据库

## 服务依赖图
```mermaid
graph TD
...
```
```

---

## 4. 设计空间管理功能

### 4.1 设计空间定位

架构师的**个人工作空间**，本地使用，不支持多人协作。

### 4.2 文件夹结构

```
design-space-{id}/
├── .design-space/
│   ├── metadata.json       # 设计空间元数据
│   ├── services.json       # 订阅的服务知识索引
│   ├── references.json     # 外部参考资料索引
│   ├── templates.json     # 个人设计模板索引
│   └── git-config.json    # Git仓库配置
├── .knowledge/           # 服务知识（自动同步）
│   └── {service-name}/
├── .references/          # 外部参考资料（仅md）
│   └── *.md
├── .templates/           # 设计模板
│   ├── prebuilt/         # 系统预置
│   └── personal/        # 个人沉淀
├── designs/              # 历史设计（Git管理）
│   └── {design-name}/
├── current-design/        # 当前设计
│   ├── context.md
│   ├── analysis.md
│   ├── architecture.md
│   ├── diagrams/
│   └── output/
├── .git/                # Git仓库
└── README.md
```

### 4.3 命名规范

- 允许字符：中文、英文大小写字母、数字、下划线、中划线
- 最大长度：128字符
- 示例：`订单系统升级_v2`、`seckill_design_v1`

### 4.4 设计空间创建流程

1. 用户填写设计空间信息
2. 可选：配置Git仓库（内部CodeHub）
3. 系统生成文件夹结构
4. 提供指导说明（README.md）
5. 用户自行添加参考资料

### 4.5 服务知识订阅

- 用户从市场空间订阅服务知识
- Web系统自动同步到 `.knowledge/` 目录
- 市场空间更新后，设计空间自动同步

### 4.6 Git集成

**git-config.json**：
```json
{
  "git": {
    "enabled": true,
    "repository": "https://codehub.company.com/...",
    "branch": "main",
    "autoBackup": {
      "enabled": true,
      "interval": 3600
    }
  }
}
```

**提交流程**：
- 设计完成后，Skill提示归档
- 用户选择：提交为新版本 / 更新现有版本
- Skill自动执行git操作

### 4.7 参考资料管理

- **格式**：仅支持Markdown文档
- **位置**：`.references/` 目录
- **管理**：用户自行添加/删除

### 4.8 模板管理

**模板来源**：
1. **系统预置**：`.templates/prebuilt/`
   - 微服务标准设计模板
   - 事件驱动架构模板
   - 数据库分库分表模板

2. **个人沉淀**：`.templates/personal/`
   - Skill辅助从历史设计提炼模板
   - 符合个人设计习惯

**模板使用**：
- 可选使用模板
- 模板作为章节参考，不支持参数化

---

## 5. MCP Server设计

### 5.1 服务知识相关工具

| 工具名 | 说明 | 参数 |
|--------|------|------|
| `get_service_knowledge` | 获取服务知识 | serviceName |
| `list_services` | 列出所有服务 | - |
| `search_services` | 搜索服务 | query, field |

### 5.2 设计空间相关工具

| 工具名 | 说明 | 参数 |
|--------|------|------|
| `get_design_space_info` | 获取设计空间信息 | designSpaceId |
| `list_design_spaces` | 列出所有设计空间 | - |
| `get_service_knowledge` | 获取服务知识 | serviceName |
| `get_references` | 获取参考资料 | designSpaceId, category |
| `get_personal_templates` | 获取个人模板 | designSpaceId |
| `get_design_history` | 获取设计历史 | designSpaceId |

### 5.3 Git相关工具

| 工具名 | 说明 | 参数 |
|--------|------|------|
| `git_status` | 查看Git状态 | designSpaceId |
| `git_log` | 查看提交历史 | designSpaceId, limit |
| `git_commit` | 提交更改 | designSpaceId, message, paths |
| `git_checkout` | 切换版本 | designSpaceId, commitOrBranch |

---

## 6. 技能（Skill）设计

### 6.1 技能清单

| 技能名 | 功能 |
|--------|------|
| `analyze-services` | 分析微服务，生成知识文档 |
| `design-solution` | 辅助方案设计 |
| `extract-template` | 从设计文档提炼模板 |

### 6.2 技能统一管理

**安装方式**：
- Web系统统一管理
- 支持安装到Claude Code等平台
- 通过通用适配器实现多平台支持

**技术实现**：
```
universal-skill-adapter/
├── core/
│   ├── SkillAdapter.ts
│   ├── PlatformRegistry.ts
│   └── TemplateEngine.ts
├── platforms/
│   ├── claude/
│   └── chatgpt/
└── templates/
```

---

## 7. 完整工作流示例

### 场景：设计一个秒杀功能

```
1. 架构师准备环境
   └─> Web系统下载服务代码

2. 服务知识分析
   └─> 生成task-list.json
   └─> 用户在Claude Code：请开始帮我分析生成各个服务的知识文档
   └─> Skill展示服务列表 → 用户确认
   └─> Skill逐个分析，实时反馈
   └─> 生成service-knowledge.json + .md
   └─> Web系统同步到市场空间

3. 创建设计空间
   └─> 填写名称：秒杀功能设计_v1
   └─> 配置Git仓库
   └─> 系统生成文件夹结构
   └─> 订阅服务：user-service, order-service, payment-service

4. 添加参考资料
   └─> 技术栈规范.md
   └─> 秒杀最佳实践.md

5. 开始方案设计
   └─> 用户进入目录，打开Claude Code
   └─> 输入：我要开始设计秒杀功能
   └─> Skill展示可用模板 → 用户选择个人模板
   └─> Skill加载服务知识和参考资料
   └─> 需求分析讨论
   └─> 方案设计讨论
   └─> 生成设计文档

6. 归档设计
   └─> Skill提示：是否归档到Git？
   └─> 用户选择：提交为新版本
   └─> Skill自动git add/commit/push

7. 提炼模板
   └─> 用户：把这个设计方案提炼为一个模板
   └─> Skill分析文档
   └─> 生成个人模板：秒杀设计模式
```

---

## 8. UI设计

### 8.1 设计理念

**视觉风格**：Refined Industrial（精致工业风）

- 受现代开发者工具启发（VS Code、JetBrains IDE）
- 深色主题为主，强调专业性和专注度
- 精致的细节处理，避免粗犷感
- 注重信息密度与可读性的平衡

**设计原则**：
- 功能优先，形式服务于内容
- 减少视觉干扰，突出关键信息
- 保持一致的视觉语言
- 适度的交互反馈

### 8.2 色彩系统

**主色调**：

| 颜色 | 用途 | CSS值 | 说明 |
|------|------|-------|------|
| 背景 | 深色背景 | #0d1117 | 深黑色，类似GitHub暗色主题 |
| 卡片 | 内容容器 | #161b22 | 比背景略亮 |
| 主色 | 主要按钮、强调 | #3b82f6 | 电蓝色，VS Code风格的蓝色 |
| 文本 | 主要文本 | #e2e8f0 | 浅灰白色，高对比度 |
| 次级文本 | 辅助信息 | #94a3b8 | 中灰色 |
| 禁用文本 | 弱化信息 | #64748b | 深灰色 |
| 边框 | 分隔线 | #334155 | 中灰色 |

**功能色**：

| 颜色 | 用途 | 说明 |
|------|------|------|
| 绿色 | 已发布、成功状态 | 表示完成、正常 |
| 黄色 | 草稿、进行中 | 表示未完成状态 |
| 红色 | 错误、警告 | 表示异常 |

**渐变效果**：

- 主按钮：`linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`
- 主按钮发光：`box-shadow: 0 0 20px rgba(59, 130, 246, 0.3)`

### 8.3 页面结构

**三页式布局**：

1. **仪表盘**
   - 欢迎信息
   - 统计卡片（4个）：设计空间、服务知识、历史设计、个人模板
   - 快速入口

2. **服务知识**
   - 顶部操作：+ 添加服务知识按钮
   - 知识卡片网格：服务名、版本、状态、更新时间

3. **设计空间**
   - 顶部操作：+ 创建设计空间按钮
   - 空间卡片网格：名称、描述、服务数、连接状态

### 8.4 组件设计

**布局框架**：

```
┌──────────┬──────────────────────────────────┐
│          │  顶部导航栏                        │
│ 侧边栏   │  ├─ 标题：Octo                    │
│  256px   │  └─ 右侧：通知、用户图标             │
│          ├──────────────────────────────────┤
│ Octo     │                                    │
│          │  主内容区 (padding: 32px)           │
│  菜单：   │                                    │
│          │                                    │
│ • 仪表盘  │  动态内容                          │
│ • 服务知识 │                                    │
│ • 设计空间 │                                    │
│          │                                    │
└──────────┴──────────────────────────────────┘
```

**侧边栏菜单**：
- 选中状态：左侧3px蓝色边框 + 深色背景
- 悬停状态：背景变亮
- 图标尺寸：20px
- 高度：48px
- 圆角：8px

**卡片设计**：
- 背景：#161b22
- 边框：1px solid #334155
- 悬停效果：边框变蓝（#3b82f6）+ 蓝色光晕
- 过渡动画：0.3s ease

**按钮设计**：

主按钮：
- 渐变背景：蓝色渐变
- 发光效果：蓝色光晕
- 悬停：亮度提升

次级按钮：
- 透明背景
- 边框：1px solid #334155
- 悬停：背景变亮

图标按钮（通知、用户）：
- 透明背景
- 边框：1px solid #334155

### 8.5 字体系统

**字体选择**：
- 优先级：系统字体栈
  ```
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif
  ```

**字号层级**：
- 标题（H1）：20px / bold
- 卡片标题（H3）：默认 / 中等
- 数字统计：36px
- 正文：默认
- 次级文本：略小（94a3b8颜色）

### 8.6 交互设计

**加载状态**：
- 页面加载："Loading..." 文字
- 按钮加载：Spin组件

**悬停效果**：
- 菜单项：背景色变化 + 图标颜色变化
- 卡片：边框颜色变化 + 发光效果
- 按钮：背景亮度变化

**过渡动画**：
- 卡片悬停：`transition: all 0.3s ease`
- 页面切换：淡入效果

### 8.7 响应式设计

当前设计针对桌面端（1920px宽度）：
- 侧边栏固定宽度256px
- 内容区域自适应
- 卡片网格：3列（每列span=8）

未来可扩展：
- 平板端：侧边栏可收起
- 移动端：底部导航 + 单列布局

### 8.8 可访问性

**颜色对比度**：
- 主要文本（#e2e8f0 on #0d1117）：高对比度
- 次级文本（#94a3b8 on #161b22）：可读

**交互反馈**：
- 所有可交互元素有悬停状态
- 选中状态明显标识
- 加载状态可见

**键盘导航**：
- Ant Design组件自带键盘支持
- 焦点可见

### 8.9 技术实现

**主题配置**（Ant Design ConfigProvider）：

```javascript
const darkTheme = {
  algorithm: 'dark',
  token: {
    colorPrimary: '#3b82f6',
    colorBgBase: '#0d1117',
    colorBgContainer: '#161b22',
    colorBorder: '#334155',
    colorText: '#e2e8f0',
  },
};
```

**样式覆盖**：
- 使用内联style和CSS变量
- Ant Design组件通过theme配置覆盖
- 自定义样式通过全局CSS实现

---

## 8. DDD 架构设计

### 8.1 架构原则

本项目采用**轻量级领域驱动设计（DDD）**，核心原则：

1. **清晰的限界上下文**：按业务领域划分代码边界
2. **高内聚低耦合**：每个上下文内部紧密协作，外部通过明确接口通信
3. **关注业务逻辑**：Service 层封装领域逻辑，Repository 层专注数据访问
4. **适度设计**：避免过度设计，保持简洁实用

### 8.2 限界上下文划分

```
Octo
├── Service Knowledge Context（服务知识上下文）
│   ├── 核心领域：服务知识的市场管理
│   ├── 能力：服务知识的 CRUD、发布、检索
│   ├── 技术栈：Spring Data JPA
│   └── 暴露方式：MCP 工具、REST API
│
├── Design Space Context（设计空间上下文）
│   ├── 核心领域：架构师个人工作空间管理
│   ├── 能力：创建空间、服务订阅、文件系统操作、Git集成
│   ├── 技术栈：Spring Data JPA + 文件系统 API
│   └── 暴露方式：MCP 工具、REST API
│
├── Skill Management Context（技能管理上下文）
│   ├── 核心领域：技能的安装、管理、适配
│   ├── 能力：技能安装、配置、多平台适配
│   ├── 技术栈：Spring Data JPA
│   └── 暴露方式：管理界面、CLI 工具
│
└── MCP Integration Context（MCP 集成上下文）
    ├── 核心领域：工具注册和调用分发
    ├── 能力：工具定义、JSON-RPC 通信
    ├── 技术栈：Spring MVC JSON-RPC 实现
    └── 暴露方式：MCP 端点
```

### 8.3 分层架构

每个限界上下文遵循以下分层：

```
{context-name}/
├── domain/                  # 领域层
│   ├── entity/             # 实体（包含基本验证）
│   ├── repository/         # 仓储接口（领域层）
│   └── service/            # 领域服务（复杂领域逻辑）
├── application/             # 应用层
│   ├── service/           # 应用服务（用例编排）
│   ├── controller/        # REST 控制器
│   └── dto/             # 数据传输对象
├── infrastructure/         # 基础设施层
│   ├── persistence/       # JPA Repository 实现
│   ├── mcp/             # MCP 工具适配器
│   └── file-system/       # 文件系统操作（仅需要时）
└── model/                 # JPA 实体（持久化用）
```

### 8.4 层级职责

| 层级 | 职责 | 说明 |
|------|------|------|
| **Controller** | 处理 HTTP 请求、参数验证、返回响应 | 接收请求，调用应用服务，返回响应 |
| **Application Service** | 用例编排、DTO 转换 | 编排业务流程，转换领域模型和 DTO |
| **Domain Service** | 复杂领域逻辑 | 封装跨实体的业务逻辑 |
| **Repository Interface** | 数据访问抽象 | 定义数据访问契约（领域层） |
| **Repository Impl** | 数据访问实现 | 实现 JPA 持久化（基础设施层） |
| **Entity** | 领域实体 | 包含业务规则和数据验证 |
| **DTO** | 数据传输对象 | 对外接口的数据结构 |

### 8.5 跨上下文交互

**上下文之间通过明确的接口通信：**

1. **Service Knowledge ↔ Design Space**：设计空间订阅服务知识（通过 ID 引用）
2. **Service Knowledge ↔ MCP**：MCP 工具暴露服务知识查询
3. **Design Space ↔ MCP**：MCP 工具暴露设计空间操作
4. **Skill Management ↔ 其他上下文**：技能安装和配置（松耦合）

**通信方式：**
- **同步**：直接调用其他上下文的应用服务
- **异步**：通过事件总线（未来扩展）

---

## 9. 技术栈

### 8.1 后端技术栈

- **框架**：Spring Boot 3.x
- **语言**：Java 17+
- **数据库**：PostgreSQL
- **ORM**：Spring Data JPA
- **MCP Server**：基于Spring MVC实现
- **前端通信**：RESTful API

- **框架**：Spring Boot 3.x
- **语言**：Java 17+
- **数据库**：PostgreSQL
- **ORM**：Spring Data JPA
- **MCP Server**：基于Spring MVC实现
- **前端通信**：RESTful API

### 8.2 前端技术栈

- **框架**：React 18+
- **UI库**：Ant Design 5.x
- **状态管理**：React Context / Zustand
- **路由**：React Router 6.x
- **HTTP客户端**：Axios
- **图表库**：ECharts
- **流程图**：Mermaid

### 8.3 技能系统技术栈

- **核心语言**：TypeScript
- **模板引擎**：Handlebars
- **适配器**：Claude Code SDK
- **CLI工具**：Commander.js

---

## 9. 数据库设计

### 9.1 核心表结构

**服务知识表（service_knowledge）**：
```sql
CREATE TABLE service_knowledge (
  id BIGSERIAL PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  version VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',
  knowledge JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(service_name, version)
);
```

**设计空间表（design_space）**：
```sql
CREATE TABLE design_space (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  workspace_path VARCHAR(512) NOT NULL,
  git_config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**服务订阅表（service_subscription）**：
```sql
CREATE TABLE service_subscription (
  id BIGSERIAL PRIMARY KEY,
  design_space_id BIGINT REFERENCES design_space(id),
  service_id BIGINT REFERENCES service_knowledge(id),
  subscribed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. 部署方案

### 10.1 部署架构

```
┌─────────────────────────────────────┐
│         用户本地环境                │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  │
│  │ Web前端   │  │ Claude    │  │
│  │          │  │ Code     │  │
│  └──────────┘  └──────────┘  │
│       ↓              ↓          │
│  ┌─────────────────────┐      │
│  │  Spring Boot      │      │
│  │  + PostgreSQL     │      │
│  └─────────────────────┘      │
└─────────────────────────────────────┘
```

### 10.2 部署方式

- Web后端：Spring Boot JAR包，本地运行
- 前端：React打包，由后端提供静态资源
- 数据库：PostgreSQL Docker容器或本地安装
- Git仓库：用户自行配置

---

## 11. 开发计划

### 阶段1：核心功能（MVP）
- [ ] 服务知识分析Skill
- [ ] 市场空间基础功能
- [ ] 设计空间基础功能
- [ ] MCP Server基础工具

### 阶段2：技能管理
- [ ] 通用技能适配器
- [ ] 方案设计Skill
- [ ] 模板提炼Skill
- [ ] 技能统一管理界面

### 阶段3：Git集成
- [ ] Git仓库配置
- [ ] 设计版本管理
- [ ] Git历史查看
- [ ] 自动备份

### 阶段4：完善功能
- [ ] 个人模板管理
- [ ] 参考资料管理
- [ ] 增量分析优化
- [ ] UI优化

---

## 12. 附录

### 12.1 术语表

| 术语 | 说明 |
|------|------|
| MCP | Model Context Protocol，模型上下文协议 |
| Skill | Claude Code的技能，可复用的知识和工作流 |
| 设计空间 | 架构师的个人工作空间 |
| 市场空间 | 服务知识的公共存储库 |
| 服务知识 | 微服务的职责、接口、依赖等信息 |

### 12.2 参考资料

- [Claude Code文档](https://code.claude.com/docs/en/overview)
- [MCP协议规范](https://www.anthropic.com/news/model-context-protocol)
- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
