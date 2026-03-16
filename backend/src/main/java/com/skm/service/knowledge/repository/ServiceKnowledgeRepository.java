package com.skm.service.knowledge.repository;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceKnowledgeRepository extends JpaRepository<ServiceKnowledge, Long> {

  // SQLite 不支持 ILIKE，使用 LOWER() 函数实现大小写不敏感查询
  @Query("SELECT sk FROM ServiceKnowledge sk WHERE LOWER(sk.serviceName) LIKE LOWER(CONCAT('%', :serviceName, '%'))")
  List<ServiceKnowledge> findByServiceName(@Param("serviceName") String serviceName);

  @Query("SELECT sk FROM ServiceKnowledge sk WHERE " +
         "(:name IS NULL OR LOWER(sk.serviceName) LIKE LOWER(CONCAT('%', :name, '%')))" +
         "AND (:status IS NULL OR sk.status = :status)")
  List<ServiceKnowledge> search(@Param("name") String name, @Param("status") String status);

  // 添加按状态查询的方法
  List<ServiceKnowledge> findByStatus(String status);
}
