package com.skm.service.repository.dto;

import com.skm.service.repository.entity.ServiceRepository;
import java.time.LocalDateTime;

/**
 * 服务仓库响应DTO
 */
public class ServiceRepositoryResponse {

    private Long id;
    private Long serviceId;
    private String type;
    private String url;
    private String path;
    private String defaultBranch;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * 从实体转换为响应DTO
     */
    public static ServiceRepositoryResponse fromEntity(ServiceRepository repository) {
        ServiceRepositoryResponse response = new ServiceRepositoryResponse();
        response.setId(repository.getId());
        response.setServiceId(repository.getService() != null ? repository.getService().getId() : null);
        response.setType(repository.getType());
        response.setUrl(repository.getUrl());
        response.setPath(repository.getPath());
        response.setDefaultBranch(repository.getDefaultBranch());
        response.setIsPrimary(repository.getIsPrimary());
        response.setCreatedAt(repository.getCreatedAt());
        response.setUpdatedAt(repository.getUpdatedAt());
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
