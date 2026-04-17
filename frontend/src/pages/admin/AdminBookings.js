import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllBookings, updateBookingStatus } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiChevronDown } from 'react-icons/fi';

const STATUS_OPTIONS = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

const BookingDetailModal = ({ booking, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
    <div style={{ background: 'var(--bg-card)', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>Booking Details</h2>
        <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-primary)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ padding: 24 }}>
        {/* Car */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <img src={booking.car?.images?.[0]} alt="" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 10 }} />
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{booking.car?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{booking.car?.brand}</p>
            <span className={`badge badge-${getStatusColor(booking.status)}`} style={{ marginTop: 8, fontSize: 11, display: 'inline-flex' }}>{booking.status}</span>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            ['Booking #', booking.bookingNumber],
            ['Customer', booking.user?.name],
            ['Email', booking.user?.email],
            ['Pickup Date', formatDate(booking.pickupDate)],
            ['Drop-off Date', formatDate(booking.dropoffDate)],
            ['Duration', `${booking.totalDays} days`],
            ['Pickup Location', booking.pickupLocation],
            ['Drop-off Location', booking.dropoffLocation || 'Same as pickup'],
            ['Price/Day', formatCurrency(booking.pricePerDay)],
            ['Total Amount', formatCurrency(booking.totalAmount)],
            ['Payment Status', booking.paymentStatus],
            ['Booked On', formatDate(booking.createdAt)],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)' }}>{l}</span>
              <span style={{ fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
          {booking.notes && (
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
              <strong>Notes:</strong> {booking.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getAllBookings()
      .then(res => setBookings(res.data.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const { data } = await updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: data.data.status } : b));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.car?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);

  const statCards = [
    { label: 'Total', val: bookings.length, color: 'var(--text-primary)' },
    { label: 'Pending', val: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
    { label: 'Confirmed', val: bookings.filter(b => b.status === 'confirmed').length, color: '#3b82f6' },
    { label: 'Revenue', val: formatCurrency(totalRevenue), color: '#22c55e' },
  ];

  return (
    <AdminLayout title="Manage Bookings">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {statCards.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.val}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', flex: 1, maxWidth: 320 }}>
          <FiSearch size={16} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid ' + (statusFilter === s ? 'var(--accent)' : 'var(--border)'), background: statusFilter === s ? 'var(--accent)' : 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Booking #', 'Customer', 'Car', 'Dates', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 14px', color: 'var(--text-muted)', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{b.bookingNumber}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ fontWeight: 600 }}>{b.user?.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.user?.email}</p>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={b.car?.images?.[0]} alt="" style={{ width: 44, height: 30, objectFit: 'cover', borderRadius: 5 }} />
                        <span style={{ fontWeight: 500 }}>{b.car?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>
                      <p>{formatDate(b.pickupDate)}</p>
                      <p style={{ color: 'var(--text-muted)' }}>→ {formatDate(b.dropoffDate)}</p>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(b.totalAmount)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : b.paymentStatus === 'failed' ? 'danger' : 'warning'}`} style={{ fontSize: 11 }}>{b.paymentStatus}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select value={b.status}
                        onChange={e => handleStatusChange(b._id, e.target.value)}
                        disabled={updatingId === b._id}
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 7, fontSize: 12, cursor: 'pointer', opacity: updatingId === b._id ? 0.6 : 1 }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => setDetail(b)} style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                        <FiEye size={13} />View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detail && <BookingDetailModal booking={detail} onClose={() => setDetail(null)} />}
    </AdminLayout>
  );
};

export default AdminBookings;
