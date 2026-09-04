import React from 'react';

export const RealTimeDealDrawer = ({ activeDeal, onClose, onAccept }) => {
  if (!activeDeal) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: activeDeal.compensationRange.currency || 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div
      className="deal-aura-notification satin-card"
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '440px',
        width: 'calc(100vw - 48px)',
        zIndex: 1000,
        border: '1px solid rgba(223, 182, 64, 0.45)',
        background: 'rgba(11, 11, 15, 0.92)',
        boxShadow: '0 24px 60px -12px rgba(0,0,0,0.85), 0 0 50px rgba(223, 182, 64, 0.25)',
        padding: '22px 24px',
        borderRadius: '14px',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-emerald-ring" />
          <span className="tech-label-mono" style={{ fontSize: '10px' }}>LIVE DEAL MATCH STREAM</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>

      {/* Brand & Campaign */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(223, 182, 64, 0.12)',
            border: '1px solid rgba(223, 182, 64, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}
        >
          {activeDeal.brandLogo}
        </div>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
            {activeDeal.brandName} • {activeDeal.brandTier || 'Verified Brand'}
          </div>
          <h4 style={{ fontSize: '16px', textTransform: 'uppercase', margin: '3px 0 6px', color: 'var(--paper-soft)' }}>
            {activeDeal.campaignName}
          </h4>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            📍 {activeDeal.city || 'National Campaign'} • Deadline: {activeDeal.deadlineDate}
          </span>
        </div>
      </div>

      {/* Match Score & Shimmer Loading Bar */}
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--satin-border)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--paper-soft)' }}>
            ALGORITHM MATCH SCORE
          </span>
          <span className="match-score-badge">
            ⚡ {activeDeal.matchScore}% FIT
          </span>
        </div>
        <div className="shimmer-bar">
          <div
            style={{
              height: '100%',
              width: `${activeDeal.matchScore}%`,
              background: 'linear-gradient(90deg, #7025e1, #dfb640)',
              borderRadius: '99px'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '9px', color: 'var(--text-muted)' }} className="mono">
          <span>Affinity: {activeDeal.matchCriteria?.audienceAffinity || '96%'}</span>
          <span>Tone: {activeDeal.matchCriteria?.visualTone || 'High Quality'}</span>
        </div>
      </div>

      {/* Compensation & Deliverables Preview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PROJECTED COMPENSATION</span>
          <div className="font-display" style={{ fontSize: '18px', color: 'var(--accent-gold)' }}>
            {formatCurrency(activeDeal.compensationRange.min)} - {formatCurrency(activeDeal.compensationRange.max)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DELIVERABLES</span>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--paper-soft)' }}>
            {activeDeal.requiredDeliverables?.length || 3} Core Items
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => onAccept(activeDeal.dealId)}
          className="btn-magnetic"
          style={{ flex: 1, padding: '10px', fontSize: '11px', textAlign: 'center' }}
        >
          ACCEPT BRIEF (AUTO-ESCROW)
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--satin-border)',
            color: 'var(--text-muted)',
            borderRadius: '6px',
            padding: '10px 14px',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}
        >
          LATER
        </button>
      </div>
    </div>
  );
};

export default RealTimeDealDrawer;
