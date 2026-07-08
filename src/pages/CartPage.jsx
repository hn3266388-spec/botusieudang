import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/helpers';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalPrice, loading } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>🔒 Vui lòng đăng nhập</h2>
        <p>Bạn cần đăng nhập để xem giỏ hàng.</p>
        <Link to="/login" style={{ color: '#cc0000', textDecoration: 'none' }}>Đăng nhập ngay</Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 0' }}>Đang tải giỏ hàng...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <h2>🛒 Giỏ hàng trống</h2>
        <Link to="/products" style={{ color: '#cc0000', textDecoration: 'none' }}>Mua sắm ngay</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Giỏ hàng ({totalItems} sản phẩm)</h2>
      {cartItems.map(item => (
        <div key={item.id || item.productId} style={{ border: '1px solid #ddd', padding: '16px', marginBottom: '12px', borderRadius: '8px', background: 'white' }}>
          <strong>{item.productName || item.name || `Sản phẩm #${item.productId}`}</strong>
          <p>{formatCurrency(item.price || 0)} x 
            <input 
              type="number" 
              value={item.quantity} 
              min={1} 
              style={{ width: '60px', margin: '0 10px', padding: '4px 8px' }} 
              onChange={e => updateQuantity(item.productId, +e.target.value)} 
            />
          </p>
          <button 
            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => removeFromCart(item.productId)}
          >
            Xóa
          </button>
        </div>
      ))}
      <h3 style={{ textAlign: 'right', marginTop: '20px' }}>Tổng cộng: {formatCurrency(totalPrice)}</h3>
      <Link to="/checkout">
        <button style={{ width: '100%', padding: '12px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}>
          Tiến hành đặt hàng
        </button>
      </Link>
    </div>
  );
}