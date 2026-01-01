import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-strong) 60%, var(--color-bg-warm) 100%)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        boxShadow: 'var(--shadow-soft)',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3vw, 2rem)' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 'bold',
            color: 'var(--color-text)',
            marginBottom: '0.5rem'
          }}>
            Admin Login
          </h1>
          <p style={{ 
            color: 'var(--color-muted)',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
          }}>
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: 'clamp(0.5rem, 2vw, 0.75rem)',
            borderRadius: '6px',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            textAlign: 'center',
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--color-text)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <FaUser style={{
                position: 'absolute',
                left: 'clamp(8px, 2vw, 12px)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(10px, 2.5vw, 12px) clamp(10px, 2.5vw, 12px) clamp(32px, 8vw, 40px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          </div>

          <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--color-text)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{
                position: 'absolute',
                left: 'clamp(8px, 2vw, 12px)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(32px, 8vw, 40px) clamp(10px, 2.5vw, 12px) clamp(32px, 8vw, 40px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 'clamp(8px, 2vw, 12px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  padding: '4px'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 12px)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: '600',
              minHeight: 'clamp(44px, 10vw, 48px)'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;