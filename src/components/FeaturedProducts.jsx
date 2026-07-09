import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getAll(0, 100)
      .then(res => {
        const allProducts = res.data?.content || res.data || [];
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const unique = [...new Map(shuffled.map(p => [p.id, p])).values()].slice(0, 6);
        setProducts(unique);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: 40 }}>Đang tải...</p>;
  if (products.length === 0) return null;

  return (
    <div style={{ padding: '40px 0', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#1a1a2e', fontSize: 28, fontWeight: 'bold' }}>
        🔥 Sản phẩm nổi bật
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
        justifyContent: 'center',
        padding: '0 20px',
      }}>
        {products.map(product => (
          <div 
            key={product.id}
            style={{ 
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              borderRadius: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ProductCard 
              product={product} 
              isAuthenticated={isAuthenticated}
              onAddToCart={addToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}