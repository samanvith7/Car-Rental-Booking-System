import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiCalendar,
  FiSettings, FiChevronDown, FiShield
} from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--accent)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'white'
          }}>D</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Drive<span style={{ color: 'var(--accent)' }}>Elite</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          <Link to="/cars" style={{ padding: '8px 16px', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
            Browse Cars
          </Link>
          {isAuthenticated && (
            <Link to="/wishlist" style={{ padding: '8px 16px', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
              Wishlist
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" style={{ padding: '8px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 15, fontWeight: 500 }}>
              <FiShield style={{ display: 'inline', marginRight: 4 }} />Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                <FiChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, minWidth: 200,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, boxShadow: 'var(--shadow)', overflow: 'hidden', zIndex: 100
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  {[
                    { to: '/dashboard', icon: <FiUser size={15} />, label: 'My Dashboard' },
                    { to: '/dashboard#bookings', icon: <FiCalendar size={15} />, label: 'My Bookings' },
                    { to: '/wishlist', icon: <FiHeart size={15} />, label: 'Wishlist' },
                    { to: '/dashboard#profile', icon: <FiSettings size={15} />, label: 'Profile Settings' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      {item.icon}{item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiLogOut size={15} />Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', padding: 8 }}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/cars" style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 15 }}>Browse Cars</Link>
          {isAuthenticated && <Link to="/wishlist" style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 15 }}>Wishlist</Link>}
          {isAuthenticated && <Link to="/dashboard" style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: 15 }}>Dashboard</Link>}
          {isAdmin && <Link to="/admin" style={{ padding: '10px 0', color: 'var(--gold)', fontSize: 15 }}>Admin Panel</Link>}
          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          ) : (
            <button onClick={handleLogout} style={{ padding: '10px 0', color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', fontSize: 15, cursor: 'pointer' }}>Logout</button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
