import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import { formatCurrency } from '../utils/helpers';

export default function CheckoutPage() {
  const { cartItems, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePurchase = async (method) => {
    if (cartItems.length === 0) {
      toast.warning('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    try {
      if (method === 'vnpay') {
        // VNPay: KHÔNG tạo đơn hàng trước, chỉ tạo payment URL
        // Đơn hàng sẽ được tạo sau khi thanh toán thành công (trong callback)
        const res = await paymentApi.createPayment(0, totalPrice);
        // Lưu cart items vào localStorage để tạo đơn sau khi thanh toán thành công
        localStorage.setItem('pendingOrder', JSON.stringify(cartItems));
        await clearCart();
        window.location.href = res.data.paymentUrl;
      } else {
        // COD: Tạo đơn hàng ngay
        for (const item of cartItems) {
          await orderApi.purchase(item.productId, item.quantity);
        }
        await clearCart();
        localStorage.removeItem('pendingOrder');
        toast.success('🎉 Đặt hàng thành công!');
        setOrderSuccess(true);
      }
    } catch (err) {
      console.error('❌ Lỗi đặt hàng:', err);
      toast.error(err.response?.data || 'Đặt hàng thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>🛒 Giỏ hàng trống</h2>
        <button onClick={() => navigate('/products')} style={{ 
          padding: '10px 24px', background: '#cc0000', color: 'white', 
          border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 16 
        }}>
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: '#28a745' }}>Đặt hàng thành công!</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
          <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#cc0000', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            🏠 Về trang chủ
          </button>
          <button onClick={() => navigate('/orders')} style={{ padding: '10px 24px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            📦 Xem đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>🛒 Xác nhận đơn hàng</h2>
      
      <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 20 }}>
        {cartItems.map(item => (
          <div key={item.id || item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{item.productName || item.name}</span>
            <span>{item.quantity} x {formatCurrency(item.price || 0)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 'bold', fontSize: 18, borderTop: '2px solid #ddd', marginTop: 8 }}>
          <span>Tổng cộng:</span>
          <span style={{ color: '#cc0000' }}>{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button onClick={() => handlePurchase('cod')} disabled={loading} variant="primary" style={{ minWidth: 180 }}>
          {loading ? 'Đang xử lý...' : '💰 Thanh toán khi nhận hàng'}
        </Button>
        <Button onClick={() => handlePurchase('vnpay')} disabled={loading} variant="success" style={{ minWidth: 180, background: '#2980b9' }}>
          {loading ? 'Đang xử lý...' : '🏦 Thanh toán VNPay'}
        </Button>
      </div>
    </div>
  );
}