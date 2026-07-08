import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductGrid from '../components/ProductGrid';

// ✅ Map category name với ảnh
const categoryImages = {
  'Xe số': 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/wave-alpha-110-2025-do-1-1.png',
  'Xe tay ga': 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/vision-2025-trang-bac-1-1.png',
  'Xe côn tay': 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/winner-x-2025-do-1-1.png',
};

export default function CategoryProductsPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryName) {
      setError('Không có danh mục');
      setLoading(false);
      return;
    }

    const decodedName = decodeURIComponent(categoryName);
    
    Promise.all([
      categoryApi.getByName(decodedName),
      productApi.getByCategory(decodedName)
    ])
      .then(([catRes, prodRes]) => {
        setCategory(catRes.data);
        setProducts(prodRes.data || []);
        setError(null);
      })
      .catch(err => {
        console.error('Lỗi tải dữ liệu:', err);
        setError('Không thể tải dữ liệu danh mục');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <h3>{error}</h3>
        <Link to="/categories" style={{ color: '#cc0000' }}>Quay lại danh mục</Link>
      </div>
    );
  }

  const imageUrl = category ? categoryImages[category.name] : null;

  return (
    <div style={{ padding: '20px' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Trang chủ</Link>
        {' / '}
        <Link to="/categories" style={{ color: '#666', textDecoration: 'none' }}>Danh mục</Link>
        {' / '}
        <span style={{ color: '#333', fontWeight: 'bold' }}>{category?.name || categoryName}</span>
      </nav>
      
      {/* Category Header with Image */}
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        alignItems: 'center',
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #eee',
        flexWrap: 'wrap'
      }}>
        {imageUrl && (
          <div style={{ 
            width: '200px', 
            height: '150px', 
            borderRadius: '8px', 
            overflow: 'hidden',
            flexShrink: 0,
            background: '#f5f5f5'
          }}>
            <img 
              src={imageUrl}
              alt={category?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#1a1a2e' }}>
            {category?.name || categoryName}
          </h2>
          <p style={{ color: '#666', marginBottom: '8px' }}>{category?.description}</p>
          <span style={{ color: '#cc0000', fontWeight: 'bold' }}>
            {products.length} sản phẩm
          </span>
        </div>
      </div>
      
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chưa có sản phẩm nào trong danh mục này.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}