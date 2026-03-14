# Octo - MVP 实现计划 v2.0

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可用的微服务知识管理系统 MVP，支持服务知识管理、设计空间管理、技能管理和基本的 MCP 工具暴露，使架构师能够分析服务、创建设计空间并通过 AI 工具协作完成方案设计。

**Architecture:** Spring Boot 3.x 后端提供 RESTful API 和 MCP Server，PostgreSQL 存储数据，React 18+ + Ant Design 前端实现"设计工作空间"Dock 导航风格的暗色主题 UI。系统采用轻量级 DDD 架构，按 4 个限界上下文划分：Service Knowledge、Design Space、Skill Management、MCP Integration。每个上下文内部采用分层：Controller 层处理 HTTP/MCP 请求，Application Service 层编排用例，Domain Service 层实现业务逻辑，Repository 层通过 Spring Data JPA 访问数据库。

**Tech Stack:**
- 后端: Spring Boot 3.x, Java 17+, PostgreSQL
- 前端: React 18+, Ant Design 5.x, React Router 6.x, Axios
- MCP: 基于 Spring MVC 实现 JSON-RPC 2.0
- 构建工具: Maven (backend), Vite (frontend)

---

## 实现顺序

### 第一阶段：服务知识管理
1. 后端基础框架搭建
2. 前端界面实现（Dock 导航 + 仪表盘）
3. 前后端功能集成

### 第二阶段：设计空间管理
1. 后端基础框架搭建
2. 前端界面实现（设计空间页面）
3. 前后端功能集成

### 第三阶段：技能管理
1. 后端基础框架搭建
2. 前端界面实现（技能管理页面）
3. 前后端功能集成

### 第四阶段：MCP 集成
1. 后端基础框架搭建
2. MCP Server 工具注册和暴露
3. 前端与 MCP 集成验证

---

## 开发方式

### TDD 驱动开发

**核心原则**：
- 每个功能开发流程：写测试 → 运行测试（失败）→ 编写最小实现 → 运行测试（通过）→ 重构优化
- 测试覆盖：单元测试 + 集成测试
- 测试命名：清晰描述行为
- 重构时机：测试通过后，立即重构优化代码

**TDD 工作流**：
```bash
# 1. 先编写失败的测试
# 2. 运行测试确认失败
# 3. 编写最小实现
# 4. 运行测试确认通过
# 5. 重构优化代码
# 6. 再次运行测试
# 7. 提交代码
```

### 测试技术栈
- 后端：JUnit 5 + Mockito
- 前端：Vitest + Testing Library

---

## Chunk 1: 后端项目初始化和基础设施

### Task 1: 初始化 Spring Boot 项目

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/java/com/skm/ServiceKnowledgeManagerApplication.java`
- Create: `backend/.gitignore`

- [ ] **Step 1: Write pom.xml with dependencies**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
    <relativePath/>
  </parent>

  <groupId>com.skm</groupId>
  <artifactId>service-knowledge-manager</artifactId>
  <version>1.0.0</version>
  <name>Service Knowledge Manager</name>

  <properties>
    <java.version>17</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

- [ ] **Step 2: Write application.yml configuration**

```yaml
spring:
  application:
    name: service-knowledge-manager

datasource:
    url: jdbc:postgresql://localhost:5432/skm_db
    username: skm_user
    password: skm_password
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
      show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

server:
    port: 8080

skm:
  约定目录-path: ${user.home}/skm-agreed-directory
  设计空间-base-path: ${user.home}/skm-design-spaces

logging:
  level:
    com.skm: DEBUG
    org.springframework.web: INFO
```

- [ ] **Step 3: Write main application class**

```java
package com.skm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServiceKnowledgeManagerApplication {
  public static void main(String[] args) {
    SpringApplication.run(ServiceKnowledgeManagerApplication.class, args);
  }
}
```

- [ ] **Step 4: Write .gitignore**

```
target/
!.mvn/wrapper/maven-wrapper.jar
*.log
.DS_Store
.idea/
*.iml
```

- [ ] **Step 5: Build and verify project structure**

Run: `cd backend && mvn clean compile`
Expected: BUILD SUCCESS

- [ ] **Step 6: Commit**

```bash
git add backend/
git commit -m "feat: initialize Spring Boot project with dependencies"
```

---

## Chunk 2: 后端数据层 - 服务知识管理

### Task 1: 创建数据库实体和 Repository

**Files:**
- Create: `backend/src/main/java/com/skm/service-knowledge/entity/ServiceKnowledge.java`
- Create: `backend/src/main/java/com/skm/service-knowledge/repository/ServiceKnowledgeRepository.java`
- Test: `backend/src/test/java/com/skm/service-knowledge/repository/ServiceKnowledgeRepositoryTest.java`

**TDD Approach:** 先写测试，再写实现

- [ ] **Step 1: Write failing test for repository**

```java
package com.skm.service.knowledge.repository;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Optional;

@SpringBootTest
@Transactional
class ServiceKnowledgeRepositoryTest {

  @Autowired
  private ServiceKnowledgeRepository repository;

  @Test
  void testSaveAndFindById() {
    // Given
    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName("test-service");
    sk.setVersion("1.0.0");
    sk.setStatus("draft");
    sk.setKnowledge("{\"test\":\"data\"}");

    // When
    ServiceKnowledge saved = repository.save(sk);

    // Then
    assertNotNull(saved.getId());
    assertTrue(repository.findById(saved.getId()).isPresent());
    assertEquals("test-service", repository.findById(saved.getId()).get().getServiceName());
  }

  @Test
  void testFindByServiceName() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("service-a");
    sk1.setVersion("1.0.0");
    sk1.setStatus("published");
    sk1.setKnowledge("{\"a\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("service-b");
    sk2.setVersion("1.0.0");
    sk2.setStatus("published");
    sk2.setKnowledge("{\"b\":\"data\"}");
    repository.save(sk2);

    // When
    List<ServiceKnowledge> result = repository.findByServiceName("service-");

    // Then
    assertEquals(2, result.size());
    assertTrue(result.stream().anyMatch(sk -> "service-a".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "service-b".equals(sk.getServiceName())));
  }

  @Test
  void testDelete() {
    // Given
    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName("to-delete");
    sk.setVersion("1.0.0");
    sk.setStatus("draft");
    sk.setKnowledge("{\"test\":\"data\"}");
    ServiceKnowledge saved = repository.save(sk);
    Long id = saved.getId();

    // When
    repository.deleteById(id);

    // Then
    assertTrue(repository.findById(id).isEmpty());
  }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && mvn test -Dtest=ServiceKnowledgeRepositoryTest`
Expected: FAIL with "repository bean not found" or similar

- [ ] **Step 3: Write entity class**

```java
package com.skm.service.knowledge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_knowledge")
public class ServiceKnowledge {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String serviceName;

  @Column
  private String version;

  @Column(length = 20)
  private String status = "draft";

  @Column(nullable = false, columnDefinition = "jsonb")
  private String knowledge;

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // Getters
  public Long getId() { return id; }
  public String getServiceName() { return serviceName; }
  public String getVersion() { return version; }
  public String getStatus() { return status; }
  public String getKnowledge() { return knowledge; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}
```

- [ ] **Step 4: Write repository interface**

```java
package com.skm.service.knowledge.repository;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceKnowledgeRepository extends JpaRepository<ServiceKnowledge, Long> {

  Optional<ServiceKnowledge> findByServiceName(String serviceName);

  @Query("SELECT sk FROM ServiceKnowledge sk WHERE " +
         "(:name IS NULL OR sk.serviceName ILIKE %:name%) AND " +
         "(:status IS NULL OR sk.status = :status)")
  List<ServiceKnowledge> search(@Param("name") String name, @Param("status") String status);

  List<ServiceKnowledge> findByStatus(String status);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd backend && mvn test -Dtest=ServiceKnowledgeRepositoryTest`
Expected: Tests pass

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/skm/service-knowledge/
git commit -m "feat: create ServiceKnowledge entity and repository with TDD"
```

---

## Chunk 3: 后端应用层 - 服务知识管理

### Task 1: 创建 Service 层和 Controller

**Files:**
- Create: `backend/src/main/java/com/skm/service-knowledge/service/ServiceKnowledgeService.java`
- Create: `backend/src/main/java/com/skm/service-knowledge/service/ServiceKnowledgeServiceTest.java`
- Create: `backend/src/main/java/com/skm/service-knowledge/controller/ServiceKnowledgeController.java`
- Create: `backend/src/main/java/com/skm/service-knowledge/dto/ServiceKnowledgeRequest.java`
- Create: `backend/src/main/java/com/skm/service-knowledge/dto/ServiceKnowledgeResponse.java`
- Create: `backend/src/main/java/com/skm/shared/exception/GlobalExceptionHandler.java`

**TDD Approach:** 先写测试，再写 Service 层实现

- [ ] **Step 1: Write ServiceKnowledgeServiceTest**

```java
package com.skm.service.knowledge.service;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class ServiceKnowledgeServiceTest {

  @Autowired
  private ServiceKnowledgeService service;

  @MockBean
  private ServiceKnowledgeRepository repository;

  @Test
  void testCreateService() {
    // Given
    when(repository.save(any())).thenAnswer(invocation -> {
      ServiceKnowledge mock = new ServiceKnowledge();
      mock.setId(1L);
      return mock;
    });

    // When
    Map<String, Object> data = Map.of(
      "serviceName", "test-service",
      "version", "1.0.0",
      "status", "published"
    );

    // Then
    ServiceKnowledge result = service.create(data);

    assertNotNull(result);
    assertEquals("test-service", result.getServiceName());
    assertEquals("1.0.0", result.getVersion());
    assertEquals("published", result.getStatus());
    verify(repository).save(any());
  }

  @Test
  void testGetById() {
    // Given
    ServiceKnowledge mock = new ServiceKnowledge();
    mock.setId(1L);
    mock.setServiceName("test-service");
    when(repository.findById(1L)).thenReturn(Optional.of(mock));

    // When
    ServiceKnowledge result = service.getById(1L);

    // Then
    assertNotNull(result);
    assertEquals("test-service", result.getServiceName());
    verify(repository).findById(1L);
  }

  @Test
  void testGetAll() {
    // Given
    when(repository.findAll()).thenReturn(List.of());

    // When
    List<ServiceKnowledge> result = service.getAll();

    // Then
    assertNotNull(result);
    verify(repository).findAll();
  }
}
```

- [ ] **Step 2: Write ServiceKnowledgeService**

```java
package com.skm.service.knowledge.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class ServiceKnowledgeService {

  private final ServiceKnowledgeRepository repository;
  private final ObjectMapper objectMapper;

  @Autowired
  public ServiceKnowledgeService(ServiceKnowledgeRepository repository, ObjectMapper objectMapper) {
    this.repository = repository;
    this.objectMapper = objectMapper;
  }

  public List<ServiceKnowledge> getAll() {
    return repository.findAll();
  }

  public ServiceKnowledge getById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Service knowledge not found"));
  }

  public ServiceKnowledge getByServiceName(String serviceName) {
    return repository.findByServiceName(serviceName)
        .orElseThrow(() -> new RuntimeException("Service not found: " + serviceName));
  }

  public List<ServiceKnowledge> search(String name, String status) {
    return repository.search(name, status);
  }

  @Transactional
  public ServiceKnowledge create(Map<String, Object> data) throws JsonProcessingException {
    String serviceName = (String) data.get("serviceName");
    if (serviceName == null || serviceName.isEmpty()) {
      throw new IllegalArgumentException("serviceName is required");
    }

    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName(serviceName);
    sk.setVersion((String) data.getOrDefault("version", null));
    sk.setStatus((String) data.getOrDefault("status", "draft"));
    sk.setKnowledge(objectMapper.writeValueAsString(data));

    return repository.save(sk);
  }

  @Transactional
  public ServiceKnowledge update(Long id, Map<String, Object> data) throws JsonProcessingException {
    ServiceKnowledge sk = getById(id);
    sk.setVersion((String) data.get("version"));
    sk.setStatus((String) data.get("status"));
    sk.setKnowledge(objectMapper.writeValueAsString(data));

    return repository.save(sk);
  }

  @Transactional
  public void delete(Long id) {
    if (!repository.existsById(id)) {
      throw new RuntimeException("Service knowledge not found");
    }
    repository.deleteById(id);
  }
}
```

- [ ] **Step 3: Run service tests**

Run: `cd backend && mvn test -Dtest=ServiceKnowledgeServiceTest`
Expected: Tests pass

- [ ] **Step 4: Write DTO classes**

```java
// ServiceKnowledgeRequest.java
package com.skm.service.knowledge.dto;

public class ServiceKnowledgeRequest {
  private String serviceName;
  private String version;
  private String status;
  private Object knowledge;

  // Getters and Setters
  public String getServiceName() { return serviceName; }
  public void setServiceName(String serviceName) { this.serviceName = serviceName; }
  public String getVersion() { return version; }
  public void setVersion(String version) { this.version = version; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public Object getKnowledge() { return knowledge; }
  public void setKnowledge(Object knowledge) { this.knowledge = knowledge; }
}
```

```java
// ServiceKnowledgeResponse.java
package com.skm.service.knowledge.dto;

import java.time.LocalDateTime;

public class ServiceKnowledgeResponse {
  private Long id;
  private String serviceName;
  private String version;
  private String status;
  private Object knowledge;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public ServiceKnowledgeResponse() {}

  public static ServiceKnowledgeResponse fromEntity(ServiceKnowledge entity,
                                               ObjectMapper mapper) {
    ServiceKnowledgeResponse response = new ServiceKnowledgeResponse();
    response.setId(entity.getId());
    response.setServiceName(entity.getServiceName());
    response.setVersion(entity.getVersion());
    response.setStatus(entity.getStatus());
    try {
      response.setKnowledge(mapper.readTree(entity.getKnowledge()));
    } catch (Exception e) {
      response.setKnowledge(entity.getKnowledge());
    }
    response.setCreatedAt(entity.getCreatedAt());
    response.setUpdatedAt(entity.getUpdatedAt());
    return response;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getServiceName() { return serviceName; }
  public void setServiceName(String serviceName) { this.serviceName = serviceName; }
  public String getVersion() { return version; }
  public void setVersion(String version) { this.version = version; }
  public String getStatus() { return status; }
  public Object getKnowledge() { return knowledge; }
  public void setKnowledge(Object knowledge) { this.knowledge = knowledge; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

- [ ] **Step 5: Write Controller**

```java
package com.skm.service.knowledge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.knowledge.dto.ServiceKnowledgeRequest;
import com.skm.service.knowledge.dto.ServiceKnowledgeResponse;
import com.skm.service.knowledge.service.ServiceKnowledgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/service-knowledge")
@CrossOrigin(origins = "*")
public class ServiceKnowledgeController {

  private final ServiceKnowledgeService service;
  private final ObjectMapper objectMapper;

  @Autowired
  public ServiceKnowledgeController(ServiceKnowledgeService service, ObjectMapper objectMapper) {
    this.service = service;
    this.objectMapper = objectMapper;
  }

  @GetMapping
  public List<ServiceKnowledgeResponse> getAll() {
    return service.getAll().stream()
        .map(sk -> ServiceKnowledgeResponse.fromEntity(sk, objectMapper))
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public ServiceKnowledgeResponse getById(@PathVariable Long id) {
    return ServiceKnowledgeResponse.fromEntity(service.getById(id), objectMapper);
  }

  @GetMapping("/service/{serviceName}")
  public ServiceKnowledgeResponse getByServiceName(@PathVariable String serviceName) {
    return ServiceKnowledgeResponse.fromEntity(
        service.getByServiceName(serviceName), objectMapper);
  }

  @GetMapping("/search")
  public List<ServiceKnowledgeResponse> search(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String status) {
    return service.search(name, status).stream()
        .map(sk -> ServiceKnowledgeResponse.fromEntity(sk, objectMapper))
        .collect(Collectors.toList());
  }

  @PostMapping
  public ServiceKnowledgeResponse create(@RequestBody ServiceKnowledgeRequest request) {
    Map<String, Object> data = new java.util.HashMap<>();
    data.put("serviceName", request.getServiceName());
    data.put("version", request.getVersion());
    data.put("status", request.getStatus());
    if (request.getKnowledge() != null) {
      data.put("knowledge", request.getKnowledge());
    }
    return ServiceKnowledgeResponse.fromEntity(service.create(data), objectMapper);
  }

  @PutMapping("/{id}")
  public ServiceKnowledgeResponse update(
      @PathVariable Long id,
      @RequestBody ServiceKnowledgeRequest request) {
    Map<String, Object> data = new java.util.HashMap<>();
    data.put("version", request.getVersion());
    data.put("status", request.getStatus());
    if (request.getKnowledge() != null) {
      data.put("knowledge", request.getKnowledge());
    }
    return ServiceKnowledgeResponse.fromEntity(service.update(id, data), objectMapper);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
```

- [ ] **Step 6: Write GlobalExceptionHandler**

```java
package com.skm.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
    Map<String, String> error = new HashMap<>();
    error.put("error", e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException e) {
    Map<String, String> error = new HashMap<>();
    error.put("error", e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }
}
```

- [ ] **Step 7: Run integration tests**

Run: `cd backend && mvn spring-boot:run`
In another terminal:
```bash
curl -X POST http://localhost:8080/api/service-knowledge \
  -H "Content-Type: application/json" \
  -d '{"serviceName":"test-service","version":"1.0.0","status":"draft"}'
```

Expected: JSON response with created service knowledge

- [ ] **Step 8: Commit**

```bash
git add backend/src/main/java/com/skm/service-knowledge/
git commit -m "feat: implement ServiceKnowledgeService and Controller REST API"
```

---

## Chunk 4: 前端项目初始化

### Task 1: 初始化 React 项目

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/.gitignore`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "octo-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "antd": "^5.12.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Write vite.config.js**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

- [ ] **Step 3: Write index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Octo - 设计工作空间</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 4: Write main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
```

- [ ] **Step 5: Write index.css (Dock Navigation Dark Theme)**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(180deg, #0c4a6e 0%, #1a1a2e 100%);
  color: #ffffff;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.02);
}

::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.12);
}

#root {
  min-height: 100vh;
}
```

- [ ] **Step 6: Write .gitignore**

```
node_modules/
dist/
.DS_Store
```

- [ ] **Step 7: Install dependencies and verify**

Run: `cd frontend && npm install`
Expected: Dependencies installed successfully

---

## Chunk 5: 前端基础组件 - Dock 导航

### Task 1: 创建 Dock 导航组件

**参考文档**：`docs/design/ui-design-spec-v2.md`

**Files:**
- Create: `frontend/src/components/Dock.jsx`
- Create: `frontend/src/components/Dock.css`

- [ ] **Step 1: Write Dock component with fan sub-menu**

```jsx
import React, { useState } from 'react';

import './Dock.css';

const Dock = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { key: 'dashboard', icon: '📊', label: '仪表盘' },
    { key: 'services', icon: '📚', label: '服务知识', hasSubmenu: true, submenu: [
      { key: 'list', icon: '📋', label: '服务列表' },
      { key: 'topology', icon: '🕸️', label: '服务拓扑' },
      { key: 'dependency', icon: '🔗', label: '依赖分析' },
    { key: 'search', icon: '🔍', label: '服务搜索' }
    ]},
    { key: 'spaces', icon: '💼', label: '设计空间' }
  ];

  return (
    <div className="dock">
      {menuItems.map(item => (
        <div
          key={item.key}
          className={`dock-item ${activeMenu === item.key ? 'active' : ''}`}
          onClick={() => setActiveMenu(item.key)}
        >
          <span className="dock-label">{item.label}</span>
          <span className="dock-icon">{item.icon}</span>
          {item.hasSubmenu && (
            <div className={`dock-fan-menu ${activeMenu === item.key ? 'visible' : ''}`}>
              {item.submenu.map((subItem, index) => (
                <div
                  key={subItem.key}
                  className="dock-fan-item"
                  style={{
                    // 扇形位置 - 待实现时精修
                    transform: `translate(${subItem.x}px, ${subItem.y}px)`
                  }}
                  onClick={() => console.log('Clicked:', subItem.key)}
                >
                  <span className="dock-fan-icon">{subItem.icon}</span>
                  <span className="dock-fan-label">{subItem.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dock;
```

- [ ] **Step 2: Write Dock.css**

```css
/* Dock 导航容器 */
.dock {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
              0 8px 20px rgba(59, 130, 246, 0.15),
              inset 0 2px 4px rgba(255, 255, 255, 0.03);
}

/* Dock 图标项 */
.dock-item {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dock-item:hover {
  transform: translateY(-6px) scale(1.1);
  background: rgba(255, 255, 255, 0.08);
}

.dock-item.active {
  transform: translateY(-10px) scale(1.15);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3));
}

/* 子菜单指示器 */
.dock-item.has-submenu .dock-icon::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

/* 扇形子菜单容器 */
.dock-fan-menu {
  position: absolute;
  bottom: 26px; /* 父菜单高度的一半 */
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

/* 扇形子菜单项 */
.dock-fan-item {
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translate(0px, 0px);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.dock-item:hover .dock-fan-menu .dock-fan-item {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.dock-fan-item.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: #60a5fa;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
}

.dock-fan-icon {
  font-size: 20px;
  margin-bottom: 2px;
  transition: transform 0.3s ease;
}

.dock-fan-item:hover .dock-fan-icon {
  transform: scale(1.2);
}

.dock-fan-label {
  font-size: 9px;
  color: #e2e8f0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.dock-fan-item:hover .dock-fan-label,
.dock-fan-item.active .dock-fan-label {
  color: #ffffff;
}

/* 悬停父菜单时显示扇形子菜单 */
.dock-item.has-submenu:hover .dock-fan-menu {
  opacity: 1;
  visibility: visible;
}

/* 待优化：子菜单项的位置计算需要在实际开发时精修 */
```

- [ ] **Step 3: Update App.jsx to include Dock**

```jsx
import React, { useState } from 'react';
import Dock from './components/Dock';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <>
      <Dock onMenuChange={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard />}
      </main>
    </>
  );
};

export default App;
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Dock.* frontend/src/App.jsx
git commit -m "feat: implement Dock navigation with fan sub-menu"
```

---

## Chunk 6: 前端页面 - 服务知识管理

### Task 1: 创建服务知识管理页面

**Files:**
- Modify: `frontend/src/pages/ServiceKnowledge.jsx`

**TDD Approach:** 先写组件测试，再写页面组件

- [ ] **Step 1: Write ServiceKnowledge page component**

```jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Tag, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { serviceKnowledgeAPI } from '../api/api';

const ServiceKnowledgePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await serviceKnowledgeAPI.getAll();
      setServices(response.data);
    } catch (error) {
      message.error('加载服务知识失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个服务知识吗？',
      onOk: async () => {
        try {
          await serviceKnowledgeAPI.delete(id);
          message.success('删除成功');
          loadServices();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleCreate = async (values) => {
    try {
      await serviceKnowledgeAPI.create({
        serviceName: values.serviceName,
        version: '1.0.0',
        status: 'draft',
        knowledge: null
      });
      message.success('创建成功');
      setModalVisible(false);
      loadServices();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const columns = [
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      key: 'serviceName'
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Button type="link" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString()
    }
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">服务知识</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加服务知识
        </Button>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div>
          <Table
            dataSource={services}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}

      <Modal
        title="添加服务知识"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => form.submit()}>
            确定
          </Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="服务名称"
            name="serviceName"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="例如：user-service" />
          </Form.Item>
          <Form.Item label="版本">
            <Input name="version" placeholder="1.0.0" defaultValue="1.0.0" />
          </Form.Item>
          <Form.Item label="状态">
            <Input name="status" placeholder="draft" defaultValue="draft" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceKnowledgePage;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/ServiceKnowledge.jsx
git commit -m "feat: implement ServiceKnowledge page with table and CRUD operations"
```

---

## Chunk 7: 前后端集成 - 服务知识管理

### Task 1: 测试前端与后端集成

- [ ] **Step 1: Start backend server**

Run: `cd backend && mvn spring-boot:run`
Expected: Server starts on port 8080

- [ ] **Step 2: Start frontend dev server**

Run: `cd frontend && npm run dev`
Expected: Vite server starts, localhost:3000 accessible

- [ ] **Step 3: Test complete flow**

Check:
1. 前端加载服务知识列表 ✓
2. 创建新服务知识 ✓
3. 编辑服务知识 ✓
4. 删除服务知识 ✓
5. 刷新后数据一致 ✓

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/ServiceKnowledge.jsx
git commit -m "feat: complete frontend-backend integration for service knowledge management"
```

---

## 完成检查清单

在进入下一阶段前，确保以下项目已完成：

- [ ] 后端 Spring Boot 项目编译和运行正常
- [ ] PostgreSQL 数据库表正确创建
- [ ] 服务知识 CRUD API 可用且测试通过
- [ ] 前端 Dock 导航组件实现
- [ ] 前端服务知识管理页面实现
- [ ] 前后端集成测试通过

---

**设计文档参考：**
- UI 设计规范：`docs/design/ui-design-spec-v2.md`
- 设计案例：`docs/design/frontend-ui-design-case.md`
- 原始设计文档：`docs/superpowers/specs/2026-03-13-service-knowledge-manager-design.md`

---

**下一阶段：设计空间管理**
