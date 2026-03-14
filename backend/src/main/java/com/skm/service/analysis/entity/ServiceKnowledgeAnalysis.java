package com.skm.service.analysis.entity;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 服务知识分析实体
 * 存储分析任务和结果
 */
@Entity
@Table(name = "service_knowledge_analysis")
public class ServiceKnowledgeAnalysis {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "service_id", nullable = false)
  private ServiceKnowledge service;

  @Column(length = 20, nullable = false)
  private String status; // 'pending', 'in_progress', 'completed', 'failed'

  @Column(length = 20, nullable = false)
  private String knowledgeType; // 'api', 'dependency', 'config', 'doc'

  @Column(columnDefinition = "JSONB")
  private String content; // 分析结果内容（JSON格式）

  @Column
  private Double confidence; // 置信度 0.00-100.00

  @Column(name = "start_time")
  private LocalDateTime startTime;

  @Column(name = "end_time")
  private LocalDateTime endTime;

  @Column(name = "error_message")
  private String errorMessage;

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

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getKnowledgeType() { return knowledgeType; }
  public void setKnowledgeType(String knowledgeType) { this.knowledgeType = knowledgeType; }

  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }

  public Double getConfidence() { return confidence; }
  public void setConfidence(Double confidence) { this.confidence = confidence; }

  public LocalDateTime getStartTime() { return startTime; }
  public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

  public LocalDateTime getEndTime() { return endTime; }
  public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

  public String getErrorMessage() { return errorMessage; }
  public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}
