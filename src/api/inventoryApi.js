import API from './axios';

export const inventoryApi = {
  getAll: () => API.get('/api/inventory'),
  getById: (id) => API.get(`/api/inventory/${id}`),
  getByProduct: (productId) => API.get(`/api/inventory/product/${productId}`),
  importStock: (data) => API.post('/api/inventory/import', data),
  exportStock: (data) => API.post('/api/inventory/export', data),
};