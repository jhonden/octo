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

  @Column
  private String status;

  // SQLite 使用 TEXT 类型存储 JSON 字符串（而非 PostgreSQL 的 JSONB）
  @Column(name = "knowledge", nullable = false, length = 10000, columnDefinition = "TEXT")
  @Lob
  private String knowledge;

  @Column(name = "created_at", nullable = false, updatable = false)
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

  // Setters
  public void setId(Long id) { this.id = id; }
  public void setServiceName(String serviceName) { this.serviceName = serviceName; }
  public void setVersion(String version) { this.version = version; }
  public void setStatus(String status) { this.status = status; }
  public void setKnowledge(String knowledge) { this.knowledge = knowledge; }
}
