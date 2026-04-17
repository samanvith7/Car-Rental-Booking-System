import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/api';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FiUser, FiCalendar, FiHeart, FiEdit3, FiSave, FiX } from 'react-icons/fi';

const tabs = [
  { id: 'bookings', label: 'My Bookings', icon: <FiCalendar /> },
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
];

const UserDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: { city: '', country: '' } });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, phone: user.phone || '', address: user.address || { city: '', country: '' } });
  }, [user]);

  useEffect(() => {
    getUserBookings()
      .then(res => setBookings(res.data.data))
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`, { reason: 'Cancelled by user' });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/profile', profileForm);
      updateUser(data.data);
      setEditMode(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const stats = [
    { label: 'Total Bookings', val: bookings.length },
    { label: 'Completed', val: bookings.filter(b => b.status === 'completed').length },
    { label: 'Active', val: bookings.filter(b => b.status === 'confirmed').length },
    { label: 'Total Spent', val: formatCurrency(bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0)) },
  ];

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
          <img src={user?.avatar} alt={user?.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }} />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Welcome, {user?.name?.split(' ')[0]}!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.email} · Member since {formatDate(user?.createdAt)}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)', marginBottom: 4 }}>{s.val}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: activeTab === t.id ? 'var(--accent)' : 'var(--text-secondary)', borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent)' : 'transparent'}`, marginBottom: -1, transition: 'all 0.2s' }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {loadingBookings ? <Loader /> : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ marginBottom: 8 }}>No bookings yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Start your journey by booking a car</p>
                <Link to="/cars" className="btn btn-primary">Browse Cars</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {bookings.map(b => (
                  <div key={b._id} className="card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 20, alignItems: 'center' }}>
                    <img src={b.car?.images?.[0]} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 10 }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700 }}>{b.car?.name}</h3>
                        <span className={`badge badge-${getStatusColor(b.status)}`} style={{ fontSize: 11 }}>{b.status}</span>
                        <span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : 'warning'}`} style={{ fontSize: 11 }}>{b.paymentStatus}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                        {formatDate(b.pickupDate)} → {formatDate(b.dropoffDate)} · {b.totalDays} day{b.totalDays !== 1 ? 's' : ''}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{b.pickupLocation}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>{formatCurrency(b.totalAmount)}</p>
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button onClick={() => handleCancelBooking(b._id)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                          Cancel
                        </button>
                      )}
                      {b.status === 'pending' && b.paymentStatus !== 'paid' && (
                        <Link to={`/payment/${b._id}`} className="btn btn-primary btn-sm" style={{ marginLeft: 8 }}>Pay Now</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 600 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20 }}>Personal Information</h3>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="btn btn-secondary btn-sm">
                    <FiEdit3 size={14} />Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setEditMode(false)} className="btn btn-ghost btn-sm"><FiX size={14} /></button>
                    <button onClick={handleSaveProfile} className="btn btn-primary btn-sm" disabled={savingProfile}>
                      <FiSave size={14} />{savingProfile ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                {[
                  { label: 'Full Name', key: 'name', val: profileForm.name },
                  { label: 'Email', key: 'email', val: user?.email, disabled: true },
                  { label: 'Phone', key: 'phone', val: profileForm.phone },
                  { label: 'City', key: 'city', val: profileForm.address?.city, isAddr: true },
                  { label: 'Country', key: 'country', val: profileForm.address?.country, isAddr: true },
                ].map(f => (
                  <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{f.label}</label>
                    {editMode && !f.disabled ? (
                      <input value={f.val || ''} onChange={e => {
                        if (f.isAddr) setProfileForm(p => ({ ...p, address: { ...p.address, [f.key]: e.target.value } }));
                        else setProfileForm(p => ({ ...p, [f.key]: e.target.value }));
                      }} />
                    ) : (
                      <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 15, color: f.disabled ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {f.val || <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10, textAlign: 'center' }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{user?.role?.toUpperCase()}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Account Type</p>
                  </div>
                  <Link to="/wishlist" style={{ flex: 1, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10, textAlign: 'center', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <FiHeart size={20} style={{ color: 'var(--accent)' }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>View Wishlist</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
