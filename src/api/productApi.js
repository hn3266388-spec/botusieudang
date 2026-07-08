import API from './axios';

export const productApi = {
  getAll: (page = 0, size = 12) => API.get(`/api/products?page=${page}&size=${size}`),
  getById: (id) => API.get(`/api/products/${id}`),
  search: (keyword) => API.get(`/api/products/search?keyword=${keyword}`),
  getByCategory: (categoryName) => API.get(`/api/products/category/${categoryName}`), // ← categoryName
  create: (data) => API.post('/api/products', data),
  update: (id, data) => API.put(`/api/products/${id}`, data),
  delete: (id) => API.delete(`/api/products/${id}`),
};