package com.skm.service.analysis.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * 分析请求DTO
 */
public class AnalysisRequest {

    @NotEmpty(message = "Service IDs list cannot be empty")
    private List<Long> serviceIds;

    // Getters and Setters
    public List<Long> getServiceIds() { return serviceIds; }
    public void setServiceIds(List<Long> serviceIds) { this.serviceIds = serviceIds; }
}
