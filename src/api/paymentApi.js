import API from './axios';

export const paymentApi = {
  createPayment: (id, amt) => API.post('/api/payment/create', { orderId: id, amount: amt }),
  getHistory: () => API.get('/api/payment/history'),
  getAllPayments: () => API.get('/api/payment/admin/all'),
};