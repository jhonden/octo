package com.skm.service.analysis.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 分析响应DTO
 */
public class AnalysisResponse {

    private Long analysisId;
    private Long serviceId;
    private String serviceName;
    private String status;
    private List<AnalysisStepResponse> steps;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double confidence;
    private String errorMessage;

    // Getters and Setters
    public Long getAnalysisId() { return analysisId; }
    public void setAnalysisId(Long analysisId) { this.analysisId = analysisId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<AnalysisStepResponse> getSteps() { return steps; }
    public void setSteps(List<AnalysisStepResponse> steps) { this.steps = steps; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
