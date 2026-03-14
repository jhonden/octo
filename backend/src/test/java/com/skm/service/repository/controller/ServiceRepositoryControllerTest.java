package com.skm.service.repository.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skm.service.repository.dto.ServiceRepositoryRequest;
import com.skm.service.repository.dto.ServiceRepositoryResponse;
import com.skm.service.repository.service.ServiceRepositoryService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ServiceRepository Controller测试
 * TDD：测试API控制器
 */
@WebMvcTest(ServiceRepositoryController.class)
@DisplayName("ServiceRepository Controller测试")
class ServiceRepositoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRepositoryService service;

    @Test
    @DisplayName("POST /api/service-repositories - 创建仓库成功")
    void testCreateRepository_Success() throws Exception {
        // Given
        ServiceRepositoryRequest request = new ServiceRepositoryRequest();
        request.setServiceId(1L);
        request.setType("git");
        request.setUrl("https://github.com/example/service.git");
        request.setIsPrimary(true);

        ServiceRepositoryResponse response = new ServiceRepositoryResponse();
        response.setId(1L);
        response.setType("git");
        response.setUrl("https://github.com/example/service.git");

        when(service.create(any(ServiceRepositoryRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/service-repositories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.type").value("git"))
            .andExpect(jsonPath("$.url").value("https://github.com/example/service.git"));
    }

    @Test
    @DisplayName("GET /api/service-repositories?serviceId=1 - 获取仓库列表")
    void testGetRepositoriesByServiceId() throws Exception {
        // Given
        ServiceRepositoryResponse repo1 = new ServiceRepositoryResponse();
        repo1.setId(1L);
        repo1.setUrl("https://git1.com");

        ServiceRepositoryResponse repo2 = new ServiceRepositoryResponse();
        repo2.setId(2L);
        repo2.setUrl("https://git2.com");

        when(service.getByServiceId(1L)).thenReturn(List.of(repo1, repo2));

        // When & Then
        mockMvc.perform(get("/api/service-repositories")
                .param("serviceId", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    @DisplayName("DELETE /api/service-repositories/{id} - 删除仓库")
    void testDeleteRepository() throws Exception {
        // Given & When & Then
        mockMvc.perform(delete("/api/service-repositories/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("POST /api/service-repositories/{id}/set-primary - 设置主仓库")
    void testSetPrimaryRepository() throws Exception {
        // Given & When & Then
        mockMvc.perform(post("/api/service-repositories/1/set-primary")
                .param("serviceId", "1"))
            .andExpect(status().isOk());
    }
}
