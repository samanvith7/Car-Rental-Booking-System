import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllUsers, deleteUser, toggleUserStatus } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiToggleLeft, FiToggleRight, FiShield, FiUser } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? All their data will be removed.`)) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUserStatus(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.data.isActive } : u));
      toast.success('User status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'admin' && u.role === 'admin') || (filter === 'active' && u.isActive) || (filter === 'inactive' && !u.isActive);
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Total Users', val: users.length },
    { label: 'Active', val: users.filter(u => u.isActive).length },
    { label: 'Admins', val: users.filter(u => u.role === 'admin').length },
    { label: 'Inactive', val: users.filter(u => !u.isActive).length },
  ];

  return (
    <AdminLayout title="Manage Users">
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{s.val}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', flex: '1', maxWidth: 300 }}>
          <FiSearch size={16} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'inactive', 'admin'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid ' + (filter === f ? 'var(--accent)' : 'var(--border)'), background: filter === f ? 'var(--accent)' : 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
              {f}
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
                  {['User', 'Email', 'Role', 'Phone', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={user.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: user.role === 'admin' ? 'rgba(244,162,97,0.15)' : 'rgba(255,255,255,0.05)', color: user.role === 'admin' ? 'var(--gold)' : 'var(--text-secondary)' }}>
                        {user.role === 'admin' ? <FiShield size={11} /> : <FiUser size={11} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{user.phone || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${user.isActive ? 'success' : 'danger'}`} style={{ fontSize: 11 }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{formatDate(user.createdAt)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {user.role !== 'admin' && (
                          <>
                            <button onClick={() => handleToggle(user._id)}
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                              style={{ padding: '6px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              {user.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                            </button>
                            <button onClick={() => handleDelete(user._id, user.name)}
                              style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <FiTrash2 size={15} />
                            </button>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
