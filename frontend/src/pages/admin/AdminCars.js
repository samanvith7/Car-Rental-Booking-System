import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getCars, createCar, updateCar, deleteCar } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit3, FiTrash2, FiX, FiSave, FiSearch } from 'react-icons/fi';

const EMPTY_CAR = {
  name: '', brand: '', model: '', year: new Date().getFullYear(), category: 'Economy', type: 'Sedan',
  pricePerDay: '', location: '', color: 'White', description: '', registrationNumber: '', availability: true,
  images: ['', '', ''],
  features: '',
  specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 5, mileage: '', engine: '', horsepower: '', acceleration: '', topSpeed: '' },
};

const inputStyle = { background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 14px', borderRadius: 8, width: '100%', fontSize: 14 };
const selectStyle = { ...inputStyle, cursor: 'pointer' };

const CarModal = ({ car, onClose, onSave }) => {
  const [form, setForm] = useState(car || EMPTY_CAR);
  const [saving, setSaving] = useState(false);
  const isEdit = !!car?._id;

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const setSpec = (key, val) => setForm(p => ({ ...p, specs: { ...p.specs, [key]: val } }));
  const setImage = (i, val) => {
    const imgs = [...(form.images || ['', '', ''])];
    imgs[i] = val;
    set('images', imgs);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.model || !form.pricePerDay || !form.location || !form.registrationNumber) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        images: (form.images || []).filter(Boolean),
        features: typeof form.features === 'string' ? form.features.split(',').map(f => f.trim()).filter(Boolean) : form.features,
        pricePerDay: Number(form.pricePerDay),
        year: Number(form.year),
        specs: {
          ...form.specs,
          seats: Number(form.specs.seats),
          horsepower: Number(form.specs.horsepower) || undefined,
        },
      };
      let result;
      if (isEdit) result = await updateCar(car._id, payload);
      else result = await createCar(payload);
      toast.success(isEdit ? 'Car updated!' : 'Car created!');
      onSave(result.data.data, isEdit);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save car');
    } finally {
      setSaving(false);
    }
  };

  const featuresStr = Array.isArray(form.features) ? form.features.join(', ') : form.features;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-primary)', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiX /></button>
        </div>

        <div style={{ padding: 28, display: 'grid', gap: 24 }}>
          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['name','Name*','text'],['brand','Brand*','text'],['model','Model*','text'],['year','Year','number'],['registrationNumber','Registration No.*','text'],['color','Color','text'],['location','Location*','text'],['pricePerDay','Price/Day ($)*','number']].map(([k,l,t]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{l}</label>
                  <input type={t} value={form[k] || ''} onChange={e => set(k, e.target.value)} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Category*</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} style={selectStyle}>
                  {['Economy','Premium','Luxury','SUV','Hatchback','Van'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Body Type*</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} style={selectStyle}>
                  {['Sedan','SUV','Hatchback','Luxury','Van','Convertible'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Fuel Type</label>
                <select value={form.specs.fuelType} onChange={e => setSpec('fuelType', e.target.value)} style={selectStyle}>
                  {['Petrol','Diesel','Electric','Hybrid'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Transmission</label>
                <select value={form.specs.transmission} onChange={e => setSpec('transmission', e.target.value)} style={selectStyle}>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </div>
              {[['seats','Seats','number'],['mileage','Mileage','text'],['engine','Engine','text'],['horsepower','Horsepower','number'],['acceleration','0-60 mph','text'],['topSpeed','Top Speed','text']].map(([k,l,t]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{l}</label>
                  <input type={t} value={form.specs[k] || ''} onChange={e => setSpec(k, e.target.value)} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Images (URLs)</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input value={(form.images || [])[i] || ''} onChange={e => setImage(i, e.target.value)} placeholder={`Image ${i+1} URL`} style={inputStyle} />
                  {(form.images || [])[i] && <img src={(form.images || [])[i]} alt="" style={{ width: 48, height: 34, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => e.target.style.display='none'} />}
                </div>
              ))}
            </div>
          </div>

          {/* Features & Description */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Features & Description</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Features (comma-separated)</label>
                <input value={featuresStr || ''} onChange={e => set('features', e.target.value)} placeholder="e.g. AC, GPS, Bluetooth, Sunroof" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Description</label>
                <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={form.availability} onChange={e => set('availability', e.target.checked)} id="avail" style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
                <label htmlFor="avail" style={{ fontSize: 14, cursor: 'pointer' }}>Available for booking</label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '20px 28px', borderTop: '1px solid var(--border)', position: 'sticky', bottom: 0, background: 'var(--bg-card)' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <FiSave size={16} />{saving ? 'Saving...' : isEdit ? 'Update Car' : 'Add Car'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | car object

  useEffect(() => {
    getCars({ limit: 100 })
      .then(res => setCars(res.data.data))
      .catch(() => toast.error('Failed to load cars'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (savedCar, isEdit) => {
    if (isEdit) setCars(prev => prev.map(c => c._id === savedCar._id ? savedCar : c));
    else setCars(prev => [savedCar, ...prev]);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCar(id);
      setCars(prev => prev.filter(c => c._id !== id));
      toast.success('Car deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = cars.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Cars">
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', flex: '1', maxWidth: 320 }}>
          <FiSearch size={16} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cars..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
        </div>
        <button onClick={() => setModal('add')} className="btn btn-primary">
          <FiPlus size={16} />Add New Car
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Car', 'Category', 'Location', 'Price/Day', 'Status', 'Rating', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(car => (
                  <tr key={car._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={car.images?.[0]} alt="" style={{ width: 56, height: 38, objectFit: 'cover', borderRadius: 6 }} />
                        <div>
                          <p style={{ fontWeight: 600 }}>{car.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{car.brand} · {car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-secondary" style={{ fontSize: 11 }}>{car.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{car.location}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent)' }}>{formatCurrency(car.pricePerDay)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${car.availability ? 'success' : 'danger'}`} style={{ fontSize: 11 }}>
                        {car.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--gold)' }}>⭐ {car.rating} ({car.numReviews})</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setModal(car)} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <FiEdit3 size={13} />Edit
                        </button>
                        <button onClick={() => handleDelete(car._id, car.name)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                          <FiTrash2 size={13} />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No cars found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <CarModal
          car={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
};

export default AdminCars;
