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

  @Query("SELECT sk FROM ServiceKnowledge sk WHERE sk.serviceName ILIKE CONCAT('%', :serviceName, '%')")
  List<ServiceKnowledge> findByServiceName(@Param("serviceName") String serviceName);

  @Query("SELECT sk FROM ServiceKnowledge sk WHERE " +
         "(:name IS NULL OR sk.serviceName ILIKE %:name%) AND " +
         "(:status IS NULL OR sk.status = :status)")
  List<ServiceKnowledge> search(@Param("name") String name, @Param("status") String status);

  List<ServiceKnowledge> findByStatus(String status);
}
