# 开发规范

本文档定义了项目开发过程中必须遵守的规范和标准。

## 目录

- [代码风格](#代码风格)
- [国际化要求 (MUST)](#国际化要求-must)
- [组件开发规范](#组件开发规范)
- [API集成规范](#api集成规范)
- [Git提交规范](#git提交规范)

## 代码风格

### JavaScript/JSX

- 使用函数式组件和Hooks
- 组件文件使用.jsx扩展名
- 使用camelCase命名变量和函数
- 使用PascalCase命名组件

```jsx
// ✅ 正确
import React from 'react';

const MyComponent = ({ title, onSave }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onSave}>Save</button>
    </div>
  );
};

// ❌ 错误
class MyComponent extends React.Component {
  // ...
}
```

### TypeScript

- TypeScript文件使用.ts/.tsx扩展名
- 为props定义接口或类型
- 避免使用any类型

```typescript
// ✅ 正确
interface MyComponentProps {
  title: string;
  onSave: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onSave }) => {
  // ...
};

// ❌ 错误
const MyComponent = ({ title, onSave }: any) => {
  // ...
};
```

### CSS

- 使用CSS Modules或独立的.css文件
- 避免内联样式（特殊情况除外）
- 使用有意义的类名

```css
/* ✅ 正确 */
.my-component {
  padding: 16px;
  background: #ffffff;
}

.my-component__title {
  font-size: 20px;
  font-weight: bold;
}

/* ❌ 错误 - 避免内联样式 */
```

## 国际化要求 (MUST)

**所有面向用户的文本必须使用国际化翻译键，禁止硬编码！**

### 基本规则

1. **在组件中使用useTranslation Hook**
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
   <p>Loading...</p>

   // ✅ 正确
   <button>{t('common.save')}</button>
   <p>{t('common.loading')}</p>
   ```

### 翻译键命名规范

使用分层结构，使用点号分隔：

```
category.subcategory.item
```

示例：
- `common.save` - 通用操作
- `serviceList.title` - 服务列表标题
- `serviceForm.serviceNameLabel` - 服务表单的服务名称标签
- `repository.updateFailed` - 仓库更新失败
- `apiList.totalApis` - API总数

### 翻译文件维护

- 添加新翻译时，必须同时更新zh-CN.json和en-US.json
- 保持两个文件的键结构一致
- 删除不再使用的键
- 定期检查是否有缺失的翻译

### 示例

**添加新的用户界面文本：**

1. 在zh-CN.json中添加：
```json
{
  "myFeature": {
    "title": "我的功能",
    "description": "这是我的功能描述",
    "saveButton": "保存",
    "cancelButton": "取消"
  }
}
```

2. 在en-US.json中添加：
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature description",
    "saveButton": "Save",
    "cancelButton": "Cancel"
  }
}
```

3. 在组件中使用：
```jsx
const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
      <button>{t('myFeature.saveButton')}</button>
      <button>{t('myFeature.cancelButton')}</button>
    </div>
  );
};
```

## 组件开发规范

### 组件结构

```jsx
/**
 * 组件描述
 * @param {Object} props - 组件属性
 * @param {string} props.title - 标题
 * @param {Function} props.onClick - 点击回调
 */
const MyComponent = ({ title, onClick }) => {
  // Hooks声明（按顺序）
  const [state, setState] = React.useState(null);
  const { t } = useTranslation();

  // 副作用
  React.useEffect(() => {
    // ...
  }, []);

  // 事件处理函数
  const handleClick = () => {
    // ...
  };

  // 渲染
  return (
    <div onClick={handleClick}>
      {title}
    </div>
  );
};

export default MyComponent;
```

### Props定义

对于复杂组件，定义PropTypes或TypeScript接口：

```jsx
// PropTypes
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  )
};

MyComponent.defaultProps = {
  onClick: () => {},
  items: []
};
```

### 组件拆分

- 单一职责原则
- 组件大小控制在300行以内
- 复杂UI拆分为多个小组件

## API集成规范

### API定义

所有API调用在 `src/api/api.js` 中定义：

```javascript
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const serviceKnowledgeAPI = {
  getAll: () => axios.get(`${API_BASE}/api/service-knowledge`),

  getById: (id) => axios.get(`${API_BASE}/api/service-knowledge/${id}`),

  create: (data) => axios.post(`${API_BASE}/api/service-knowledge`, data),

  update: (id, data) => axios.put(`${API_BASE}/api/service-knowledge/${id}`, data),

  delete: (id) => axios.delete(`${API_BASE}/api/service-knowledge/${id}`)
};
```

### 在组件中使用

```jsx
import { serviceKnowledgeAPI } from '../api/api';

const MyComponent = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await serviceKnowledgeAPI.getAll();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Spin />;

  return <div>{/* ... */}</div>;
};
```

### 错误处理

- 使用try-catch捕获错误
- 显示用户友好的错误消息
- 使用Ant Design的message组件显示错误

```javascript
try {
  const response = await apiCall();
  // 处理成功响应
} catch (error) {
  console.error('API Error:', error);
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  message.error(errorMessage);
}
```

## Git提交规范

### 提交信息格式

使用Conventional Commits规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat` - 新功能
- `fix` - 修复bug
- `docs` - 文档更新
- `style` - 代码格式调整（不影响功能）
- `refactor` - 重构
- `test` - 测试相关
- `chore` - 构建/工具链相关

### 示例

```bash
# 新功能
git commit -m "feat(service): add service creation feature"

# 修复bug
git commit -m "fix(i18n): resolve missing translation keys"

# 文档更新
git commit -m "docs(readme): update installation instructions"

# 重构
git commit -m "refactor(api): simplify API response handling"
```

### 分支策略

- `main` - 主分支，稳定代码
- `feature/*` - 新功能分支
- `fix/*` - bug修复分支
- `refactor/*` - 重构分支

### Pull Request

- 使用描述性的PR标题
- PR描述中包含变更说明
- 确保CI检查通过
- 至少一个reviewer批准

## 其他规范

### 注释

- 复杂逻辑必须添加注释
- 使用JSDoc格式注释函数
- 避免无意义的注释

```javascript
/**
 * 计算两个日期之间的天数差
 * @param {Date} date1 - 第一个日期
 * @param {Date} date2 - 第二个日期
 * @returns {number} 天数差（绝对值）
 */
const getDaysDifference = (date1, date2) => {
  // 使用时间戳计算毫秒差
  const diffMs = Math.abs(date1 - date2);
  // 转换为天数
  return diffMs / (1000 * 60 * 60 * 24);
};
```

### 性能优化

- 使用React.memo避免不必要的重新渲染
- 合理使用useMemo和useCallback
- 列表渲染使用key
- 大列表使用虚拟化

### 安全

- 不要在代码中硬编码敏感信息
- 使用环境变量存储配置
- 验证用户输入
- 防止XSS和CSRF攻击

### 测试

- 组件测试使用Jest + React Testing Library
- API测试使用mock数据
- 覆盖率目标：80%以上

---

**记住：国际化要求是必须遵守的，所有面向用户的文本都必须使用翻译键！**
