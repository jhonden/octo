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

  // Setters
  public void setServiceName(String serviceName) { this.serviceName = serviceName; }
  public void setVersion(String version) { this.version = version; }
  public void setStatus(String status) { this.status = status; }
  public void setKnowledge(String knowledge) { this.knowledge = knowledge; }
}
