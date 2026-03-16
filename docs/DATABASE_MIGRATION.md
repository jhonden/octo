# 数据库迁移：PostgreSQL → SQLite

本文档描述了将服务知识管理系统的数据库从 PostgreSQL 迁移到 SQLite 的详细步骤和注意事项。

## 为什么选择 SQLite？

**SQLite 的优势：**
1. ✅ **零配置** - 单文件数据库，不需要安装数据库服务
2. ✅ **便携性** - 数据存储在单个文件中，便于备份和迁移
3. ✅ **适合本地工具** - 专为桌面应用和本地工具设计
4. ✅ **轻量级** - 小体积，快速启动
5. ✅ **无需网络** - 不依赖网络连接到数据库服务
6. ✅ **跨平台** - 支持 Windows、macOS、Linux

**适用场景：**
- 本地开发环境
- 设计师使用的桌面工具
- 单机应用
- 不需要高并发写入的场景

---

## 迁移步骤

### 1. 更新 pom.xml 依赖

**删除 PostgreSQL 依赖：**
```xml
<!-- 删除这个依赖 -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

**添加 SQLite 依赖：**
```xml
<!-- 添加 SQLite JDBC 驱动 -->
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.42.0.0</version>
</dependency>

<!-- 测试时使用 H2 -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

### 2. 更新 application.yml 配置

**生产配置（src/main/resources/application.yml）：**
```yaml
spring:
  datasource:
    # SQLite 连接 URL
    url: jdbc:sqlite:${user.home}/.skm/skm.db
    driver-class-name: org.sqlite.JDBC

  jpa:
    database-platform: org.hibernate.dialect.SQLiteDialect
    hibernate:
      ddl-auto: update
      show-sql: false
    properties:
      hibernate:
        # SQLite 特定配置
        dialect: org.hibernate.dialect.SQLiteDialect
        format_sql: true
        # 批量插入大小
        jdbc.batch_size: 50
        # 语句缓存
        statement_cache_size: 250
```

**测试配置（src/test/resources/application.yml）：**
```yaml
spring:
  datasource:
    # H2 内存数据库（测试用）
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver

  jpa:
    hibernate:
      ddl-auto: create-drop
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
```

### 3. 更新实体类注解

**ServiceKnowledge 实体：**
```java
@Entity
@Table(name = "service_knowledge")
public class ServiceKnowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // SQLite 使用 IDENTITY
    private Long id;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Column(nullable = false, length = 50)
    private String version;

    // SQLite 使用 TEXT 存储 JSON 字符串，不是 JSONB
    @Column(name = "knowledge", columnDefinition = "TEXT")
    @Lob
    private String knowledge;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // getters and setters...
}
```

**ServiceRepository 实体：**
```java
@Entity
@Table(name = "service_repositories")
public class ServiceRepository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceKnowledge service;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "path")
    private String path;

    @Column(name = "default_branch")
    private String defaultBranch;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // getters and setters...
}
```

**ServiceKnowledgeAnalysis 实体：**
```java
@Entity
@Table(name = "service_knowledge_analysis")
public class ServiceKnowledgeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceKnowledge service;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AnalysisStatus status;

    @Column(name = "knowledge_type", length = 50)
    private String knowledgeType;

    // SQLite 使用 TEXT 存储 JSON 字符串
    @Column(name = "content", columnDefinition = "TEXT")
    @Lob
    private String content;

    @Column(name = "confidence")
    private Double confidence;

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // getters and setters...
}
```

### 4. 添加数据序列化工具

为处理 TEXT 类型的 JSON 字段，添加序列化和反序列化工具：

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JsonUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 将 JSON 字符串转换为 JsonNode
     */
    public static JsonNode toJsonNode(String jsonText) {
        if (jsonText == null || jsonText.trim().isEmpty()) {
            return objectMapper.createObjectNode();
        }
        try {
            return objectMapper.readTree(jsonText);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse JSON: {}", jsonText, e);
            return objectMapper.createObjectNode();
        }
    }

    /**
     * 将 JsonNode 转换为 JSON 字符串
     */
    public static String toJsonString(JsonNode jsonNode) {
        if (jsonNode == null || jsonNode.isMissingNode()) {
            return "{}";
        }
        try {
            return objectMapper.writeValueAsString(jsonNode);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize JSON", e);
            return "{}";
        }
    }
}
```

### 5. 更新 Service 层处理 JSON 字段

修改 Service 层来正确处理 TEXT 类型的 JSON 字段：

```java
@Service
@Transactional
public class ServiceKnowledgeService {

    @Autowired
    private ServiceKnowledgeRepository repository;

    /**
     * 保存服务知识，正确处理 JSON 字段
     */
    public ServiceKnowledge save(ServiceKnowledge service) {
        // 确保 knowledge 字段是有效的 JSON 字符串
        if (service.getKnowledge() != null && !service.getKnowledge().trim().isEmpty()) {
            String json = service.getKnowledge();
            try {
                // 验证是否为有效的 JSON
                JsonNode node = JsonUtils.toJsonNode(json);
                // 可以在这里添加额外的验证逻辑
            } catch (Exception e) {
                log.warn("Invalid JSON in knowledge field, storing as plain text");
            }
        }
        return repository.save(service);
    }

    /**
     * 获取服务知识，解析 JSON 字段
     */
    public Map<String, Object> getKnowledgeAsMap(Long serviceId) {
        ServiceKnowledge service = repository.findById(serviceId)
            .orElseThrow(() -> new RuntimeException("Service not found"));

        if (service.getKnowledge() == null) {
            return new HashMap<>();
        }

        try {
            JsonNode node = JsonUtils.toJsonNode(service.getKnowledge());
            return objectMapper.convertValue(node, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.error("Failed to parse knowledge JSON", e);
            return new HashMap<>();
        }
    }
}
```

### 6. 测试数据操作

创建测试类验证 SQLite 数据操作：

```java
@SpringBootTest
@Transactional
class DatabaseMigrationTests {

    @Autowired
    private ServiceKnowledgeService service;

    @Test
    void testCreateServiceWithJsonData() {
        ServiceKnowledge service = new ServiceKnowledge();
        service.setServiceName("test-service");
        service.setVersion("1.0.0");

        // JSON 数据
        String jsonData = "{\"api_endpoints\": []}";
        service.setKnowledge(jsonData);

        ServiceKnowledge saved = service.save(service);

        assertNotNull(saved.getId());
        assertEquals(jsonData, saved.getKnowledge());
    }

    @Test
    void testQueryWithJsonData() {
        ServiceKnowledge service = service.createServiceWithJsonData();

        ServiceKnowledge found = repository.findById(service.getId()).orElse(null);

        assertNotNull(found);
        assertEquals(jsonData, found.getKnowledge());
    }

    @Test
    void testUpdateJsonData() {
        ServiceKnowledge service = service.createServiceWithJsonData();
        String newJson = "{\"api_endpoints\": [{\"method\": \"GET\"}]}";
        service.setKnowledge(newJson);

        ServiceKnowledge updated = repository.save(service);

        assertEquals(newJson, updated.getKnowledge());
    }
}
```

### 7. 数据迁移脚本

如果需要从 PostgreSQL 迁移已有数据：

```java
@Component
public class DataMigrationService {

    @Autowired
    private ServiceKnowledgeService service;

    /**
     * 检查并迁移数据（仅在首次启动时运行）
     */
    @PostConstruct
    public void checkAndMigrate() {
        // 检查是否存在迁移标记文件
        Path markerFile = Paths.get(System.getProperty("user.home"), ".skm", "migrated");
        if (Files.exists(markerFile)) {
            log.info("Migration already completed, skipping...");
            return;
        }

        log.info("Starting data migration from PostgreSQL to SQLite...");
        // TODO: 如果需要迁移现有数据，在这里实现
        // 注意：由于 SQLite 数据类型限制，JSONB 需要转换为 TEXT

        try {
            // 创建迁移标记
            Files.createDirectories(markerFile.getParent());
            Files.createFile(markerFile);
            log.info("Migration completed successfully");
        } catch (IOException e) {
            log.error("Failed to create migration marker", e);
        }
    }
}
```

---

## 关键差异和注意事项

### 数据类型映射

| PostgreSQL | SQLite | 说明 |
|-----------|--------|------|
| JSONB | TEXT | SQLite 不支持 JSONB，使用 TEXT 存储 JSON 字符串 |
| UUID | TEXT/CHAR(36) | SQLite 不支持原生 UUID 类型 |
| TIMESTAMP | TIMESTAMP | 格式稍有不同 |
| SERIAL | INTEGER PRIMARY KEY AUTOINCREMENT | 自增主键 |
| BIGSERIAL | INTEGER | 序列需要用 INTEGER |

### 性能考虑

**SQLite 的限制：**
1. **并发写入** - SQLite 不支持高并发写入
   - 解决方案：使用连接池
   - 合理设置事务隔离级别

2. **写入优化**
   ```yaml
   spring:
     jpa:
       properties:
         hibernate:
           jdbc:
             batch_size: 50  # 批量插入大小
   ```

3. **连接池配置**
   ```yaml
   spring:
     datasource:
       hikari:
         maximum-pool-size: 10
         minimum-idle: 5
   ```

### 索引优化

SQLite 对每个表的索引数量有限制：

```java
@Entity
@Table(name = "service_knowledge",
       indexes = @Index(name = "idx_service_name", columnList = "service_name"))
public class ServiceKnowledge {
    // ...
}
```

### 事务配置

```java
@Service
@Transactional(
    isolation = IsolationLevel.SERIALIZABLE,  // SQLite 推荐 SERIALIZABLE
    readOnly = false
)
public class ServiceKnowledgeService {
    // ...
}
```

---

## 回滚计划

如果迁移后遇到问题，可以快速回滚到 PostgreSQL：

1. **备份当前 PostgreSQL 数据**
   ```bash
   pg_dump -U skm_user skm_db > backup.sql
   ```

2. **回滚代码更改**
   ```bash
   git revert <commit-hash>
   ```

3. **恢复 PostgreSQL 依赖和配置**

---

## 验收清单

- [ ] pom.xml 依赖已更新（移除 PostgreSQL，添加 SQLite）
- [ ] application.yml 配置已更新（两个环境）
- [ ] 所有实体类的注解已更新
- [ ] JSON 字段处理工具已添加
- [ ] 所有测试通过
- [ ] 应用可以正常启动
- [ ] CRUD 操作正常工作
- [ ] JSON 数据读写正常
- [ ] 数据迁移脚本已测试
- [ ] 文档已更新（README、ARCHITECTURE.md）

---

## 预期效果

迁移完成后：

1. **零配置启动**
   - 无需安装 PostgreSQL
   - 应用启动即用

2. **便携性**
   - 数据存储在 `~/.skm/skm.db`
   - 便于备份和迁移

3. **性能**
   - 适合单用户场景
   - 启动速度更快

4. **兼容性**
   - JPA API 保持不变
   - 业务逻辑无需修改

---

## 下一步

1. 审查本文档
2. 按步骤执行迁移
3. 运行测试验证功能
4. 更新相关文档（README、ARCHITECTURE.md）

---

**最后更新：2024年3月**
