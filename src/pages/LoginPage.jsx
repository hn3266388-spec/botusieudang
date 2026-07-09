import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');  // ← Về trang chủ
      } else {
        setError('Sai tài khoản hoặc mật khẩu');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '32px', border: '1px solid #eee', borderRadius: '8px', background: 'white' }}>
      <h2 style={{ textAlign: 'center' }}>Đăng nhập</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Tên đăng nhập" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          style={{ width: '100%', marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          required
        />
        <input 
          placeholder="Mật khẩu" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={{ width: '100%', marginBottom: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px' }}>
        Chưa có tài khoản? <Link to="/register" style={{ color: '#cc0000', textDecoration: 'none' }}>Đăng ký</Link>
      </p>
    </div>
  );
}