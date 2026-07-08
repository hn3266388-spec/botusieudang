import API from './axios';

export const statisticsApi = {
  // Dashboard Statistics
  getDashboardStats: () =>
    API.get('/api/statistics/dashboard'),

  // Revenue Statistics
  getRevenueStats: (period = 'month') =>
    API.get(`/api/statistics/revenue?period=${period}`),

  // Sales by period
  getSalesByPeriod: (period = 'month') =>
    API.get(`/api/statistics/sales/${period}`),

  // Orders by status
  getOrdersByStatus: () =>
    API.get('/api/statistics/orders-by-status'),

  // Top products
  getTopProducts: () =>
    API.get('/api/statistics/top-products'),
};