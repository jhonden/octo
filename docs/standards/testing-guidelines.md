# 测试规范

本文档规定了 Octo 项目的测试开发规范，确保所有功能的测试用例设计和实现符合统一标准。

---

## 📋 目录

1. [测试目录组织](#测试目录组织)
2. [测试类型定义](#测试类型定义)
3. [测试用例设计规范](#测试用例设计规范)
4. [测试代码编写规范](#测试代码编写规范)
5. [测试执行规范](#测试执行规范)
6. [测试维护规范](#测试维护规范)
7. [测试覆盖度要求](#测试覆盖度要求)

---

## 测试目录组织

### 目录结构

```
backend/src/test/java/
├── com/
│   └── skm/
│       ├── entity/                # 实体类单元测试
│       ├── repository/            # Repository 集成测试
│       ├── service/               # Service 层单元测试
│       └── controller/            # Controller 集成测试
└── resources/                   # 测试配置和数据

frontend/
├── tests/
│   ├── unit/                    # 前端单元测试
│   │   └── components/
│   └── integration/              # 前端集成测试
│       └── api/
└── setup.js                    # 测试配置文件
```

### 放置原则

| 测试类型 | 放置位置 | 说明 |
|---------|----------|------|
| 单个类/方法测试 | `backend/src/test/java/com/skm/entity/` | 测试独立模块，不依赖外部系统 |
| Repository 测试 | `backend/src/test/java/com/skm/repository/` | 测试数据访问层，使用真实数据库 |
| Service 层测试 | `backend/src/test/java/com/skm/service/` | 测试业务逻辑，使用 Mock |
| Controller 测试 | `backend/src/test/java/com/skm/controller/` | 测试 API 接口，使用真实环境 |
| 前端组件测试 | `frontend/tests/unit/components/` | 测试 React 组件 |
| API 集成测试 | `frontend/tests/integration/api/` | 测试前后端交互 |

---

## 测试类型定义

### 单元测试 (Unit Test)

**定义**：测试最小的可测试单元（函数、方法、类）

**特点**：
- 测试范围小、执行快速（<1秒）
- 不依赖外部系统（数据库、文件系统、网络）
- 使用 Mock 隔离依赖
- 易于定位问题

**示例**：
```java
@Test
void testCreateServiceKnowledge() {
    // Arrange
    ServiceKnowledgeRequest request = new ServiceKnowledgeRequest();
    request.setServiceName("test-service");
    request.setVersion("1.0.0");

    // Act
    ServiceKnowledge result = service.create(request);

    // Assert
    assertNotNull(result.getId());
    assertEquals("test-service", result.getServiceName());
}
```

**放置位置**：`backend/src/test/java/com/skm/entity/`, `backend/src/test/java/com/skm/service/`

---

### 集成测试 (Integration Test)

**定义**：测试多个模块协同工作的功能流程

**特点**：
- 测试范围中等（1-10秒）
- 涉及真实数据库
- 验证系统集成正确性
- 验证 API 接口和数据库交互

**示例**：
```java
@SpringBootTest
@Transactional
class ServiceKnowledgeControllerIntegrationTest {

    @Autowired
    private ServiceKnowledgeController controller;

    @Test
    void testCreateAndGetServiceKnowledge() {
        // Arrange
        ServiceKnowledgeRequest request = new ServiceKnowledgeRequest();
        request.setServiceName("integration-test");
        request.setVersion("1.0.0");

        // Act
        ResponseEntity<?> createResponse = controller.create(request);

        // Assert
        assertEquals(HttpStatus.OK, createResponse.getStatusCode());

        // Get
        ResponseEntity<?> getResponse = controller.getByServiceName("integration-test");
        assertEquals(HttpStatus.OK, getResponse.getStatusCode());
    }
}
```

**放置位置**：`backend/src/test/java/com/skm/controller/`, `backend/src/test/java/com/skm/repository/`

---

### 端到端测试 (End-to-End Test)

**定义**：从用户角度测试完整的业务场景

**特点**：
- 测试范围大、执行较慢（>10秒）
- 模拟真实用户操作
- 验证系统满足业务需求
- 可能涉及浏览器交互（前端）

**示例**：
```java
@SpringBootTest
@AutoConfigureMockMvc
class CompleteWorkflowE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testCompleteServiceKnowledgeWorkflow() {
        // 1. 创建服务知识
        mockMvc.perform(post("/api/service-knowledge")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"serviceName\":\"e2e-service\",\"version\":\"1.0.0\"}"))
            .andExpect(status().isOk());

        // 2. 查询服务知识
        mockMvc.perform(get("/api/service-knowledge/e2e-service"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.serviceName").value("e2e-service"));

        // 3. 更新服务知识
        mockMvc.perform(put("/api/service-knowledge/{id}")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"version\":\"2.0.0\"}"))
            .andExpect(status().isOk());
    }
}
```

**放置位置**：`backend/src/test/java/com/skm/e2e/`

---

## 测试用例设计规范

### 测试用例结构

每个测试用例必须包含以下部分：

```java
@Test
void test_<功能描述>() throws Exception {
    // Arrange - 准备测试数据和环境
    // Act - 执行被测功能
    // Assert - 断言结果
}
```

### 命名规范

**类命名**：
- 格式：`{被测类名}Test`
- 示例：`ServiceKnowledgeTest`, `DesignSpaceServiceTest`

**方法命名**：
- 格式：`test_{具体功能}[_{场景}]`
- 示例：`testCreateServiceKnowledge`, `testCreateDuplicateService`
- 使用驼峰命名法

### 测试用例覆盖维度

设计测试用例时，必须覆盖以下维度：

#### 1. 正常场景 (Happy Path)
- 功能在正常输入下的预期行为
- 示例：标准的服务知识创建应该成功

#### 2. 边界条件 (Boundary Conditions)
- 输入的边界值
- 示例：128 字符的名称（刚好满足/刚好不满足）

#### 3. 异常场景 (Edge Cases)
- 异常输入和错误情况
- 示例：空名称、已存在的服务、无效数据格式

#### 4. 性能场景 (Performance)
- 大规模数据操作
- 示例：创建1000条服务知识记录

### 测试用例设计清单

设计测试用例时，回答以下问题：

- [ ] **正常场景**：功能在正常情况下是否工作？
- [ ] **边界条件**：边界值是否正确处理？
- [ ] **异常场景**：错误情况是否正确处理？
- [ ] **性能**：大规模数据是否正常处理？
- [ ] **可追溯**：需求/缺陷是否可追溯？

---

## 测试代码编写规范

### 类结构

每个测试类必须包含标准结构：

```java
@SpringBootTest
@Transactional
class ServiceKnowledgeServiceTest {

    @Autowired
    private ServiceKnowledgeService service;

    @Autowired
    private ServiceKnowledgeRepository repository;

    @BeforeEach
    void setUp() {
        // 每个测试前的初始化
    repository.deleteAll();
    // 创建基础测试数据
    service.create(createBasicRequest());
    }

    @AfterEach
    void tearDown() {
        // 每个测试后的清理
        repository.deleteAll();
    }

    @Test
    void testSomething() {
        // 测试代码
    }
}
```

### 断言规范

**使用 JUnit 断言，不要使用 if 判断：**

```java
// ✅ 正确
assertEquals("test-service", result.getServiceName());
assertNotNull(result.getId());
assertTrue(repository.existsByServiceName("test-service"));

// ❌ 错误
if (!"test-service".equals(result.getServiceName())) {
    fail("Service name mismatch");
}
```

**断言失败时提供清晰错误信息：**

```java
// ✅ 正确
assertEquals(
    2L,
    result.getId(),
    "Expected ID 2 for created service, got " + result.getId()
);

// ❌ 错误
assertEquals(2L, result.getId());
```

### Mock 使用规范

**Mock 用于隔离 Service 层的数据库依赖：**

```java
@SpringBootTest
class ServiceControllerTest {

    @MockBean
    private ServiceKnowledgeService service;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testCreateService() throws Exception {
        // 准备 Mock 返回值
        when(service.create(any()))
            .thenReturn(createMockService());

        // 执行测试
        mockMvc.perform(post("/api/service-knowledge")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"serviceName\":\"test-service\"}"))
            .andExpect(status().isOk());

        // 验证 Mock 被调用
        verify(service).create(any());
    }
}
```

### 事务管理

- **Repository 测试**：使用 `@Transactional` 自动回滚
- **Controller 测试**：使用 `@SpringBootTest` + `@Transactional`
- **Service 测试**：使用 `@MockBean`，不真实操作数据库

---

## 测试执行规范

### 运行单个测试

```bash
# 后端单元测试
cd backend
mvn test -Dtest=ServiceKnowledgeServiceTest

# 后端集成测试
mvn test -Dtest=ServiceKnowledgeControllerIntegrationTest

# 前端测试
cd frontend
npm test -- ComponentName.test.js
```

### 运行所有测试

```bash
# 后端所有测试
cd backend
mvn test

# 前端所有测试
cd frontend
npm test
```

### 测试结果验证

**必须满足以下标准才能提交：**
- [ ] 所有测试用例通过
- [ ] 无警告信息（除了预期的）
- [ ] 测试覆盖度达到要求
- [ ] 测试文档已更新

---

## 测试维护规范

### 文件维护

**保持测试文件与源码同步：**
- 源码重构时，同步更新测试
- 新增功能时，立即编写测试
- 删除功能时，移除对应测试

### 文档维护

**每次测试变更后更新文档：**

1. **更新测试总结**
   - 新增测试用例：更新测试结果统计
   - 修复 Bug：记录问题修复验证
   - 性能优化：记录性能测试结果

2. **更新测试覆盖度分析**
   - 定期分析测试覆盖度
   - 识别测试盲区
   - 提出改进建议

---

## 测试覆盖度要求

### 覆盖度目标

| 测试类型 | 目标覆盖度 | 说明 |
|---------|-----------|------|
| 单元测试 | 80%+ | 核心业务逻辑（Service 层） |
| 集成测试 | 70%+ | 主要功能流程（Controller 层） |
| 端到端测试 | 60%+ | 关键用户场景 |

### 覆盖度测量

**使用 JaCoCo 进行精确测量（Maven 集成）：**

```xml
<!-- backend/pom.xml -->
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.11</version>
  <executions>
    <execution>
      <goals>
        <goal>prepare-agent</goal>
      </goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>test</phase>
      <goals>
        <goal>report</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

```bash
# 运行测试并生成覆盖率报告
cd backend
mvn clean test jacoco:report

# 查看报告
open target/site/jacoco/index.html
```

### 覆盖度指标

**关键指标：**
- **行覆盖率** (Line Coverage)：执行的代码行比例
- **分支覆盖率** (Branch Coverage)：条件分支的覆盖比例
- **方法覆盖率** (Method Coverage)：被调用的方法比例

### 覆盖度审查

**每两周进行覆盖度审查：**

1. 生成覆盖率报告
2. 识别未覆盖的代码
3. 分析未覆盖原因：
   - 遗忘代码 → 补充测试
   - 废弃代码 → 清理代码
   - 难以测试 → 设计 Mock 方案

---

## 开发流程

### 功能开发测试流程

**标准流程（TDD 推荐）：**

```
1. 需求分析
   └─> 理解需求，明确验收标准

2. 测试设计
   └─> 设计测试用例（正常、边界、异常）

3. 测试实现（先）
   └─> 编写测试代码（运行失败）

4. 功能实现（后）
   └─> 编写功能代码（测试通过）

5. 测试验证
   └─> 运行所有测试
   └─> 确保无回归

6. 代码提交
   └─> 功能代码 + 测试代码 + 文档更新
```

### Bug 修复测试流程

```
1. Bug 定位
   └─> 定位问题代码

2. 复现测试
   └─> 编写测试复现 Bug

3. 修复验证
   └─> 修复代码
   └─> 测试通过

4. 回归测试
   └─> 运行相关测试
   └─> 确保无新问题

5. 提交修复
   └─> Bug 修复 + 复现测试 + 回归验证
```

---

## 最佳实践

### 1. 测试先行（TDD）
- 先写测试，再写功能
- 让测试驱动设计

### 2. 测试独立性
- 每个测试独立运行
- 不依赖测试执行顺序
- 使用 `@BeforeEach` 和 `@AfterEach` 管理测试状态

### 3. 测试可读性
- 测试即文档
- 使用清晰的命名和注释
- 测试方法名即描述

### 4. 测试快速
- 单元测试 <1 秒
- 集成测试 <10 秒
- 避免不必要的等待

### 5. 测试自动化
- 可一键运行所有测试
- Maven `mvn test` 统一执行
- 前端 `npm test` 统一执行

### 6. 测试真实性
- 使用真实数据结构
- 模拟真实使用场景
- 避免过度 Mock

---

## 附录：测试用例设计示例

### 功能：服务知识 CRUD

| 场景 | 输入 | 期望输出 | 测试类型 |
|------|------|----------|---------|
| 创建服务知识 | serviceName="test-service", version="1.0.0" | 创建成功，返回 ID | 正常 |
| 创建重复服务 | serviceName=已存在的名称 | 抛出异常 | 边界 |
| 创建空服务名 | serviceName="", version="1.0.0" | 验证失败 | 异常 |
| 查询存在的服务 | serviceName="test-service" | 返回服务信息 | 正常 |
| 查询不存在的服务 | serviceName="non-existent" | 抛出 404 | 异常 |

### 测试代码检查清单

提交前检查：

- [ ] 所有测试通过
- [ ] 无编译错误（mvn clean compile）
- [ ] 无硬编码路径
- [ ] 临时文件已清理
- [ ] 断言信息清晰
- [ ] 测试覆盖需求文档

---

**相关文档**:
- [编码规范](./development-conventions.md) - 编码规范
- [代码提交流程](./code-submission-workflow.md) - 代码验证和提交

---

**文档版本**: 1.0
**最后更新**: 2026-03-14
**维护者**: Claude AI Assistant
