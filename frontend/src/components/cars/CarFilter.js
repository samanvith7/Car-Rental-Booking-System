import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const CarFilter = ({ filters, onChange, onReset }) => {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  const selectStyle = {
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', padding: '10px 14px', borderRadius: 8,
    width: '100%', fontSize: 14, cursor: 'pointer',
  };

  return (
    <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18 }}>
          <FiFilter size={18} style={{ color: 'var(--accent)' }} />Filters
        </h3>
        <button onClick={onReset} className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)', fontSize: 13 }}>
          <FiX size={14} />Clear All
        </button>
      </div>

      {/* Search */}
      <div className="form-group">
        <label className="form-label">Search</label>
        <input name="search" value={filters.search} onChange={handle} placeholder="Car name, brand..." />
      </div>

      {/* Location */}
      <div className="form-group">
        <label className="form-label">Location</label>
        <input name="location" value={filters.location} onChange={handle} placeholder="City or airport..." />
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select name="category" value={filters.category} onChange={handle} style={selectStyle}>
          <option value="">All Categories</option>
          {['Economy','Premium','Luxury','SUV','Hatchback','Van'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Type */}
      <div className="form-group">
        <label className="form-label">Body Type</label>
        <select name="type" value={filters.type} onChange={handle} style={selectStyle}>
          <option value="">All Types</option>
          {['Sedan','SUV','Hatchback','Luxury','Van','Convertible'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Fuel Type */}
      <div className="form-group">
        <label className="form-label">Fuel Type</label>
        <select name="fuelType" value={filters.fuelType} onChange={handle} style={selectStyle}>
          <option value="">All Fuel Types</option>
          {['Petrol','Diesel','Electric','Hybrid'].map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Transmission */}
      <div className="form-group">
        <label className="form-label">Transmission</label>
        <select name="transmission" value={filters.transmission} onChange={handle} style={selectStyle}>
          <option value="">Any</option>
          <option>Automatic</option>
          <option>Manual</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="form-group">
        <label className="form-label">Price Range (per day)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handle} placeholder="Min $" min={0} />
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handle} placeholder="Max $" min={0} />
        </div>
      </div>

      {/* Availability */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
        <input type="checkbox" id="available" checked={filters.available === 'true'}
          onChange={e => onChange({ ...filters, available: e.target.checked ? 'true' : '' })}
          style={{ width: 18, height: 18, accentColor: 'var(--accent)', cursor: 'pointer' }} />
        <label htmlFor="available" style={{ fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          Show available only
        </label>
      </div>
    </div>
  );
};

export default CarFilter;
