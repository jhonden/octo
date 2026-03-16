package com.skm.service.knowledge.dto;

public class ServiceKnowledgeRequest {
  private String serviceName;
  private String version;
  private Object knowledge;

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
}
