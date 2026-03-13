# 微服务知识管理系统 - MVP实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可用的微服务知识管理系统MVP，支持服务知识管理、设计空间管理和基本的MCP工具暴露，使架构师能够分析服务、创建设计空间并通过AI工具协作完成方案设计。

**Architecture:** Spring Boot 3.x后端提供RESTful API和MCP Server，PostgreSQL存储数据，React 18+ + Ant Design前端实现"精致工业风"暗色主题UI，约定目录结构用于服务代码和知识文档存储。系统采用分层架构：Controller层处理HTTP/MCP请求，Service层实现业务逻辑，Repository层通过Spring Data JPA访问数据库，FileSystem模块管理文件系统操作。

**Tech Stack:**
- 后端: Spring Boot 3.x, Java 17+, PostgreSQL 15+, Spring Data JPA, Jackson
- 前端: React 18+, Ant Design 5.x, React Router 6.x, Axios
- MCP: 基于Spring MVC实现JSON-RPC 2.0
- 构建工具: Maven (backend), Vite (frontend)

---

## Chunk 1: 项目初始化和基础设施

### Task 1: 初始化Spring Boot项目

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
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
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

### Task 2: 初始化React前端项目

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
  <title>Octo - 服务知识，触手可及</title>
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

- [ ] **Step 5: Write App.jsx (basic structure)**

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Content>
          <Routes>
            <Route path="/" element={<div>Welcome to Octo</div>} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 6: Write index.css (dark theme base)**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d1117;
  color: #e2e8f0;
}

#root {
  min-height: 100vh;
}
```

- [ ] **Step 7: Write .gitignore**

```
node_modules/
dist/
.DS_Store
```

- [ ] **Step 8: Install dependencies and verify**

Run: `cd frontend && npm install`
Expected: Dependencies installed successfully

Run: `npm run dev`
Expected: Vite server starts, localhost:3000 accessible

- [ ] **Step 9: Commit**

```bash
git add frontend/
git commit -m "feat: initialize React frontend with Vite and Ant Design"
```

---

## Chunk 2: 数据库层实现

### Task 3: 创建数据库实体类

**Files:**
- Create: `backend/src/main/java/com/skm/entity/ServiceKnowledge.java`
- Create: `backend/src/main/java/com/skm/entity/DesignSpace.java`
- Create: `backend/src/main/java/com/skm/entity/ServiceSubscription.java`

- [ ] **Step 1: Write ServiceKnowledge entity**

```java
package com.skm.entity;

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

- [ ] **Step 2: Write DesignSpace entity**

```java
package com.skm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

  @Column(columnDefinition = "jsonb")
  private String gitConfig;

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

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getOwner() { return owner; }
  public void setOwner(String owner) { this.owner = owner; }

  public String getWorkspacePath() { return workspacePath; }
  public void setWorkspacePath(String workspacePath) { this.workspacePath = workspacePath; }

  public String getGitConfig() { return gitConfig; }
  public void setGitConfig(String gitConfig) { this.gitConfig = gitConfig; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}
```

- [ ] **Step 3: Write ServiceSubscription entity**

```java
package com.skm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_subscription")
public class ServiceSubscription {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "design_space_id", nullable = false)
  private DesignSpace designSpace;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "service_id", nullable = false)
  private ServiceKnowledge serviceKnowledge;

  @Column(name = "subscribed_at", updatable = false)
  private LocalDateTime subscribedAt;

  @PrePersist
  protected void onCreate() {
    subscribedAt = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public DesignSpace getDesignSpace() { return designSpace; }
  public void setDesignSpace(DesignSpace designSpace) { this.designSpace = designSpace; }

  public ServiceKnowledge getServiceKnowledge() { return serviceKnowledge; }
  public void setServiceKnowledge(ServiceKnowledge serviceKnowledge) { this.serviceKnowledge = serviceKnowledge; }

  public LocalDateTime getSubscribedAt() { return subscribedAt; }
}
```

- [ ] **Step 4: Compile to verify**

Run: `cd backend && mvn clean compile`
Expected: BUILD SUCCESS, no compilation errors

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/skm/entity/
git commit -m "feat: create entity classes for ServiceKnowledge, DesignSpace, ServiceSubscription"
```

---

### Task 4: 创建Repository接口

**Files:**
- Create: `backend/src/main/java/com/skm/repository/ServiceKnowledgeRepository.java`
- Create: `backend/src/main/java/com/skm/repository/DesignSpaceRepository.java`
- Create: `backend/src/main/java/com/skm/repository/ServiceSubscriptionRepository.java`
- Test: `backend/src/test/java/com/skm/repository/RepositoryTest.java`

- [ ] **Step 1: Write ServiceKnowledgeRepository**

```java
package com.skm.repository;

import com.skm.entity.ServiceKnowledge;
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

- [ ] **Step 2: Write DesignSpaceRepository**

```java
package com.skm.repository;

import com.skm.entity.DesignSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignSpaceRepository extends JpaRepository<DesignSpace, Long> {

  List<DesignSpace> findByOwner(String owner);

  Optional<DesignSpace> findByOwnerAndName(String owner, String name);

  boolean existsByOwnerAndName(String owner, String name);
}
```

- [ ] **Step 3: Write ServiceSubscriptionRepository**

```java
package com.skm.repository;

import com.skm.entity.ServiceSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceSubscriptionRepository extends JpaRepository<ServiceSubscription, Long> {

  List<ServiceSubscription> findByDesignSpaceId(Long designSpaceId);

  void deleteByDesignSpaceId(Long designSpaceId);
}
```

- [ ] **Step 4: Write test class**

```java
package com.skm.repository;

import com.skm.entity.ServiceKnowledge;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class RepositoryTest {

  @Autowired
  private ServiceKnowledgeRepository repository;

  @Test
  void testSaveAndFind() {
    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName("test-service");
    sk.setVersion("1.0.0");
    sk.setStatus("draft");
    sk.setKnowledge("{\"test\": \"data\"}");

    ServiceKnowledge saved = repository.save(sk);

    assertNotNull(saved.getId());
    assertTrue(repository.findByServiceName("test-service").isPresent());
  }
}
```

- [ ] **Step 5: Run tests**

Run: `cd backend && mvn test -Dtest=RepositoryTest`
Expected: Tests pass

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/skm/repository/ backend/src/test/
git commit -m "feat: create repository interfaces with basic queries"
```

---

## Chunk 3: 服务知识管理API实现

### Task 5: 创建Service层 - 服务知识管理

**Files:**
- Create: `backend/src/main/java/com/skm/service/ServiceKnowledgeService.java`
- Test: `backend/src/test/java/com/skm/service/ServiceKnowledgeServiceTest.java`

- [ ] **Step 1: Write ServiceKnowledgeService**

```java
package com.skm.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.entity.ServiceKnowledge;
import com.skm.repository.ServiceKnowledgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    sk.setVersion((String) data.get("version"));
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

  public JsonNode parseKnowledge(String knowledgeJson) throws JsonProcessingException {
    return objectMapper.readTree(knowledgeJson);
  }
}
```

- [ ] **Step 2: Write test class**

```java
package com.skm.service;

import com.skm.entity.ServiceKnowledge;
import com.skm.repository.ServiceKnowledgeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

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
  void testCreateService() throws Exception {
    Map<String, Object> data = Map.of(
        "serviceName", "test-service",
        "version", "1.0.0",
        "status", "published"
    );

    ServiceKnowledge sk = service.create(data);

    assertEquals("test-service", sk.getServiceName());
    assertEquals("1.0.0", sk.getVersion());
    assertEquals("published", sk.getStatus());
  }
}
```

- [ ] **Step 3: Run tests**

Run: `cd backend && mvn test -Dtest=ServiceKnowledgeServiceTest`
Expected: Tests pass

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/skm/service/ServiceKnowledgeService.java
git commit -m "feat: implement ServiceKnowledgeService with CRUD operations"
```

---

### Task 6: 创建Controller - 服务知识API

**Files:**
- Create: `backend/src/main/java/com/skm/controller/ServiceKnowledgeController.java`
- Create: `backend/src/main/java/com/skm/dto/ServiceKnowledgeRequest.java`
- Create: `backend/src/main/java/com/skm/dto/ServiceKnowledgeResponse.java`
- Create: `backend/src/main/java/com/skm/exception/GlobalExceptionHandler.java`

- [ ] **Step 1: Write ServiceKnowledgeRequest DTO**

```java
package com.skm.dto;

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

- [ ] **Step 2: Write ServiceKnowledgeResponse DTO**

```java
package com.skm.dto;

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

  public static ServiceKnowledgeResponse fromEntity(com.skm.entity.ServiceKnowledge entity,
                                               com.fasterxml.jackson.databind.ObjectMapper mapper) {
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
  public void setStatus(String status) { this.status = status; }

  public Object getKnowledge() { return knowledge; }
  public void setKnowledge(Object knowledge) { this.knowledge = knowledge; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

- [ ] **Step 3: Write GlobalExceptionHandler**

```java
package com.skm.exception;

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

- [ ] **Step 4: Write ServiceKnowledgeController**

```java
package com.skm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.dto.ServiceKnowledgeRequest;
import com.skm.dto.ServiceKnowledgeResponse;
import com.skm.service.ServiceKnowledgeService;
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
  public ServiceKnowledgeResponse create(@RequestBody ServiceKnowledgeRequest request)
      throws Exception {
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
      @RequestBody ServiceKnowledgeRequest request) throws Exception {
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

- [ ] **Step 5: Test API with curl**

Run: `cd backend && mvn spring-boot:run`

In another terminal:
```bash
curl -X POST http://localhost:8080/api/service-knowledge \
  -H "Content-Type: application/json" \
  -d '{"serviceName":"test-service","version":"1.0.0","status":"draft"}'
```

Expected: JSON response with created service knowledge

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/skm/controller/ backend/src/main/java/com/skm/dto/ backend/src/main/java/com/skm/exception/
git commit -m "feat: implement ServiceKnowledgeController REST API"
```

---

## Chunk 4: 设计空间管理API实现

### Task 7: 创建设计空间Service和Controller

**Files:**
- Create: `backend/src/main/java/com/skm/service/DesignSpaceService.java`
- Create: `backend/src/main/java/com/skm/controller/DesignSpaceController.java`
- Create: `backend/src/main/java/com/skm/util/FileSystemUtil.java`
- Create: `backend/src/main/java/com/skm/config/DesignSpaceProperties.java`

- [ ] **Step 1: Write DesignSpaceProperties configuration**

```java
package com.skm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "skm")
public class DesignSpaceProperties {
  private String 约定目录Path;
  private String 设计空间BasePath;

  // Getters and Setters
  public String get约定目录Path() { return 约定目录Path; }
  public void set约定目录Path(String 约定目录Path) { this.约定目录Path = 约定目录Path; }

  public String get设计空间BasePath() { return 设计空间BasePath; }
  public void set设计空间BasePath(String 设计空间BasePath) { this.设计空间BasePath = 设计空间BasePath; }
}
```

- [ ] **Step 2: Write FileSystemUtil**

```java
package com.skm.util;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class FileSystemUtil {

  public void createDirectory(Path path) throws IOException {
    Files.createDirectories(path);
  }

  public boolean exists(Path path) {
    return Files.exists(path);
  }

  public void writeString(Path path, String content) throws IOException {
    Files.createDirectories(path.getParent());
    Files.writeString(path, content);
  }

  public String readString(Path path) throws IOException {
    return Files.readString(path);
  }

  public Path createDesignSpaceStructure(String basePath, String spaceId, String spaceName)
      throws IOException {
    Path root = Paths.get(basePath, "design-space-" + spaceId);

    createDirectory(root.resolve(".design-space"));
    createDirectory(root.resolve(".knowledge"));
    createDirectory(root.resolve(".references"));
    createDirectory(root.resolve(".templates/prebuilt"));
    createDirectory(root.resolve(".templates/personal"));
    createDirectory(root.resolve("designs"));
    createDirectory(root.resolve("current-design/diagrams"));
    createDirectory(root.resolve("current-design/output"));

    // Create metadata.json
    String metadata = String.format("""
        {
          "name": "%s",
          "createdAt": "%s"
        }
        """, spaceName, java.time.LocalDateTime.now());
    writeString(root.resolve(".design-space/metadata.json"), metadata);

    // Create README.md
    String readme = String.format("""
        # %s

        这是你的设计空间。

        ## 目录结构

        - `.knowledge/` - 自动同步的服务知识
        - `.references/` - 外部参考资料（Markdown文档）
        - `.templates/` - 设计模板
        - `designs/` - 历史设计（Git管理）
        - `current-design/` - 当前设计工作区
        """, spaceName);
    writeString(root.resolve("README.md"), readme);

    return root;
  }
}
```

- [ ] **Step 3: Write DesignSpaceService**

```java
package com.skm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.config.DesignSpaceProperties;
import com.skm.entity.DesignSpace;
import com.skm.repository.DesignSpaceRepository;
import com.skm.util.FileSystemUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@Service
public class DesignSpaceService {

  private final DesignSpaceRepository repository;
  private final FileSystemUtil fileSystemUtil;
  private final DesignSpaceProperties properties;
  private final ObjectMapper objectMapper;

  @Autowired
  public DesignSpaceService(DesignSpaceRepository repository,
                            FileSystemUtil fileSystemUtil,
                            DesignSpaceProperties properties,
                            ObjectMapper objectMapper) {
    this.repository = repository;
    this.fileSystemUtil = fileSystemUtil;
    this.properties = properties;
    this.objectMapper = objectMapper;
  }

  public List<DesignSpace> getByOwner(String owner) {
    return repository.findByOwner(owner);
  }

  public DesignSpace getById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Design space not found"));
  }

  @Transactional
  public DesignSpace create(String name, String owner, Map<String, Object> gitConfig)
      throws IOException {
    // Validate name
    if (name == null || name.isEmpty() || name.length() > 128) {
      throw new IllegalArgumentException("Invalid design space name");
    }

    if (repository.existsByOwnerAndName(owner, name)) {
      throw new IllegalArgumentException("Design space name already exists");
    }

    // Create entity
    DesignSpace space = new DesignSpace();
    space.setName(name);
    space.setOwner(owner);

    // Create file structure
    String spaceId = java.util.UUID.randomUUID().toString().substring(0, 8);
    Path workspacePath = fileSystemUtil.createDesignSpaceStructure(
        properties.get设计空间BasePath(), spaceId, name);
    space.setWorkspacePath(workspacePath.toString());

    // Set git config if provided
    if (gitConfig != null && !gitConfig.isEmpty()) {
      space.setGitConfig(objectMapper.writeValueAsString(gitConfig));
    }

    return repository.save(space);
  }

  @Transactional
  public void delete(Long id) throws IOException {
    DesignSpace space = getById(id);
    repository.deleteById(id);
    // Note: File system cleanup could be added here
  }
}
```

- [ ] **Step 4: Write DesignSpaceController**

```java
package com.skm.controller;

import com.skm.entity.DesignSpace;
import com.skm.service.DesignSpaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/design-spaces")
@CrossOrigin(origins = "*")
public class DesignSpaceController {

  private final DesignSpaceService service;

  @Autowired
  public DesignSpaceController(DesignSpaceService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<DesignSpace>> getAll(@RequestParam String owner) {
    return ResponseEntity.ok(service.getByOwner(owner));
  }

  @GetMapping("/{id}")
  public ResponseEntity<DesignSpace> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
  }

  @PostMapping
  public ResponseEntity<DesignSpace> create(
      @RequestBody CreateRequest request) throws Exception {
    DesignSpace space = service.create(
        request.getName(),
        request.getOwner(),
        request.getGitConfig()
    );
    return ResponseEntity.ok(space);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  public static class CreateRequest {
    private String name;
    private String owner;
    private Map<String, Object> gitConfig;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public Map<String, Object> getGitConfig() { return gitConfig; }
    public void setGitConfig(Map<String, Object> gitConfig) { this.gitConfig = gitConfig; }
  }
}
```

- [ ] **Step 5: Compile and verify**

Run: `cd backend && mvn clean compile`
Expected: BUILD SUCCESS

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/skm/service/DesignSpaceService.java backend/src/main/java/com/skm/controller/DesignSpaceController.java backend/src/main/java/com/skm/util/FileSystemUtil.java backend/src/main/java/com/skm/config/
git commit -m "feat: implement DesignSpaceService and Controller with file system operations"
```

---

## Chunk 5: MCP Server基础实现

### Task 8: 创建MCP Server核心

**Files:**
- Create: `backend/src/main/java/com/skm/mcp/McpRequest.java`
- Create: `backend/src/main/java/com/skm/mcp/McpResponse.java`
- Create: `backend/src/main/java/com/skm/mcp/McpServerController.java`
- Create: `backend/src/main/java/com/skm/mcp/ToolDefinition.java`

- [ ] **Step 1: Write ToolDefinition**

```java
package com.skm.mcp;

import java.util.List;
import java.util.Map;

public record ToolDefinition(
    String name,
    String description,
    Map<String, Object> inputSchema
) {
  public static ToolDefinition serviceKnowledgeTool() {
    return new ToolDefinition(
        "get_service_knowledge",
        "Get knowledge for a specific service by service name",
        Map.of(
            "type", "object",
            "properties", Map.of(
                "serviceName", Map.of(
                    "type", "string",
                    "description", "Name of the service"
                )
            ),
            "required", List.of("serviceName")
        )
    );
  }

  public static ToolDefinition listServicesTool() {
    return new ToolDefinition(
        "list_services",
        "List all available services",
        Map.of(
            "type", "object",
            "properties", Map.of()
        )
    );
  }

  public static ToolDefinition getDesignSpaceInfo() {
    return new ToolDefinition(
        "get_design_space_info",
        "Get information about a design space",
        Map.of(
            "type", "object",
            "properties", Map.of(
                "designSpaceId", Map.of(
                    "type", "number",
                    "description", "ID of the design space"
                )
            ),
            "required", List.of("designSpaceId")
        )
    );
  }
}
```

- [ ] **Step 2: Write McpRequest**

```java
package com.skm.mcp;

public record McpRequest(
    String jsonrpc,
    String method,
    Object params,
    Object id
) {
  public McpRequest {
    if (!"2.0".equals(jsonrpc)) {
      throw new IllegalArgumentException("Only JSON-RPC 2.0 is supported");
    }
  }
}
```

- [ ] **Step 3: Write McpResponse**

```java
package com.skm.mcp;

public record McpResponse(
    String jsonrpc,
    Object result,
    Object error,
    Object id
) {
  public static McpResponse success(Object result, Object id) {
    return new McpResponse("2.0", result, null, id);
  }

  public static McpResponse error(int code, String message, Object id) {
    return new McpResponse("2.0", null,
        Map.of("code", code, "message", message), id);
  }
}
```

- [ ] **Step 4: Write McpServerController**

```java
package com.skm.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.DesignSpaceService;
import com.skm.service.ServiceKnowledgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mcp")
@CrossOrigin(origins = "*")
public class McpServerController {

  private final ServiceKnowledgeService serviceKnowledgeService;
  private final DesignSpaceService designSpaceService;
  private final ObjectMapper objectMapper;

  @Autowired
  public McpServerController(ServiceKnowledgeService serviceKnowledgeService,
                             DesignSpaceService designSpaceService,
                             ObjectMapper objectMapper) {
    this.serviceKnowledgeService = serviceKnowledgeService;
    this.designSpaceService = designSpaceService;
    this.objectMapper = objectMapper;
  }

  @GetMapping(value = "/tools", produces = MediaType.APPLICATION_JSON_VALUE)
  public List<ToolDefinition> listTools() {
    return List.of(
        ToolDefinition.serviceKnowledgeTool(),
        ToolDefinition.listServicesTool(),
        ToolDefinition.getDesignSpaceInfo()
    );
  }

  @PostMapping(value = "/tools/call", consumes = MediaType.APPLICATION_JSON_VALUE,
               produces = MediaType.APPLICATION_JSON_VALUE)
  public McpResponse callTool(@RequestBody Map<String, Object> request) {
    try {
      String toolName = (String) request.get("name");
      @SuppressWarnings("unchecked")
      Map<String, Object> arguments = (Map<String, Object>) request.get("arguments");

      return switch (toolName) {
        case "get_service_knowledge" -> handleGetServiceKnowledge(arguments, request.get("id"));
        case "list_services" -> handleListServices(request.get("id"));
        case "get_design_space_info" -> handleGetDesignSpaceInfo(arguments, request.get("id"));
        default -> McpResponse.error(-32601, "Tool not found", request.get("id"));
      };
    } catch (Exception e) {
      return McpResponse.error(-32603, "Internal error: " + e.getMessage(),
          request.get("id"));
    }
  }

  private McpResponse handleGetServiceKnowledge(Map<String, Object> args, Object requestId) {
    String serviceName = (String) args.get("serviceName");
    try {
      var sk = serviceKnowledgeService.getByServiceName(serviceName);
      return McpResponse.success(
          Map.of("serviceName", sk.getServiceName(),
                  "version", sk.getVersion(),
                  "knowledge", objectMapper.readTree(sk.getKnowledge())),
          requestId);
    } catch (Exception e) {
      return McpResponse.error(-32002, "Service not found: " + serviceName, requestId);
    }
  }

  private McpResponse handleListServices(Object requestId) {
    var services = serviceKnowledgeService.getAll();
    return McpResponse.success(
        services.stream()
            .map(sk -> Map.of("serviceName", sk.getServiceName(),
                               "version", sk.getVersion(),
                               "status", sk.getStatus()))
            .toList(),
        requestId);
  }

  private McpResponse handleGetDesignSpaceInfo(Map<String, Object> args, Object requestId) {
    Long id = ((Number) args.get("designSpaceId")).longValue();
    try {
      var space = designSpaceService.getById(id);
      return McpResponse.success(
          Map.of("id", space.getId(),
                  "name", space.getName(),
                  "owner", space.getOwner(),
                  "workspacePath", space.getWorkspacePath()),
          requestId);
    } catch (Exception e) {
      return McpResponse.error(-32002, "Design space not found", requestId);
    }
  }
}
```

- [ ] **Step 5: Test MCP endpoints**

Run: `cd backend && mvn spring-boot:run`

In another terminal:
```bash
curl http://localhost:8080/mcp/tools
```

Expected: JSON array of tool definitions

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/skm/mcp/
git commit -m "feat: implement MCP Server with tool registration and invocation"
```

---

## Chunk 6: 前端UI实现

### Task 9: 实现前端页面和组件

**Files:**
- Modify: `frontend/src/App.jsx`
- Create: `frontend/src/components/Layout.jsx`
- Create: `frontend/src/pages/Dashboard.jsx`
- Create: `frontend/src/pages/ServiceKnowledge.jsx`
- Create: `frontend/src/pages/DesignSpaces.jsx`
- Create: `frontend/src/api/api.js`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Write api.js**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const serviceKnowledgeAPI = {
  getAll: () => api.get('/service-knowledge'),
  getById: (id) => api.get(`/service-knowledge/${id}`),
  getByServiceName: (name) => api.get(`/service-knowledge/service/${name}`),
  create: (data) => api.post('/service-knowledge', data),
  update: (id, data) => api.put(`/service-knowledge/${id}`, data),
  delete: (id) => api.delete(`/service-knowledge/${id}`),
};

export const designSpaceAPI = {
  getAll: (owner) => api.get(`/design-spaces?owner=${owner}`),
  getById: (id) => api.get(`/design-spaces/${id}`),
  create: (data) => api.post('/design-spaces', data),
  delete: (id) => api.delete(`/design-spaces/${id}`),
};

export const mcpAPI = {
  getTools: () => axios.get('/mcp/tools'),
  callTool: (request) => axios.post('/mcp/tools/call', request),
};
```

- [ ] **Step 2: Update index.css with dark theme**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d1117;
  color: #e2e8f0;
}

#root {
  min-height: 100vh;
}

.ant-layout {
  background: #0d1117 !important;
}

.ant-menu {
  background: transparent !important;
  border: none !important;
}

.ant-menu-item {
  color: #94a3b8 !important;
  margin: 4px 0 !important;
  border-radius: 8px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
}

.ant-menu-item:hover {
  color: #e2e8f0 !important;
  background: #1e293b !important;
}

.ant-menu-item-selected {
  background: #1e293b !important;
  color: #3b82f6 !important;
  border-left: 3px solid #3b82f6 !important;
}

.ant-btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
}

.ant-card {
  background: #161b22 !important;
  border-color: #334155 !important;
  transition: all 0.3s ease;
}

.ant-card:hover {
  border-color: #3b82f6 !important;
}
```

- [ ] **Step 3: Write Layout component**

```jsx
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { DatabaseOutlined, CodeOutlined, SettingOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children, currentPage, onPageChange }) => {
  const menuItems = [
    { key: 'dashboard', icon: <DatabaseOutlined />, label: '仪表盘' },
    { key: 'services', icon: <CodeOutlined />, label: '服务知识' },
    { key: 'spaces', icon: <SettingOutlined />, label: '设计空间' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={256} style={{ background: '#0d1117', borderRight: '1px solid #334155' }}>
        <div style={{ padding: '24px 0', marginBottom: '24px' }}>
          <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 700, textAlign: 'center' }}>
            Octo
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          onClick={({ key }) => onPageChange(key)}
          style={{ background: 'transparent' }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#0d1117',
          borderBottom: '1px solid #334155',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 700 }}>
            Octo - 服务知识，触手可及
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button icon={<BellOutlined />} style={{ background: 'transparent', border: '1px solid #334155' }} />
            <Button icon={<UserOutlined />} style={{ background: 'transparent', border: '1px solid #334155' }} />
          </div>
        </Header>
        <Content style={{ background: '#0d1117', padding: '32px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
```

- [ ] **Step 4: Write Dashboard page**

```jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';

const Dashboard = () => {
  const [stats, setStats] = useState({
    designSpaces: 5,
    serviceKnowledge: 23,
    historyDesigns: 15,
    personalTemplates: 3,
  });

  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '24px' }}>欢迎回来，架构师</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>设计空间</h3>
            <Statistic value={stats.designSpaces} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>服务知识</h3>
            <Statistic value={stats.serviceKnowledge} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>历史设计</h3>
            <Statistic value={stats.historyDesigns} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>个人模板</h3>
            <Statistic value={stats.personalTemplates} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
```

- [ ] **Step 5: Write ServiceKnowledge page**

```jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Tag, Modal, Form, Input, message } from 'antd';
import { serviceKnowledgeAPI } from '../api/api';

const ServiceKnowledgePage = () => {
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceKnowledgeAPI.getAll();
      setServices(response.data);
    } catch (error) {
      message.error('加载服务知识失败');
    }
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await serviceKnowledgeAPI.create(values);
      message.success('添加成功');
      setModalVisible(false);
      form.resetFields();
      loadServices();
    } catch (error) {
      message.error('添加失败');
    }
  };

  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '24px' }}>服务知识</h1>
      <Button type="primary" style={{ marginBottom: '24px' }} onClick={() => setModalVisible(true)}>
        + 添加服务知识
      </Button>
      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col span={8} key={service.id}>
            <Card
              title={service.serviceName}
              extra={<Tag color="green">{service.status === 'published' ? '已发布' : '草稿'}</Tag>}
              style={{ background: '#161b22', border: '1px solid #334155' }}
            >
              <p style={{ color: '#94a3b8' }}>v{service.version || 'N/A'}</p>
              <p style={{ color: '#64748b' }}>最后更新：{new Date(service.updatedAt).toLocaleString()}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="添加服务知识"
        open={modalVisible}
        onOk={handleAdd}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="服务名称"
            name="serviceName"
            rules={[{ required: true, message: '请输入服务名称' }]}
          >
            <Input placeholder="user-service" />
          </Form.Item>
          <Form.Item label="版本" name="version">
            <Input placeholder="1.0.0" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="draft">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceKnowledgePage;
```

- [ ] **Step 6: Write DesignSpaces page**

```jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Modal, Form, Input, message, Badge } from 'antd';
import { designSpaceAPI } from '../api/api';

const DesignSpacesPage = () => {
  const [spaces, setSpaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const response = await designSpaceAPI.getAll('architect');
      setSpaces(response.data);
    } catch (error) {
      message.error('加载设计空间失败');
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await designSpaceAPI.create({
        ...values,
        owner: 'architect',
      });
      message.success('创建成功');
      setModalVisible(false);
      form.resetFields();
      loadSpaces();
    } catch (error) {
      message.error('创建失败');
    }
  };

  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '24px' }}>设计空间</h1>
      <Button type="primary" style={{ marginBottom: '24px' }} onClick={() => setModalVisible(true)}>
        + 创建设计空间
      </Button>
      <Row gutter={[16, 16]}>
        {spaces.map((space) => (
          <Col span={8} key={space.id}>
            <Card title={space.name} style={{ background: '#161b22', border: '1px solid #334155' }}>
              <p style={{ color: '#94a3b8', marginBottom: '12px' }}>设计空间：{space.name}</p>
              <p style={{ color: '#64748b' }}>路径：{space.workspacePath}</p>
              <Badge status="success" text="🌿 已连接" />
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="创建设计空间"
        open={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="设计空间名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="订单系统升级_v2" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DesignSpacesPage;
```

- [ ] **Step 7: Update App.jsx**

```jsx
import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import AppLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ServiceKnowledgePage from './pages/ServiceKnowledge';
import DesignSpacesPage from './pages/DesignSpaces';
import './index.css';

const darkTheme = {
  algorithm: 'dark',
  token: {
    colorPrimary: '#3b82f6',
    colorBgBase: '#0d1117',
    colorBgContainer: '#161b22',
    colorBorder: '#334155',
    colorText: '#e2e8f0',
  },
};

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <ServiceKnowledgePage />;
      case 'spaces':
        return <DesignSpacesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConfigProvider theme={darkTheme}>
      <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </AppLayout>
    </ConfigProvider>
  );
}

export default App;
```

- [ ] **Step 8: Build and test frontend**

Run: `cd frontend && npm run build`
Expected: Build successful

- [ ] **Step 9: Commit**

```bash
git add frontend/src/
git commit -m "feat: implement frontend pages with dark theme and navigation"
```

---

## Chunk 7: 集成测试和文档

### Task 10: 约定目录结构文档

**Files:**
- Create: `docs/agreed-directory-structure.md`

- [ ] **Step 1: Write agreed directory documentation**

```markdown
# 约定目录结构

本文档描述微服务知识管理系统的约定目录结构，用于服务代码存储和知识文档生成。

## 目录结构

```
约定目录/
├── services/              # 服务代码目录
│   ├── user-service/
│   └── order-service/
├── service-knowledge/
│   ├── config/
│   │   ├── defaults.json     # 默认配置
│   │   └── user.json        # 用户配置
│   ├── task-list.json       # 任务清单
│   └── analysis-cache/      # 分析缓存
└── analysis-guide.md        # 操作指南
```

## 配置文件

### defaults.json

默认配置文件，定义分析策略和性能参数：

```json
{
  "analysis": {
    "type": "full",
    "timeout": 300000,
    "filePatterns": {
      "include": ["**/*.java", "**/*.yaml", "**/*.json"],
      "exclude": ["**/tests/**", "**/node_modules/**"]
    }
  },
  "performance": {
    "cacheEnabled": true,
    "parallelProcessing": true
  }
}
```

### task-list.json

任务清单文件，定义需要分析的服务：

```json
{
  "version": "1.0",
  "services": [
    {
      "name": "user-service",
      "path": "services/user-service",
      "framework": "Spring Boot 2.7.x"
    }
  ],
  "analysisConfig": {
    "mode": "incremental",
    "trigger": "git_diff"
  }
}
```

## 工作流程

1. Web系统下载服务代码到 `services/` 目录
2. 生成 `task-list.json`
3. 用户在Claude Code启动分析
4. Skill逐个分析服务，生成 `service-knowledge.json` 和 `.md` 文件
5. Web系统同步到市场空间

## 环境变量

约定目录路径可通过 `skm.约定目录-path` 配置，默认为用户主目录下的 `skm-agreed-directory`。
```

- [ ] **Step 2: Commit documentation**

```bash
git add docs/
git commit -m "docs: add agreed directory structure documentation"
```

---

### Task 11: 端到端集成测试

**Files:**
- Test: Manual verification

- [ ] **Step 1: Start PostgreSQL database**

Run:
```bash
docker run --name skm-postgres -e POSTGRES_PASSWORD=skm_password \
  -e POSTGRES_DB=skm_db -e POSTGRES_USER=skm_user \
  -p 5432:5432 -d postgres:15
```

Expected: PostgreSQL container running

- [ ] **Step 2: Start backend server**

Run: `cd backend && mvn spring-boot:run`

Expected: Server starts on port 8080, database tables created

- [ ] **Step 3: Start frontend server**

Run (in another terminal): `cd frontend && npm run dev`

Expected: Vite server starts on port 3000

- [ ] **Step 4: Test service knowledge CRUD**

Run:
```bash
# Create
curl -X POST http://localhost:8080/api/service-knowledge \
  -H "Content-Type: application/json" \
  -d '{"serviceName":"test-service","version":"1.0.0","status":"published"}'

# Get all
curl http://localhost:8080/api/service-knowledge

# Get by name
curl http://localhost:8080/api/service-knowledge/service/test-service
```

Expected: JSON responses for each request

- [ ] **Step 5: Test design space creation**

Run:
```bash
curl -X POST http://localhost:8080/api/design-spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"test-space","owner":"architect"}'
```

Expected: Design space created, file structure generated

- [ ] **Step 6: Test MCP tools**

Run:
```bash
# List tools
curl http://localhost:8080/mcp/tools

# Call list_services
curl -X POST http://localhost:8080/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name":"list_services","arguments":{},"id":1}'
```

Expected: MCP tools return correct responses

- [ ] **Step 7: Verify frontend UI**

Open browser to: `http://localhost:3000`

Check:
- Dashboard page loads with statistics
- Navigation works between pages
- Service knowledge page displays services
- Add service modal works
- Design space page displays spaces
- Create space modal works

Expected: All UI elements functional, dark theme applied

- [ ] **Step 8: Update README with setup instructions**

```bash
cat > README.md << 'EOF'
# Octo - 服务知识，触手可及

辅助架构师快速高质量完成需求方案分析和设计的工具。

## 功能特性

- 服务知识管理：存储和管理微服务知识
- 设计空间管理：创建个人设计工作空间
- MCP Server：通过MCP协议与AI工具集成

## 技术栈

- 后端：Spring Boot 3.x, PostgreSQL
- 前端：React 18+, Ant Design 5.x
- MCP：基于Spring MVC的JSON-RPC 2.0实现

## 快速开始

### 1. 启动数据库

```bash
docker run --name skm-postgres -e POSTGRES_PASSWORD=skm_password \
  -e POSTGRES_DB=skm_db -e POSTGRES_USER=skm_user \
  -p 5432:5432 -d postgres:15
```

### 2. 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端将运行在 http://localhost:8080

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端将运行在 http://localhost:3000

## 开发计划

详见 [MVP实现计划](docs/superpowers/plans/2026-03-13-service-knowledge-manager-mvp.md)

## 设计文档

详见 [设计文档](docs/superpowers/specs/2026-03-13-service-knowledge-manager-design.md)
EOF
```

- [ ] **Step 9: Final commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions"
```

---

## 完成检查清单

在宣告MVP完成之前，确保以下项目已完成：

- [ ] 后端Spring Boot项目编译和运行正常
- [ ] 数据库表正确创建
- [ ] 服务知识CRUD API可用
- [ ] 设计空间CRUD API可用
- [ ] 设计空间文件结构正确生成
- [ ] MCP Server工具可注册和调用
- [ ] 前端React应用编译和运行正常
- [ ] 仪表盘页面显示正确
- [ ] 服务知识页面功能完整
- [ ] 设计空间页面功能完整
- [ ] 暗色主题正确应用
- [ ] API和MCP端点测试通过
- [ ] 约定目录结构文档完成
- [ ] README更新完成

## 后续工作

MVP完成后，后续阶段包括：

1. **Skill管理模块** - 通用技能适配器和Claude Code技能开发
2. **Git集成** - 设计空间的版本控制和历史管理
3. **完善功能** - 个人模板管理、参考资料管理、增量分析优化
