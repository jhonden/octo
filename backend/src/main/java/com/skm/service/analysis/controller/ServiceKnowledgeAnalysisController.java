package com.skm.service.analysis.controller;

import com.skm.service.analysis.dto.AnalysisRequest;
import com.skm.service.analysis.dto.AnalysisResponse;
import com.skm.service.analysis.service.ServiceKnowledgeAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * 服务知识分析API控制器
 */
@RestController
@RequestMapping("/api/service-knowledge/analysis")
@CrossOrigin(origins = "*")
public class ServiceKnowledgeAnalysisController {

    private final ServiceKnowledgeAnalysisService service;

    @Autowired
    public ServiceKnowledgeAnalysisController(ServiceKnowledgeAnalysisService service) {
        this.service = service;
    }

    /**
     * 批量分析服务
     */
    @PostMapping("/analyze")
    public ResponseEntity<List<AnalysisResponse>> analyze(@RequestBody AnalysisRequest request) {
        CompletableFuture<List<AnalysisResponse>> future = service.analyzeServices(request);
        return ResponseEntity.accepted().build();
    }

    /**
     * 获取分析进度
     */
    @GetMapping("/{serviceId}")
    public ResponseEntity<AnalysisResponse> getAnalysisProgress(@PathVariable Long serviceId) {
        AnalysisResponse response = service.getAnalysisProgress(serviceId);
        return ResponseEntity.ok(response);
    }

    /**
     * 删除分析结果
     */
    @DeleteMapping("/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable Long analysisId) {
        // TODO: 实现删除功能
        return ResponseEntity.noContent().build();
    }
}
