import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await categoryApi.update(editId, { name, description });
    } else {
      await categoryApi.create({ name, description });
    }
    setName('');
    setDescription('');
    setEditId(null);
    categoryApi.getAll().then(res => setCategories(res.data || []));
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa?')) {
      await categoryApi.delete(id);
      categoryApi.getAll().then(res => setCategories(res.data || []));
    }
  };

  return (
    <div>
      <h2>Quản lý Danh mục</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input placeholder="Tên" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">{editId ? 'Sửa' : 'Thêm'}</button>
      </form>
      <table border="1" cellPadding="8">
        <thead><tr><th>ID</th><th>Tên</th><th>Mô tả</th><th></th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.name}</td><td>{c.description}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Sửa</button>
                <button onClick={() => handleDelete(c.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}