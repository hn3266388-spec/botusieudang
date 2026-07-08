import { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: '⏳ Chờ xác nhận', color: '#f39c12' },
  { value: 'CONFIRMED', label: '✅ Đã xác nhận', color: '#2980b9' },
  { value: 'SHIPPING', label: '🚚 Đang giao', color: '#8e44ad' },
  { value: 'DELIVERED', label: '📦 Đã giao', color: '#27ae60' },
  { value: 'COMPLETED', label: '🎉 Hoàn thành', color: '#2ecc71' },
  { value: 'CANCELLED', label: '❌ Đã hủy', color: '#e74c3c' },
];

const STATUS_COLORS = {
  PENDING: '#fef3e2', CONFIRMED: '#e8f4fd', SHIPPING: '#f3e8ff',
  DELIVERED: '#e8f8ef', COMPLETED: '#eafaf1', CANCELLED: '#fdeaea',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    orderApi.getAllOrders()
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) setOrders(data);
        else if (data?.orders) setOrders(data.orders);
        else setOrders([]);
      })
      .catch(err => toast.error('Lỗi tải đơn hàng'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success(`Đã cập nhật: ${STATUS_OPTIONS.find(s => s.value === status)?.label}`);
      loadOrders();
    } catch (err) {
      toast.error('Lỗi cập nhật trạng thái!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Đang tải...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>📋 Quản lý Đơn hàng</h2>
        <span style={{ fontSize: 14, color: '#888' }}>Tổng: {orders.length} đơn</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Khách hàng</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Sản phẩm</th>
              <th style={{ padding: 12, textAlign: 'center' }}>SL</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Tổng tiền</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Ngày đặt</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: 10, fontWeight: 'bold' }}>#{o.id}</td>
                <td style={{ padding: 10 }}>{o.username}</td>
                <td style={{ padding: 10 }}>{o.productName}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>{o.quantity}</td>
                <td style={{ padding: 10, textAlign: 'right', color: '#c41230', fontWeight: 'bold' }}>
                  {o.totalPrice?.toLocaleString()}đ
                </td>
                <td style={{ padding: 10, textAlign: 'center', fontSize: 13, color: '#888' }}>
                  {new Date(o.orderDate).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: 10, textAlign: 'center' }}>
                  <select 
                    value={o.status} 
                    onChange={e => updateStatus(o.id, e.target.value)}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd',
                      background: STATUS_COLORS[o.status] || '#fff',
                      fontWeight: 'bold', cursor: 'pointer',
                      color: STATUS_OPTIONS.find(s => s.value === o.status)?.color || '#333',
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}