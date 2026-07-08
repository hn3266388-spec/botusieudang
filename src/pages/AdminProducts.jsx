import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { getImageUrl } from '../utils/helpers';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ 
    name: '', description: '', price: '', quantity: '', imageUrl: '', categoryName: '' 
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll(0, 100);
      const data = res.data?.content || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    categoryApi.getAll().then(res => setCategories(res.data || [])).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Upload ảnh
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setForm({ ...form, imageUrl: data.imageUrl });
    } catch (err) {
      alert('Lỗi upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      imageUrl: form.imageUrl || '',
      categoryName: form.categoryName || null,
    };
    try {
      if (editId) await productApi.update(editId, data);
      else await productApi.create(data);
      setForm({ name: '', description: '', price: '', quantity: '', imageUrl: '', categoryName: '' });
      setEditId(null);
      await fetchProducts();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data || error.message));
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ 
      name: p.name, 
      description: p.description || '', 
      price: p.price?.toString() || '', 
      quantity: p.quantity?.toString() || '', 
      imageUrl: p.imageUrl || '',
      categoryName: p.categoryName || '' 
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      await productApi.delete(id);
      await fetchProducts();
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Đang tải...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>📦 Quản lý Sản phẩm ({products.length})</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: 20, padding: 16, background: '#f9f9f9', borderRadius: 8,
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' 
      }}>
        <input name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} required 
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, flex: '1 1 150px' }} />
        <input name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} 
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, flex: '1 1 150px' }} />
        <input name="price" type="number" placeholder="Giá" value={form.price} onChange={handleChange} required 
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, width: 120 }} />
        <input name="quantity" type="number" placeholder="SL" value={form.quantity} onChange={handleChange} required 
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6, width: 80 }} />
        
        {/* Upload ảnh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ 
            padding: '10px 16px', background: '#f0f0f0', border: '1px solid #ddd', 
            borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' 
          }}>
            📷 Chọn ảnh
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
          {uploading && <span style={{ fontSize: 12, color: '#888' }}>Đang tải...</span>}
          {form.imageUrl && (
            <img src={getImageUrl(form.imageUrl)} alt="Preview" 
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
          )}
        </div>
        
        <select name="categoryName" value={form.categoryName} onChange={handleChange} 
          style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
          <option value="">Chọn danh mục</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        
        <button type="submit" style={{ 
          background: '#c41230', color: 'white', border: 'none', padding: '10px 20px', 
          borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' 
        }}>
          {editId ? '✏️ Sửa' : '➕ Thêm'}
        </button>
        {editId && (
          <button type="button" onClick={() => { 
            setEditId(null); 
            setForm({ name: '', description: '', price: '', quantity: '', imageUrl: '', categoryName: '' }); 
          }}
            style={{ background: '#666', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Table với scroll */}
      <div style={{ overflowX: 'auto', maxHeight: '60vh', overflowY: 'auto', border: '1px solid #eee', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ background: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={{ padding: 12, textAlign: 'center' }}>ID</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Ảnh</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Tên</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Giá</th>
              <th style={{ padding: 12, textAlign: 'center' }}>SL</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Danh mục</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} style={{ background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>{p.id}</td>
                <td style={{ padding: 10, textAlign: 'center' }}>
                  {p.imageUrl ? (
                    <img 
                      src={getImageUrl(p.imageUrl)}
                      alt={p.name} 
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ fontSize: 28 }}>🏍️</span>
                  )}
                </td>
                <td style={{ padding: 10 }}>{p.name}</td>
                <td style={{ padding: 10, textAlign: 'right', color: '#c41230', fontWeight: 'bold' }}>
                  {p.price?.toLocaleString()}đ
                </td>
                <td style={{ padding: 10, textAlign: 'center' }}>{p.quantity}</td>
                <td style={{ padding: 10 }}>{p.categoryName || '-'}</td>
                <td style={{ padding: 10, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <button onClick={() => handleEdit(p)} 
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 6, cursor: 'pointer' }}>
                    ✏️ Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} 
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}