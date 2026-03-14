import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const serviceRepositoryAPI = {
  /**
   * 根据服务ID获取仓库列表
   */
  getByServiceId: async (serviceId) => {
    const response = await axios.get(`${API_BASE}/api/service-repositories`, {
      params: { serviceId }
    });
    return response.data;
  },

  /**
   * 创建仓库
   */
  create: async (data) => {
    const response = await axios.post(`${API_BASE}/api/service-repositories`, data);
    return response.data;
  },

  /**
   * 设置主仓库
   */
  setPrimary: async (repositoryId, serviceId) => {
    const response = await axios.post(
      `${API_BASE}/api/service-repositories/${repositoryId}/set-primary`,
      null,
      { params: { serviceId } }
    );
    return response.data;
  },

  /**
   * 删除仓库
   */
  delete: async (id) => {
    await axios.delete(`${API_BASE}/api/service-repositories/${id}`);
  }
};
