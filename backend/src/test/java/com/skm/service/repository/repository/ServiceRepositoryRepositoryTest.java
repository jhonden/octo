package com.skm.service.repository.repository;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.repository.entity.ServiceRepository;
import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ServiceRepository JPA Repository测试
 * TDD：测试数据访问层
 */
@DataJpaTest
@DisplayName("ServiceRepository Repository测试")
class ServiceRepositoryRepositoryTest {

    // 注意：实际使用时需要注入ServiceRepository和EntityManager
    // 这里先定义测试用例结构

    @Test
    @DisplayName("保存服务仓库")
    void testSaveServiceRepository() {
        // Given - 准备测试数据
        ServiceKnowledge service = new ServiceKnowledge();
        service.setServiceName("test-service");

        ServiceRepository repository = new ServiceRepository();
        repository.setService(service);
        repository.setUrl("https://github.com/example/service.git");
        repository.setType("git");
        repository.setIsPrimary(true);

        // When - 保存
        ServiceRepository saved = serviceRepository.save(repository);

        // Then - 验证
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUrl()).isEqualTo("https://github.com/example/service.git");
    }

    @Test
    @DisplayName("根据服务ID查找仓库")
    void testFindRepositoriesByServiceId() {
        // Given
        ServiceKnowledge service = new ServiceKnowledge();
        service.setServiceName("test-service");

        ServiceRepository repo1 = new ServiceRepository(service, "git", "https://git1.com");
        ServiceRepository repo2 = new ServiceRepository(service, "git", "https://git2.com");
        serviceRepository.saveAll(List.of(repo1, repo2));

        // When
        List<ServiceRepository> repositories = serviceRepository.findByServiceId(service.getId());

        // Then
        assertThat(repositories).hasSize(2);
    }

    @Test
    @DisplayName("删除仓库")
    void testDeleteRepository() {
        // Given
        ServiceKnowledge service = new ServiceKnowledge();
        service.setServiceName("test-service");

        ServiceRepository repository = new ServiceRepository(service, "git", "https://git1.com");
        ServiceRepository saved = serviceRepository.save(repository);
        Long repoId = saved.getId();

        // When
        serviceRepository.deleteById(repoId);

        // Then
        Optional<ServiceRepository> deleted = serviceRepository.findById(repoId);
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("查找主仓库")
    void testFindPrimaryRepository() {
        // Given
        ServiceKnowledge service = new ServiceKnowledge();
        service.setServiceName("test-service");

        ServiceRepository repo1 = new ServiceRepository(service, "git", "https://git1.com");
        repo1.setIsPrimary(true);
        ServiceRepository repo2 = new ServiceRepository(service, "git", "https://git2.com");
        repo2.setIsPrimary(false);
        serviceRepository.saveAll(List.of(repo1, repo2));

        // When
        ServiceRepository primary = serviceRepository.findByServiceIdAndIsPrimary(service.getId(), true);

        // Then
        assertThat(primary).isNotNull();
        assertThat(primary.getUrl()).isEqualTo("https://git1.com");
    }
}
