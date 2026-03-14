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

  @Test
  void testSearchWithNullParameters() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("alpha-service");
    sk1.setVersion("1.0.0");
    sk1.setStatus("draft");
    sk1.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("beta-service");
    sk2.setVersion("2.0.0");
    sk2.setStatus("published");
    sk2.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk2);

    ServiceKnowledge sk3 = new ServiceKnowledge();
    sk3.setServiceName("gamma-service");
    sk3.setVersion("1.5.0");
    sk3.setStatus("archived");
    sk3.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk3);

    // When
    List<ServiceKnowledge> result = repository.search(null, null);

    // Then
    assertEquals(3, result.size());
    assertTrue(result.stream().anyMatch(sk -> "alpha-service".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "beta-service".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "gamma-service".equals(sk.getServiceName())));
  }

  @Test
  void testSearchByNameOnly() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("user-service");
    sk1.setVersion("1.0.0");
    sk1.setStatus("draft");
    sk1.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("order-service");
    sk2.setVersion("2.0.0");
    sk2.setStatus("published");
    sk2.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk2);

    ServiceKnowledge sk3 = new ServiceKnowledge();
    sk3.setServiceName("product-service");
    sk3.setVersion("1.5.0");
    sk3.setStatus("archived");
    sk3.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk3);

    // When
    List<ServiceKnowledge> result = repository.search("service", null);

    // Then
    assertEquals(3, result.size());
    assertTrue(result.stream().anyMatch(sk -> "user-service".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "order-service".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "product-service".equals(sk.getServiceName())));
  }

  @Test
  void testSearchByStatusOnly() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("alpha-service");
    sk1.setVersion("1.0.0");
    sk1.setStatus("draft");
    sk1.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("beta-service");
    sk2.setVersion("2.0.0");
    sk2.setStatus("published");
    sk2.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk2);

    ServiceKnowledge sk3 = new ServiceKnowledge();
    sk3.setServiceName("gamma-service");
    sk3.setVersion("1.5.0");
    sk3.setStatus("published");
    sk3.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk3);

    // When
    List<ServiceKnowledge> result = repository.search(null, "published");

    // Then
    assertEquals(2, result.size());
    assertTrue(result.stream().anyMatch(sk -> "beta-service".equals(sk.getServiceName())));
    assertTrue(result.stream().anyMatch(sk -> "gamma-service".equals(sk.getServiceName())));
    assertFalse(result.stream().anyMatch(sk -> "alpha-service".equals(sk.getServiceName())));
  }

  @Test
  void testSearchByNameAndStatus() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("api-service");
    sk1.setVersion("1.0.0");
    sk1.setStatus("published");
    sk1.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("api-service-v2");
    sk2.setVersion("2.0.0");
    sk2.setStatus("draft");
    sk2.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk2);

    ServiceKnowledge sk3 = new ServiceKnowledge();
    sk3.setServiceName("web-service");
    sk3.setVersion("1.5.0");
    sk3.setStatus("published");
    sk3.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk3);

    // When
    List<ServiceKnowledge> result = repository.search("api", "published");

    // Then
    assertEquals(1, result.size());
    assertEquals("api-service", result.get(0).getServiceName());
    assertEquals("published", result.get(0).getStatus());
  }

  @Test
  void testSearchCaseInsensitive() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("UserService");
    sk1.setVersion("1.0.0");
    sk1.setStatus("draft");
    sk1.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("USER-SERVICE");
    sk2.setVersion("2.0.0");
    sk2.setStatus("draft");
    sk2.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk2);

    ServiceKnowledge sk3 = new ServiceKnowledge();
    sk3.setServiceName("user-service");
    sk3.setVersion("1.5.0");
    sk3.setStatus("draft");
    sk3.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk3);

    // When
    List<ServiceKnowledge> resultLower = repository.search("user", null);
    List<ServiceKnowledge> resultUpper = repository.search("USER", null);
    List<ServiceKnowledge> resultMixed = repository.search("User", null);

    // Then
    assertEquals(3, resultLower.size());
    assertEquals(3, resultUpper.size());
    assertEquals(3, resultMixed.size());
  }

  @Test
  void testFindByStatus() {
    // Given
    ServiceKnowledge sk1 = new ServiceKnowledge();
    sk1.setServiceName("draft-service");
    sk1.setVersion("1.0.0");
    sk1.setStatus("draft");
    sk1.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk1);

    ServiceKnowledge sk2 = new ServiceKnowledge();
    sk2.setServiceName("published-service-1");
    sk2.setVersion("2.0.0");
    sk2.setStatus("published");
    sk2.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk2);

    ServiceKnowledge sk3 = new ServiceKnowledge();
    sk3.setServiceName("published-service-2");
    sk3.setVersion("1.5.0");
    sk3.setStatus("published");
    sk3.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk3);

    ServiceKnowledge sk4 = new ServiceKnowledge();
    sk4.setServiceName("archived-service");
    sk4.setVersion("3.0.0");
    sk4.setStatus("archived");
    sk4.setKnowledge("{\"test\":\"data\"}");
    repository.save(sk4);

    // When
    List<ServiceKnowledge> draftResult = repository.findByStatus("draft");
    List<ServiceKnowledge> publishedResult = repository.findByStatus("published");
    List<ServiceKnowledge> archivedResult = repository.findByStatus("archived");

    // Then
    assertEquals(1, draftResult.size());
    assertEquals("draft-service", draftResult.get(0).getServiceName());

    assertEquals(2, publishedResult.size());
    assertTrue(publishedResult.stream().anyMatch(sk -> "published-service-1".equals(sk.getServiceName())));
    assertTrue(publishedResult.stream().anyMatch(sk -> "published-service-2".equals(sk.getServiceName())));

    assertEquals(1, archivedResult.size());
    assertEquals("archived-service", archivedResult.get(0).getServiceName());
  }
}
