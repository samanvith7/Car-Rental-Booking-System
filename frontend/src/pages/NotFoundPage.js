import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ paddingTop: 90, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px' }}>
    <div>
      <div style={{ fontSize: '120px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, marginBottom: 16, opacity: 0.3 }}>404</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/cars" className="btn btn-secondary">Browse Cars</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
