import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const bookingId = location.state?.bookingId || Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="booking-confirmation-page wrap">
      <div className="applied-success-state">
        <div className="success-icon-wrap" style={{ borderColor: 'var(--c-green)' }}>
          <span style={{ color: 'var(--c-green)' }}>✓</span>
        </div>
        <h3>Booking Confirmed!</h3>
        <p className="form-success-sub">
          Your session has been successfully booked. A confirmation email has been sent.
        </p>
        <div className="booking-ref-box">
          <span className="ref-label">Your Booking Reference</span>
          <span className="ref-number">{bookingId}</span>
        </div>
        <p className="success-next-steps">You can now close this page or return to the homepage.</p>
      </div>
      <br />
      <Link to="/" className="btn btn-ghost" style={{ marginTop: '24px' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default BookingConfirmation;