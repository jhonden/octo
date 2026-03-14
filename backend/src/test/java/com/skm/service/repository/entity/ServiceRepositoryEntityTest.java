package com.skm.service.repository.entity;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import com.skm.service.repository.entity.ServiceRepository;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ServiceRepository实体测试
 * TDD步骤：红灯测试 → 实现实体 → 绿灯测试
 */
class ServiceRepositoryEntityTest {

    @Test
    @DisplayName("创建服务仓库实体 - 基本属性")
    void testCreateServiceEntity_BasicProperties() {
        // Given - 准备测试数据
        ServiceKnowledge service = new ServiceKnowledge();
        service.setId(1L);
        service.setServiceName("test-service");

        ServiceRepository repository = new ServiceRepository();
        repository.setService(service);
        repository.setUrl("https://github.com/example/service.git");
        repository.setType("git");
        repository.setBranch("main");
        repository.setIsPrimary(true);

        // Then - 验证属性
        assertThat(repository.getService()).isNotNull();
        assertThat(repository.getService().getServiceName()).isEqualTo("test-service");
        assertThat(repository.getUrl()).isEqualTo("https://github.com/example/service.git");
        assertThat(repository.getType()).isEqualTo("git");
        assertThat(repository.getBranch()).isEqualTo("main");
        assertThat(repository.isPrimary()).isTrue();
    }

    @Test
    @DisplayName("创建本地仓库实体")
    void testCreateLocalRepositoryEntity() {
        // Given - 准备测试数据
        ServiceKnowledge service = new ServiceKnowledge();
        service.setId(1L);

        ServiceRepository repository = new ServiceRepository();
        repository.setService(service);
        repository.setPath("/Users/username/service");
        repository.setType("local");
        repository.setIsPrimary(true);

        // Then - 验证本地仓库属性
        assertThat(repository.getType()).isEqualTo("local");
        assertThat(repository.getPath()).isEqualTo("/Users/username/service");
        assertThat(repository.isPrimary()).isTrue();
    }

    @Test
    @DisplayName("仓库类型验证")
    void testRepositoryTypeValidation() {
        // Given
        ServiceRepository gitRepo = new ServiceRepository();
        gitRepo.setType("git");

        ServiceRepository localRepo = new ServiceRepository();
        localRepo.setType("local");

        // Then
        assertThat(gitRepo.getType()).isIn("git", "local");
        assertThat(localRepo.getType()).isIn("git", "local");
    }
}
