import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiTruck, FiUsers, FiCalendar, FiLogOut, FiHome } from 'react-icons/fi';

const navItems = [
  { to: '/admin', icon: <FiGrid size={18} />, label: 'Dashboard' },
  { to: '/admin/cars', icon: <FiTruck size={18} />, label: 'Manage Cars' },
  { to: '/admin/users', icon: <FiUsers size={18} />, label: 'Manage Users' },
  { to: '/admin/bookings', icon: <FiCalendar size={18} />, label: 'Manage Bookings' },
];

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', position: 'fixed', top: 70, left: 0, bottom: 0, overflowY: 'auto', zIndex: 50 }}>
        <div style={{ padding: '24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 8px' }}>
            <img src={user?.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--accent)' }}>Administrator</p>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: active ? 'white' : 'var(--text-secondary)', background: active ? 'var(--accent)' : 'transparent', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = '#fff'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}>
                  {item.icon}{item.label}
                </Link>
              );
            })}
          </nav>

          <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <FiHome size={16} />View Site
            </Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: 14, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
              <FiLogOut size={16} />Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: 'calc(100vh - 70px)' }}>
        {title && <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
