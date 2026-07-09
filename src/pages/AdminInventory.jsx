import { useState, useEffect } from 'react';
import { inventoryApi } from '../api/inventoryApi';
import { toast } from 'react-toastify';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  
  // 2 form riêng biệt
  const [importForm, setImportForm] = useState({ productId: '', quantity: '', location: 'Kho chính' });
  const [exportForm, setExportForm] = useState({ productId: '', quantity: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll();
      setInventory(res.data || []);
    } catch (err) {
      toast.error('Lỗi tải dữ liệu kho');
    } finally {
      setLoading(false);
    }
  };

  // Nhập kho
  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.importStock({
        productId: parseInt(importForm.productId),
        quantity: parseInt(importForm.quantity),
        location: importForm.location,
      });
      toast.success('✅ Nhập kho thành công!');
      setImportForm({ productId: '', quantity: '', location: 'Kho chính' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi nhập kho');
    }
  };

  // Xuất kho
  const handleExport = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.exportStock({
        productId: parseInt(exportForm.productId),
        quantity: parseInt(exportForm.quantity),
      });
      toast.success('📦 Xuất kho thành công!');
      setExportForm({ productId: '', quantity: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xuất kho');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Đang tải...</div>;

  const lowStock = inventory.filter(item => item.quantity < 10);
  const outOfStock = inventory.filter(item => item.quantity === 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Quản lý Kho hàng</h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard title="Tổng sản phẩm" value={inventory.length} color="#3498db" icon="📦" />
        <StatCard title="Tổng tồn kho" value={inventory.reduce((sum, i) => sum + (i.quantity || 0), 0)} color="#2ecc71" icon="📊" />
        <StatCard title="Sắp hết (<10)" value={lowStock.length} color="#f39c12" icon="⚠️" />
        <StatCard title="Hết hàng" value={outOfStock.length} color="#e74c3c" icon="❌" />
      </div>

      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('inventory')} style={{
          padding: '10px 20px', border: 'none', borderRadius: 6, cursor: 'pointer',
          background: activeTab === 'inventory' ? '#c41230' : '#f0f0f0',
          color: activeTab === 'inventory' ? 'white' : '#333', fontWeight: 'bold',
        }}>📦 Tồn kho</button>
        <button onClick={() => setActiveTab('import')} style={{
          padding: '10px 20px', border: 'none', borderRadius: 6, cursor: 'pointer',
          background: activeTab === 'import' ? '#c41230' : '#f0f0f0',
          color: activeTab === 'import' ? 'white' : '#333', fontWeight: 'bold',
        }}>➕ Nhập/Xuất kho</button>
      </div>

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 12 }}>ID</th>
                <th style={{ padding: 12 }}>Mã SP</th>
                <th style={{ padding: 12 }}>Số lượng</th>
                <th style={{ padding: 12 }}>Vị trí</th>
                <th style={{ padding: 12 }}>Trạng thái</th>
                <th style={{ padding: 12 }}>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const status = item.quantity === 0 ? 'Hết hàng' : item.quantity < 10 ? 'Sắp hết' : 'Còn hàng';
                const statusColor = item.quantity === 0 ? '#e74c3c' : item.quantity < 10 ? '#f39c12' : '#2ecc71';
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 10 }}>{item.id}</td>
                    <td style={{ padding: 10 }}>{item.productId}</td>
                    <td style={{ padding: 10, fontWeight: 'bold' }}>{item.quantity}</td>
                    <td style={{ padding: 10 }}>{item.location}</td>
                    <td style={{ padding: 10 }}>
                      <span style={{ color: statusColor, fontWeight: 'bold' }}>{status}</span>
                    </td>
                    <td style={{ padding: 10, fontSize: 13, color: '#888' }}>
                      {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString('vi-VN') : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Import/Export Form */}
      {activeTab === 'import' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Nhập kho */}
          <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 8 }}>
            <h3>➕ Nhập kho</h3>
            <form onSubmit={handleImport}>
              <input placeholder="ID Sản phẩm" type="number" value={importForm.productId} 
                onChange={e => setImportForm({...importForm, productId: e.target.value})} required
                style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 6 }} />
              <input placeholder="Số lượng" type="number" value={importForm.quantity} 
                onChange={e => setImportForm({...importForm, quantity: e.target.value})} required
                style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 6 }} />
              <input placeholder="Vị trí kho" value={importForm.location} 
                onChange={e => setImportForm({...importForm, location: e.target.value})}
                style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 6 }} />
              <button type="submit" style={{
                width: '100%', padding: 12, background: '#2ecc71', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 16,
              }}>➕ Nhập kho</button>
            </form>
          </div>

          {/* Xuất kho */}
          <div style={{ background: '#fdecea', padding: 20, borderRadius: 8 }}>
            <h3>📦 Xuất kho</h3>
            <form onSubmit={handleExport}>
              <input placeholder="ID Sản phẩm" type="number" value={exportForm.productId} 
                onChange={e => setExportForm({...exportForm, productId: e.target.value})} required
                style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 6 }} />
              <input placeholder="Số lượng" type="number" value={exportForm.quantity} 
                onChange={e => setExportForm({...exportForm, quantity: e.target.value})} required
                style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ddd', borderRadius: 6 }} />
              <button type="submit" style={{
                width: '100%', padding: 12, background: '#e74c3c', color: 'white',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 16,
              }}>📦 Xuất kho</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{ background: 'white', padding: 20, borderRadius: 8, borderLeft: `4px solid ${color}`, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 'bold', color }}>{value}</div>
      <div style={{ fontSize: 14, color: '#888' }}>{title}</div>
    </div>
  );
}