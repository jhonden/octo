package com.skm.service.repository.service;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import com.skm.service.repository.dto.ServiceRepositoryRequest;
import com.skm.service.repository.dto.ServiceRepositoryResponse;
import com.skm.service.repository.entity.ServiceRepository;
import com.skm.service.repository.repository.ServiceRepositoryJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 服务仓库业务逻辑服务
 */
@Service
@Transactional
public class ServiceRepositoryService {

    private final ServiceRepositoryJpaRepository repositoryJPA;
    private final ServiceKnowledgeRepository serviceKnowledgeRepository;

    @Autowired
    public ServiceRepositoryService(ServiceRepositoryJpaRepository repositoryJPA,
                                 ServiceKnowledgeRepository serviceKnowledgeRepository) {
        this.repositoryJPA = repositoryJPA;
        this.serviceKnowledgeRepository = serviceKnowledgeRepository;
    }

    /**
     * 创建仓库
     */
    public ServiceRepositoryResponse create(ServiceRepositoryRequest request) {
        // 验证服务存在
        ServiceKnowledge service = serviceKnowledgeRepository.findById(request.getServiceId())
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + request.getServiceId()));

        // 验证仓库URL唯一性
        if (request.getUrl() != null) {
            Optional<ServiceRepository> existing = repositoryJPA.findByUrl(request.getUrl());
            if (existing.isPresent()) {
                throw new RuntimeException("Repository with this URL already exists");
            }
        }

        // 如果设置为主仓库，需要将其他仓库设置非主
        if (request.getIsPrimary() != null && request.getIsPrimary()) {
            repositoryJPA.findByServiceIdAndIsPrimary(request.getServiceId(), true)
                .ifPresent(repo -> {
                    repo.setIsPrimary(false);
                    repositoryJPA.save(repo);
                });
        }

        // 创建仓库实体
        ServiceRepository repositoryEntity = new ServiceRepository();
        repositoryEntity.setService(service);
        repositoryEntity.setType(request.getType());
        repositoryEntity.setUrl(request.getUrl());
        repositoryEntity.setPath(request.getPath());
        repositoryEntity.setDefaultBranch(request.getDefaultBranch());
        repositoryEntity.setIsPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false);

        ServiceRepository saved = repositoryJPA.save(repositoryEntity);
        return ServiceRepositoryResponse.fromEntity(saved);
    }

    /**
     * 根据服务ID获取所有仓库
     */
    public List<ServiceRepositoryResponse> getByServiceId(Long serviceId) {
        List<ServiceRepository> repositories = repositoryJPA.findByServiceId(serviceId);
        return repositories.stream()
            .map(ServiceRepositoryResponse::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * 设置主仓库
     */
    public void setPrimary(Long serviceId, Long repositoryId) {
        // 将原主仓库取消
        repositoryJPA.findByServiceIdAndIsPrimary(serviceId, true)
            .ifPresent(repo -> {
                repo.setIsPrimary(false);
                repositoryJPA.save(repo);
            });

        // 设置新主仓库
        ServiceRepository repository = repositoryJPA.findById(repositoryId)
            .orElseThrow(() -> new RuntimeException("Repository not found with id: " + repositoryId));
        repository.setIsPrimary(true);
        repositoryJPA.save(repository);
    }

    /**
     * 删除仓库
     */
    public void delete(Long repositoryId) {
        repositoryJPA.deleteById(repositoryId);
    }
}
