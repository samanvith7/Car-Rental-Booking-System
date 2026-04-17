import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking, mockPayment, createPaymentIntent, confirmPayment } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FiCreditCard, FiLock, FiCheckCircle } from 'react-icons/fi';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({ name: '', number: '4242 4242 4242 4242', expiry: '12/26', cvv: '123' });
  const useStripe = !!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY !== 'pk_test_your_stripe_publishable_key_here';

  useEffect(() => {
    getBooking(bookingId)
      .then(res => {
        const b = res.data.data;
        if (b.paymentStatus === 'paid') { navigate(`/payment/success?bookingId=${bookingId}`); return; }
        setBooking(b);
      })
      .catch(() => { toast.error('Booking not found'); navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [bookingId, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!booking) return null;

  const handleMockPayment = async () => {
    setProcessing(true);
    try {
      await mockPayment(bookingId);
      toast.success('Payment successful! 🎉');
      navigate(`/payment/success?bookingId=${bookingId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      navigate(`/payment/failure?bookingId=${bookingId}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardForm.name) { toast.error('Please enter cardholder name'); return; }
    // Simulate failure for test card 4000 0000 0000 0002
    if (cardForm.number.replace(/\s/g, '') === '4000000000000002') {
      toast.error('Card declined. Try 4242 4242 4242 4242 for success.');
      navigate(`/payment/failure?bookingId=${bookingId}`);
      return;
    }
    handleMockPayment();
  };

  const inputStyle = {
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 10,
    width: '100%', fontSize: 15, letterSpacing: '1px',
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container-sm" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Secure Payment</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Complete your booking with our secure payment gateway</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }} className="payment-layout">
          {/* Payment Form */}
          <div>
            {/* Test Mode Notice */}
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600, marginBottom: 6 }}>🧪 Test Mode Active</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Use <strong style={{ color: '#f59e0b' }}>4242 4242 4242 4242</strong> for success, or <strong style={{ color: '#ef4444' }}>4000 0000 0000 0002</strong> to test failure.
                Any future date & 3-digit CVV.
              </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCreditCard style={{ color: 'var(--accent)' }} />Card Details
              </h3>

              {/* Payment Method Logos */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['VISA', 'MC', 'AMEX', 'DISC'].map(b => (
                  <div key={b} style={{ padding: '4px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{b}</div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input value={cardForm.name} onChange={e => setCardForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="John Smith" required style={inputStyle} />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input value={cardForm.number}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      v = v.replace(/(.{4})/g, '$1 ').trim();
                      setCardForm(p => ({ ...p, number: v }));
                    }}
                    placeholder="0000 0000 0000 0000" required style={inputStyle} maxLength={19} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input value={cardForm.expiry}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCardForm(p => ({ ...p, expiry: v }));
                      }}
                      placeholder="MM/YY" required style={inputStyle} maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input value={cardForm.cvv}
                      onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="123" required style={inputStyle} maxLength={4} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                  <FiLock size={14} style={{ color: 'var(--accent)' }} />
                  Your payment information is encrypted and secure
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={processing}>
                  {processing ? (
                    <>
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <><FiLock size={18} />Pay {formatCurrency(booking.totalAmount)}</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Order Summary</h3>

              {/* Car */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <img src={booking.car?.images?.[0]} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{booking.car?.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{booking.car?.brand}</p>
                </div>
              </div>

              {[
                ['Booking #', booking.bookingNumber],
                ['Pickup', formatDate(booking.pickupDate)],
                ['Drop-off', formatDate(booking.dropoffDate)],
                ['Duration', `${booking.totalDays} day${booking.totalDays !== 1 ? 's' : ''}`],
                ['Rate', formatCurrency(booking.pricePerDay) + '/day'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10, color: 'var(--text-secondary)' }}>
                  <span>{label}</span><span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
                </div>
              ))}

              <hr className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{formatCurrency(booking.totalAmount)}</span>
              </div>

              <div style={{ marginTop: 20 }}>
                {[
                  ['Free cancellation (24h)', true],
                  ['Full insurance coverage', true],
                  ['24/7 roadside support', true],
                ].map(([t, v]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <FiCheckCircle size={13} style={{ color: '#22c55e' }} />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .payment-layout { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PaymentPage;
