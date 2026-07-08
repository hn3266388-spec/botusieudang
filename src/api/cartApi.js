import API from './axios';

export const cartApi = {
  // ✅ Thêm /api vào tất cả các endpoint
  getCart: () => API.get('/api/cart'),
  addToCart: (id, q) => API.post('/api/cart', { productId: id, quantity: q }),
  updateQuantity: (id, q) => API.put(`/api/cart/${id}?quantity=${q}`),
  removeFromCart: (id) => API.delete(`/api/cart/${id}`),
  clearCart: () => API.delete('/api/cart'),
};