package com.skm.service.analysis.repository;

import com.skm.service.analysis.entity.ServiceKnowledgeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ServiceKnowledgeAnalysis数据访问接口
 */
@Repository
public interface ServiceKnowledgeAnalysisRepository extends JpaRepository<ServiceKnowledgeAnalysis, Long> {

    /**
     * 根据服务ID查找分析结果
     */
    List<ServiceKnowledgeAnalysis> findByServiceId(Long serviceId);

    /**
     * 根据服务ID和知识类型查找分析结果
     */
    Optional<ServiceKnowledgeAnalysis> findByServiceIdAndKnowledgeType(Long serviceId, String knowledgeType);

    /**
     * 根据状态查找分析结果
     */
    List<ServiceKnowledgeAnalysis> findByStatus(String status);
}
