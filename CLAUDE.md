# 微服务知识管理系统

## 项目概述

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

- 设计文档已完成：`docs/superpowers/specs/2026-03-13-service-knowledge-manager-design.md`
- 技术栈已确定：Spring Boot + PostgreSQL, React + Ant Design
- 待完成：UI设计 → 实现计划

## UI设计任务

请使用 ui-ux-pro-max 技能为本系统设计UI界面，重点关注：
1. 整体布局和导航结构
2. 核心页面的界面设计
3. Ant Design组件的最佳实践
4. 企业级SaaS应用的视觉风格
5. 信息架构和交互流程

输出格式可以是：
- 界面描述和布局说明
- 关键页面的线框图
- 设计建议和原则
- 或者其他你认为合适的格式
