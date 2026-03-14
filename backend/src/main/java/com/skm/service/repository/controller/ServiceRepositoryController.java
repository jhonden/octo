package com.skm.service.repository.controller;

import com.skm.service.repository.dto.ServiceRepositoryRequest;
import com.skm.service.repository.dto.ServiceRepositoryResponse;
import com.skm.service.repository.service.ServiceRepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 服务仓库API控制器
 */
@RestController
@RequestMapping("/api/service-repositories")
@CrossOrigin(origins = "*")
public class ServiceRepositoryController {

    private final ServiceRepositoryService service;

    @Autowired
    public ServiceRepositoryController(ServiceRepositoryService service) {
        this.service = service;
    }

    /**
     * 创建仓库
     */
    @PostMapping
    public ResponseEntity<ServiceRepositoryResponse> create(@RequestBody ServiceRepositoryRequest request) {
        ServiceRepositoryResponse response = service.create(request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * 获取仓库列表（根据服务ID）
     */
    @GetMapping
    public ResponseEntity<List<ServiceRepositoryResponse>> getByServiceId(
            @RequestParam Long serviceId) {
        List<ServiceRepositoryResponse> responses = service.getByServiceId(serviceId);
        return ResponseEntity.ok(responses);
    }

    /**
     * 设置主仓库
     */
    @PostMapping("/{id}/set-primary")
    public ResponseEntity<Void> setPrimary(
            @PathVariable Long id,
            @RequestParam Long serviceId) {
        service.setPrimary(serviceId, id);
        return ResponseEntity.ok().build();
    }

    /**
     * 删除仓库
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
