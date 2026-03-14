# 服务知识窗口 - 功能需求设计

> **设计日期**: 2026-03-14
> **设计版本**: v1.1
> **设计师**: Claude Sonnet 4.5
> **状态**: 设计完成，待实施

---

## 一、设计目标

在服务知识窗口内部实现一个完整的服务管理工作台，支持服务信息管理、代码仓库管理和服务知识分析功能。

---

## 二、整体架构

### 2.1 窗口结构

```
┌─────────────────────────────────────────┐
│  Tab菜单（顶部）                          │
│  ├─ [服务列表] [API列表] [配置] [仓库] │  ← 功能Tab
│  └─ 主内容区                           │
│      ├─ 服务列表表格（选中Tab内容）       │
│      ├─ API接口列表                      │
│      ├─ 依赖关系图                      │
│      └─ 配置信息                          │
└─────────────────────────────────────────┘
```

### 2.2 数据流转

```
服务列表（后端API） ←→ 服务知识（前端状态） ←→ Tab选择
     ↓                                      ↓
服务仓库配置 ←───────────────── 服务知识分析结果
     ↓                (批量分析后生成)
```

---

## 三、功能模块设计

### 3.1 服务列表功能（Tab 1）

#### 功能需求

**基础CRUD：**
- 创建服务（名称、版本、描述）
- 编辑服务信息
- 删除服务
- 查看服务详情
- 服务列表分页显示

**仓库管理（简化）：**
- 添加代码仓库（Git URL或本地路径）
- 设置主仓库标记
- 删除仓库配置
- 查看仓库详情

**状态标签：**
- 已发布（绿色）
- 草稿（黄色）
- 已废弃（灰色）

#### 界面设计

**Tab菜单：**
- 固定在窗口顶部，横向Tab切换
- 样式：类似于浏览器Tab或VS Code
- 激活Tab：深色背景 + 蓝色文字
- 非激活Tab：浅色背景 + 深色文字

**服务列表表格：**
```typescript
interface Service {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'published' | 'deprecated';
  description?: string;
  repositoryId?: string; // 关联的仓库ID
  repositories: ServiceRepository[]; // 支持多个仓库
  createdAt: string;
  updatedAt: string;
}

interface ServiceRepository {
  id: string;
  serviceId: string;
  type: 'git' | 'local';
  url?: string; // Git URL
  path?: string; // 本地路径
  defaultBranch?: string;
  isPrimary: boolean; // 是否主仓库
  createdAt: string;
  updatedAt: string;
}
```

**操作按钮：**
- 添加服务（主要操作）
- 批量删除
- 刷新列表
- 搜索服务（按名称、状态）

**表格列：**
- 服务名称（可编辑）
- 版本
- 状态（Tag显示）
- 仓库数量（显示有多少个代码仓库）
- 创建时间
- 最后更新时间
- 操作（编辑、删除、管理仓库）

#### 交互流程

1. 点击"添加服务" → 打开创建服务弹窗
2. 填写服务信息（名称、版本、描述） → 保存
3. 点击服务列表项 → 打开编辑弹窗
4. 点击"仓库数量" → 打开仓库管理弹窗
5. 在仓库管理弹窗中：
   - 添加仓库（Git URL或本地路径）
   - 设置主仓库
   - 删除仓库
   - 查看仓库详情

---

### 3.2 API接口列表功能（Tab 2）

#### 功能需求

**API信息展示：**
- 接口路径
- HTTP方法（GET/POST/PUT/DELETE）
- 接口描述
- 请求参数说明
- 返回类型说明
- 关联的服务
- 最后更新时间

**筛选和搜索：**
- 按服务筛选
- 按方法筛选
- 按路径搜索

#### 界面设计

**API接口表格：**
```typescript
interface APIEndpoint {
  id: string;
  serviceId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  parameters: APIParameter[];
  responseType: string;
  service?: Service; // 关联的服务信息
  updatedAt: string;
}

interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: any;
}
```

**操作按钮：**
- 刷新API列表（重新分析代码）
- 搜索接口
- 导出API文档

**批量操作：**
- 批量选中API → 批量生成测试文档
- 复制API路径

---

### 3.3 服务知识分析功能（核心功能）

#### 功能需求

**知识类型：**
1. **API接口知识** - 从代码中提取的接口信息
2. **依赖关系** - 服务间的调用依赖
3. **配置信息** - 应用配置、数据库配置等
4. **文档链接** - 设计文档、README等

**分析触发：**
- 批量勾选服务 → 点击"开始知识分析"
- 单个服务分析 → 在服务详情弹窗中点击"分析"

**分析进度展示：**
```typescript
interface AnalysisProgress {
  serviceId: string;
  serviceName: string;
  steps: AnalysisStep[];
  currentStep: number;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
}

interface AnalysisStep {
  stepName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}
```

**分析步骤：**
1. **代码下载** - 从Git/本地路径拉取代码
2. **代码扫描** - 扫描项目结构
3. **API提取** - 提取REST接口
4. **依赖分析** - 分析服务间调用关系
5. **配置提取** - 读取配置文件
6. **生成文档** - 生成markdown文档
7. **入库** - 保存到服务知识库

**知识展示方式：**

**Tab 2: 服务知识（列表展示）**
```
┌──────────────────────────────────────────┐
│ 服务A [✅ 已分析]                         │
│ ├─ API接口: [GET /api/xxx] [POST ...]   │
│ ├─ 依赖关系: 服务B、服务C                     │
│ └─ 配置信息: 端口: 8080, DB: postgres      │
└───────────────────────────────────────────┘
```

**弹窗详情：**
```typescript
interface ServiceKnowledgeDetail {
  serviceId: string;
  serviceName: string;
  version: string;
  sections: KnowledgeSection[];
}

interface KnowledgeSection {
  type: 'api' | 'dependency' | 'config' | 'doc';
  title: string;
  content: any;
  expanded?: boolean; // 是否展开
}
```

---

### 3.4 依赖关系图功能（Tab 3）- 暂缓

**功能描述：**
- 基于服务知识中的依赖关系自动生成依赖图
- 可视化展示服务间调用关系
- 支持依赖链路高亮
- 支持循环依赖警告

**实现方式（待定）：**
- 后端生成Mermaid格式依赖图数据
- 前端使用Mermaid.js渲染
- 或手动维护mermaid.md文档

---

## 四、后端API设计

### 4.1 服务管理API扩展

**现有API（已完成）：**
```
GET    /api/service-knowledge
POST   /api/service-knowledge
PUT    /api/service-knowledge/{id}
DELETE /api/service-knowledge/{id}
```

**新增API：**

```typescript
// 服务仓库管理
POST   /api/service-repositories
GET    /api/service-repositories
PUT    /api/service-repositories/{id}
DELETE /api/service-repositories/{id}

// 服务知识分析
POST   /api/service-knowledge/analyze
POST   /api/service-knowledge/analyze/batch
GET    /api/service-knowledge/analyze/{id}
```

### 4.2 数据库表扩展

**现有表：**
```sql
service_knowledge (id, service_name, version, status, knowledge, created_at, updated_at)
```

**新增表：**
```sql
-- 服务仓库表
CREATE TABLE service_repositories (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT NOT NULL REFERENCES service_knowledge(id),
  repository_type VARCHAR(10) NOT NULL, -- 'git' | 'local'
  url VARCHAR(500), -- Git仓库URL
  path VARCHAR(500), -- 本地路径
  default_branch VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 服务知识分析表
CREATE TABLE service_knowledge_analysis (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT NOT NULL REFERENCES service_knowledge(id),
  knowledge_type VARCHAR(20) NOT NULL, -- 'api' | 'dependency' | 'config' | 'doc'
  content JSONB NOT NULL,
  confidence DECIMAL(3,2), -- 置信度 0-100
  extracted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_service_id_type (service_id, knowledge_type)
);

-- 分析步骤表
CREATE TABLE analysis_steps (
  id BIGSERIAL PRIMARY KEY,
  analysis_id BIGINT NOT NULL REFERENCES service_knowledge_analysis(id),
  step_number INT NOT NULL,
  step_name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 五、前端技术实现

### 5.1 组件结构

```
frontend/src/
├── components/
│   ├── ServiceKnowledgeWindow.jsx       # 主窗口
│   │   ├── ServiceList.jsx              # Tab 1: 服务列表
│   │   ├── RepositoryManage.jsx         # 仓库管理弹窗
│   │   ├── APIList.jsx                 # Tab 2: API列表
│   │   ├── KnowledgeAnalysis.jsx        # Tab 3: 知识分析
│   │   └── ServiceKnowledgeDetail.jsx   # 详情弹窗
│   └── services/
│       └── api/
│           ├── serviceRepositoryService.js  # 仓库API
│           ├── serviceKnowledgeAnalysisService.js  # 知识分析API
│           └── knowledge/
│               └── ServiceKnowledgeList.jsx  # 服务知识列表展示
│               └── DependencyGraph.jsx    # 依赖关系图（Tab 3）
└── App.jsx (已集成WindowManager)
└── WindowManagerContext.jsx (已集成)
```

### 5.2 状态管理

```typescript
// 在ServiceKnowledgeWindow中维护的本地状态
interface WindowState {
  activeTab: 'serviceList' | 'apiList' | 'knowledge';
  selectedServices: string[];
  selectedAPIs: string[];
  isAnalyzing: boolean;
  analysisProgress: AnalysisProgress | null;
}
```

---

## 六、文件结构

```
frontend/src/
├── components/
│   ├── ServiceKnowledgeWindow.jsx       # 服务知识主窗口
│   ├── ServiceList.jsx              # Tab 1: 服务列表
│   ├── APIList.jsx                 # Tab 2: API列表
│   ├── KnowledgeAnalysis.jsx        # Tab 3: 知识分析（主内容）
│   ├── DependencyGraph.jsx            # Tab 3: 依赖关系图（暂缓）
│   ├── RepositoryManage.jsx         # 仓库管理弹窗
│   └── ServiceKnowledgeDetail.jsx   # 详情弹窗
└── services/
│   ├── serviceRepositoryService.js    # 仓库API服务
│   ├── serviceKnowledgeAnalysisService.js  # 知识分析API服务
│   └── knowledge/
│       └── ServiceKnowledgeList.jsx  # 服务知识列表
│       └── tabs/
│           └── ServiceTabs.jsx  # Tab菜单组件
└── App.jsx
```

---

## 七、开发任务清单

### 阶段1：基础组件（2小时）
- [ ] 创建ServiceKnowledgeWindow主窗口组件
- [ ] 创建ServiceTabs Tab菜单组件
- [ ] 创建ServiceList服务列表（Tab 1内容）
- [ ] 实现服务CRUD功能
- [ ] 创建RepositoryManage仓库管理弹窗
- [ ] 实现仓库基础管理

### 阶段2：API列表（Tab 2）（1小时）
- [ ] 创建APIList组件
- [ ] 从服务知识读取API数据
- [ ] 实现API筛选和搜索
- [ ] 实现API详情展示

### 阶段3：知识分析（Tab 3）（3小时）
- [ ] 创建KnowledgeAnalysis主组件
- [ ] 实现服务列表复选
- [ ] 创建分析进度展示
- [ ] 创建服务知识详情弹窗（展示API、依赖、配置、文档）
- [ ] 实现批量分析触发
- [ ] 实现单个服务分析

### 阶段4：后端扩展（2小时）
- [ ] 创建ServiceRepository实体和Repository
- [ ] 创建ServiceKnowledgeAnalysis实体
- [ ] 创建RepositoryController和AnalysisController
- [ ] 实现仓库管理API
- [ ] 实现知识分析API
- [ ] 创建数据库表和Repository

### 阶段5：集成测试（1小时）
- [ ] 前端集成测试
- [ ] 后端API测试
- [ ] 端到端流程测试
- [ ] Bug修复

---

## 八、预估时间

- **总时间**：约9小时
- **阶段1**：2小时
- **阶段2**：1小时
- **阶段3**：3小时（最复杂）
- **阶段4**：2小时
- **阶段5**：1小时

---

**状态**: ✅ 设计完成，等待开始实施

**下一步**: 等待用户确认后开始阶段1实施

---

## 八、测试用例设计（TDD驱动开发）

### 8.1 测试策略

#### 8.1.1 测试金字塔
```
         E2E测试 (端到端)
        /    /\
       /    集成测试
      /     /    / 单元测试
      /    /   \
       /------------ E2E测试 ------------\
        /      / 集成测试
        /     /    / 单元测试
        /   /    /  \  \
       /------------------------- 手动探索测试 --------------\
        /      /    / 单元测试
```

#### 8.1.2 测试类型

**单元测试**（Component Tests）
- 目标：验证单个函数/方法逻辑正确性
- 范围：Controller方法、Service业务逻辑、Repository数据访问
- 工具：JUnit 5 + Mockito
- 覆盖率目标：核心功能70%+

**集成测试**（Integration Tests）
- 目标：验证多个组件协作正确性
- 范围：完整用户流程（创建服务、添加仓库、批量分析）
- 工具：SpringBootTest + MockMvc

**E2E测试**（End-to-End Tests）
- 目标：验证系统端到端功能
- 范围：完整业务流程（代码拉取→分析→入库）
- 工具：RestAssured + TestContainers

---

### 8.2 服务列表功能测试用例（Tab 1）

#### 8.2.1 服务CRUD测试

```gherkin
@ExtendWith(SpringExtensionContext.class)
@SpringBootTest
@AutoConfigureMockMvc(ServiceRepositoryService.class)
class ServiceControllerTest {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private MockMvc mockMvc;

    // ========== 创建服务测试 ==========

    @Test
    @DisplayName("创建服务 - 成功")
    void testCreateService_Success() {
        // Given
        ServiceCreateRequest request = new ServiceCreateRequest();
        request.setServiceName("test-service");
        request.setVersion("1.0.0");
        request.setStatus("draft");

        // When
        ResponseEntity<ServiceResponse> response = serviceRepository.create(request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ServiceResponse result = response.getBody();
        assertThat(result.getServiceName()).isEqualTo("test-service");
        assertThat(result.getVersion()).isEqualTo("1.0.0");
        assertThat(result.getStatus()).isEqualTo("draft");
        assertThat(result.getId()).isNotNull();

        // 验证数据库插入
        assertThat(serviceRepository.count()).isGreaterThan(0);
    }

    @Test
    @DisplayName("创建服务 - 服务名已存在")
    void testCreateService_ServiceNameExists() {
        // Given
        Service service = new Service();
        service.setServiceName("test-service");
        service.setVersion("1.0.0");
        service.setStatus("draft");

        // When
        assertThrows(()
    }
}
```

#### 8.2.2 服务仓库管理测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceRepositoryService.class)
class ServiceRepositoryTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("添加Git仓库 - 成功")
    void testAddGitRepository_Success() {
        // Given
        Service testService = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");

        ServiceRepository repository = new ServiceRepository();
        repository.setService(testService);
        repository.setUrl("https://github.com/example/service.git");
        repository.setType("git");
        repository.setBranch("main");
        repository.setIsPrimary(true);

        // When
        when(repositoryService.save(repository))

        // Then
        assertThat(repositoryService.existsById(repository.getId())).isTrue();
        ServiceRepository saved = repositoryService.findById(repository.getId()).get();
        assertThat(saved.getUrl()).isEqualTo("https://github.com/example/service.git");
        assertThat(saved.isPrimary()).isTrue();
    }

    @Test
    @DisplayName("设置主仓库")
    void testSetPrimaryRepository() {
        // Given
        Service testService = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        ServiceRepository repo1 = serviceRepository.save(new ServiceRepository(testService, "https://git1.com"));
        ServiceRepository repo2 = serviceRepository.save(new ServiceRepository(testService, "git://git2.com"));

        // When
        when(serviceRepositoryService.setPrimary(testService.getId(), repo1.getId()))

        // Then
        assertThat(serviceRepositoryService.findById(repo1.getId()).get().isPrimary()).isTrue();
        assertThat(serviceRepositoryService.findById(repo2.getId()).get().isPrimary()).isFalse();
    }

    @Test
    @DisplayName("删除仓库")
    void testDeleteRepository() {
        // Given
        Service testService = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        ServiceRepository repository = serviceRepository.save(new ServiceRepository(testService, "https://git1.com"));
        Long repoId = repository.getId();

        // When
        serviceRepositoryService.delete(repoId);

        // Then
        assertThat(serviceRepositoryService.existsById(repoId)).isFalse();
    }
}
```

#### 8.2.3 服务状态管理测试

```gherkin
@SpringBootTest
class ServiceServiceTest {

    @Test
    @DisplayName("发布服务")
    void testPublishService() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");

        // When
        service.setStatus("published");
        when(serviceRepository.save(service))

        // Then
        assertThat(service.getStatus()).isEqualTo("published");
    }

    @Test
    @DisplayName("废弃服务")
    void testDeprecateService() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");

        // When
        service.setStatus("deprecated");
        when(serviceRepository.save(service))

        // Then
        assertThat(service.getStatus()).isEqualTo("deprecated");
    }

    @Test
    @DisplayName("删除服务")
    void testDeleteService() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        Long serviceId = service.getId();

        // When
        serviceRepository.delete(serviceId);

        // Then
        assertThat(serviceRepository.existsById(serviceId)).isFalse();
    }
}
```

---

### 8.3 API列表功能测试用例（Tab 2）

#### 8.3.1 API端点测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceController.class)
class ServiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ========== 服务列表测试 ==========

    @Test
    @DisplayName("获取所有服务 - 成功")
    void testGetAllServices_Success() {
        // Given
        List<Service> services = Arrays.asList(
            createTestService("service-a", "1.0.0", "published"),
            createTestService("service-b", "2.0.0", "draft"),
            createTestService("service-c", "1.1.0", "draft")
        );

        // When
        when(serviceController.getAllServices())

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

        List<ServiceResponse> results = responseEntity.getBody();
        assertThat(results).hasSize(3);

        assertThat(results.get(0).getServiceName()).isEqualTo("service-a");
        assertThat(results.get(1).getServiceName()).isEqualTo("service-b");
        assertThat(results.get(2).getServiceName()).isEqualTo("service-c");
    }

    @Test
    @DisplayName("根据名称搜索服务")
    void testSearchServicesByName() {
        // Given
        createTestService("search-service", "1.0.0", "published");

        // When
        when(serviceController.searchServices("search-service", null, null))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<ServiceResponse> results = responseEntity.getBody();
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getServiceName()).isEqualTo("search-service");
    }

    @Test
    @DisplayName("根据状态筛选服务")
    void testFilterServicesByStatus() {
        // Given
        createTestService("draft-service-1", "1.0.0", "draft");
        createTestService("published-service-1", "1.0.0", "published");

        // When
        when(serviceController.searchServices(null, "draft", null))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<ServiceResponse> results = responseEntity.getBody();
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getStatus()).isEqualTo("draft");
    }
}
```

#### 8.3.2 API详情测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceController.class)
class ServiceControllerTest {

    @Test
    @DisplayName("根据ID获取服务详情")
    void testGetServiceById_Success() {
        // Given
        Service service = createTestService("detail-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // When
        when(serviceController.getServiceById(serviceId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        ServiceResponse result = responseEntity.getBody();
        assertThat(result.getServiceName()).isEqualTo("detail-service");
        assertThat(result.getVersion()).isEqualTo("1.0.0");
    }

    @Test
    @DisplayName("服务不存在")
    void testGetServiceById_NotFound() {
        // Given
        Long nonExistentId = 99999L;

        // When
        when(serviceController.getServiceById(nonExistentId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

#### 8.3.3 API创建测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceController.class)
class ServiceControllerTest {

    @Test
    @DisplayName("创建服务 - 成功")
    void testCreateService_Success() {
        // Given
        ServiceCreateRequest request = new ServiceCreateRequest();
        request.setServiceName("new-service");
        request.setVersion("1.0.0");
        request.setStatus("draft");
        request.setKnowledge("{}");

        // When
        when(serviceController.createService(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        ServiceResponse result = responseEntity.getBody();
        assertThat(result.getServiceName()).isEqualTo("new-service");
        assertThat(result.getVersion()).isEqualTo("1.0.0");
    }

    @Test
    @DisplayName("创建服务 - 服务名已存在")
    void testCreateService_ServiceNameExists() {
        // Given
        ServiceCreateRequest request = new ServiceCreateRequest();
        request.setServiceName("test-service");
        request.setVersion("1.0.0");

        // When
        when(serviceController.createService(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(responseEntity.getBody().containsString("already exists"));
    }

    @Test
    @DisplayName("创建服务 - 版本格式错误")
    void testCreateService_InvalidVersionFormat() {
        // Given
        ServiceCreateRequest request = new ServiceCreateRequest();
        request.setServiceName("invalid-service");
        request.setVersion("invalid-version");

        // When
        when(serviceController.createService(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
```

#### 8.3.4 API更新测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceController.class)
class ServiceControllerTest {

    @Test
    @DisplayName("更新服务 - 成功")
    void testUpdateService_Success() {
        // Given
        Service service = createTestService("update-service", "1.0.0", "published");
        Long serviceId = service.getId();

        ServiceUpdateRequest request = new ServiceUpdateRequest();
        request.setServiceName("updated-service");
        request.setVersion("1.1.0");
        request.setStatus("published");

        // When
        when(serviceController.updateService(serviceId, request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        ServiceResponse result = responseEntity.getBody();
        assertThat(result.getServiceName()).isEqualTo("updated-service");
        assertThat(result.getVersion()).isEqualTo("1.1.0");
    }

    @Test
    @DisplayName("更新服务 - 服务不存在")
    void testUpdateService_ServiceNotFound() {
        // Given
        Long nonExistentId = 99999L;
        ServiceUpdateRequest request = new ServiceUpdateRequest();
        request.setServiceName("updated-service");

        // When
        when(serviceController.updateService(nonExistentId, request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

#### 8.3.5 API删除测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceController.class)
class ServiceControllerTest {

    @Test
    @DisplayName("删除服务 - 成功")
    void testDeleteService_Success() {
        // Given
        Service service = createTestService("delete-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // When
        when(serviceController.deleteService(serviceId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(serviceRepository.existsById(serviceId)).isFalse();
    }

    @Test
    @DisplayName("删除服务 - 服务不存在")
    void testDeleteService_ServiceNotFound() {
        // Given
        Long nonExistentId = 99999L;

        // When
        when(serviceController.deleteService(nonExistentId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

---

### 8.4 服务知识分析功能测试用例（Tab 3）

#### 8.4.1 分析API测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceKnowledgeAnalysisController.class)
class ServiceKnowledgeAnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("单个服务分析 - 成功")
    void testAnalyzeSingleService_Success() {
        // Given
        Service service = createTestService("analyze-service", "1.0.0", "published");
        Long serviceId = service.getId();

        AnalysisRequest request = new AnalysisRequest();
        request.setServiceIds(Arrays.asList(serviceId));

        // When
        when(serviceKnowledgeAnalysisController.analyze(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);

        // 验证任务已创建
        List<ServiceKnowledgeAnalysis> analyses = serviceKnowledgeAnalysisRepository.findByServiceId(serviceId);
        assertThat(analyses).hasSize(1);
        assertThat(analyses.get(0).getStatus()).isEqualTo("pending");
    }

        // 模拟后端任务执行
        analyses.get(0).setStatus("completed");
        serviceKnowledgeAnalysisRepository.save(analyses.get(0));
    }

    @Test
    @DisplayName("单个服务分析 - 服务不存在")
    void testAnalyzeSingleService_ServiceNotFound() {
        // Given
        Long nonExistentId = 99999L;
        AnalysisRequest request = new AnalysisRequest();
        request.setServiceIds(Arrays.asList(nonExistentId));

        // When
        when(serviceKnowledgeAnalysisController.analyze(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

#### 8.4.2 批量分析测试

```gherkin
@SpringBootTest
class ServiceKnowledgeAnalysisServiceTest {

    @Autowired
    private ServiceKnowledgeAnalysisController analysisController;

    @Test
    @DisplayName("批量分析 - 成功")
    void testBatchAnalyze_Success() {
        // Given
        Service service1 = createTestService("batch-1", "1.0.0", "published");
        Service service2 = createTestService("batch-2", "1.0.0", "published");
        Service service3 = createTestService("batch-3", "1.0.0", "published");

        AnalysisRequest request = new AnalysisRequest();
        request.setServiceIds(Arrays.asList(
            service1.getId(),
            service2.getId(),
            service3.getId()
        ));

        // When
        when(analysisController.analyze(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);

        // 验证3个任务已创建
        List<ServiceKnowledgeAnalysis> analyses = serviceKnowledgeAnalysisRepository.findAll();
        assertThat(analyses).hasSize(3);
        analyses.forEach(analysis -> {
            assertThat(analysis.getStatus()).isEqualTo("pending");
        });
    }

        // 模拟任务完成
        analyses.forEach(analysis -> {
            analysis.setStatus("completed");
            serviceKnowledgeAnalysisRepository.save(analysis);
        });
    }

    @Test
    @DisplayName("批量分析 - 空列表")
    void testBatchAnalyze_EmptyList() {
        // Given
        AnalysisRequest request = new AnalysisRequest();
        request.setServiceIds(new ArrayList<>());

        // When
        when(analysisController.analyze(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody().containsString("service list cannot be empty"));
    }
}
```

#### 8.4.3 分析进度查询测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceKnowledgeAnalysisController.class)
class ServiceKnowledgeAnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("查询分析进度")
    void testGetAnalysisProgress() {
        // Given
        Service service = createTestService("progress-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // 模拟分析任务
        ServiceKnowledgeAnalysis analysis = createAnalysisTask(serviceId);
        serviceKnowledgeAnalysisRepository.save(analysis);

        // When
        when(serviceKnowledgeAnalysisController.getAnalysisProgress(serviceId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        AnalysisProgressResponse result = responseEntity.getBody();
        assertThat(result.getServiceId()).isEqualTo(serviceId);
        assertThat(result.getSteps()).isNotEmpty();
    }

    @Test
    @DisplayName("查询分析进度 - 不存在")
    void testGetAnalysisProgress_NotFound() {
        // Given
        Long nonExistentId = 99999L;

        // When
        when(serviceKnowledgeAnalysisController.getAnalysisProgress(nonExistentId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
```

#### 8.4.4 知识详情查询测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceKnowledgeController.class)
class ServiceKnowledgeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("获取服务知识 - 成功")
    void testGetServiceKnowledge_Success() {
        // Given
        Service service = createTestService("knowledge-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // 模拟分析完成
        ServiceKnowledgeAnalysis analysis = createAnalysisTask(serviceId);
        analysis.setStatus("completed");

        // 提取知识内容
        Map<String, Object> knowledge = new HashMap<>();
        knowledge.put("api_endpoints", Arrays.asList(
            Map.of("path", "/api/users", "method", "GET", "description", "用户列表API")
        ));

        ServiceKnowledge serviceKnowledge = new ServiceKnowledge();
        serviceKnowledge.setAnalysis(analysis);
        serviceKnowledge.setKnowledge(knowledge);
        serviceKnowledgeRepository.save(serviceKnowledge);

        // When
        when(serviceKnowledgeAnalysisController.getServiceKnowledge(serviceId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        ServiceKnowledgeResponse result = responseEntity.getBody();
        assertThat(result.getServiceId()).isEqualTo(serviceId);
        assertThat(result.getKnowledge()).isNotNull();
        assertThat(result.getKnowledge()).containsKey("api_endpoints");
    }

    @Test
    @DisplayName("获取服务知识 - 分析未完成")
    void testGetServiceKnowledge_AnalysisNotCompleted() {
        // Given
        Service service = createTestService("knowledge-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // 模拟分析进行中
        ServiceKnowledgeAnalysis analysis = createAnalysisTask(serviceId);
        analysis.setStatus("in_progress");

        // When
        when(serviceKnowledgeAnalysisController.getServiceKnowledge(serviceId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_ACCEPTABLE);
        assertThat(responseEntity.getBody()).containsString("analysis not completed yet"));
    }
}
```

#### 8.4.5 知识内容更新测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceKnowledgeController.class)
class ServiceKnowledgeControllerTest {

    @Test
    @DisplayName("更新知识内容 - 成功")
    void testUpdateKnowledge_Success() {
        // Given
        Service service = createTestService("knowledge-service", "1.0.0", "published");
        Long serviceId = service.getId();
        ServiceKnowledge serviceKnowledge = new ServiceKnowledge();
        serviceKnowledge.setAnalysis(createAnalysisTask(serviceId));
        serviceKnowledge.setKnowledge(new HashMap<>());
        serviceKnowledgeRepository.save(serviceKnowledge);

        Map<String, Object> updatedKnowledge = new HashMap<>();
        updatedKnowledge.put("api_endpoints", Arrays.asList(
            Map.of("path", "/api/users", "method", "POST", "description", "创建用户API")
        ));

        // When
        when(serviceKnowledgeAnalysisController.updateKnowledge(serviceId, updatedKnowledge))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        ServiceKnowledgeResponse result = responseEntity.getBody();
        assertThat(result.getKnowledge()).containsKey("api_endpoints");
    }
}
```

---

### 8.5 仓库管理功能测试用例（阶段1）

#### 8.5.1 仓库CRUD测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceRepositoryController.class)
class ServiceRepositoryControllerTest {

    @Autowired
    private ServiceRepositoryService serviceRepositoryService;

    @Test
    @DisplayName("添加Git仓库 - 成功")
    void testAddGitRepository_Success() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        ServiceRepository repository = new ServiceRepository();
        repository.setUrl("https://github.com/example/service.git");
        repository.setType("git");
        repository.setBranch("main");
        repository.setIsPrimary(true);
        repository.setService(service);

        // When
        when(serviceRepositoryService.create(repository))

        // Then
        assertThat(serviceRepositoryService.existsById(repository.getId())).isTrue();
        ServiceRepository saved = serviceRepositoryService.findById(repository.getId()).get();
        assertThat(saved.getUrl()).isEqualTo("https://github.com/example/service.git");
    }

    @Test
    @DisplayName("添加本地仓库 - 成功")
    void testAddLocalRepository_Success() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        ServiceRepository repository = new ServiceRepository();
        repository.setPath("/Users/username/service");
        repository.setType("local");
        repository.setIsPrimary(true);
        repository.setService(service);

        // When
        when(serviceRepositoryService.create(repository))

        // Then
        assertThat(serviceRepositoryService.existsById(repository.getId())).isTrue();
    }

    @Test
    @DisplayName("设置主仓库")
    void testSetPrimaryRepository() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        ServiceRepository repo1 = serviceRepositoryService.create(new ServiceRepository(service, "git://git1.com"));
        ServiceRepository repo2 = serviceRepositoryService.create(new ServiceRepository(service, "git://git2.com"));

        // When
        when(serviceRepositoryService.setPrimary(service.getId(), repo1.getId()))

        // Then
        assertThat(serviceRepositoryService.findById(repo1.getId()).get().isPrimary()).isTrue();
        assertThat(serviceRepositoryService.findById(repo2.getId()).get().isPrimary()).isFalse();
    }

    @Test
    @DisplayName("删除仓库")
    void testDeleteRepository() {
        // Given
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        ServiceRepository repository = serviceRepositoryService.create(new ServiceRepository(service, "git://git1.com"));
        Long repoId = repository.getId();

        // When
        when(serviceRepositoryService.delete(repoId))

        // Then
        assertThat(serviceRepositoryService.existsById(repoId)).isFalse();
    }
}
```

#### 8.5.2 仓库API测试

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceRepositoryController.class)
class ServiceRepositoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("获取所有仓库 - 成功")
    void testGetAllRepositories_Success() {
        // Given
        Service service = createTestService("repo-service", "1.0.0", "published");
        ServiceRepository repo1 = serviceRepositoryService.create(new ServiceRepository(service, "https://git1.com"));
        ServiceRepository repo2 = serviceRepositoryService.create(new ServiceRepository(service, "https://git2.com"));

        // When
        when(serviceRepositoryController.getAllRepositories())

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<RepositoryResponse> results = responseEntity.getBody();
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getUrl()).isEqualTo("https://git1.com");
        assertThat(results.get(1).getUrl()).isEqualTo("https://git2.com");
    }

    @Test
    @DisplayName("获取仓库 - 按服务ID")
    void testGetRepositoriesByService_Success() {
        // Given
        Service service = createTestService("repo-service", "1.0.0", "published");
        ServiceRepository repo = serviceRepositoryService.create(new ServiceRepository(service, "https://git1.com"));
        Long serviceId = service.getId();

        // When
        when(serviceRepositoryController.getRepositoriesByService(serviceId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<RepositoryResponse> results = responseEntity.getBody();
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getServiceId()).isEqualTo(serviceId);
    }

    @Test
    @DisplayName("添加仓库 - 服务不存在")
    void testAddRepository_ServiceNotFound() {
        // Given
        Long nonExistentServiceId = 99999L;
        RepositoryRequest request = new RepositoryRequest();
        request.setServiceId(nonExistentServiceId);

        // When
        when(serviceRepositoryController.createRepository(request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("更新仓库 - 成功")
    void testUpdateRepository_Success() {
        // Given
        Service service = createTestService("repo-service", "1.0.0", "published");
        ServiceRepository repo = serviceRepositoryService.create(new ServiceRepository(service, "https://git1.com"));
        Long repoId = repository.getId();

        RepositoryRequest request = new RepositoryRequest();
        request.setServiceId(repoId);
        request.setBranch("develop"); // 切换分支
        request.setIsPrimary(false);

        // When
        when(serviceRepositoryController.updateRepository(repoId, request))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        RepositoryResponse result = responseEntity.getBody();
        assertThat(result.getBranch()).isEqualTo("develop");
    }

    @Test
    @DisplayName("删除仓库 - 成功")
    void testDeleteRepository_Success() {
        // Given
        Service service = createTestService("repo-service", "1.0.0", "published");
        ServiceRepository repo = serviceRepositoryService.create(new ServiceRepository(service, "https://git1.com"));
        Long repoId = repository.getId();

        // When
        when(serviceRepositoryController.deleteRepository(repoId))

        // Then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}
```

---

### 8.6 前端组件测试用例

#### 8.6.1 服务知识窗口组件测试

```gherkin
@ExtendWith(ReactExtensionContext.class)
class ServiceKnowledgeWindowTest {

    @Test
    @DisplayName("渲染服务知识窗口")
    void testRenderServiceKnowledgeWindow() {
        // Given
        render(<ServiceKnowledgeWindow />)

        // Then
        expect(screen.getByText('Service Knowledge Management')).toBeInTheDocument();
    }

    @Test
    @DisplayName("服务列表表格显示")
    void testServiceListTable() {
        // Given
        // Mock服务列表数据
        const mockServices = [
            { id: 1, serviceName: 'test-service', version: '1.0.0', status: 'published', knowledge: {} },
            { id: 2, serviceName: 'service-2', version: '2.0.0', status: 'draft', knowledge: {} }
        ];

        // Mock API响应
        jest.spyOn(serviceKnowledgeAPI, 'getAll').mockResolvedValue({
            data: mockServices
        });

        // When
        render(<ServiceKnowledgeWindow />);
        await waitFor(() => screen.getByText('service-2'));

        // Then
        expect(screen.getByText('service-2')).toBeInTheDocument();
        expect(screen.getByText('service-1')).toBeInTheDocument();
    }

    @Test
    @DisplayName("服务列表加载状态")
    void testServiceListLoading() {
        // Given
        jest.spyOn(serviceKnowledgeAPI, 'getAll').mockImplementation(() => {
            return new Promise(resolve => setTimeout(() => resolve({ data: [] }), 1000);
        });

        // When
        render(<ServiceKnowledgeWindow />);

        // Then
        expect(screen.getByTestId(/loading/i)).toBeInTheDocument();
    }

    @Test
    @DisplayName("创建服务弹窗")
    void testCreateServiceModal() {
        // Given
        render(<ServiceKnowledgeWindow />);
        const addButton = screen.getByRole('button', { name: /add service/i });

        // When
        fireEvent.click(addButton);
        await waitFor(() => screen.findByRole('dialog', { name: /add service/i }).isVisible());

        // Then
        expect(screen.getByRole('textbox', { name: /service name/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    }
}
```

#### 8.6.2 Tab菜单组件测试

```gherkin
@ExtendWith(ReactExtensionContext.class)
class ServiceTabsTest {

    @Test
    @DisplayName("Tab切换 - 服务列表到API列表")
    void testSwitchToAPITab() {
        // Given
        const serviceListTab = screen.getByRole('tab', { name: /service list/i });
        const apiListTab = screen.getByRole('tab', { name: /api list/i });

        // When
        fireEvent.click(apiListTab);
        await waitFor(() => screen.getByRole('tab', { name: /api list/i, selected: true }));

        // Then
        expect(apiListTab.getAttribute('aria-selected')).toBe('true');
        expect(serviceListTab.getAttribute('aria-selected')).toBe('false');
    }
}
```

#### 8.6.3 仓库管理弹窗测试

```gherkin
@ExtendWith(ReactExtensionContext.class)
class RepositoryManageModalTest {

    @Test
    @DisplayName("添加仓库弹窗")
    void testAddRepositoryModal() {
        // Given
        render(<ServiceKnowledgeWindow />);
        // 模拟打开仓库管理
        const manageButton = screen.getByText(/manage repositories/i);
        fireEvent.click(manageButton);

        // When
        await waitFor(() => screen.findByRole('dialog', { name: /repository manage/i }).isVisible());

        // Then
        expect(screen.getByText(/repository url/i)).toBeInTheDocument();
    }
}
```

#### 8.6.4 知识分析结果展示测试

```gherkin
@ExtendWith(ReactExtensionContext.class)
class KnowledgeAnalysisResultTest {

    @Test
    @DisplayName("展示知识分析结果")
    void testDisplayAnalysisResults() {
        // Given
        const mockAnalysisResult = {
            serviceName: 'test-service',
            knowledgeType: 'api',
            content: {
                'api_endpoints': [
                    Map.of('path', '/api/users', 'method', 'GET', 'description', '用户列表API')
                ]
            },
            confidence: 85,
            extractedAt: '2026-03-14T10:00:00Z'
        };

        jest.spyOn(serviceKnowledgeAnalysisService, 'getAnalysisResult')
            .mockResolvedValue(mockAnalysisResult);

        // When
        render(<ServiceKnowledgeWindow />);

        // Then
        expect(screen.getByText('api_endpoints')).toBeInTheDocument();
        expect(screen.getByText('用户列表API')).toBeInTheDocument();
    }

    @Test
    @DisplayName("批量选择服务")
    void testBatchSelectServices() {
        // Given
        render(<ServiceKnowledgeWindow />);
        const checkboxes = screen.getAllByRole('checkbox', { name: /select service/i });

        // When
        fireEvent.click(checkboxes[0]); // 选中第一个
        fireEvent.click(checkboxes[1]); // 选中第二个
        fireEvent.click(checkboxes[2]); // 选中第三个

        // Then
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).toBeChecked();
    }
}
```

---

### 8.7 集成测试场景

#### 8.7.1 E2E测试场景

**场景1：完整的代码分析流程**

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceKnowledgeAnalysisController.class)
@SpringBootTest
@AutoConfigureMockMvc(ServiceRepositoryController.class)
@SpringBootTest
@AutoConfigureMockMvc(ServiceKnowledgeController.class)
@AutoConfigureMockMvc(ServiceRepositoryController.class)
class EndToEndCodeAnalysisE2ETest {

    @Autowired
    private ServiceKnowledgeAnalysisController analysisController;
    @Autowired
    private ServiceRepositoryController repositoryController;
    @Autowired
    private ServiceKnowledgeRepositoryService serviceKnowledgeRepositoryService;

    @Test
    @DisplayName("E2E: 代码分析 - 完整流程")
    void testCompleteCodeAnalysisFlow() {
        // Given - 准备测试数据
        Service service = createTestService("code-analysis-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // 1. 创建分析任务
        AnalysisRequest request = new AnalysisRequest();
        request.setServiceIds(Arrays.asList(serviceId));
        ResponseEntity<Void> response1 = analysisController.analyze(request);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        ServiceKnowledgeAnalysis analysis = serviceKnowledgeRepositoryService
                .findByServiceId(serviceId);
        Long analysisId = analysis.getId();

        // 2. 模拟代码下载
        serviceKnowledgeRepositoryService.downloadCode(analysisId);
        analysis.setCodeDownloadedAt(Instant.now().toString());

        // 3. 模拟代码扫描（简化）
        Map<String, Object> apiEndpoints = new HashMap<>();
        apiEndpoints.put("scan_code_completed", true);
        apiEndpoints.put("extract_apis_completed", true);
        serviceKnowledgeRepositoryService.saveServiceKnowledge(
                new ServiceKnowledge(serviceId, analysis, apiEndpoints)
        );

        // 4. 模拟依赖分析
        Map<String, Object> dependencies = new HashMap<>();
        dependencies.put("internal_dependencies", Arrays.asList(
            Map.of("serviceName", "internal-service", "direction", "depends_on")
        ));
        analysis.setDependencies(dependencies);

        // 5. 模拟配置提取
        Map<String, Object> configs = new HashMap<>();
        configs.put("database", Map.of("port", "5432"));
        analysis.setConfigs(configs);

        // 6. 完成分析
        analysis.setStatus("completed");
        serviceKnowledgeRepositoryService.save(analysis);

        // When - 查询最终结果
        when(serviceKnowledgeAnalysisService.getAnalysisResult(serviceId))

        // Then
        assertThat(serviceKnowledgeAnalysisService.existsById(analysisId)).isTrue();
        ServiceKnowledgeAnalysis final = serviceKnowledgeAnalysisService.findById(analysisId).get();
        assertThat(final.getStatus()).isEqualTo("completed");

        // 验证所有步骤完成
        final.getSteps().forEach(step -> {
            assertThat(step.getStatus()).isEqualTo("completed");
        });

        // 验证知识内容
        assertThat(final.getKnowledge()).isNotNull();
        assertThat(final.getKnowledge()).isNotEmpty();
    }

    @Test
    @DisplayName("E2E: 代码分析 - 任务失败")
    void testCompleteCodeAnalysisFlow_TaskFailure() {
        // Given
        Service service = createTestService("code-analysis-service", "1.0.0", "published");
        Long serviceId = service.getId();

        // 1. 创建分析任务
        AnalysisRequest request = new AnalysisRequest();
        request.setServiceIds(Arrays.asList(serviceId));
        ResponseEntity<Void> response1 = analysisController.analyze(request);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        ServiceKnowledgeAnalysis analysis = serviceKnowledgeRepositoryService
                .findByServiceId(serviceId);

        // 2. 代码下载失败
        serviceKnowledgeRepositoryService.setCodeDownloadError(
                analysisId, "Connection timeout"
        );

        // When - 查询结果
        when(serviceKnowledgeAnalysisService.getAnalysisResult(serviceId))

        // Then
        assertThat(serviceKnowledgeAnalysisService.existsById(analysisId)).isTrue();
        ServiceKnowledgeAnalysis final = serviceKnowledgeAnalysisService.findById(analysisId).get();
        assertThat(final.getStatus()).isEqualTo("failed");
        assertThat(final.getSteps().get(0).getStatus()).isEqualTo("failed");
    }
}
```

---

## 九、TDD实施流程

### 9.1 TDD循环

```
┌───────────────────────────────────────────┐
│  1. 红灯测试             │
├───────────────────────────────────────────┤
│  2. 编写失败测试          │ ← 补足测试条件
├───────────────────────────────────────────┤
│   3. 编写最小代码        │ ← 使测试通过
├───────────────────────────────────────────┤
│  4. 重构/优化          │
├───────────────────────────────────────────┤
│  5.  运行测试验证         │
└───────────────────────────────────────────┘
         ↓
         绿灯测试
         编写失败测试
         编写最小代码
         重构/优化
         运行测试验证
```

### 9.2 实施示例

**示例：添加Git仓库功能**

```gherkin
@SpringBootTest
@AutoConfigureMockMvc(ServiceRepositoryController.class)
class AddGitRepositoryTest {

    @Autowired
    private ServiceRepositoryService serviceRepositoryService;
    private MockMvc mockMvc;

    @Test
    @DisplayName("TDD: 添加Git仓库 - 完整流程")
    void testAddGitRepository_FullCycle() {
        // ========== 红灯测试 ==========

        // Given - 测试数据准备
        Service service = serviceRepository.findByServiceNameAndVersion("test-service", "1.0.0");
        Long serviceId = service.getId();

        // 1. 红灯测试：POST /api/service-repositories 应该返回 201 CREATED
        when(repositoryService.create(new RepositoryRequest()))
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // 2. 红灯测试：仓库应该被关联到服务
        when(serviceRepositoryService.findById(serviceId))
        Service saved = serviceRepositoryService.findById(serviceId).get();
        assertThat(saved.getService()).isEqualTo(service);
        assertThat(saved.getRepositories()).hasSize(1);

        // ========== 编写失败测试 ==========

        // When - 尝试添加重复仓库（相同URL）
        when(repositoryService.create(new RepositoryRequest()))

        // Then - 应该返回 409 CONFLICT
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(responseEntity.getBody()).containsString("repository already exists"));

        // ========== 编写最小代码 ==========
        // 已在上面实现，直接使用

        // ========== 运行测试验证 ==========
        // 验证创建成功
        List<RepositoryResponse> repositories = repositoryService.getAllRepositoriesByService(serviceId);
        assertThat(repositories).hasSize(1);
        assertThat(repositories.get(0).getUrl()).isEqualTo("https://github.com/example/service.git");
    }
}
```

---

## 十、测试覆盖目标

### 10.1 覆盖率目标

| 模块 | 功能 | 测试用例数 | 覆盖率目标 |
|------|------|----------|-----------|
| 服务列表 | CRUD | 15 | 70% |
| 服务仓库 | CRUD | 12 | 70% |
| API列表 | 查看/筛选 | 8 | 80% |
| 服务知识 | 分析/知识管理 | 20 | 70% |
| 仓库管理 | 弹窗交互 | 10 | 70% |
| 前端组件 | 渲染/交互 | 15 | 70% |

**总体目标**: 核心功能70%+ 覆盖率

---

## 十一、验收标准

### 11.1 功能验收

- [ ] 所有测试用例通过
- [ ] 功能符合需求描述
- [ ] UI交互流畅

### 11.2 性能验收

- [ ] 页面加载时间 < 2秒
- [ ] API响应时间 < 500ms
- [ ] 大量数据场景（100+条）不卡顿

### 11.3 代码质量验收

- [ ] 代码符合规范（SonarQube, SpotBugs）
- [ ] 单元测试覆盖率 ≥ 70%
- [ ] 无明显的代码坏味道

---

## 十二、待补充内容

### 12.1 集成测试用例

- [ ] 完整用户流程E2E测试
- [ ] 多窗口协作测试
- [ ] WebSocket通知测试

### 12.2 边界情况测试

- [ ] 网络异常处理测试
- [ ] 超时处理测试
- [ ] 大数据分页性能测试
- [ ] 并发操作测试

### 12.3 依赖关系图测试

- [ ] 复杂依赖循环检测
- [ ] 图形数据验证

---

**状态**: ✅ 测试用例章节补充完成

**下一步**: 等待用户确认后开始阶段1（基础组件）TDD实施
