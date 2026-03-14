package com.skm.service.repository.entity;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 服务仓库实体
 * 关联到ServiceKnowledge，存储Git或本地代码仓库信息
 */
@Entity
@Table(name = "service_repositories")
public class ServiceRepository {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "service_id", nullable = false)
  private ServiceKnowledge service;

  @Column(length = 10, nullable = false)
  private String type; // 'git' | 'local'

  @Column(length = 500)
  private String url; // Git仓库URL

  @Column(length = 500)
  private String path; // 本地路径

  @Column(length = 255)
  private String defaultBranch; // 默认分支（如main, master等）

  @Column
  private Boolean isPrimary = false; // 是否主仓库

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

  public ServiceKnowledge getService() { return service; }
  public void setService(ServiceKnowledge service) { this.service = service; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getUrl() { return url; }
  public void setUrl(String url) { this.url = url; }

  public String getPath() { return path; }
  public void setPath(String path) { this.path = path; }

  public String getDefaultBranch() { return defaultBranch; }
  public void setDefaultBranch(String defaultBranch) { this.defaultBranch = defaultBranch; }

  public Boolean getIsPrimary() { return isPrimary; }
  public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}
