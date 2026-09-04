import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import EscrowLedgerModal from "./Enterprise/EscrowLedgerModal";

export default function GigDetailsDrawer({ gig, onClose, onApply, isAlreadyApplied }) {
  const { user, profile, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    handle: "",
    followers: "50k - 100k",
    portfolio: "https://instagram.com/tanvi.creates",
    pitch: "I would love to produce a high-converting 4K vertical video reel for this launch highlighting texture and results!"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [showLedger, setShowLedger] = useState(false);

  // Sync profile data from Neon database
  useEffect(() => {
    if (user || profile) {
      setFormData(prev => ({
        ...prev,
        name: user?.full_name || profile?.full_name || prev.name,
        email: user?.email || prev.email,
        handle: profile?.handle || `@${user?.full_name?.toLowerCase().replace(/\s+/g, '') || 'creator'}`,
        followers: profile?.followers_count ? `${Math.round(profile.followers_count / 1000)}k+ followers` : "50k - 100k",
      }));
    }
  }, [user, profile]);

  if (!gig) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAlreadyApplied) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `OV-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(ref);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      if (onApply) {
        onApply(gig.id, ref, formData);
      }
    }, 600);
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}>
        <div 
          className="drawer-panel satin-card" 
          onClick={(e) => e.stopPropagation()}
          style={{ borderLeft: `2px solid ${gig.accent || 'var(--accent-purple)'}` }}
        >
          {/* Close Button */}
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close details">
            ✕
          </button>

          {/* Hero Header */}
          <div className="drawer-hero">
            {gig.image && <img src={gig.image} alt={gig.title} className="drawer-hero-img" />}
            <div className="drawer-hero-overlay"></div>
            <div className="drawer-hero-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="drawer-badge" style={{ backgroundColor: `${gig.accent || '#8b5cf6'}22`, color: gig.accent || '#8b5cf6', borderColor: gig.accent || '#8b5cf6' }}>
                  {gig.tag}
                </span>
                {gig.format && (
                  <span className="mono" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>
                    {gig.format}
                  </span>
                )}
                {gig.matchScore && (
                  <span className="mono" style={{ fontSize: '10px', background: 'rgba(16,185,129,0.2)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '4px' }}>
                    ★ {gig.matchScore}% Match
                  </span>
                )}
              </div>
              <h2 className="drawer-title">{gig.title}</h2>
              <p className="drawer-brand">by {gig.brand || "Partner Brand"}</p>
            </div>
          </div>

          {/* Details Content Container */}
          <div className="drawer-body">
            <div className="drawer-sections-grid">
              
              {/* Left Side: Campaign Specs */}
              <div className="drawer-left-col">
                {/* Meta Quick Specs */}
                <div className="drawer-specs-card">
                  <div className="spec-item">
                    <span className="spec-label">📍 LOCATION</span>
                    <span className="spec-val">{gig.city}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">💰 PAYOUT</span>
                    <span className="spec-val" style={{ color: gig.accent || 'var(--accent-gold)', fontWeight: 700 }}>
                      {gig.payout} {gig.payoutUSD && `(${gig.payoutUSD})`}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">🔒 ESCROW STATUS</span>
                    <span className="spec-val" style={{ color: 'var(--accent-green)' }}>
                      100% Locked in Neon
                    </span>
                  </div>
                </div>

                {/* View Escrow & Tax Breakdown Button */}
                <button
                  type="button"
                  onClick={() => setShowLedger(true)}
                  className="btn-magnetic"
                  style={{ width: '100%', marginBottom: '20px', padding: '10px', fontSize: '11px', justifyContent: 'center' }}
                >
                  📊 VIEW ESCROW LEDGER & TAX BREAKDOWN (TDS / GST)
                </button>

                {/* Description */}
                <div className="detail-section">
                  <h4>Campaign Overview</h4>
                  <p className="section-desc">{gig.description}</p>
                </div>

                {/* Requirements */}
                {gig.requirements && gig.requirements.length > 0 && (
                  <div className="detail-section">
                    <h4>Creator Requirements</h4>
                    <ul className="spec-list">
                      {gig.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deliverables */}
                {gig.deliverables && gig.deliverables.length > 0 && (
                  <div className="detail-section">
                    <h4>Required Deliverables</h4>
                    <ul className="spec-list tick-list">
                      {gig.deliverables.map((del, idx) => (
                        <li key={idx}>{del}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Side: Apply Form */}
              <div className="drawer-right-col">
                <div className="form-card">
                  {isAlreadyApplied ? (
                    <div className="applied-success-state">
                      <div className="success-icon-wrap" style={{ color: "var(--accent-green)", borderColor: "var(--accent-green)" }}>✓</div>
                      <h3>Application Submitted</h3>
                      <p className="form-success-sub">You have already applied for this booking. Our campaign managers are currently reviewing your profile in Neon PostgreSQL.</p>
                      
                      <div className="status-badge-container" style={{ marginTop: "16px" }}>
                        <span className="status-label mono">DATABASE STATUS:</span>
                        <span className="status-pill status-review mono" style={{ color: 'var(--accent-gold)' }}>Queue Active (98% Match) ⏳</span>
                      </div>

                      <button className="btn btn-ghost" onClick={onClose} style={{ width: "100%", marginTop: "24px" }}>
                        Back to Creator Gigs
                      </button>
                    </div>
                  ) : submitSuccess ? (
                    <div className="applied-success-state">
                      <div className="success-icon-wrap animated-pop" style={{ color: "var(--accent-green)", borderColor: "var(--accent-green)" }}>✓</div>
                      <h3>Application Sent!</h3>
                      <p className="form-success-sub">Your pitch and Neon verified creator profile have been dispatched to {gig.brand}.</p>
                      
                      <div className="booking-ref-box">
                        <span className="ref-label">Booking Ref:</span>
                        <span className="ref-number">{bookingRef}</span>
                      </div>

                      <p className="success-next-steps">
                        Milestone Escrow contract initialized. We will notify you at <strong>{formData.email}</strong> upon brand confirmation.
                      </p>

                      <button className="btn btn-solid" onClick={onClose} style={{ width: "100%", marginTop: "16px", background: 'var(--accent-purple)' }}>
                        Awesome, Got It!
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="booking-form">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0 }}>Apply for Booking</h3>
                        {isAuthenticated && (
                          <span className="mono" style={{ fontSize: '9px', color: 'var(--accent-green)' }}>
                            ⚡ NEON PROFILE SYNCED
                          </span>
                        )}
                      </div>

                      <p className="form-subtitle">Direct application with instant smart matching. 100% escrow milestone payouts guaranteed.</p>

                      <div className="form-group">
                        <label htmlFor="name" className="mono" style={{ fontSize: '11px' }}>Full Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder="e.g. Tanvi Sharma"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="mono" style={{ fontSize: '11px' }}>Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="e.g. tanvi@onevoo.com"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="handle" className="mono" style={{ fontSize: '11px' }}>Social Handle</label>
                          <input 
                            type="text" 
                            id="handle" 
                            name="handle" 
                            required 
                            value={formData.handle} 
                            onChange={handleInputChange} 
                            placeholder="e.g. @tanvi.creates"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="followers" className="mono" style={{ fontSize: '11px' }}>Audience Reach</label>
                          <input 
                            type="text" 
                            id="followers" 
                            name="followers" 
                            value={formData.followers} 
                            onChange={handleInputChange} 
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="portfolio" className="mono" style={{ fontSize: '11px' }}>Portfolio / Past Reel Link</label>
                        <input 
                          type="url" 
                          id="portfolio" 
                          name="portfolio" 
                          required 
                          value={formData.portfolio} 
                          onChange={handleInputChange} 
                          placeholder="https://instagram.com/mywork"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="pitch" className="mono" style={{ fontSize: '11px' }}>Content Direction & Pitch</label>
                        <textarea 
                          id="pitch" 
                          name="pitch" 
                          rows="3" 
                          required 
                          value={formData.pitch} 
                          onChange={handleInputChange} 
                          placeholder="Describe your creative vision and angle for this brand..."
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn-magnetic" 
                        disabled={isSubmitting} 
                        style={{ width: "100%", justifyContent: 'center', padding: '12px', fontSize: '12px', background: gig.accent || 'var(--accent-purple)' }}
                      >
                        {isSubmitting ? "Submitting to Neon Escrow Queue…" : "⚡ 1-CLICK APPLY FOR BOOKING"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Escrow Ledger Breakdown Modal */}
      <EscrowLedgerModal
        isOpen={showLedger}
        onClose={() => setShowLedger(false)}
        dealTitle={gig.title}
        grossAmount={gig.payoutNumeric || 85000}
      />
    </>
  );
}
