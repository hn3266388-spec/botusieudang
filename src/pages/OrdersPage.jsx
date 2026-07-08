import React, { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Chờ xác nhận', icon: '⏳', autoTime: '~1 phút' },
  { key: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅', autoTime: '~1 phút' },
  { key: 'SHIPPING', label: 'Đang giao', icon: '🚚', autoTime: '~1 phút' },
  { key: 'DELIVERED', label: 'Đã giao', icon: '📦', autoTime: '~1 phút' },
  { key: 'COMPLETED', label: 'Hoàn thành', icon: '🎉', autoTime: '' },
];

const STATUS_COLORS = {
  PENDING: '#f39c12', CONFIRMED: '#2980b9', SHIPPING: '#8e44ad',
  DELIVERED: '#27ae60', COMPLETED: '#2ecc71', PAID: '#2ecc71', CANCELLED: '#e74c3c',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getMyOrders();
      const data = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      setOrders(data);
    } catch (err) {
      console.error('Lỗi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Tự động refresh mỗi 15 giây (đồng bộ với backend 30s)
  useEffect(() => {
    const timer = setInterval(fetchOrders, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleCancel = async (orderId) => {
    if (window.confirm('Hủy đơn hàng này?')) {
      try {
        await orderApi.cancelOrder(orderId);
        toast.success('Đã hủy đơn hàng!');
        fetchOrders();
      } catch (err) {
        toast.error(err.response?.data || 'Không thể hủy đơn!');
      }
    }
  };

  // Tính thời gian ước tính còn lại
  const getEstimatedTime = (order) => {
    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') return '';
    
    const orderTime = new Date(order.orderDate).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - orderTime) / 60000); // phút
    
    const statusIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
    const nextTime = (statusIndex + 1) * 1; // mỗi bước 1 phút
    
    const remaining = Math.max(0, nextTime - elapsed);
    
    if (remaining === 0) return 'Đang cập nhật...';
    return `~${remaining} phút nữa`;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>📋 Đơn hàng của tôi</h2>
        <span style={{ fontSize: 12, color: '#888' }}>🔄 Tự động cập nhật mỗi 15s</span>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontSize: 48 }}>📭</p>
          <p>Chưa có đơn hàng nào.</p>
          <button onClick={() => navigate('/products')} style={{ 
            marginTop: 16, padding: '10px 24px', background: '#c41230', color: 'white', 
            border: 'none', borderRadius: 6, cursor: 'pointer' 
          }}>
            Mua sắm ngay
          </button>
        </div>
      ) : (
        orders.map(order => {
          const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
          const isCancelled = order.status === 'CANCELLED';
          const estimatedTime = getEstimatedTime(order);
          
          return (
            <div key={order.id} style={{
              background: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #eee',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong style={{ fontSize: 16 }}>Đơn hàng #{order.id}</strong>
                  <span style={{ marginLeft: 12, color: '#888', fontSize: 14 }}>
                    {new Date(order.orderDate).toLocaleString('vi-VN')}
                  </span>
                </div>
                <span style={{
                  padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 'bold',
                  background: isCancelled ? '#fdeaea' : '#e8f8ef',
                  color: STATUS_COLORS[order.status] || '#666',
                }}>
                  {isCancelled ? '❌ Đã hủy' : `${STATUS_STEPS[currentStepIndex]?.icon} ${STATUS_STEPS[currentStepIndex]?.label}`}
                </span>
              </div>

              {/* Product info */}
              <div style={{ background: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{order.productName} x{order.quantity}</span>
                  <strong style={{ color: '#c41230' }}>{order.totalPrice?.toLocaleString()}đ</strong>
                </div>
              </div>

              {/* Progress bar */}
              {!isCancelled && (
                <div style={{ marginBottom: 12 }}>
                  {/* Steps label */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step.key} style={{ 
                        textAlign: 'center', flex: 1,
                        color: i <= currentStepIndex ? STATUS_COLORS[order.status] : '#ccc',
                        fontSize: 11,
                        fontWeight: i === currentStepIndex ? 'bold' : 'normal',
                      }}>
                        <div style={{ fontSize: 16 }}>{step.icon}</div>
                        <div>{step.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress line */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {STATUS_STEPS.map((step, i) => (
                      <React.Fragment key={step.key}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: i <= currentStepIndex ? STATUS_COLORS[order.status] : '#e0e0e0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 11, fontWeight: 'bold',
                          transition: 'all 0.5s ease',
                        }}>
                          {i <= currentStepIndex ? '✓' : i + 1}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div style={{
                            flex: 1, height: 3,
                            background: i < currentStepIndex ? STATUS_COLORS[order.status] : '#e0e0e0',
                            transition: 'background 0.5s ease',
                          }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Thời gian ước tính */}
                  {estimatedTime && order.status !== 'COMPLETED' && (
                    <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#888' }}>
                      ⏱️ {estimatedTime} → {STATUS_STEPS[currentStepIndex + 1]?.label}
                    </p>
                  )}
                </div>
              )}

              {/* Cancel button */}
              {order.status === 'PENDING' && (
                <button onClick={() => handleCancel(order.id)} style={{
                  padding: '8px 20px', background: '#fff', color: '#e74c3c',
                  border: '1px solid #e74c3c', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                }}>
                  Hủy đơn hàng
                </button>
              )}

              {isCancelled && (
                <p style={{ color: '#e74c3c', fontSize: 13, marginTop: 8 }}>Đơn hàng này đã bị hủy.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}