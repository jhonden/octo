package com.skm.service.analysis.dto;

/**
 * 分析步骤响应DTO
 */
public class AnalysisStepResponse {

    private String stepName;
    private String description;
    private String status; // 'pending', 'in_progress', 'completed', 'failed'
    private String message;

    // Getters and Setters
    public String getStepName() { return stepName; }
    public void setStepName(String stepName) { this.stepName = stepName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
