package com.skm.service.knowledge.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import com.skm.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class ServiceKnowledgeService {
  private final ServiceKnowledgeRepository repository;

  @Autowired
  public ServiceKnowledgeService(ServiceKnowledgeRepository repository) {
    this.repository = repository;
  }

  public List<ServiceKnowledge> getAll() {
    return repository.findAll();
  }

  public ServiceKnowledge getById(Long id) {
    return repository.findById(id)
      .orElseThrow(() -> new RuntimeException("Service knowledge not found"));
  }

  public ServiceKnowledge getByServiceName(String serviceName) {
    List<ServiceKnowledge> results = repository.findByServiceName(serviceName);
    if (results.isEmpty()) {
      throw new RuntimeException("Service not found: " + serviceName);
    }
    return results.get(0);
  }

  public List<ServiceKnowledge> search(String name, String status) {
    return repository.search(name, status);
  }

  @Transactional
  public ServiceKnowledge create(Map<String, Object> data) {
    String serviceName = (String) data.get("serviceName");
    if (serviceName == null || serviceName.isEmpty()) {
      throw new IllegalArgumentException("serviceName is required");
    }

    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName(serviceName);
    sk.setVersion((String) data.getOrDefault("version", null));

    // 使用 JsonUtils 处理 JSON 序列化（先初始化）
    String jsonString = "{}";
    if (data.containsKey("knowledge")) {
      Object knowledgeObj = data.get("knowledge");
      if (knowledgeObj != null) {
        String knowledgeStr = knowledgeObj.toString();
        JsonNode knowledgeNode = JsonUtils.toJsonNode(knowledgeStr);
        jsonString = JsonUtils.toJsonString(knowledgeNode);
      } else {
        jsonString = "{}";
      }
    }

    sk.setKnowledge(jsonString);
    sk.setStatus((String) data.getOrDefault("status", "draft"));

    return repository.save(sk);
  }

  @Transactional
  public ServiceKnowledge update(Long id, Map<String, Object> data) {
    ServiceKnowledge sk = getById(id);
    sk.setVersion((String) data.get("version"));

    // 使用 JsonUtils 处理 JSON 序列化
    String jsonString = sk.getKnowledge(); // 保留原有值
    if (data.containsKey("knowledge")) {
      Object knowledgeObj = data.get("knowledge");
      if (knowledgeObj != null) {
        JsonNode knowledgeNode = JsonUtils.toJsonNode(knowledgeObj.toString());
        jsonString = JsonUtils.toJsonString(knowledgeNode);
      } else {
        jsonString = "{}";
      }
    }

    sk.setKnowledge(jsonString);

    if (data.containsKey("status")) {
      sk.setStatus((String) data.get("status"));
    }

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
