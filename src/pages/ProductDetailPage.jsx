import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/helpers';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productApi.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    navigate('/cart');
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
        <p style={{ marginTop: '15px', color: '#666' }}>Đang tải...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return <div style={{ padding: '40px 0', textAlign: 'center' }}>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '300px', 
              background: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '16px'
            }}>
              Không có ảnh
            </div>
          )}
        </div>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{product.name}</h1>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#cc0000' }}>
            {formatCurrency(product.price)}
          </p>
          <p style={{ color: '#555', lineHeight: '1.6', margin: '16px 0' }}>{product.description}</p>
          <p><strong>Tồn kho:</strong> {product.quantity}</p>

          {isAuthenticated ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
                <label style={{ fontWeight: '600' }}>Số lượng:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: '70px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: '12px 32px',
                  background: '#cc0000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Thêm vào giỏ
              </button>
            </>
          ) : (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', border: '1px dashed #cc0000' }}>
              <p style={{ margin: 0, fontSize: '16px', color: '#555' }}>
                🔒 Vui lòng <Link to="/login" style={{ color: '#cc0000', fontWeight: '600', textDecoration: 'none' }}>đăng nhập</Link> để mua hàng
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;