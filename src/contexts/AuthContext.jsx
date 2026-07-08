import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      setUser(res.data);
    } catch (error) {
      console.error('❌ Load user failed:', error.response?.status);
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authApi.login(username, password);
      const { accessToken, refreshToken, role } = res.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      
      setUser({ username, role });
      toast.success('Đăng nhập thành công!');
      return true;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data);
      toast.error(error.friendlyMessage || 'Đăng nhập thất bại');
      return false;
    }
  };

  // ✅ Sửa hàm register
  const register = async (username, password) => {
    try {
      const res = await authApi.register(username, password);
      console.log('✅ Đăng ký thành công:', res.data);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return true;
    } catch (error) {
      console.error('❌ Register error:', error.response?.data);
      const message = error.response?.data || 'Đăng ký thất bại';
      toast.error(message);
      throw new Error(message); // ✅ Ném lỗi để component bắt
    }
  };

  const logout = () => {
  localStorage.clear();
  setUser(null);
  toast.info('Đã đăng xuất');
  window.location.href = '/';  // ← Về trang chủ khi logout
};

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};