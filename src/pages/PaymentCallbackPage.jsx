import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '../api/orderApi';

export default function PaymentCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const vnpResponseCode = params.get('vnp_ResponseCode');
    
    const handleCallback = async () => {
      if (vnpResponseCode === '00') {
        // Thanh toán thành công → Tạo đơn hàng từ pendingOrder
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
          try {
            const cartItems = JSON.parse(pendingOrder);
            for (const item of cartItems) {
              await orderApi.purchase(item.productId, item.quantity);
            }
            localStorage.removeItem('pendingOrder');
            toast.success('✅ Thanh toán thành công! Đơn hàng đã được tạo.');
          } catch (err) {
            toast.error('Lỗi tạo đơn hàng!');
          }
        } else {
          toast.success('✅ Thanh toán thành công!');
        }
      } else if (vnpResponseCode) {
        // Thanh toán thất bại → Xóa pendingOrder
        localStorage.removeItem('pendingOrder');
        toast.error('❌ Thanh toán thất bại! Đơn hàng không được tạo.');
      }
      
      setTimeout(() => navigate('/orders', { replace: true }), 2000);
    };
    
    handleCallback();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h3>Đang xử lý kết quả thanh toán...</h3>
    </div>
  );
}