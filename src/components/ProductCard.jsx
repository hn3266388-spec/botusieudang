import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/helpers';
import { categoryApi } from '../api/categoryApi';

const ProductCard = ({ product, isAuthenticated, onAddToCart }) => {
  const [categoryName, setCategoryName] = useState(product?.categoryName || '');

  // Nếu backend trả về categoryName thì hiển thị luôn, không cần gọi API
  useEffect(() => {
    if (product?.categoryName) {
      setCategoryName(product.categoryName);
    }
  }, [product?.categoryName]);

  if (!product) return null;

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: 'white' }}>
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {product.imageUrl ? (
          <img 
            src={`http://localhost:8080${product.imageUrl}`} 
            alt={product.name} 
            style={{ width: '100%', height: 180, objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: 180, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            🏍️
          </div>
        )}
        <div style={{ padding: '0 16px' }}>
          <h3 style={{ fontSize: 16, margin: '8px 0 4px' }}>{product.name}</h3>
        </div>
      </Link>
      
      <div style={{ padding: '0 16px 12px' }}>
        {/* Hiển thị tên danh mục từ product.categoryName */}
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>
          📂 {categoryName || 'Chưa phân loại'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold', color: '#cc0000' }}>
            {formatCurrency(product.price || 0)}
          </span>
          {isAuthenticated && (
            <button onClick={(e) => { e.preventDefault(); onAddToCart && onAddToCart(product.id, 1); }}
              style={{ background: '#cc0000', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer' }}>
              🛒
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;