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
    sk.setStatus((String) data.getOrDefault("status", "draft"));
    try {
      sk.setKnowledge(objectMapper.writeValueAsString(data));
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize knowledge data", e);
    }

    return repository.save(sk);
  }

  @Transactional
  public ServiceKnowledge update(Long id, Map<String, Object> data) {
    ServiceKnowledge sk = getById(id);
    sk.setVersion((String) data.get("version"));
    sk.setStatus((String) data.get("status"));
    try {
      sk.setKnowledge(objectMapper.writeValueAsString(data));
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to serialize knowledge data", e);
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
