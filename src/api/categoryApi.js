import API from './axios';

export const categoryApi = {
  getAll: () => API.get('/api/categories'),
  getById: (id) => API.get(`/api/categories/${id}`),
  // ✅ Thêm method lấy category theo tên
  getByName: (name) => API.get(`/api/categories/name/${encodeURIComponent(name)}`),
  create: (data) => API.post('/api/categories', data),
  update: (id, data) => API.put(`/api/categories/${id}`, data),
  delete: (id) => API.delete(`/api/categories/${id}`),
};