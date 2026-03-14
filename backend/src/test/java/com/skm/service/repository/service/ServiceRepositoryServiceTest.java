package com.skm.service.repository.service;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.knowledge.repository.ServiceKnowledgeRepository;
import com.skm.service.repository.dto.ServiceRepositoryRequest;
import com.skm.service.repository.dto.ServiceRepositoryResponse;
import com.skm.service.repository.entity.ServiceRepository;
import com.skm.service.repository.repository.ServiceRepositoryRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * ServiceRepository Service测试
 * TDD：测试业务逻辑层
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ServiceRepository Service测试")
class ServiceRepositoryServiceTest {

    @Mock
    private ServiceRepositoryRepository repository;

    @Mock
    private ServiceKnowledgeRepository serviceKnowledgeRepository;

    @InjectMocks
    private ServiceRepositoryService service;

    @Test
    @DisplayName("创建Git仓库 - 成功")
    void testCreateGitRepository_Success() {
        // Given
        ServiceKnowledge service = new ServiceKnowledge();
        service.setId(1L);
        service.setServiceName("test-service");

        ServiceRepositoryRequest request = new ServiceRepositoryRequest();
        request.setServiceId(1L);
        request.setType("git");
        request.setUrl("https://github.com/example/service.git");
        request.setDefaultBranch("main");
        request.setIsPrimary(true);

        when(serviceKnowledgeRepository.findById(1L)).thenReturn(Optional.of(service));
        when(repository.findByUrl(any())).thenReturn(Optional.empty());
        when(repository.save(any(ServiceRepository.class))).thenAnswer(invocation -> {
            ServiceRepository repo = invocation.getArgument(0);
            repo.setId(1L);
            return repo;
        });

        // When
        ServiceRepositoryResponse response = service.create(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getType()).isEqualTo("git");
        assertThat(response.getUrl()).isEqualTo("https://github.com/example/service.git");
        assertThat(response.getIsPrimary()).isTrue();

        verify(repository).save(any(ServiceRepository.class));
    }

    @Test
    @DisplayName("创建Git仓库 - 服务不存在")
    void testCreateGitRepository_ServiceNotFound() {
        // Given
        ServiceRepositoryRequest request = new ServiceRepositoryRequest();
        request.setServiceId(999L);
        request.setType("git");

        when(serviceKnowledgeRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> service.create(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Service not found");
    }

    @Test
    @DisplayName("创建Git仓库 - URL已存在")
    void testCreateGitRepository_UrlExists() {
        // Given
        ServiceKnowledge service = new ServiceKnowledge();
        service.setId(1L);

        ServiceRepositoryRequest request = new ServiceRepositoryRequest();
        request.setServiceId(1L);
        request.setType("git");
        request.setUrl("https://github.com/example/service.git");

        ServiceRepository existingRepo = new ServiceRepository();
        when(serviceKnowledgeRepository.findById(1L)).thenReturn(Optional.of(service));
        when(repository.findByUrl("https://github.com/example/service.git"))
            .thenReturn(Optional.of(existingRepo));

        // When & Then
        assertThatThrownBy(() -> service.create(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Repository with this URL already exists");
    }

    @Test
    @DisplayName("根据服务ID获取仓库列表")
    void testGetRepositoriesByServiceId() {
        // Given
        ServiceRepository repo1 = new ServiceRepository();
        repo1.setId(1L);
        repo1.setUrl("https://git1.com");

        ServiceRepository repo2 = new ServiceRepository();
        repo2.setId(2L);
        repo2.setUrl("https://git2.com");

        when(repository.findByServiceId(1L)).thenReturn(List.of(repo1, repo2));

        // When
        List<ServiceRepositoryResponse> responses = service.getByServiceId(1L);

        // Then
        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getUrl()).isEqualTo("https://git1.com");
        assertThat(responses.get(1).getUrl()).isEqualTo("https://git2.com");
    }

    @Test
    @DisplayName("设置主仓库")
    void testSetPrimaryRepository() {
        // Given
        ServiceRepository repo1 = new ServiceRepository();
        repo1.setId(1L);
        repo1.setService(new ServiceKnowledge());
        repo1.setIsPrimary(false);

        ServiceRepository repo2 = new ServiceRepository();
        repo2.setId(2L);
        repo2.setService(new ServiceKnowledge());
        repo2.setIsPrimary(true);

        when(repository.findById(1L)).thenReturn(Optional.of(repo1));
        when(repository.findByServiceIdAndIsPrimary(1L, true)).thenReturn(Optional.of(repo2));
        when(repository.save(any(ServiceRepository.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        service.setPrimary(1L, 1L);

        // Then
        verify(repository).save(repo1);
        verify(repository).save(repo2);
        assertThat(repo1.getIsPrimary()).isTrue();
        assertThat(repo2.getIsPrimary()).isFalse();
    }

    @Test
    @DisplayName("删除仓库")
    void testDeleteRepository() {
        // Given
        ServiceRepository repository = new ServiceRepository();
        repository.setId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(repository));

        // When
        service.delete(1L);

        // Then
        verify(repository).deleteById(1L);
    }
}
