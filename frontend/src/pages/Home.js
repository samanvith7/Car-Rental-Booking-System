import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiArrowRight, FiShield, FiStar, FiClock, FiAward } from 'react-icons/fi';
import { getFeaturedCars } from '../services/api';
import CarCard from '../components/cars/CarCard';
import Loader from '../components/common/Loader';

const CATEGORIES = [
  { name: 'Economy', emoji: '🚗', desc: 'Budget-friendly options', color: '#22c55e' },
  { name: 'Premium', emoji: '🏎️', desc: 'Performance & style', color: '#3b82f6' },
  { name: 'Luxury', emoji: '✨', desc: 'Ultimate comfort', color: '#f4a261' },
  { name: 'SUV', emoji: '🚙', desc: 'Space & capability', color: '#a855f7' },
];

const STATS = [
  { value: '500+', label: 'Vehicles', icon: <FiAward /> },
  { value: '50+', label: 'Locations', icon: <FiMapPin /> },
  { value: '10K+', label: 'Happy Customers', icon: <FiStar /> },
  { value: '24/7', label: 'Support', icon: <FiClock /> },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedCars()
      .then(res => setFeaturedCars(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
        paddingTop: 70,
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '20%', right: '-10%', width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%', width: '40%', height: '40%',
          background: 'radial-gradient(circle, rgba(244,162,97,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 20, padding: '6px 16px', marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>Premium Car Rental Experience</span>
            </div>

            <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}>
              Drive Your<br />
              <span style={{ color: 'var(--accent)', display: 'inline-block' }}>Dream Car</span><br />
              Today
            </h1>

            <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 48, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px' }}>
              From sleek sedans to powerful SUVs — rent the perfect vehicle for every journey, at unbeatable prices.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 12, display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 680, margin: '0 auto', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
              <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', borderRadius: 10, padding: '0 14px' }}>
                <FiSearch size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Car type, brand..." style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: 15, color: 'var(--text-primary)', outline: 'none', width: '100%' }} />
              </div>
              <div style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', borderRadius: 10, padding: '0 14px' }}>
                <FiMapPin size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Location..." style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: 15, color: 'var(--text-primary)', outline: 'none', width: '100%' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', flexShrink: 0 }}>
                <FiSearch size={16} />Search
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
              {['Free cancellation', 'No hidden fees', 'Insured vehicles'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                  <FiShield size={13} style={{ color: 'var(--accent)' }} />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 12 }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Find the perfect car for every occasion</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/cars?category=${cat.name}`}
                style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 28, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = `0 12px 40px ${cat.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{cat.emoji}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{cat.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, marginBottom: 8 }}>Featured Vehicles</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Top-rated cars handpicked for you</p>
            </div>
            <Link to="/cars" className="btn btn-secondary">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          {loading ? <Loader /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {featuredCars.map(car => <CarCard key={car._id} car={car} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 12 }}>Why Choose DriveElite?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '🔒', title: 'Fully Insured', desc: 'Every vehicle comes with comprehensive insurance coverage for your peace of mind.' },
              { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any competitor price. Transparent pricing with no hidden fees.' },
              { icon: '🚀', title: 'Instant Booking', desc: 'Book in under 2 minutes. Instant confirmation and digital key delivery.' },
              { icon: '🛡️', title: '24/7 Roadside Support', desc: 'Our team is always on standby to assist you wherever you are.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5 }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 16, color: 'white' }}>
            Ready to Hit the Road?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 40 }}>
            Join thousands of happy customers who trust DriveElite for their journeys.
          </p>
          <Link to="/cars" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--accent)', padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            Browse All Cars <FiArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
