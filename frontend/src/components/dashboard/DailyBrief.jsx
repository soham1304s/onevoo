import React, { useState, useEffect } from 'react';
import useRealTimeDeals from '../../hooks/useRealTimeDeals';

export const DailyBrief = ({ creatorId, onOpenDeal }) => {
  const { deals, activeNotification, clearNotification } = useRealTimeDeals(creatorId);
  const [loading, setLoading] = useState(true);
  const [rescheduled, setRescheduled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleReschedule = () => {
    setRescheduled(true);
    setTimeout(() => {
      alert("⚡ AI Copilot: Mumbai shoot editor timeline locked! 14 hours buffer secured for Samsung campaign review.");
    }, 200);
  };

  return (
    <div
      className="satin-card daily-brief-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '36px',
        backdropFilter: 'blur(30px)',
      }}
    >
      {/* Background Engineering Line Grid */}
      <div className="ambient-engineering-grid" style={{ opacity: 0.7 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header Row */}
        <div
          className="daily-brief-header"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid var(--satin-border)',
            paddingBottom: '16px',
            marginBottom: '20px',
          }}
        >
          <div>
            <span className="mono" style={{ fontSize: '10.5px', letterSpacing: '0.12em', color: 'var(--accent-gold)', fontWeight: 600, display: 'block' }}>
              LIVE OPERATING BRIEFING • NEON POSTGRESQL SYNC
            </span>
            <h2 className="disp-title-h2 daily-brief-title" style={{ textTransform: 'uppercase', color: 'var(--paper-soft)', marginTop: '4px', marginBottom: 0 }}>
              CREATIVE <em>COMMAND</em> CENTER
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', padding: '5px 12px', borderRadius: '99px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <span className="pulse-emerald-ring" style={{ width: '7px', height: '7px' }} />
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700 }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '48px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }} className="animate-pulse" />
            <div style={{ height: '48px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', width: '75%' }} className="animate-pulse" />
          </div>
        ) : (
          <div>
            {/* Active AI Recommendation Prompt Box */}
            <div
              className="ai-copilot-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                borderRadius: '12px',
                background: 'rgba(112, 37, 225, 0.12)',
                border: '1px solid rgba(112, 37, 225, 0.3)',
                padding: '16px',
                marginBottom: '20px',
                boxShadow: '0 0 30px rgba(112, 37, 225, 0.15)',
              }}
            >
              <div
                className="ai-copilot-icon"
                style={{
                  display: 'flex',
                  height: '36px',
                  width: '36px',
                  minWidth: '36px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  background: 'rgba(112, 37, 225, 0.25)',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                💡
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, wordBreak: 'break-word' }}>
                    AI OPERATIONS COPILOT (LOGISTICS & SCHEDULE OPTIMIZER)
                  </span>
                </div>
                <p style={{ color: 'var(--paper-soft)', fontSize: '13px', lineHeight: 1.5, margin: '6px 0 12px', wordBreak: 'break-word' }}>
                  Your Mumbai shoot editor Rahul is available tonight. Moving the raw footage edit forward keeps you <strong>14 hours ahead</strong> of the Samsung Galaxy campaign delivery window.
                </p>

                <button
                  type="button"
                  onClick={handleReschedule}
                  className="btn-magnetic ai-copilot-btn"
                  style={{
                    fontSize: '11px',
                    padding: '9px 16px',
                    background: rescheduled ? 'var(--accent-green)' : 'var(--accent-purple)',
                    borderColor: rescheduled ? 'var(--accent-green)' : 'var(--accent-purple)',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    maxWidth: '100%',
                  }}
                >
                  {rescheduled ? '✓ PIPELINE RESCHEDULED & NOTIFIED' : '⚡ RESCHEDULE EDIT PIPELINE NOW'}
                </button>
              </div>
            </div>

            {/* Daily Operational Timeline Cards */}
            <div
              className="daily-brief-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
              }}
            >
              {/* Card 1: Live Call Time */}
              <div
                style={{
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--satin-border)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>11:00 AM CALL TIME</span>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>BANDRA WEST</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--paper-soft)' }}>Nykaa Monsoon Shoot</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Studio XYZ • Arri Alexa + Lighting crew locked in call sheet.</p>
              </div>

              {/* Card 2: Escrow Payment Settled */}
              <div
                style={{
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--satin-border)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-green)' }}>PAYMENT SETTLED</span>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-green)' }}>STRIPE CONNECT</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--paper-soft)' }}>₹85,000 Milestone 2 Unlocked</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Net payout released to creator wallet (10% TDS withheld at source).</p>
              </div>

              {/* Card 3: Real-Time Matching Queue */}
              <div
                style={{
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--satin-border)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-purple)' }}>OPPORTUNITY RADAR</span>
                  <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--paper-soft)' }}>8 Active Creator Gigs</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>₹11,65,000 total escrow pipeline available for immediate booking.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyBrief;
