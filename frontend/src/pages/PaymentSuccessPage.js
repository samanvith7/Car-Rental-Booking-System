import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBooking } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { FiCheckCircle, FiCalendar, FiDownload } from 'react-icons/fi';

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookingId) {
      getBooking(bookingId).then(res => setBooking(res.data.data)).catch(() => {});
    }
  }, [bookingId]);

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 560, width: '100%', padding: '0 24px', textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <FiCheckCircle size={48} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid rgba(34,197,94,0.1)', animation: 'ripple 1.5s ease-out infinite' }} />
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 40 }}>
          Your booking has been confirmed. Enjoy your ride! 🚗
        </p>

        {booking && (
          <div className="card" style={{ padding: 24, textAlign: 'left', marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <img src={booking.car?.images?.[0]} alt="" style={{ width: 90, height: 64, objectFit: 'cover', borderRadius: 10 }} />
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{booking.car?.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{booking.car?.brand}</p>
                <span className="badge badge-success" style={{ marginTop: 4, fontSize: 11 }}>Confirmed</span>
              </div>
            </div>
            {[
              ['Booking Number', booking.bookingNumber],
              ['Pickup Date', formatDate(booking.pickupDate)],
              ['Drop-off Date', formatDate(booking.dropoffDate)],
              ['Pickup Location', booking.pickupLocation],
              ['Total Paid', formatCurrency(booking.totalAmount)],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '10px 0', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">
            <FiCalendar size={16} />View My Bookings
          </Link>
          <Link to="/cars" className="btn btn-secondary">Browse More Cars</Link>
        </div>
      </div>
      <style>{`@keyframes ripple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.4);opacity:0} }`}</style>
    </div>
  );
};

export const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, width: '100%', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>❌</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Payment Failed</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
          Something went wrong with your payment. Your booking has not been confirmed. Please try again or use a different card.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {bookingId && (
            <Link to={`/payment/${bookingId}`} className="btn btn-primary">Try Again</Link>
          )}
          <Link to="/cars" className="btn btn-secondary">Back to Cars</Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Need help? Contact our support team at support@driveelite.com
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
