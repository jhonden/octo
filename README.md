# Octo - Service Knowledge Manager

一个基于窗口系统的服务知识管理平台，提供服务管理、代码仓库管理、知识分析和API文档等功能。

## 技术栈

### 前端
- **React 18.2.0** - 用户界面框架
- **Ant Design 5.12.0** - UI组件库
- **Vite 5.4.21** - 构建工具
- **i18next + react-i18next** - 国际化支持
- **Axios** - HTTP客户端

### 后端
- **Java Spring Boot**
- **JPA/Hibernate**
- **REST API**

## 功能特性

- 🪟 **窗口系统** - Mac风格的窗口管理，支持拖拽、最大化、最小化
- 🌐 **多语言支持** - 支持简体中文和英文
- 📚 **服务知识管理** - 管理服务和代码仓库
- 🔍 **知识分析** - 自动分析代码并提取API文档
- 📝 **API文档** - 自动生成和维护API端点文档
- ⚙️ **系统配置** - 语言设置和系统管理

## 安装和运行

### 前置要求
- Node.js 18+
- npm 或 yarn
- Java 17+ (用于后端)

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务
cd ../backend
./mvnw spring-boot:run
```

### 生产构建

```bash
# 构建前端
npm run build

# 构建产物位于 dist/ 目录
```

## 项目结构

```
service-knowledge-manager/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── api/            # API接口定义
│   │   ├── components/      # React组件
│   │   ├── contexts/       # React Context
│   │   ├── i18n/           # 国际化配置
│   │   ├── pages/          # 页面组件
│   │   └── services/       # 业务逻辑服务
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                  # 后端应用
│   └── src/
│       └── main/java/com/skm/
│           ├── controller/
│           ├── dto/
│           ├── entity/
│           ├── repository/
│           └── service/
└── docs/                     # 项目文档
```

## 开发规范

### 国际化 (i18n) 要求 - 必须遵守

**所有面向用户的文本必须使用国际化翻译键，禁止硬编码！**

1. **使用useTranslation Hook**
   ```jsx
   import { useTranslation } from 'react-i18next';

   function MyComponent() {
     const { t } = useTranslation();
     return <button>{t('common.save')}</button>;
   }
   ```

2. **添加新翻译**
   - 在 `src/i18n/zh-CN.json` 和 `src/i18n/en-US.json` 中添加对应的翻译
   - 遵循命名规范：`category.subcategory.item`
   - 确保两个语言文件保持同步

3. **禁止硬编码文本**
   ```jsx
   // ❌ 错误
   <button>保存</button>

   // ✅ 正确
   <button>{t('common.save')}</button>
   ```

### 代码风格

- 使用函数式组件和Hooks
- 组件文件使用.jsx扩展名
- TypeScript文件使用.ts/.tsx扩展名
- 遵循ESLint规则
- 有意义的变量和函数命名

### Git提交规范

使用Conventional Commits格式：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

示例：
```bash
git commit -m "feat: add service management feature"
git commit -m "fix: resolve i18n initialization issue"
```

### API集成

所有API调用通过 `src/api/api.js` 统一管理。

```javascript
import { serviceKnowledgeAPI } from '../api/api';

// 获取所有服务
const services = await serviceKnowledgeAPI.getAll();

// 创建服务
const newService = await serviceKnowledgeAPI.create(data);
```

## 常见问题

### 如何添加新的翻译？

1. 在 `src/i18n/zh-CN.json` 和 `src/i18n/en-US.json` 中添加对应的键值对
2. 在组件中使用 `t('your.key')` 访问翻译

### 如何切换语言？

点击底部导航栏的设置图标（⚙️），在弹出的系统配置中选择语言。

### 窗口系统如何工作？

窗口系统基于React Context实现：
- `WindowManagerContext` - 管理所有窗口状态
- `WindowContainer` - 使用Portal渲染窗口
- `Dock` - 底部导航栏，用于打开和切换窗口

## 许可证

MIT License

## 贡献

欢迎贡献代码、报告问题或提出建议！
