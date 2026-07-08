import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { totalItems } = useCart();

  return (
    <header style={{ background: '#c41230', padding: '12px 20px', display: 'flex', gap: 16, alignItems: 'center', color: 'white', flexWrap: 'wrap' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textDecoration: 'none' }}>🏍️ HEAD Honda</Link>
      <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Sản phẩm</Link>
      <Link to="/categories" style={{ color: 'white', textDecoration: 'none' }}>Danh mục</Link>
      <div style={{ flex: 1 }} />
      {isAuthenticated ? (
        <>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>🛒 Giỏ ({totalItems})</Link>
          <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>Đơn hàng</Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>👤 {user?.username}</Link>
          {isAdmin && (
            <>
              <Link to="/admin" style={{ color: '#ffd700', textDecoration: 'none' }}>📊 Dashboard</Link>
              
            </>
          )}
          <button onClick={logout} style={{ background: 'white', color: '#c41230', border: 'none', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>Đăng xuất</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Đăng nhập</Link>
          <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Đăng ký</Link>
        </>
      )}
    </header>
  );
}