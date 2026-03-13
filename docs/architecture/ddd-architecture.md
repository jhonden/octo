# Octo - DDD 架构设计文档

> **产品名**：Octo - 服务知识，触手可及
> **文档类型**：DDD 架构设计
> **创建日期**：2026-03-14
> **版本**：1.0.0

---

## 1. 架构概览

### 1.1 设计原则

Octo 采用**轻量级领域驱动设计（DDD）**，核心原则：

1. **清晰的限界上下文**：按业务领域划分代码边界
2. **高内聚低耦合**：每个上下文内部紧密协作，外部通过明确接口通信
3. **关注业务逻辑**：Service 层封装领域逻辑，Repository 层专注数据访问
4. **适度设计**：避免过度设计，保持简洁实用

### 1.2 不采用的重型 DDD 元素

以下元素**不采用**，以保持轻量级：

- ❌ 值对象：使用基本类型（String、Long 等）
- ❌ 领域方法：业务逻辑放在 Service 层
- ❌ 领域规范：验证逻辑放在 Service 层
- ❌ DTO 转换器：直接使用实体或简单包装
- ❌ 聚合根：通过事务管理一致性
- ❌ 领域事件：使用同步调用

---

## 2. 限界上下文划分

### 2.1 上下文列表

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
│   ├── 技术栈：Spring Data JPA + Java NIO
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
    ├── 技术栈：Spring MVC
    └── 暴露方式：MCP 端点
```

### 2.2 上下文职责

| 上下文 | 核心领域 | 能力 | 外部依赖 |
|--------|---------|------|----------|
| Service Knowledge | 服务知识的增删改查 | CRUD、发布、检索、搜索 | PostgreSQL |
| Design Space | 设计空间的管理 | 创建、订阅、文件操作、Git | PostgreSQL、文件系统、Git |
| Skill Management | 技能的配置和管理 | 安装、卸载、配置 | PostgreSQL |
| MCP Integration | MCP 协议实现 | 工具注册、请求分发、响应 | 以上所有上下文 |

### 2.3 上下文交互

**同步调用**（MVP）：
- Design Space 订阅 Service Knowledge（通过 ID 引用）
- MCP Integration 调用各上下文的 Service 查询方法

**异步事件**（未来扩展）：
- Service Knowledge 发布事件 → Design Space 订阅更新
- Design Space 创建事件 → Skill Management 自动配置

---

## 3. 分层架构

### 3.1 通用分层结构

每个限界上下文遵循以下分层：

```
{context-name}/
├── domain/                  # 领域层
│   ├── entity/             # 实体（包含基本验证）
│   ├── repository/         # 仓储接口（领域层）
│   └── service/           # 领域服务（复杂领域逻辑）
├── application/             # 应用层
│   ├── service/           # 应用服务（用例编排）
│   ├── controller/        # REST 控制器
│   └── dto/             # 数据传输对象
├── infrastructure/         # 基础设施层
│   ├── persistence/       # JPA Repository 实现
│   └── mcp/              # MCP 工具适配器
└── model/                 # JPA 实体（持久化用）
```

### 3.2 层级职责

| 层级 | 职责 | 调用方向 |
|------|------|----------|
| **Controller** | 处理 HTTP/MCP 请求、参数验证、返回响应 | → Application Service |
| **Application Service** | 用例编排、DTO 转换、事务管理 | ← Controller, → Domain Service, → Repository |
| **Domain Service** | 封装复杂领域逻辑 | ← Application Service |
| **Repository Interface** | 数据访问抽象（领域层） | ← Domain Service |
| **Repository Impl** | JPA 持久化实现 | ← Application Service |
| **Entity** | 领域实体、包含基本验证 | ← Repository Impl |
| **DTO** | 对外接口的数据结构 | ← Application Service |

---

## 4. 领域模型设计示例

### 4.1 Service Knowledge Context

#### 实体设计

```java
@Entity
@Table(name = "service_knowledge")
public class ServiceKnowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String serviceName;

    @Column(length = 50)
    private String version;

    @Column(length = 20)
    private String status;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", nullable = false)
    private String knowledge;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 基本验证
    @PrePersist
    @PreUpdate
    protected void onCreateOrUpdate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();

        // 业务验证
        if (serviceName == null || serviceName.isEmpty()) {
            throw new IllegalArgumentException("Service name cannot be empty");
        }
        if (serviceName.length() > 255) {
            throw new IllegalArgumentException("Service name too long");
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getKnowledge() { return knowledge; }
    public void setKnowledge(String knowledge) { this.knowledge = knowledge; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
```

#### 仓储接口

```java
package com.skm.service_knowledge.domain.repository;

import com.skm.service_knowledge.domain.entity.ServiceKnowledge;
import java.util.List;
import java.util.Optional;

public interface ServiceKnowledgeRepository {
    ServiceKnowledge save(ServiceKnowledge serviceKnowledge);
    Optional<ServiceKnowledge> findById(Long id);
    Optional<ServiceKnowledge> findByServiceName(String serviceName);
    List<ServiceKnowledge> findAll();
    List<ServiceKnowledge> findByStatus(String status);
    List<ServiceKnowledge> search(String name, String status);
    void deleteById(Long id);
    boolean existsByServiceName(String serviceName);
}
```

#### JPA 实现

```java
package com.skm.service_knowledge.infrastructure.persistence;

import com.skm.service_knowledge.domain.entity.ServiceKnowledge;
import com.skm.service_knowledge.domain.repository.ServiceKnowledgeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaServiceKnowledgeRepository extends JpaRepository<ServiceKnowledge, Long>, ServiceKnowledgeRepository {

    // 自定义查询方法
    Optional<ServiceKnowledge> findByServiceName(String serviceName);

    @Query("SELECT sk FROM ServiceKnowledge sk WHERE (:name IS NULL OR sk.serviceName ILIKE %:name%) AND (:status IS NULL OR sk.status = :status)")
    List<ServiceKnowledge> searchServices(@Param("name") String name, @Param("status") String status);
}
```

#### 应用服务

```java
package com.skm.service_knowledge.application.service;

import com.skm.service_knowledge.domain.entity.ServiceKnowledge;
import com.skm.service_knowledge.domain.repository.ServiceKnowledgeRepository;
import com.skm.service_knowledge.application.dto.ServiceKnowledgeDTO;
import com.skm.shared.domain.exception.ServiceNameAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceKnowledgeApplicationService {

    private final ServiceKnowledgeRepository repository;

    @Autowired
    public ServiceKnowledgeApplicationService(ServiceKnowledgeRepository repository) {
        this.repository = repository;
    }

    public ServiceKnowledgeDTO create(CreateServiceKnowledgeCommand command) {
        // 业务规则验证
        if (repository.existsByServiceName(command.serviceName())) {
            throw new ServiceNameAlreadyExistsException(command.serviceName());
        }

        // 创建实体
        ServiceKnowledge sk = new ServiceKnowledge();
        sk.setServiceName(command.serviceName());
        sk.setVersion(command.version());
        sk.setStatus(command.status() != null ? command.status() : "draft");
        sk.setKnowledge(command.knowledge());

        // 持久化
        ServiceKnowledge saved = repository.save(sk);

        // 转换为 DTO
        return toDTO(saved);
    }

    public ServiceKnowledgeDTO publish(Long id) {
        ServiceKnowledge sk = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service knowledge", id));

        sk.setStatus("published");
        ServiceKnowledge saved = repository.save(sk);

        return toDTO(saved);
    }

    public List<ServiceKnowledgeDTO> getAll() {
        return repository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public List<ServiceKnowledgeDTO> search(String name, String status) {
        return repository.search(name, status).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ServiceKnowledgeDTO toDTO(ServiceKnowledge entity) {
        ServiceKnowledgeDTO dto = new ServiceKnowledgeDTO();
        dto.setId(entity.getId());
        dto.setServiceName(entity.getServiceName());
        dto.setVersion(entity.getVersion());
        dto.setStatus(entity.getStatus());
        dto.setKnowledge(entity.getKnowledge());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
```

---

### 4.2 Design Space Context

#### 实体设计

```java
@Entity
@Table(name = "design_space")
public class DesignSpace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(nullable = false)
    private String owner;

    @Column(nullable = false, length = 512)
    private String workspacePath;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private String gitConfig;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onCreateOrUpdate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();

        // 业务验证
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Design space name cannot be empty");
        }
        if (name.length() > 128) {
            throw new IllegalArgumentException("Design space name too long");
        }
    }
}
```

---

## 5. DTO 设计

### 5.1 DTO 原则

- DTO 用于跨层传输数据
- DTO 不包含业务逻辑
- DTO 可以使用注解验证（`@NotNull`, `@Size`, `@Pattern`）
- 转换逻辑放在 Application Service

### 5.2 DTO 示例

```java
package com.skm.service_knowledge.application.dto;

public class ServiceKnowledgeDTO {
    private Long id;
    private String serviceName;
    private String version;
    private String status;
    private Object knowledge;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Object getKnowledge() { return knowledge; }
    public void setKnowledge(Object knowledge) { this.knowledge = knowledge; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

```java
package com.skm.service_knowledge.application.dto;

public class CreateServiceKnowledgeCommand {
    @NotNull(message = "Service name is required")
    @Size(max = 255, message = "Service name must not exceed 255 characters")
    private String serviceName;

    private String version;
    private String status;
    private Object knowledge;

    // Getters and Setters
    public String serviceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Object getKnowledge() { return knowledge; }
    public void setKnowledge(Object knowledge) { this.knowledge = knowledge; }
}
```

---

## 6. 异常处理

### 6.1 异常层次

```
shared/domain/exception/
├── BusinessException.java          # 基础业务异常
├── ResourceNotFoundException.java    # 资源未找到异常
├── ServiceNameAlreadyExistsException.java  # 服务名称已存在异常
└── InvalidDesignSpaceNameException.java  # 设计空间名称无效异常
```

### 6.2 异常使用

```java
// 抛出业务异常
throw new ServiceNameAlreadyExistsException("user-service");

// Controller 层统一处理
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ServiceNameAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleServiceNameExists(ServiceNameAlreadyExistsException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

---

## 7. 事务管理

### 7.1 事务策略

| 操作类型 | 事务策略 | 说明 |
|---------|----------|------|
| 查询操作 | `@Transactional(readOnly = true)` | 事务只读，提高性能 |
| 写入操作 | `@Transactional` | 标准事务 |
| Service 层 | `@Transactional` | 事务边界在 Service 层 |
| Controller 层 | 无事务 | Controller 调用 Service，事务由 Service 管理 |

### 7.2 事务边界

**Service Knowledge Context**：
- 每个应用服务方法是一个事务
- 避免跨上下文的事务

**Design Space Context**：
- 文件系统操作无事务
- 数据库操作有事务
- 文件和数据库操作分离

---

## 8. 数据访问层

### 8.1 Repository 接口设计

```java
// 领域层接口
public interface ServiceKnowledgeRepository {
    ServiceKnowledge save(ServiceKnowledge sk);
    Optional<ServiceKnowledge> findById(Long id);
    List<ServiceKnowledge> findAll();
    void deleteById(Long id);
    boolean existsByServiceName(String serviceName);
}
```

### 8.2 JPA 实现设计

```java
// 基础设施层实现
@Repository
public interface JpaServiceKnowledgeRepository extends JpaRepository<ServiceKnowledge, Long>, ServiceKnowledgeRepository {
    // Spring Data JPA 自动实现基本 CRUD
    // 可以添加自定义查询方法
}
```

### 8.3 PostgreSQL JSONB 支持

```java
// 实体中 JSONB 字段定义
@Entity
@Table(name = "service_knowledge")
public class ServiceKnowledge {

    // JSONB 字段存储知识内容
    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", nullable = false)
    private String knowledge;

    // Service 层读取 JSONB
    @Service
public class ServiceKnowledgeApplicationService {

    public String getKnowledgeAsJson(Long id) {
        ServiceKnowledge sk = repository.findById(id).orElseThrow();
        return sk.getKnowledge();
    }

    public Map<String, Object> getKnowledgeAsMap(Long id) {
        ServiceKnowledge sk = repository.findById(id).orElseThrow();
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(sk.getKnowledge(), Map.class);
        } catch (Exception e) {
            throw new BusinessException("Failed to parse knowledge JSON", e);
        }
    }
}
```

---

## 9. MCP 集成

### 9.1 MCP 架构

```
mcp-integration/
├── application/
│   ├── McpServerController.java        # REST 控制器
│   ├── McpRequest.java                 # JSON-RPC 请求
│   ├── McpResponse.java                # JSON-RPC 响应
│   └── ToolDefinition.java             # 工具定义
├── infrastructure/
│   ├── ServiceKnowledgeMcpAdapter.java  # 服务知识 MCP 适配器
│   ├── DesignSpaceMcpAdapter.java       # 设计空间 MCP 适配器
│   └── SkillMcpAdapter.java           # 技能管理 MCP 适配器
└── dto/
    ├── McpToolRequest.java
    └── McpToolResponse.java
```

### 9.2 MCP 工具定义

```java
public record ToolDefinition(
    String name,
    String description,
    Map<String, Object> inputSchema
) {
    public static ToolDefinition getServiceKnowledge() {
        return new ToolDefinition(
            "get_service_knowledge",
            "Get knowledge for a specific service by service name",
            Map.of(
                "type", "object",
                "properties", Map.of(
                    "serviceName", Map.of(
                        "type", "string",
                        "description", "Name of service"
                    )
                ),
                "required", List.of("serviceName")
            )
        )
    );
    }
}
```

---

## 10. 依赖注入原则

### 10.1 依赖方向

```
Controller
    ↓ 依赖
Application Service
    ↓ 依赖
Domain Service / Repository Interface
    ↑ 实现
Repository Implementation
```

### 10.2 依赖倒置

- Controller 依赖 Application Service 接口（实现类）
- Application Service 依赖 Repository 接口（领域层）
- Repository Implementation 实现 Repository 接口

---

## 11. 包命名规范

| 包名 | 用途 | 示例 |
|------|------|------|
| `com.skm.{context}.domain` | 领域层 | `com.skm.service_knowledge.domain` |
| `com.skm.{context}.application` | 应用层 | `com.skm.service_knowledge.application` |
| `com.skm.{context}.infrastructure` | 基础设施层 | `com.skm.service_knowledge.infrastructure` |
| `com.skm.{context}.application.dto` | DTO | `com.skm.service_knowledge.application.dto` |
| `com.skm.shared.domain` | 共享领域概念 | `com.skm.shared.domain` |

---

**相关文档**:
- [设计文档](../specs/2026-03-13-service-knowledge-manager-design.md) - 完整系统设计
- [MVP 实现计划](../plans/2026-03-13-service-knowledge-manager-mvp.md) - 详细实现步骤
- [编码规范](../../standards/development-conventions.md) - 编码规范

---

**文档维护者**: Claude AI Assistant
**最后更新**: 2026-03-14
