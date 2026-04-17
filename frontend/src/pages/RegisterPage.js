import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success('Account created! Welcome to DriveElite!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputWithIcon = (icon, name, type, placeholder, required = true) => (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>{icon}</span>
      <input name={name} type={type} value={form[name]} onChange={handle} placeholder={placeholder} required={required} style={{ paddingLeft: 42 }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 16px 60px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'white' }}>D</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Drive<span style={{ color: 'var(--accent)' }}>Elite</span></span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Join DriveElite today — it's free!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            {inputWithIcon(<FiUser size={16} />, 'name', 'text', 'John Smith')}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            {inputWithIcon(<FiMail size={16} />, 'email', 'email', 'you@example.com')}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number (optional)</label>
            {inputWithIcon(<FiPhone size={16} />, 'phone', 'tel', '+1 (555) 000-0000', false)}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Min. 6 characters" required style={{ paddingLeft: 42, paddingRight: 42 }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="confirmPassword" type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={handle} placeholder="Repeat password" required style={{ paddingLeft: 42 }} />
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ color: 'var(--accent)' }}>Terms of Service</a> and{' '}
            <a href="#" style={{ color: 'var(--accent)' }}>Privacy Policy</a>.
          </p>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
