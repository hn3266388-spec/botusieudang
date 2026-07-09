export default function ProductFilter({ onSearch, onCategory, categories = [] }) {
  return (
    <div style={{
      display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
      background: 'white', padding: 16, borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    }}>
      <input
        placeholder="🔍 Tìm kiếm sản phẩm..."
        onChange={e => onSearch(e.target.value)}
        style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
      />
      <select
        onChange={e => onCategory(e.target.value)}
        style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, minWidth: 180 }}
      >
        <option value="">📂 Tất cả danh mục</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}