package com.skm.service.knowledge.repository;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ServiceKnowledgeRepositoryTest {

  @Autowired
  private ServiceKnowledgeRepository repository;

  @Test
  void testSaveAndFindById() {
    // Given
    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName("test-service");
    sk.setVersion("1.0.0");
    sk.setStatus("draft");
    sk.setKnowledge("{\"test\":\"data\"}");

    // When
    ServiceKnowledge saved = repository.save(sk);

    // Then
    assertNotNull(saved.getId());
    assertTrue(repository.findById(saved.getId()).isPresent());
    assertEquals("test-service", repository.findById(saved.getId()).get().getServiceName());
  }

  @Test
  void testFindByServiceName() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("service-a");
    sk1.setVersion("1.0.0");
    sk1.setStatus("published");
    sk1.setKnowledge("{\"a\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("service-b");
    sk2.setVersion("1.0.0");
    sk2.setStatus("published");
    sk2.setKnowledge("{\"b\":\"data\"}");
    repository.save(sk2);

    // When
    List<ServiceKnowledge> result = repository.findByServiceName("service-");

    // Then
    assertEquals(2, result.size());
    assertTrue(result.stream().anyMatch(sk -> "service-a".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "service-b".equals(sk.getServiceName())));
  }

  @Test
  void testDelete() {
    // Given
    ServiceKnowledge sk = new ServiceKnowledge();
    sk.setServiceName("to-delete");
    sk.setVersion("1.0.0");
    sk.setStatus("draft");
    sk.setKnowledge("{\"test\":\"data\"}");
    ServiceKnowledge saved = repository.save(sk);
    Long id = saved.getId();

    // When
    repository.deleteById(id);

    // Then
    assertTrue(repository.findById(id).isEmpty());
  }
}
