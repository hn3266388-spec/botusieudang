import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, emptyMessage, isAuthenticated, onAddToCart }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Đang tải sản phẩm...</div>;
  }

  // ✅ Đảm bảo products là mảng
  const productList = Array.isArray(products) ? products : [];

  if (productList.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>{emptyMessage || 'Không có sản phẩm nào.'}</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
      {productList.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          isAuthenticated={isAuthenticated}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;