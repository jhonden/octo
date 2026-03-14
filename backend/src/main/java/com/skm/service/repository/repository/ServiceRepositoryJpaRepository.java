package com.skm.service.repository.repository;

import com.skm.service.repository.entity.ServiceRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ServiceRepository数据访问接口
 */
@Repository
public interface ServiceRepositoryJpaRepository extends JpaRepository<ServiceRepository, Long> {

    /**
     * 根据服务ID查找所有仓库
     */
    List<ServiceRepository> findByServiceId(Long serviceId);

    /**
     * 根据服务ID和主仓库标识查找
     */
    Optional<ServiceRepository> findByServiceIdAndIsPrimary(Long serviceId, Boolean isPrimary);

    /**
     * 根据URL查找仓库（用于检查重复）
     */
    Optional<ServiceRepository> findByUrl(String url);
}
