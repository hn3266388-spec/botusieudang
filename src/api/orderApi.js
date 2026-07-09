import API from './axios';

export const orderApi = {
  purchase: (id, q) => API.post('/api/orders/purchase', { productId: id, quantity: q }),
  getMyOrders: () => API.get('/api/orders/my-orders'),
  getAllOrders: () => API.get('/api/orders/admin/all'),
  updateStatus: (id, s) => API.put(`/api/orders/admin/${id}/status?status=${s}`),
  cancelOrder: (orderId) => API.put(`/api/orders/${orderId}/cancel`),
};