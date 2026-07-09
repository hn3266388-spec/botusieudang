import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy giỏ hàng
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await cartApi.getCart();
      setCartItems(res.data?.cartItems || []);
    } catch (error) {
      console.error('❌ Lỗi lấy giỏ hàng:', error.response?.status);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Thêm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return false;
    }

    try {
      const res = await cartApi.addToCart(productId, quantity);
      toast.success(res.data?.message || 'Đã thêm vào giỏ!');
      await fetchCart();
      return true;
    } catch (error) {
      console.error('❌ Lỗi thêm giỏ hàng:', error.response?.data);
      toast.error(error.response?.data || 'Thêm giỏ hàng thất bại');
      return false;
    }
  };

  // ✅ Cập nhật số lượng
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const res = await cartApi.updateQuantity(productId, quantity);
      toast.success(res.data?.message || 'Đã cập nhật!');
      await fetchCart();
    } catch (error) {
      console.error('❌ Lỗi cập nhật:', error.response?.data);
      toast.error(error.response?.data || 'Cập nhật thất bại');
    }
  };

  // ✅ Xóa 1 sản phẩm
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      const res = await cartApi.removeFromCart(productId);
      toast.success(res.data || 'Đã xóa khỏi giỏ hàng!');
      await fetchCart();
    } catch (error) {
      console.error('❌ Lỗi xóa giỏ hàng:', error.response?.data);
      toast.error(error.response?.data || 'Xóa thất bại');
    }
  };

  // ✅ Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await cartApi.clearCart();
      toast.success(res.data || 'Đã xóa toàn bộ giỏ hàng!');
      await fetchCart();
    } catch (error) {
      console.error('❌ Lỗi xóa giỏ hàng:', error.response?.data);
      toast.error(error.response?.data || 'Xóa giỏ hàng thất bại');
    }
  };

  // ✅ Tính tổng
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      totalItems,
      totalPrice,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};