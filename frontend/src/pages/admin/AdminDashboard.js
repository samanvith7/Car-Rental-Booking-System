import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDashboardStats } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiTruck, FiUsers, FiCalendar, FiDollarSign, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const COLORS = ['#e63946', '#f4a261', '#22c55e', '#3b82f6', '#a855f7'];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon, label, value, sub, color = 'var(--accent)' }) => (
  <div className="card" style={{ padding: 24 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><Loader /></AdminLayout>;
  if (!stats) return <AdminLayout title="Dashboard"><p>Failed to load stats.</p></AdminLayout>;

  const monthlyData = stats.monthlyRevenue.map(d => ({
    name: MONTH_NAMES[(d._id.month || 1) - 1],
    revenue: d.revenue,
    bookings: d.count,
  }));

  const pieData = stats.bookingsByCategory.map(d => ({ name: d._id || 'Other', value: d.count }));

  const statCards = [
    { icon: <FiTruck size={20} />, label: 'Total Cars', value: stats.totalCars, sub: `${stats.availableCars} available`, color: '#3b82f6' },
    { icon: <FiUsers size={20} />, label: 'Total Users', value: stats.totalUsers, color: '#a855f7' },
    { icon: <FiCalendar size={20} />, label: 'Total Bookings', value: stats.totalBookings, sub: `${stats.confirmedBookings} confirmed`, color: '#f4a261' },
    { icon: <FiDollarSign size={20} />, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: '#22c55e' },
    { icon: <FiCheckCircle size={20} />, label: 'Completed', value: stats.completedBookings, color: '#22c55e' },
    { icon: <FiXCircle size={20} />, label: 'Cancelled', value: stats.cancelledBookings, color: '#ef4444' },
    { icon: <FiClock size={20} />, label: 'Pending', value: stats.pendingBookings, color: '#f59e0b' },
    { icon: <FiTruck size={20} />, label: 'Unavailable Cars', value: stats.totalCars - stats.availableCars, color: '#6b7280' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Revenue Chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 24 }}>Monthly Revenue</h3>
          {monthlyData.length === 0 ? (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} formatter={v => [formatCurrency(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 24 }}>Bookings by Category</h3>
          {pieData.length === 0 ? (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 20 }}>Recent Bookings</h3>
        {stats.recentBookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>No bookings yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Booking #', 'Customer', 'Car', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map(b => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 12px', fontFamily: 'monospace', fontSize: 12 }}>{b.bookingNumber}</td>
                    <td style={{ padding: '12px 12px' }}>{b.user?.name}</td>
                    <td style={{ padding: '12px 12px' }}>{b.car?.name}</td>
                    <td style={{ padding: '12px 12px', color: 'var(--accent)', fontWeight: 600 }}>{formatCurrency(b.totalAmount)}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span className={`badge badge-${b.status === 'confirmed' ? 'info' : b.status === 'completed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`} style={{ fontSize: 11 }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--text-muted)' }}>{formatDate(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
