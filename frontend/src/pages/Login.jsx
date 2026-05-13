import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // مسح أي خطأ قديم

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      
      // لو السيرفر رجع البيانات تمام، نحفظهم وندخل الداشبورد
      if (response.data.id) {
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        navigate('/'); // التوجيه للصفحة الرئيسية
      }
    } catch (err) {
      // لو فيه خطأ (إيميل غلط أو باسورد غلط)
      setError(err.response?.data?.error || 'حدث خطأ في تسجيل الدخول');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #78350f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        borderTop: '6px solid #f59e0b'
      }}>
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ width: '100px', height: '100px', margin: '0 auto 20px auto', borderRadius: '50%', border: '4px solid #1e293b', padding: '5px', objectFit: 'contain', display: 'block' }}
        />
        <h1 style={{ color: '#1e293b', fontSize: '22px', fontWeight: '800', marginBottom: '30px' }}>
          الإدارة العامة للمراسم والعلاقات العامة
        </h1>
        
        {/* رسالة الخطأ */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '15px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '15px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(90deg, #d97706, #b45309)',
            color: 'white',
            fontWeight: '800',
            fontSize: '18px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(217, 119, 6, 0.3)',
            marginTop: '10px'
          }}>
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}