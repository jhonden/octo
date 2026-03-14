import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const serviceKnowledgeAPI = {
  getAll: () => api.get('/service-knowledge'),
  getById: (id) => api.get(`/service-knowledge/${id}`),
  create: (data) => api.post('/service-knowledge', data),
  update: (id, data) => api.put(`/service-knowledge/${id}`, data),
  delete: (id) => api.delete(`/service-knowledge/${id}`),
  search: (params) => api.get('/service-knowledge/search', { params })
};

export const serviceRepositoryAPI = {
  getByServiceId: (serviceId) => api.get('/service-repositories', { params: { serviceId } }),
  create: (data) => api.post('/service-repositories', data),
  setPrimary: (repositoryId, serviceId) =>
    api.post(`/service-repositories/${repositoryId}/set-primary`, null, { params: { serviceId } }),
  delete: (id) => api.delete(`/service-repositories/${id}`)
};

export default api;
