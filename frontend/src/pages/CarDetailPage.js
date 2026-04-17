import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCar, getCarReviews, createReview, deleteReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import StarRating from '../components/common/StarRating';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../utils/helpers';
import { FiMapPin, FiHeart, FiUsers, FiZap, FiSettings, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

const CarDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    Promise.all([getCar(id), getCarReviews(id)])
      .then(([carRes, revRes]) => {
        setCar(carRes.data.data);
        setReviews(revRes.data.data);
      })
      .catch(() => toast.error('Failed to load car details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!car) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Car not found.</div>;

  const wishlisted = isInWishlist(car._id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.rating) { toast.error('Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await createReview({ carId: id, ...newReview });
      setReviews(prev => [data.data, ...prev]);
      setCar(prev => ({ ...prev, numReviews: prev.numReviews + 1 }));
      setNewReview({ rating: 0, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 24 }}>
          <FiArrowLeft />Back to Cars
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }} className="detail-layout">
          {/* Left Column */}
          <div>
            {/* Images */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 12, height: 420, background: 'var(--bg-card)' }}>
                <img src={car.images?.[activeImg]} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {car.images?.length > 1 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {car.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      style={{ flex: 1, height: 80, borderRadius: 10, overflow: 'hidden', border: i === activeImg ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', padding: 0 }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="card" style={{ padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-secondary">{car.category}</span>
                    <span className={`badge badge-${car.availability ? 'success' : 'danger'}`}>
                      {car.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 4 }}>{car.name}</h1>
                  <p style={{ color: 'var(--text-muted)' }}>{car.brand} {car.model} · {car.year} · {car.color}</p>
                </div>
                <button onClick={() => toggleWishlist(car._id)}
                  style={{ width: 44, height: 44, borderRadius: '50%', background: wishlisted ? 'var(--accent)' : 'var(--bg-secondary)', border: `1px solid ${wishlisted ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <FiHeart fill={wishlisted ? '#fff' : 'none'} color={wishlisted ? '#fff' : 'var(--text-secondary)'} size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <StarRating rating={car.rating} />
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{car.rating} · {car.numReviews} reviews</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{car.description}</p>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: 20, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                {[
                  { icon: <FiUsers size={16} />, label: 'Seats', val: car.specs?.seats },
                  { icon: <FiZap size={16} />, label: 'Fuel Type', val: car.specs?.fuelType },
                  { icon: <FiSettings size={16} />, label: 'Transmission', val: car.specs?.transmission },
                  { icon: <span>⛽</span>, label: 'Mileage', val: car.specs?.mileage },
                  { icon: <span>🏎️</span>, label: 'Engine', val: car.specs?.engine },
                  { icon: <span>⚡</span>, label: 'Horsepower', val: car.specs?.horsepower ? `${car.specs.horsepower} hp` : '-' },
                  { icon: <span>🚀</span>, label: '0-60', val: car.specs?.acceleration },
                  { icon: <span>🏁</span>, label: 'Top Speed', val: car.specs?.topSpeed },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--accent)' }}>{s.icon}</span>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{s.val || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, marginBottom: 16 }}>Features & Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {car.features.map((f, i) => (
                    <span key={i} className="tag">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 20, marginBottom: 20 }}>Customer Reviews ({reviews.length})</h3>

              {/* Write Review */}
              {isAuthenticated && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 16, fontSize: 16 }}>Write a Review</h4>
                  <form onSubmit={handleSubmitReview}>
                    <div style={{ marginBottom: 12 }}>
                      <label className="form-label">Your Rating</label>
                      <StarRating rating={newReview.rating} interactive onRate={r => setNewReview(p => ({ ...p, rating: r }))} size={24} />
                    </div>
                    <div className="form-group">
                      <input placeholder="Review title..." value={newReview.title} onChange={e => setNewReview(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <textarea placeholder="Share your experience..." value={newReview.comment} onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))} rows={3} required style={{ resize: 'vertical' }} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>No reviews yet. Be the first!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reviews.map(r => (
                    <div key={r._id} style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={r.user?.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{r.user?.name}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(r.createdAt)}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StarRating rating={r.rating} size={14} />
                          {(user?._id === r.user?._id || user?.role === 'admin') && (
                            <button onClick={() => handleDeleteReview(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{r.title}</p>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {formatCurrency(car.pricePerDay)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}> / day</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--text-muted)', fontSize: 14 }}>
                <FiMapPin size={14} /><span>{car.location}</span>
              </div>

              <hr className="divider" />

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Base price</span>
                  <span>{formatCurrency(car.pricePerDay)}/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Registration</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{car.registrationNumber}</span>
                </div>
              </div>

              {car.availability ? (
                isAuthenticated ? (
                  <Link to={`/booking/${car._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
                    Book Now
                  </Link>
                ) : (
                  <Link to={`/login?redirect=/booking/${car._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
                    Login to Book
                  </Link>
                )
              ) : (
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                  Currently Unavailable
                </button>
              )}

              <button onClick={() => toggleWishlist(car._id)} className="btn btn-secondary" style={{ width: '100%' }}>
                <FiHeart fill={wishlisted ? 'var(--accent)' : 'none'} color={wishlisted ? 'var(--accent)' : 'inherit'} size={16} />
                {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10 }}>
                {[['Free cancellation', '✓'], ['Insurance included', '✓'], ['24/7 support', '✓']].map(([t, v]) => (
                  <div key={t} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                    <span>{t}</span><span style={{ color: '#22c55e' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CarDetailPage;
