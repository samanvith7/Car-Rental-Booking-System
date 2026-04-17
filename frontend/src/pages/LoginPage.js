import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@carrental.com', password: 'admin123' });
    else setForm({ email: 'john@example.com', password: 'user123' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 16px 60px', background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'white' }}>D</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Drive<span style={{ color: 'var(--accent)' }}>Elite</span></span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Sign in to your account</p>
        </div>

        {/* Demo Accounts */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[['User Demo', 'user'], ['Admin Demo', 'admin']].map(([label, type]) => (
            <button key={type} onClick={() => fillDemo(type)} className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }}>
              🔑 {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required style={{ paddingLeft: 42 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="••••••••" required style={{ paddingLeft: 42, paddingRight: 42 }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
