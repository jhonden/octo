package com.skm.service.knowledge.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.knowledge.entity.ServiceKnowledge;

import java.time.LocalDateTime;

public class ServiceKnowledgeResponse {
  private Long id;
  private String serviceName;
  private String version;
  private Object knowledge;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public ServiceKnowledgeResponse() {
  }

  public static ServiceKnowledgeResponse fromEntity(ServiceKnowledge entity,
                                                     ObjectMapper mapper) {
    ServiceKnowledgeResponse response = new ServiceKnowledgeResponse();
    response.setId(entity.getId());
    response.setServiceName(entity.getServiceName());
    response.setVersion(entity.getVersion());
    try {
      response.setKnowledge(mapper.readTree(entity.getKnowledge()));
    } catch (JsonProcessingException e) {
      response.setKnowledge(entity.getKnowledge());
    } catch (Exception e) {
      response.setKnowledge(entity.getKnowledge());
    }
    response.setCreatedAt(entity.getCreatedAt());
    response.setUpdatedAt(entity.getUpdatedAt());
    return response;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getServiceName() {
    return serviceName;
  }

  public void setServiceName(String serviceName) {
    this.serviceName = serviceName;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public Object getKnowledge() {
    return knowledge;
  }

  public void setKnowledge(Object knowledge) {
    this.knowledge = knowledge;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
