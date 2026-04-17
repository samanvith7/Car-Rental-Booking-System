import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/cars/CarCard';
import Loader from '../components/common/Loader';
import { FiHeart } from 'react-icons/fi';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/wishlist')
      .then(res => setWishlist(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiHeart style={{ color: 'var(--accent)' }} />My Wishlist
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{wishlist.length} saved vehicle{wishlist.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? <Loader /> : wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>💔</div>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
              Browse our fleet and save your favorite cars
            </p>
            <Link to="/cars" className="btn btn-primary">Browse Cars</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {wishlist.map(car => <CarCard key={car._id} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
