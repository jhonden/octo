# 编码规范

本文档定义了 Octo 项目开发过程中的编码规范。

---

## 1. 文档和注释语言规范

**重要：因为项目在中国开发，以下情况必须优先使用中文：**

### 1.1 代码注释

- 业务逻辑注释必须使用中文
- 复杂算法或配置说明必须使用中文
- 示例：
  ```java
  // 检查服务知识是否已存在，确保唯一性约束
  if (repository.existsByServiceName(serviceName)) {
    throw new BusinessException("服务知识已存在");
  }
  ```

### 1.2 文档输出

- 代码文档（Javadoc、README）优先使用中文
- 架构设计文档、API 文档使用中文
- 用户手册、开发指南使用中文

### 1.3 日志输出

- 应用日志信息使用英文
- 错误提示信息使用英文
- 示例：`log.error("Service knowledge not found: {}", serviceName);`

### 1.4 用户界面文本

- 前端页面文本使用中文
- 错误提示、警告信息使用中文
- API 返回的错误消息使用中文

### 1.5 例外情况

- 技术术语保持英文（如 JSON、API、Exception、MCP 等）
- 变量名、类名、方法名等标识符使用英文
- 配置文件中的 key 使用英文
- **代码的运行日志输出使用英文**（便于日志分析和问题排查）

---

## 2. 后端开发规范

### 2.1 编码规范

- 遵循 Java 17 语言规范
- 使用驼峰命名法（camelCase）命名变量和方法
- 使用大驼峰命名法（PascalCase）命名类和接口
- 常量使用全大写下划线分隔（UPPER_SNAKE_CASE）

### 2.2 异常处理

- 使用 RuntimeException 作为基础异常
- 异常消息使用中文（用于 API 响应）
- 不要捕获异常后直接忽略，至少记录日志

### 2.3 日志规范

- 使用 SLF4J 日志框架
- 日志级别使用：
  - `ERROR`: 错误信息
  - `WARN`: 警告信息
  - `INFO`: 关键业务流程
  - `DEBUG`: 调试信息（仅开发环境）
- 日志格式：使用英文描述，占位符输出关键参数

### 2.4 事务管理

- 修改数据的方法必须添加 `@Transactional` 注解
- 查询方法使用 `@Transactional(readOnly = true)`

### 2.5 REST API 规范

- 所有 API 路径以 `/api` 开头
- 使用标准 HTTP 方法：GET、POST、PUT、DELETE
- 返回统一格式的响应（成功/失败）
- 添加 `@CrossOrigin` 注解允许跨域

---

## 3. 前端开发规范

### 3.1 React 规范

- 使用函数组件（Function Components）
- 避免类组件（Class Components）
- 使用 Hooks 管理状态

### 3.2 组件规范

- 组件文件使用 PascalCase 命名（如 `Dashboard.jsx`、`ServiceKnowledgePage.jsx`）
- 组件放在 `src/pages/` 或 `src/components/` 目录
- 导出使用默认导出（`export default`）

### 3.3 样式规范

- 使用 Ant Design 组件库
- 遵循"精致工业风"暗色主题
- 避免行内样式（特殊情况除外）
- 使用 ConfigProvider 统一配置主题

### 3.4 API 调用

- 使用 Axios 进行 HTTP 请求
- API 调用集中在 `src/api/api.js`
- 使用 async/await 处理异步操作

---

## 4. 测试规范

### 4.1 单元测试

- 核心业务逻辑必须有单元测试
- 测试覆盖率不低于 70%
- 测试类命名：`{类名}Test`

### 4.2 集成测试

- API 接口必须有集成测试
- 使用 Spring Boot Test 框架
- 测试类位于 `src/test/java/` 目录

---

## 5. 安全规范

### 5.1 输入验证

- 所有用户输入必须进行验证
- 使用 Spring Validation 注解（`@NotNull`、`@Size`、`@Pattern` 等）
- 在 Controller 层进行验证

### 5.2 SQL 注入防护

- 使用 JPA Repository，避免原生 SQL
- 必须使用原生 SQL 时，使用参数化查询

### 5.3 XSS 防护

- 前端对用户输入进行转义
- 避免直接渲染 HTML 内容
- React 默认提供 XSS 防护

---

## 6. Git 工作流规范

- 每个功能开发一个分支
- 功能完成后合并到 main 分支
- 合并前确保功能验证通过
- 详细流程见：[代码提交流程](./code-submission-workflow.md)

---

**相关文档**:
- [代码提交流程](./code-submission-workflow.md) - 代码验证和提交
- [MVP 实现计划](../superpowers/plans/2026-03-13-service-knowledge-manager-mvp.md) - 实现参考

---

**文档维护者**: Claude AI Assistant
**最后更新**: 2026-03-14
