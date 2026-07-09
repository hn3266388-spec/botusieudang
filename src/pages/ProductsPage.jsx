import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import ProductGrid from '../components/ProductGrid';

const ProductsPage = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (keyword.trim()) {
        const res = await productApi.search(keyword);
        setProducts(res.data || []);
        setTotalPages(1);
      } else {
        const res = await productApi.getAll(page, 12);
        setProducts(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    const input = e.target.elements.search.value;
    setKeyword(input);
    setPage(0);
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

  return (
    <div style={{ padding: '20px 0' }}>
      <h2>Tất cả sản phẩm</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
        <input
          type="text"
          name="search"
          placeholder="Tìm kiếm sản phẩm..."
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 24px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
      </form>

      <ProductGrid
        products={products}
        loading={loading}
        isAuthenticated={isAuthenticated}
        onAddToCart={addToCart}
        emptyMessage="Không tìm thấy sản phẩm nào."
      />

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '30px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                padding: '8px 14px',
                border: '1px solid #ddd',
                background: i === page ? '#cc0000' : 'white',
                color: i === page ? 'white' : '#333',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;