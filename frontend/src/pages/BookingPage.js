import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCar, createBooking } from '../services/api';
import { formatCurrency, formatDateInput, calcDays } from '../utils/helpers';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiArrowRight, FiInfo } from 'react-icons/fi';

const LOCATIONS = ['New York JFK Airport', 'Los Angeles LAX Airport', 'Chicago O\'Hare Airport', 'Miami International Airport', 'San Francisco SFO Airport', 'Dallas Fort Worth Airport', 'Houston Hobby Airport', 'Seattle-Tacoma Airport', 'Denver International Airport', 'Las Vegas McCarran Airport', 'Boston Logan Airport', 'Austin-Bergstrom Airport'];

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const today = formatDateInput(new Date());
  const tomorrow = formatDateInput(new Date(Date.now() + 86400000));

  const [form, setForm] = useState({
    pickupDate: today,
    dropoffDate: tomorrow,
    pickupLocation: '',
    dropoffLocation: '',
    notes: '',
  });

  useEffect(() => {
    getCar(carId)
      .then(res => setCar(res.data.data))
      .catch(() => { toast.error('Car not found'); navigate('/cars'); })
      .finally(() => setLoading(false));
  }, [carId, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!car) return null;

  const days = calcDays(form.pickupDate, form.dropoffDate);
  const total = days * car.pricePerDay;

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pickupLocation) { toast.error('Please select pickup location'); return; }
    if (new Date(form.dropoffDate) <= new Date(form.pickupDate)) { toast.error('Drop-off must be after pickup date'); return; }
    setSubmitting(true);
    try {
      const { data } = await createBooking({ carId, ...form });
      toast.success('Booking created! Proceed to payment.');
      navigate(`/payment/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: 10, width: '100%', fontSize: 15 };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container-sm" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Complete Your Booking</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Fill in the details to reserve your vehicle</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="booking-layout">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Car Summary */}
            <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
              <img src={car.images?.[0]} alt={car.name} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 10 }} />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{car.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{car.brand} · {car.year} · {car.specs?.transmission}</p>
                <p style={{ color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>{formatCurrency(car.pricePerDay)}/day</p>
              </div>
            </div>

            {/* Dates */}
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCalendar style={{ color: 'var(--accent)' }} />Rental Dates
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pickup Date</label>
                  <input type="date" name="pickupDate" value={form.pickupDate} onChange={handle} min={today} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Drop-off Date</label>
                  <input type="date" name="dropoffDate" value={form.dropoffDate} onChange={handle} min={form.pickupDate} required />
                </div>
              </div>
              {days > 0 && (
                <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(230,57,70,0.08)', borderRadius: 8, border: '1px solid rgba(230,57,70,0.2)', fontSize: 14, color: 'var(--accent)' }}>
                  <FiInfo size={14} style={{ display: 'inline', marginRight: 6 }} />
                  Rental duration: <strong>{days} day{days !== 1 ? 's' : ''}</strong>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiMapPin style={{ color: 'var(--accent)' }} />Pickup & Return
              </h3>
              <div className="form-group">
                <label className="form-label">Pickup Location</label>
                <select name="pickupLocation" value={form.pickupLocation} onChange={handle} required style={selectStyle}>
                  <option value="">Select pickup location...</option>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Drop-off Location (leave blank for same)</label>
                <select name="dropoffLocation" value={form.dropoffLocation} onChange={handle} style={selectStyle}>
                  <option value="">Same as pickup</option>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>Additional Notes (optional)</h3>
              <textarea name="notes" value={form.notes} onChange={handle}
                placeholder="Any special requests or requirements..."
                rows={3} style={{ resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Processing...' : <>Proceed to Payment <FiArrowRight size={18} /></>}
            </button>
          </form>

          {/* Summary */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Price Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Base price', `${formatCurrency(car.pricePerDay)} × ${days} day${days !== 1 ? 's' : ''}`],
                  ['Subtotal', formatCurrency(total)],
                  ['Insurance', 'Included'],
                  ['Taxes & fees', 'Included'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span>{label}</span><span style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
                <hr className="divider" style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{formatCurrency(total)}</span>
                </div>
              </div>
              <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-secondary)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                🔒 Your booking is protected by our secure payment system. Free cancellation up to 24 hours before pickup.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .booking-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
