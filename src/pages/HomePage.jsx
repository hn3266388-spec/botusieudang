import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FeaturedProducts from '../components/FeaturedProducts';
import { APP_INFO } from '../utils/constants';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        borderRadius: '16px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 'bold', marginBottom: '12px' }}>
          🏍️ HEAD <span style={{ color: '#e94560' }}>Honda</span>
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#a0a0b0' }}>
          Đồng hành cùng bạn - Giữ vạn niềm tin
        </p>
        
        {isAuthenticated ? (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '18px', marginTop: '24px', color: '#e0e0e0' }}>
              👋 Chào mừng <strong style={{ color: '#e94560' }}>{user?.username}</strong> quay trở lại!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '14px 32px', background: '#e94560', color: 'white', 
                  border: 'none', borderRadius: '50px', fontSize: '16px',
                  fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(233, 69, 96, 0.3)',
                }}>
                  🛒 Tiếp tục mua sắm
                </button>
              </Link>
              <Link to="/orders" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '14px 32px', background: 'transparent', color: 'white', 
                  border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', 
                  fontSize: '16px', cursor: 'pointer',
                }}>
                  📦 Xem đơn hàng
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '18px', marginTop: '24px', color: '#e0e0e0' }}>
              📞 Hotline: <strong style={{ color: '#e94560' }}>{APP_INFO.hotline}</strong>
            </p>
            <p style={{ color: '#a0a0b0', marginBottom: '8px', fontSize: '14px' }}>{APP_INFO.address}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '14px 32px', background: '#e94560', color: 'white', 
                  border: 'none', borderRadius: '50px', fontSize: '16px',
                  fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(233, 69, 96, 0.3)',
                }}>
                  🚀 Khám phá sản phẩm
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '14px 32px', background: 'transparent', color: 'white', 
                  border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', 
                  fontSize: '16px', cursor: 'pointer',
                }}>
                  📝 Đăng ký ngay
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
}