package com.skm.service.knowledge.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.knowledge.dto.ServiceKnowledgeRequest;
import com.skm.service.knowledge.dto.ServiceKnowledgeResponse;
import com.skm.service.knowledge.service.ServiceKnowledgeService;
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
  public ServiceKnowledgeResponse create(@RequestBody ServiceKnowledgeRequest request) {
    try {
      Map<String, Object> data = new java.util.HashMap<>();
      data.put("serviceName", request.getServiceName());
      data.put("version", request.getVersion());
      data.put("status", request.getStatus());
      if (request.getKnowledge() != null) {
        data.put("knowledge", request.getKnowledge());
      }
      return ServiceKnowledgeResponse.fromEntity(service.create(data), objectMapper);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to process JSON: " + e.getMessage(), e);
    }
  }

  @PutMapping("/{id}")
  public ServiceKnowledgeResponse update(
      @PathVariable Long id,
      @RequestBody ServiceKnowledgeRequest request) {
    try {
      Map<String, Object> data = new java.util.HashMap<>();
      data.put("version", request.getVersion());
      data.put("status", request.getStatus());
      if (request.getKnowledge() != null) {
        data.put("knowledge", request.getKnowledge());
      }
      return ServiceKnowledgeResponse.fromEntity(service.update(id, data), objectMapper);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to process JSON: " + e.getMessage(), e);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
