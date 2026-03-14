package com.skm.service.knowledge.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceKnowledgeServiceTest {

  @Mock
  private ServiceKnowledgeRepository repository;

  @Mock
  private ObjectMapper objectMapper;

  @InjectMocks
  private ServiceKnowledgeService service;

  @Test
  void testCreateService() throws JsonProcessingException {
    // Given
    when(objectMapper.writeValueAsString(any())).thenReturn("{}");
    when(repository.save(any())).thenAnswer(invocation -> {
      ServiceKnowledge mock = invocation.getArgument(0);
      mock.setId(1L);
      return mock;
    });

    // When
    Map<String, Object> data = Map.of(
        "serviceName", "test-service",
        "version", "1.0.0",
        "status", "published"
    );

    // Then
    ServiceKnowledge result = service.create(data);

    assertNotNull(result);
    assertEquals("test-service", result.getServiceName());
    assertEquals("1.0.0", result.getVersion());
    assertEquals("published", result.getStatus());
    verify(repository).save(any());
  }

  @Test
  void testCreateServiceWithoutVersion() throws JsonProcessingException {
    // Given
    when(objectMapper.writeValueAsString(any())).thenReturn("{}");
    when(repository.save(any())).thenAnswer(invocation -> {
      ServiceKnowledge mock = invocation.getArgument(0);
      mock.setId(1L);
      return mock;
    });

    // When
    Map<String, Object> data = Map.of("serviceName", "test-service");

    // Then
    ServiceKnowledge result = service.create(data);

    assertNotNull(result);
    assertEquals("test-service", result.getServiceName());
    assertNull(result.getVersion());
    assertEquals("draft", result.getStatus()); // default status
    verify(repository).save(any());
  }

  @Test
  void testCreateServiceWithNullServiceName() {
    // Given
    Map<String, Object> data = Map.of("version", "1.0.0");

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> service.create(data));
    verify(repository, never()).save(any());
  }

  @Test
  void testCreateServiceWithEmptyServiceName() {
    // Given
    Map<String, Object> data = Map.of("serviceName", "", "version", "1.0.0");

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> service.create(data));
    verify(repository, never()).save(any());
  }

  @Test
  void testGetById() {
    // Given
    ServiceKnowledge mock = new ServiceKnowledge();
    mock.setId(1L);
    mock.setServiceName("test-service");
    when(repository.findById(1L)).thenReturn(Optional.of(mock));

    // When
    ServiceKnowledge result = service.getById(1L);

    // Then
    assertNotNull(result);
    assertEquals("test-service", result.getServiceName());
    verify(repository).findById(1L);
  }

  @Test
  void testGetByIdNotFound() {
    // Given
    when(repository.findById(999L)).thenReturn(Optional.empty());

    // When & Then
    assertThrows(RuntimeException.class, () -> service.getById(999L));
    verify(repository).findById(999L);
  }

  @Test
  void testGetByServiceName() {
    // Given
    ServiceKnowledge mock = new ServiceKnowledge();
    mock.setId(1L);
    mock.setServiceName("test-service");
    when(repository.findByServiceName("test-service")).thenReturn(List.of(mock));

    // When
    ServiceKnowledge result = service.getByServiceName("test-service");

    // Then
    assertNotNull(result);
    assertEquals("test-service", result.getServiceName());
    verify(repository).findByServiceName("test-service");
  }

  @Test
  void testGetByServiceNameNotFound() {
    // Given
    when(repository.findByServiceName("nonexistent")).thenReturn(List.of());

    // When & Then
    assertThrows(RuntimeException.class, () -> service.getByServiceName("nonexistent"));
    verify(repository).findByServiceName("nonexistent");
  }

  @Test
  void testGetAll() {
    // Given
    when(repository.findAll()).thenReturn(List.of());

    // When
    List<ServiceKnowledge> result = service.getAll();

    // Then
    assertNotNull(result);
    verify(repository).findAll();
  }

  @Test
  void testSearch() {
    // Given
    ServiceKnowledge mock = new ServiceKnowledge();
    mock.setId(1L);
    mock.setServiceName("test-service");
    mock.setStatus("published");
    when(repository.search("test", "published")).thenReturn(List.of(mock));

    // When
    List<ServiceKnowledge> result = service.search("test", "published");

    // Then
    assertNotNull(result);
    assertEquals(1, result.size());
    assertEquals("test-service", result.get(0).getServiceName());
    verify(repository).search("test", "published");
  }

  @Test
  void testUpdate() throws JsonProcessingException {
    // Given
    when(objectMapper.writeValueAsString(any())).thenReturn("{}");
    ServiceKnowledge existing = new ServiceKnowledge();
    existing.setId(1L);
    existing.setServiceName("test-service");
    existing.setVersion("1.0.0");
    existing.setStatus("draft");

    when(repository.findById(1L)).thenReturn(Optional.of(existing));
    when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    Map<String, Object> data = Map.of(
        "version", "2.0.0",
        "status", "published"
    );
    ServiceKnowledge result = service.update(1L, data);

    // Then
    assertNotNull(result);
    assertEquals("2.0.0", result.getVersion());
    assertEquals("published", result.getStatus());
    verify(repository).findById(1L);
    verify(repository).save(any());
  }

  @Test
  void testUpdateNotFound() {
    // Given
    when(repository.findById(999L)).thenReturn(Optional.empty());

    // When & Then
    Map<String, Object> data = Map.of("version", "2.0.0");
    assertThrows(RuntimeException.class, () -> service.update(999L, data));
    verify(repository).findById(999L);
    verify(repository, never()).save(any());
  }

  @Test
  void testDelete() {
    // Given
    when(repository.existsById(1L)).thenReturn(true);
    doNothing().when(repository).deleteById(1L);

    // When
    service.delete(1L);

    // Then
    verify(repository).existsById(1L);
    verify(repository).deleteById(1L);
  }

  @Test
  void testDeleteNotFound() {
    // Given
    when(repository.existsById(999L)).thenReturn(false);

    // When & Then
    assertThrows(RuntimeException.class, () -> service.delete(999L));
    verify(repository).existsById(999L);
    verify(repository, never()).deleteById(999L);
  }
}
