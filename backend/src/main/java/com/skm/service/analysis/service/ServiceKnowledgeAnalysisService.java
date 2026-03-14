package com.skm.service.analysis.service;

import com.skm.service.analysis.dto.AnalysisRequest;
import com.skm.service.analysis.dto.AnalysisResponse;
import com.skm.service.analysis.dto.AnalysisStepResponse;
import com.skm.service.analysis.entity.ServiceKnowledgeAnalysis;
import com.skm.service.analysis.repository.ServiceKnowledgeAnalysisRepository;
import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * 服务知识分析业务逻辑服务
 */
@Service
@Transactional
public class ServiceKnowledgeAnalysisService {

    private final ServiceKnowledgeAnalysisRepository analysisRepository;
    private final ServiceKnowledgeRepository serviceKnowledgeRepository;

    @Autowired
    public ServiceKnowledgeAnalysisService(ServiceKnowledgeAnalysisRepository analysisRepository,
                                     ServiceKnowledgeRepository serviceKnowledgeRepository) {
        this.analysisRepository = analysisRepository;
        this.serviceKnowledgeRepository = serviceKnowledgeRepository;
    }

    /**
     * 批量分析服务
     */
    @Async
    public CompletableFuture<List<AnalysisResponse>> analyzeServices(AnalysisRequest request) {
        List<AnalysisResponse> responses = new ArrayList<>();

        for (Long serviceId : request.getServiceIds()) {
            AnalysisResponse response = analyzeService(serviceId);
            responses.add(response);
        }

        return CompletableFuture.completedFuture(responses);
    }

    /**
     * 分析单个服务
     */
    public AnalysisResponse analyzeService(Long serviceId) {
        // 获取服务信息
        ServiceKnowledge service = serviceKnowledgeRepository.findById(serviceId)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + serviceId));

        // 创建分析任务
        ServiceKnowledgeAnalysis analysis = new ServiceKnowledgeAnalysis();
        analysis.setService(service);
        analysis.setStatus("pending");
        analysis.setKnowledgeType("api");
        analysis.setStartTime(LocalDateTime.now());
        analysis = analysisRepository.save(analysis);

        AnalysisResponse response = new AnalysisResponse();
        response.setAnalysisId(analysis.getId());
        response.setServiceId(serviceId);
        response.setServiceName(service.getServiceName());
        response.setStatus("pending");
        response.setSteps(createInitialSteps());
        response.setStartTime(analysis.getStartTime());

        // 异步执行分析（模拟）
        executeAnalysis(analysis);

        return response;
    }

    /**
     * 执行分析（模拟）
     */
    private void executeAnalysis(ServiceKnowledgeAnalysis analysis) {
        try {
            // 更新状态为进行中
            analysis.setStatus("in_progress");
            analysisRepository.save(analysis);

            // 模拟分析步骤（这里只是示例，实际应该调用分析引擎）
            Thread.sleep(1000); // 模拟代码下载

            // 从服务知识中提取API信息（如果有）
            String apiContent = extractAPIContent(analysis.getService());

            analysis.setStatus("completed");
            analysis.setContent(apiContent);
            analysis.setConfidence(85.0);
            analysis.setEndTime(LocalDateTime.now());
            analysisRepository.save(analysis);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            analysis.setStatus("failed");
            analysis.setErrorMessage("Analysis interrupted: " + e.getMessage());
            analysis.setEndTime(LocalDateTime.now());
            analysisRepository.save(analysis);
        }
    }

    /**
     * 从服务知识中提取API内容（示例）
     */
    private String extractAPIContent(ServiceKnowledge service) {
        // 这里应该实际分析代码，这里只返回示例数据
        return "{\"api_endpoints\": [{\"path\": \"/api/\" + service.getServiceName() + \"/items\", \"method\": \"GET\", \"description\": \"Get items list\"}]}";
    }

    /**
     * 创建初始分析步骤
     */
    private List<AnalysisStepResponse> createInitialSteps() {
        List<AnalysisStepResponse> steps = new ArrayList<>();

        steps.add(createStep("代码下载", "从Git仓库拉取代码", "pending"));
        steps.add(createStep("代码扫描", "扫描项目结构", "pending"));
        steps.add(createStep("API提取", "提取REST接口定义", "pending"));
        steps.add(createStep("依赖分析", "分析服务间调用关系", "pending"));
        steps.add(createStep("配置提取", "读取配置文件", "pending"));
        steps.add(createStep("生成文档", "生成Markdown文档", "pending"));
        steps.add(createStep("入库", "保存到知识库", "pending"));

        return steps;
    }

    /**
     * 创建分析步骤
     */
    private AnalysisStepResponse createStep(String name, String description, String status) {
        AnalysisStepResponse step = new AnalysisStepResponse();
        step.setStepName(name);
        step.setDescription(description);
        step.setStatus(status);
        return step;
    }

    /**
     * 获取分析进度
     */
    public AnalysisResponse getAnalysisProgress(Long serviceId) {
        ServiceKnowledgeAnalysis analysis = analysisRepository.findByServiceIdAndKnowledgeType(serviceId, "api")
            .orElseThrow(() -> new RuntimeException("Analysis not found for service: " + serviceId));

        AnalysisResponse response = new AnalysisResponse();
        response.setAnalysisId(analysis.getId());
        response.setServiceId(serviceId);
        response.setServiceName(analysis.getService().getServiceName());
        response.setStatus(analysis.getStatus());
        response.setSteps(createStepsFromContent(analysis.getContent()));
        response.setStartTime(analysis.getStartTime());
        response.setEndTime(analysis.getEndTime());
        response.setConfidence(analysis.getConfidence());
        response.setErrorMessage(analysis.getErrorMessage());

        return response;
    }

    /**
     * 从内容创建步骤（简化版）
     */
    private List<AnalysisStepResponse> createStepsFromContent(String content) {
        // 简化版，只返回固定的步骤
        return createInitialSteps();
    }
}
