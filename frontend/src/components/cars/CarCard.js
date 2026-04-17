import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiUsers, FiZap } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#f4a261' : 'none'} stroke="#f4a261" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>({rating})</span>
  </div>
);

const CarCard = ({ car }) => {
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const wishlisted = isInWishlist(car._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    await toggleWishlist(car._id);
  };

  return (
    <Link to={`/cars/${car._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

        {/* Image */}
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <img src={car.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />

          {/* Availability Badge */}
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className={`badge badge-${car.availability ? 'success' : 'danger'}`} style={{ fontSize: 11 }}>
              {car.availability ? '✓ Available' : '✗ Unavailable'}
            </span>
          </div>

          {/* Category Badge */}
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
            <span className="badge badge-secondary" style={{ fontSize: 11 }}>{car.category}</span>
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            style={{ position: 'absolute', bottom: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: wishlisted ? 'var(--accent)' : 'rgba(10,10,15,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}>
            <FiHeart size={15} fill={wishlisted ? '#fff' : 'none'} color={wishlisted ? '#fff' : '#fff'} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{car.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{car.brand} · {car.year}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                {formatCurrency(car.pricePerDay)}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>per day</p>
            </div>
          </div>

          <StarRating rating={car.rating} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            {[
              { icon: <FiUsers size={13} />, val: `${car.specs?.seats} Seats` },
              { icon: <FiZap size={13} />, val: car.specs?.fuelType },
              { icon: <span style={{ fontSize: 12 }}>⚙</span>, val: car.specs?.transmission },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12 }}>
                {item.icon}<span>{item.val}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12, color: 'var(--text-muted)', fontSize: 12 }}>
            <FiMapPin size={12} /><span>{car.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
