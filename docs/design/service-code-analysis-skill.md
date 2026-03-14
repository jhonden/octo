# 服务代码分析Skill设计文档

> **设计日期**: 2026-03-14
> **设计版本**: v1.0
> **设计师**: Claude Sonnet 4.5
> **状态**: 待实施

---

## 一、设计动机

### 1.1 背景

当前服务知识管理系统需要手动输入服务信息，效率低。项目中的微服务代码已经包含了丰富的服务定义：
- API接口定义
- 服务间依赖关系
- 配置信息
- 服务说明文档

**目标**：自动化从微服务代码库中提取这些知识，减少手动录入工作。

### 1.2 核心需求

1. **Git仓库集成**
   - 支持配置Git仓库地址
   - 支持拉取指定分支的代码
   - 支持多个仓库配置

2. **代码分析功能**
   - 扫描项目结构，识别服务目录
   - 分析Java/Kotlin/Go等源代码文件
   - 提取API接口信息（路径、方法、参数、返回值）
   - 分析服务间依赖关系
   - 提取配置信息

3. **知识导入**
   - 将提取的知识自动导入到服务知识管理系统
   - 支持批量导入
   - 支持覆盖/更新已有服务

---

## 二、架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────┐
│  Git仓库管理                      │
│  ├─ 仓库配置                         │
│  ├─ 代码拉取                         │
│  └─ 分支管理                         │
│                                    │
│  代码分析引擎                         │
│  ├─ 文件扫描                         │
│  ├─ 语言解析器（Java/Kotlin/Go）       │
│  ├─ API提取器                         │
│  ├─ 依赖分析器                       │
│  └─ 配置提取器                       │
│                                    │
│  后端API集成                       │
│  └─ 知识导入                         │
└─────────────────────────────────────┘
```

### 2.2 前端窗口组件

```
┌─────────────────────────────────────┐
│  代码分析窗口                       │
│  ├─ 仓库配置                         │
│  ├─ 分支选择                         │
│  ├─ 分析控制                         │
│  ├─ 分析进度                         │
│  └─ 提取结果展示                 │
│                                    │
│  服务知识窗口                       │
│  └─ 自动填充提取的服务           │
└─────────────────────────────────────┘
```

---

## 三、功能设计

### 3.1 Git仓库管理

#### 功能需求
1. 仓库配置
   - 仓库名称
   - Git仓库地址（https/ssh）
   - 认证信息（用户名、密码或token）
   - 默认分支

2. 代码拉取
   - 支持拉取指定分支
   - 显示拉取进度
   - 支持取消拉取
   - 拉取后缓存代码到本地或临时目录

3. 仓库列表
   - 支持配置多个仓库
   - 支持启用/禁用仓库
   - 支持删除仓库配置

#### 数据结构
```typescript
interface GitRepository {
  id: string
  name: string
  url: string
  authType: 'none' | 'token' | 'username_password'
  username?: string
  password?: string
  token?: string
  defaultBranch: string
  enabled: boolean
  createdAt: string
}
```

### 3.2 代码分析功能

#### 分析流程

```
1. 代码拉取到临时目录
   │
2. 扫描项目结构
   │  ├── 识别服务目录（通常在src/main/java/**/service/）
   │  ├── 识别配置文件（application.yml, application.properties等）
   │  └── 识别代码文件（.java, .kt, .go等）
   │
3. 解析代码文件
   │   ├── API提取器
   │   │   ├── 扫描@RestController注解
   │   │   ├── 扫描@Mapping, @GetMapping等注解
   │   │   ├── 提取接口路径、方法、参数、返回类型
   │   │   └── 生成API文档
   │   │
   │   ├── 依赖分析器
   │   │   ├── 扫描@Autowired, @Resource等依赖
   │   │   ├── 构建服务依赖关系图
   │   │   └── 识别循环依赖
   │   │
   │   └── 配置提取器
   │       ├── 读取配置文件
   │       ├── 提取服务端口、数据库配置等
   │       └── 识别环境变量
   │
4. 数据整合
   │   ├── 合并API、依赖、配置信息
   │   ├── 生成服务知识结构
   │   └── 准备导入数据
   │
5. 导入到后端
   │   └── 调用后端API批量创建/更新服务
```

#### 支持的语言

**阶段1：Java/Kotlin**
- 识别Spring Boot项目结构
- 解析Spring MVC/REST注解
- 识别Maven/Gradle依赖
- 读取application.yml/properties

**阶段2：Go**
- 识别标准Go项目结构
- 解析Go标准库（gin, echo等）
- 识别go.mod依赖

#### 提取的信息

**API接口信息**
```typescript
interface APIEndpoint {
  serviceId: string
  serviceName: string
  path: string
  method: string
  description?: string
  parameters: APIParameter[]
  returnType: string
  deprecated: boolean
}

interface APIParameter {
  name: string
  type: string
  required: boolean
  description?: string
  example?: any
}
```

**依赖关系**
```typescript
interface ServiceDependency {
  serviceId: string
  dependsOn: string[]
  dependencyType: 'direct' | 'indirect'
  strength: number // 依赖强度（调用次数）
}

interface DependencyGraph {
  services: ServiceDependency[]
  cycles: string[][] // 循环依赖警告
}
```

**配置信息**
```typescript
interface ServiceConfig {
  serviceId: string
  configType: string // 'application', 'bootstrap', 'application-props', etc.
  configs: ConfigItem[]
}

interface ConfigItem {
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
}
```

### 3.3 分析窗口界面

#### 组件结构
```
代码分析窗口
├─ 仓库配置区
│  ├─ 仓库名称输入
│  ├─ Git地址输入
│  ├─ 认证方式选择
│  └─ 默认分支输入
│
├─ 分析控制区
│  ├─ 分支选择下拉框
│  ├─ "开始分析"按钮
│  ├─ "停止分析"按钮
│  └─ 分析进度条
│
├─ 提取结果区
│  ├─ 服务列表（Tab页）
│  │  ├─ API接口Tab
│  │  ├─ 依赖关系Tab
│  │  └─ 配置信息Tab
│  ├─ 每个服务的详细信息
│  └─ "导入到知识库"按钮
│
└─ 分析日志区
   └─ 实时日志输出
```

#### 交互流程
1. 配置仓库信息 → 点击"开始分析"
2. 显示分析进度（文件扫描、代码解析、数据提取）
3. 分析完成 → 显示提取结果
4. 查看提取结果 → 批量选择服务
5. 点击"导入到知识库" → 确认导入
6. 导入完成 → 自动打开服务知识窗口查看

---

## 四、技术实现方案

### 4.1 前端实现

#### 技术栈
- React 18 + Hooks
- Ant Design 5.x
- Axios（HTTP请求）
- Monaco Editor（可选，用于代码预览）

#### 关键组件

1. **CodeAnalysisWindow.jsx**
   - 主窗口组件
   - 集成Git管理、分析控制、结果展示

2. **RepositoryConfig.jsx**
   - 仓库配置表单

3. **AnalysisProgress.jsx**
   - 分析进度展示组件

4. **APIExtraction.jsx**
   - API接口信息展示组件

5. **DependencyGraph.jsx**
   - 依赖关系可视化组件（使用React Flow等）

6. **ServiceConfigViewer.jsx**
   - 配置信息查看器

### 4.2 后端实现

#### 后端API设计

需要扩展的后端API：

```typescript
// Git仓库管理API
POST /api/git-repositories           // 创建仓库配置
GET  /api/git-repositories          // 获取仓库列表
PUT  /api/git-repositories/:id       // 更新仓库配置
DELETE /api/git-repositories/:id    // 删除仓库配置
POST /api/git-repositories/:id/clone  // 拉取仓库代码

// 代码分析API
POST /api/code-analysis/analyze    // 开始代码分析
GET  /api/code-analysis/:id         // 获取分析结果
DELETE /api/code-analysis/:id     // 删除分析结果

// 批量导入API
POST /api/service-knowledge/batch-import  // 批量导入提取的服务
```

#### 实现选项

**选项A：前端直接分析（推荐）**
- 前端直接调用Git API拉取代码
- 前端使用简单的字符串匹配提取信息
- 优点：简单、快速实现
- 缺点：分析深度有限

**选项B：后端分析引擎**
- 后端实现完整的代码分析引擎
- 支持AST解析、深度依赖分析
- 优点：分析准确、功能强大
- 缺点：实现复杂、需要后端开发资源

**推荐方案：选项A**
- 先实现基础的字符串匹配分析
- 后续可以扩展为后端分析引擎
- 快速验证想法，降低开发成本

---

## 五、文件结构

```
frontend/src/
├── components/
│   ├── CodeAnalysisWindow.jsx           # 代码分析主窗口
│   ├── RepositoryConfig.jsx            # 仓库配置组件
│   ├── AnalysisProgress.jsx             # 分析进度组件
│   ├── APIExtraction.jsx               # API提取结果组件
│   ├── DependencyGraph.jsx             # 依赖关系图组件
│   ├── ServiceConfigViewer.jsx          # 配置查看器
│   └── CodeAnalysis.css                # 样式文件
│
├── services/
│   └── codeAnalysisService.js            # 后端API服务
│
└── pages/
    └── CodeAnalysis.jsx                  # 独立页面（可选）
```

---

## 六、开发任务清单

### 阶段1：基础功能（4小时）

- [ ] 创建CodeAnalysisWindow组件基础结构
- [ ] 实现Git仓库配置表单
- [ ] 实现仓库列表展示
- [ ] 实现代码拉取基础功能（仅HTTP拉取）
- [ ] 添加仓库配置到后端API

### 阶段2：代码分析（6小时）

- [ ] 实现项目结构扫描
- [ ] 实现Java/Kotlin文件解析器
  - [ ] 扫描@RestController注解
  - [ ] 扫描@GetMapping等注解
  - [ ] 提取API接口信息
- [ ] 实现简单的依赖分析（基于字符串匹配）
- [ ] 实现配置文件解析（application.yml）
- [ ] 分析进度展示
- [ ] 结果数据整合

### 阶段3：结果展示（4小时）

- [ ] 实现API接口信息展示组件
- [ ] 实现依赖关系展示（简单列表或树形）
- [ ] 实现配置信息展示
- [ ] 结果搜索和过滤

### 阶段4：导入功能（2小时）

- [ ] 实现批量选择功能
- [ ] 实现导入确认对话框
- [ ] 调用批量导入API
- [ ] 导入成功提示

### 阶段5：测试和优化（2小时）

- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] Bug修复

---

## 七、预估时间

- **总时间**：18-22小时
- **阶段1**：4小时（基础功能）
- **阶段2**：6小时（代码分析）
- **阶段3**：4小时（结果展示）
- **阶段4**：2小时（导入功能）
- **阶段5**：2小时（测试优化）

---

## 八、风险和注意事项

### 8.1 技术风险

1. **Git认证**
   - SSH密钥需要安全存储
   - Token需要加密存储
   - 建议：先支持HTTPS + Token，SSH后续添加

2. **代码分析准确性**
   - 字符串匹配无法保证100%准确
   - 可能会有误报或漏报
   - 建议：提供人工审核和修正功能

3. **大仓库性能**
   - 大型仓库拉取和分析可能耗时
   - 建议：添加进度提示、支持取消操作

### 8.2 实施建议

1. **分阶段实施**
   - 先实现最基础的功能验证想法
   - 逐步添加高级功能

2. **保持灵活性**
   - 分析规则可配置（支持自定义模式）
   - 支持手动修正分析结果

3. **数据安全**
   - 敏感信息（Token、密码）加密存储
   - 代码分析后可以清理临时文件

---

**状态**: 📝 设计完成，等待确认

**下一步**: 等待用户确认后开始实施
