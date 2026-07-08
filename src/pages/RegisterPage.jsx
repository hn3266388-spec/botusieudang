import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ✅ Kiểm tra username
    if (!username || username.trim().length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      setLoading(false);
      return;
    }

    // ✅ Kiểm tra mật khẩu
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    // ✅ Kiểm tra xác nhận mật khẩu
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const success = await register(username, password);
      if (success) {
        // ✅ Đăng ký thành công, chuyển về login
        navigate('/login');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('❌ Lỗi đăng ký:', err);
      
      // ✅ Xử lý các lỗi từ backend
      const errorMessage = err.response?.data;
      if (typeof errorMessage === 'string') {
        setError(errorMessage);
      } else if (errorMessage?.message) {
        setError(errorMessage.message);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '40px auto', 
      padding: '32px', 
      border: '1px solid #eee', 
      borderRadius: '8px', 
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>Đăng ký</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Tạo tài khoản để mua hàng</p>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#cc0000', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
            Tên đăng nhập *
          </label>
          <input 
            placeholder="Nhập tên đăng nhập " 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '15px'
            }} 
            required
          />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
            Mật khẩu *
          </label>
          <input 
            placeholder="Nhập mật khẩu " 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '15px'
            }} 
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
            Xác nhận mật khẩu *
          </label>
          <input 
            placeholder="Nhập lại mật khẩu" 
            type="password" 
            value={confirm} 
            onChange={e => setConfirm(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '15px'
            }} 
            required
          />
          {confirm && password !== confirm && (
            <div style={{ 
              color: '#cc0000', 
              fontSize: '13px', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⚠️ Mật khẩu xác nhận không khớp
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading || (confirm && password !== confirm)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#cc0000', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: (loading || (confirm && password !== confirm)) ? 'not-allowed' : 'pointer', 
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: (loading || (confirm && password !== confirm)) ? 0.7 : 1
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
        Đã có tài khoản? <Link to="/login" style={{ color: '#cc0000', textDecoration: 'none', fontWeight: '600' }}>Đăng nhập</Link>
      </p>
    </div>
  );
}