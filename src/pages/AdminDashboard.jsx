import { useState, useEffect } from 'react';
import { statisticsApi } from '../api/statisticsApi';
import { formatCurrency } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  const [topProducts, setTopProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState({});

  useEffect(() => {
    // ✅ Kiểm tra token trước khi gọi API
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Vui lòng đăng nhập để xem thống kê.');
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, revenueRes, salesRes, ordersStatusRes, topProductsRes] = await Promise.all([
        statisticsApi.getDashboardStats(),
        statisticsApi.getRevenueStats(period),
        statisticsApi.getSalesByPeriod(period),
        statisticsApi.getOrdersByStatus(),
        statisticsApi.getTopProducts(),
      ]);

      setStats({
        dashboard: dashboardRes.data,
        revenue: revenueRes.data,
        sales: salesRes.data,
      });
      setOrdersByStatus(ordersStatusRes.data || {});
      const topData = topProductsRes.data;
console.log('topProducts raw:', topData);
if (Array.isArray(topData)) {
  setTopProducts(topData);
} else if (topData && typeof topData === 'object') {
  // Thử lấy từ content, data, orders...
  const arr = topData.content || topData.data || topData.orders || [];
  setTopProducts(Array.isArray(arr) ? arr : []);
} else {
  setTopProducts([]);
}

    } catch (error) {
      console.error('❌ Lỗi tải thống kê:', error);

      if (error.response?.status === 403) {
        setError('Bạn không có quyền truy cập thống kê. Yêu cầu quyền Admin.');
        toast.error('Không có quyền truy cập! Vui lòng đăng nhập với tài khoản Admin.');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy dịch vụ thống kê. Vui lòng kiểm tra backend.');
        toast.error('Dịch vụ thống kê chưa sẵn sàng!');
      } else {
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
        toast.error('Lỗi tải dữ liệu thống kê!');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #cc0000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '15px', color: '#666' }}>Đang tải thống kê...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: '#dc3545' }}>{error}</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {error.includes('403') && 'Vui lòng đăng nhập với tài khoản Admin để xem thống kê.'}
          {error.includes('404') && 'Vui lòng kiểm tra backend statistics-service đã chạy chưa.'}
          {error.includes('Không thể') && 'Vui lòng thử lại sau.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 24px',
            background: '#cc0000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>Không có dữ liệu thống kê</h2>
        <button
          onClick={fetchDashboardData}
          style={{
            padding: '10px 24px',
            background: '#cc0000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Tải lại
        </button>
      </div>
    );
  }

  const { dashboard, revenue, sales } = stats;

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '28px', color: '#1a1a2e' }}>📊 Dashboard</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPeriod('week')}
            style={{
              padding: '6px 16px',
              background: period === 'week' ? '#cc0000' : '#f5f5f5',
              color: period === 'week' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tuần
          </button>
          <button
            onClick={() => setPeriod('month')}
            style={{
              padding: '6px 16px',
              background: period === 'month' ? '#cc0000' : '#f5f5f5',
              color: period === 'month' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tháng
          </button>
          <button
            onClick={() => setPeriod('year')}
            style={{
              padding: '6px 16px',
              background: period === 'year' ? '#cc0000' : '#f5f5f5',
              color: period === 'year' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Năm
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>💰 Doanh thu</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#cc0000' }}>
            {formatCurrency(revenue?.totalRevenue || 0)}
          </p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>📦 Đơn hàng</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>
            {dashboard?.totalOrders || 0}
          </p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>👤 Người dùng</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>
            {dashboard?.totalUsers || 0}
          </p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>🏍️ Sản phẩm</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>
            {dashboard?.totalProducts || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <Link to="/admin/products" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
          >
            <span style={{ fontSize: '28px' }}>📦</span>
            <p style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Quản lý sản phẩm</p>
          </div>
        </Link>
        <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
          >
            <span style={{ fontSize: '28px' }}>📋</span>
            <p style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Quản lý đơn hàng</p>
          </div>
        </Link>
        <Link to="/admin/categories" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
          >
            <span style={{ fontSize: '28px' }}>📂</span>
            <p style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Quản lý danh mục</p>
          </div>
        </Link>
        <Link to="/admin/payments" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
          >
            <span style={{ fontSize: '28px' }}>💳</span>
            <p style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Quản lý thanh toán</p>
          </div>
        </Link>
        <Link to="/admin/inventory" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
          >
            <span style={{ fontSize: '28px' }}>📦</span>
            <p style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Quản lý kho</p>
          </div>
        </Link>
      </div>

      {/* Chart + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Chart */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: '16px' }}>📈 Doanh thu theo {period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : 'năm'}</h3>
          {sales?.data && sales.data.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '200px', paddingTop: '20px' }}>
              {sales.data.map((item, index) => {
                const maxValue = Math.max(...sales.data.map(d => d.total || 0), 1);
                const height = (item.total / maxValue) * 180;
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '100%',
                      height: `${height}px`,
                      background: height > 0 ? '#cc0000' : '#f5f5f5',
                      borderRadius: '4px 4px 0 0',
                      minHeight: height > 0 ? '4px' : '0px',
                      transition: 'height 0.5s'
                    }}></div>
                    <span style={{ fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
                      {item.label?.slice(0, 8) || `Ngày ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>Chưa có dữ liệu doanh thu</p>
          )}
        </div>

        {/* Order Status */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: '16px' }}>📊 Trạng thái đơn hàng</h3>
          {Object.keys(ordersByStatus).length > 0 ? (
            <div>
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <div key={status} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>{status}</span>
                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(count / Math.max(...Object.values(ordersByStatus), 1)) * 100}%`,
                      height: '100%',
                      background: status === 'COMPLETED' ? '#28a745' :
                                  status === 'CANCELLED' ? '#dc3545' :
                                  status === 'PENDING' ? '#ffc107' : '#007bff',
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: '16px' }}>🏍️ Top sản phẩm bán chạy</h3>
        {topProducts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Sản phẩm</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Số lượng bán</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{index + 1}</td>
                    <td style={{ padding: '8px' }}>{product.productName}</td>
                    <td style={{ textAlign: 'right', padding: '8px', fontWeight: 'bold', color: '#cc0000' }}>
                      {product.totalSold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}