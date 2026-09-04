import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComingSoon } from '../context/ComingSoonContext';

const BookingPage = () => {
    const navigate = useNavigate();
    const { openComingSoon } = useComingSoon();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmBooking = () => {
        openComingSoon({
          title: "Demo Booking Engine — Coming Soon",
          badgeText: "Private Access • Q3 2026",
          description: "Live 1-on-1 demo scheduling with creator growth experts is currently opening in limited batches.",
          category: "Demo Session",
          icon: "📅",
          progress: 95,
          highlights: [
            "1-on-1 Strategy Walkthrough",
            "Custom Rate Card Benchmark",
            "VIP Account Setup Onboarding"
          ]
        });
    };

    return (
        <div className="booking-page wrap">
            <h1>Book a Demo Session</h1>
            <div className="booking-content">
                <p className="form-success-sub">
                    Please fill out the form below to schedule a personalized demo with one of our experts. We'll walk you through the Onevoo platform and answer any questions you have.
                </p>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" placeholder="e.g., Jane Doe" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="e.g., jane.doe@example.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company (Optional)</label>
                    <input type="text" id="company" placeholder="e.g., Creative Inc." />
                </div>
                <div className="form-group">
                    <button className="btn btn-solid" onClick={handleConfirmBooking} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="spinner-loader"></span>
                        ) : (
                            "Confirm Booking"
                        )}
                    </button>
                </div>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                Go Back
            </button>
        </div>
    );
};

export default BookingPage;