import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';

// ✅ Map category name với ảnh tương ứng
const categoryImages = {
  'Xe số': 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/wave-alpha-110-2025-do-1-1.png',
  'Xe tay ga': 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/vision-2025-trang-bac-1-1.png',
  'Xe côn tay': 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/winner-x-2025-do-1-1.png',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryApi.getAll()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : 
                     Array.isArray(res.data?.content) ? res.data.content : [];
        setCategories(data);
        setError(null);
      })
      .catch(err => {
        console.error('Lỗi tải danh mục:', err);
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải danh mục...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', color: '#1a1a2e' }}>
        🏍️ Danh mục sản phẩm
      </h2>
      
      {categories.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Chưa có danh mục nào.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {categories.map(c => (
            <Link 
              to={`/categories/${encodeURIComponent(c.name)}/products`} 
              key={c.id} 
              style={{ textDecoration: 'none' }}
            >
              <div style={{ 
                border: '1px solid #eee',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'white',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
              >
                {/* ✅ Ảnh danh mục */}
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  overflow: 'hidden',
                  background: '#f5f5f5'
                }}>
                  <img 
                    src={categoryImages[c.name] || 'https://cdn.honda.com.vn/thumb/800x400/upload/2025/3/5/wave-alpha-110-2025-do-1-1.png'}
                    alt={c.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.5s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#1a1a2e',
                    marginBottom: '6px'
                  }}>
                    {c.name}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}>
                    {c.description}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 20px',
                    background: '#cc0000',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#990000'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#cc0000'}
                  >
                    Xem sản phẩm →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}