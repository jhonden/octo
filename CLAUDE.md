# Octo - 服务知识，触手可及

## 项目概述

产品名：Octo
Slogan：服务知识，触手可及

这是一个架构师的个人提效工具，辅助架构师快速高质量完成需求方案分析和设计。

核心功能：
- **服务知识分析**：自动分析Spring Boot微服务，提取职责、接口、依赖等知识
- **设计空间管理**：架构师的个人工作空间，支持历史设计管理、参考资料管理、模板沉淀
- **AI协作支持**：通过MCP协议与Claude Code集成，实现人机协作设计

## 技术栈

### 后端
- 框架：Spring Boot 3.x
- 语言：Java 17+
- 数据库：PostgreSQL
- ORM：Spring Data JPA / MyBatis-Plus
- MCP Server：基于Spring MVC实现

### 前端
- 框架：React 18+
- UI库：Ant Design 5.x
- 状态管理：React Context / Zustand
- 路由：React Router 6.x
- HTTP客户端：Axios
- 图表库：ECharts
- 流程图：Mermaid

## 核心功能模块

### 1. 服务知识管理
- 服务知识分析（自动提取）
- 市场空间（知识发布、审核、检索）
- 服务知识存储

### 2. 设计空间管理
- 创建设计空间
- 服务知识订阅
- Git集成（版本管理）
- 参考资料管理（仅Markdown）
- 个人模板管理

### 3. 技能管理
- 通用技能适配器（多平台支持）
- 技能安装和管理

### 4. MCP Server
- 工具暴露（服务知识、设计空间、Git操作）

## 设计要求

### UI风格
- **定位**：企业级管理后台
- **用户**：架构师/技术负责人
- **风格**：专业、简洁、高效
- **配色**：参考SaaS企业应用配色方案

### 核心页面
1. **首页/仪表盘**：设计空间概览、快速入口
2. **服务知识管理**：市场空间、知识检索
3. **设计空间列表**：查看、创建、打开设计空间
4. **设计空间详情**：
   - 服务知识订阅
   - 参考资料管理
   - 个人模板管理
   - 历史设计（Git）
   - 当前设计状态
5. **技能管理**：技能列表、安装管理

### 交互设计
- 表单操作：服务订阅、配置管理
- 列表展示：服务列表、设计历史
- 详情查看：服务知识详情、设计文档预览
- 状态反馈：分析进度、Git提交状态

### 响应式要求
- 桌面：支持主流分辨率（1920x1080+）
- 移动端：可选支持（优先桌面体验）

## 参考资源

### 设计空间目录结构
```
design-space-{id}/
├── .design-space/
│   ├── metadata.json
│   ├── services.json
│   ├── references.json
│   ├── templates.json
│   └── git-config.json
├── .knowledge/           # 服务知识
├── .references/          # 参考资料（md）
├── .templates/           # 设计模板
│   ├── prebuilt/
│   └── personal/
├── designs/              # 历史设计
├── current-design/       # 当前设计
└── README.md
```

### 设计空间命名规范
- 允许字符：中文、英文大小写字母、数字、下划线、中划线
- 最大长度：128字符
- 示例：`订单系统升级_v2`、`seckill_design_v1`

## 项目当前状态

- 设计文档已完成：
  - `docs/superpowers/specs/2026-03-13-service-knowledge-manager-design.md` - 原始设计文档
  - `docs/design/ui-design-spec-v2.md` - 更新后的 UI 设计规范 v2.0
  - `docs/design/frontend-ui-design-case.md` - UI 设计案例记录
- UI 原型已完成：`frontend-preview/ui-preview-dock.html` - Dock 导航设计原型
- 技术栈已确定：Spring Boot + PostgreSQL, React + Ant Design
- 待完成：实现计划 → 后端开发 → 前端开发

## UI设计完成

**设计风格**：Design Workspace（设计工作空间）
- 采用 Mac OS Dock 风格的底部导航
- 液态主题配色：深蓝色渐变 + 旋转光效 + 环境光效
- 创新交互：扇形子菜单弹出（如同 Octo 章鱼触须）
- 设计定位：为架构师创建专业、高效的"设计工作空间"

**主要设计特点**：
- Dock 导航位于底部，主菜单：仪表盘、服务知识、设计空间
- 子菜单支持：悬停弹出扇形分布的子菜单项
- 玻璃态设计：半透明背景 + backdrop-filter 模糊
- 流畅动画：弹性过渡 + 旋转光效 + 悬停反馈

**设计文档位置**：
- 设计规范 v2.0：`docs/design/ui-design-spec-v2.md`
- 设计案例记录：`docs/design/frontend-ui-design-case.md`
- 设计原型：`frontend-preview/ui-preview-dock.html`

**待实现时注意**：
- 子菜单扇形位置计算需要在实际开发时精修
- 响应式设计待补充（当前仅桌面端）
- 可访问性设计待补充（键盘导航、屏幕阅读器支持）

---

## 开发规范

本项目遵循一套完整的开发规范，确保代码质量和团队协作效率。

### 规范文档

- [开发规范文档目录](./docs/standards/README.md) - 所有规范文档索引
- [编码规范](./docs/standards/development-conventions.md) - 后端/前端编码、测试、安全规范
- [代码提交流程](./docs/standards/code-submission-workflow.md) - 代码验证、提交流程、Git 提交规范

### 规范使用场景

#### 新会话启动时
1. 阅读 [开发规范文档目录](./docs/standards/README.md)
2. 阅读 [编码规范](./docs/standards/development-conventions.md)
3. 阅读 [代码提交流程](./docs/standards/code-submission-workflow.md)

#### 编码时
- 后端开发：参考 [编码规范](./docs/standards/development-conventions.md) 的后端部分
- 前端开发：参考 [编码规范](./docs/standards/development-conventions.md) 的前端部分
- 测试开发：参考 [编码规范](./docs/standards/development-conventions.md) 的测试部分

#### 提交代码时
1. 验证代码：参考 [代码提交流程](./docs/standards/code-submission-workflow.md)
2. 确认后提交
3. 遵循 Git 提交规范

### 重要原则

**📋 路径检查**：在执行编译、启动等命令前，必须检查当前工作目录是否为项目根目录

**✅ 验证后提交**：修改代码后必须验证编译、启动和功能，才能提交

**📝 提交信息规范**：使用中文，格式为"类型：简短描述"（功能、修复、重构、文档等）

---

## 相关文档

- [设计文档](./docs/superpowers/specs/2026-03-13-service-knowledge-manager-design.md) - 完整系统设计
- [MVP 实现计划](./docs/superpowers/plans/2026-03-13-service-knowledge-manager-mvp.md) - 详细实现步骤
