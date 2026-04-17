import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => (
  <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', paddingTop: 60, paddingBottom: 32 }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'white' }}>D</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>Drive<span style={{ color: 'var(--accent)' }}>Elite</span></span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
            Premium car rentals for every occasion. Experience the road in style with our curated fleet of exceptional vehicles.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Quick Links</h4>
          {[['Browse Cars', '/cars'], ['How It Works', '#'], ['Pricing', '#'], ['Locations', '#']].map(([label, to]) => (
            <Link key={label} to={to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
              {label}
            </Link>
          ))}
        </div>

        {/* Car Categories */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Categories</h4>
          {['Economy', 'Premium', 'Luxury', 'SUV', 'Hatchback'].map(cat => (
            <Link key={cat} to={`/cars?category=${cat}`} style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Support</h4>
          {[['FAQ', '#'], ['Contact Us', '#'], ['Terms of Service', '#'], ['Privacy Policy', '#']].map(([label, to]) => (
            <Link key={label} to={to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>© {new Date().getFullYear()} DriveElite. All rights reserved.</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Built with ❤️ using MERN Stack</p>
      </div>
    </div>
  </footer>
);

export default Footer;
