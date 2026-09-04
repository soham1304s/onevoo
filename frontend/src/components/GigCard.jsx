import React from 'react';

const GigCard = ({ gig, onSelect, isApplied, index }) => {
  return (
    <div
      className="showcase-card premium-card satin-card gig-card-animate"
      onClick={onSelect}
      style={{
        '--accent-color': gig.accent || 'var(--accent-purple)',
        animationDelay: `${index * 40}ms`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '380px',
      }}
    >
      {/* Background Image / Moodboard Backdrop */}
      {gig.image && (
        <div
          className="card-bg-image"
          style={{
            backgroundImage: `url(${gig.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.18,
            transition: 'transform 0.5s ease, opacity 0.3s ease',
            zIndex: 0,
          }}
        />
      )}
      <div className="card-image-overlay" />

      {/* Top Section: Brand Banner & Moodboard Indicators */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '15px' }}>{gig.brandLogo || '✨'}</span>
              <span className="mono card-brand" style={{ fontWeight: 800, fontSize: '12px', letterSpacing: '0.04em' }}>
                {gig.brand}
              </span>
            </div>
            <span className="mono card-city" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              📍 {gig.city} • {gig.brandTier || 'Verified Brand'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {isApplied ? (
              <span className="applied-tag mono" style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', fontWeight: 700 }}>
                Escrow Locked ✓
              </span>
            ) : (
              <span
                className="mono card-tag"
                style={{
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(112, 37, 225, 0.15)',
                  color: gig.accent || 'var(--accent-purple)',
                  border: `1px solid ${gig.accent || 'rgba(112, 37, 225, 0.3)'}`,
                  fontWeight: 700
                }}
              >
                {gig.tag}
              </span>
            )}

            {gig.matchScore && (
              <span className="mono" style={{ fontSize: '9px', color: 'var(--accent-green)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 5px', borderRadius: '4px' }}>
                ★ {gig.matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0 2px', lineHeight: 1.25 }}>
          {gig.title}
        </h3>

        {/* Deliverables & Negotiable Budget Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', background: 'rgba(223, 182, 64, 0.12)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(223, 182, 64, 0.3)' }}>
            ✦ {gig.payout} {gig.isNegotiable && "(Negotiable)"}
          </span>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            ● {gig.deliverablesCount || 3} Core Deliverables
          </span>
        </div>
      </div>

      {/* Middle Section: Blueprint Eligibility Specs [Section 1] */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          margin: '12px 0',
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--satin-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          ELIGIBILITY REQUIREMENTS:
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-muted)' }}>├─ Niche:</span>
          <span style={{ color: 'var(--paper-soft)', fontWeight: 700 }}>{gig.requiredNiche || gig.tag}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-muted)' }}>├─ Min Engagement:</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{gig.minEngagementRate || 3.2}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-muted)' }}>└─ Min Followers:</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{(gig.minFollowers || 25000).toLocaleString()} Active</span>
        </div>
      </div>

      {/* Bottom Section: Brand Trust Quick Tags & Booking CTA */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Quick Tagging: Trust & Turnaround History */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <span>🛡️ Trust: <strong style={{ color: 'var(--accent-green)' }}>{gig.brandProfile?.relationshipScore || 95}%</strong></span>
          <span>⚡ Avg Pay: <strong style={{ color: 'var(--accent-gold)' }}>{gig.brandProfile?.avgPayoutDays || 12}d</strong></span>
          <span>🔄 {gig.brandProfile?.avgRevisionRounds || 1.2}x Revs</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="btn btn-solid card-apply-btn"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {isApplied ? "VIEW APPLICATION STATUS ⚡" : "NEGOTIATE & APPLY →"}
        </button>
      </div>
    </div>
  );
};

export default GigCard;