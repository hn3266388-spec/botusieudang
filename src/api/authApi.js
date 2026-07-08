import API from './axios';

export const authApi = {
  // ✅ Đúng: /api/users/register
  register: (username, password) =>
    API.post('/api/users/register', { username, password }),

  // ✅ Đúng: /api/users/login
  login: (username, password) =>
    API.post('/api/users/login', { username, password }),

  // ✅ Đúng: /api/users/profile
  getProfile: () =>
    API.get('/api/users/profile'),

  // ✅ Đúng: /api/users/refresh
  refresh: (refreshToken) =>
    API.post('/api/users/refresh', { refreshToken }),
};