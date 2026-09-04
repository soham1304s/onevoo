import React, { useState } from 'react';
import { formatINR } from '../../utils/costingCalculator';

export const EscrowContentVault = () => {
  const [activeVersion, setActiveVersion] = useState('V2');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, timecode: '00:14', author: 'Aura Brand Manager', text: 'Boost the specular highlights on the dropper bottle glass.' },
    { id: 2, timecode: '00:28', author: 'Creative Director', text: 'Color grade looks incredible here. Pacing transition is tight.' }
  ]);

  const [milestones, setMilestones] = useState([
    {
      id: 'ms-01',
      title: 'Phase 1: Creative Brief & Moodboard Sign-off',
      amount: 25000,
      status: 'RELEASED',
      date: 'Oct 04, 2026',
      hashRef: 'sha256:8f4a1029c'
    },
    {
      id: 'ms-02',
      title: 'Phase 2: Rough Cut V1 & B-Roll Delivery',
      amount: 45000,
      status: 'ESCROWED', // Currently locked in digital escrow
      date: 'Oct 12, 2026',
      hashRef: 'sha256:3d7e8912b'
    },
    {
      id: 'ms-03',
      title: 'Phase 3: DaVinci Color Grade & 4K Final Master',
      amount: 55000,
      status: 'PENDING_ESCROW',
      date: 'Oct 18, 2026',
      hashRef: 'sha256:pending'
    }
  ]);

  const [approvalNotice, setApprovalNotice] = useState(false);

  // Handle milestone release
  const handleApproveAndRelease = (milestoneId) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, status: 'RELEASED', date: 'Just Now (Confirmed)' } : m
      )
    );
    setApprovalNotice(true);
    setTimeout(() => setApprovalNotice(false), 5000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        timecode: '00:22',
        author: 'Brand Reviewer (You)',
        text: commentText
      }
    ]);
    setCommentText('');
  };

  const totalEscrowed = milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedAmount = milestones
    .filter((m) => m.status === 'RELEASED')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="escrow-vault-container" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span className="tech-label-mono">DIGITAL LEDGER & SECURE CONTENT DROPZONE</span>
          <h2 className="disp-title-h2" style={{ margin: '8px 0 6px' }}>
            MILESTONE ESCROW & <em>CONTENT VAULT</em>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Cryptographically tracked reel iterations, frame-accurate brand reviews, and automated escrow payout releases.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(112, 37, 225, 0.12)',
            border: '1px solid rgba(112, 37, 225, 0.4)',
            padding: '10px 20px',
            borderRadius: '12px',
            textAlign: 'right'
          }}
        >
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>TOTAL CONTRACT ESCROW</span>
          <div className="font-display" style={{ fontSize: '22px', color: 'var(--paper-soft)' }}>
            {formatINR(totalEscrowed)}
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-green)' }}>
            {formatINR(releasedAmount)} Released to Creators
          </span>
        </div>
      </div>

      {/* Approval Success Notification */}
      {approvalNotice && (
        <div
          className="satin-card"
          style={{
            border: '1px solid var(--accent-green)',
            background: 'rgba(16, 185, 129, 0.15)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span className="mono" style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '12px' }}>
              ✓ ESCROW UNLOCKED & FUNDS DISPATCHED
            </span>
            <div style={{ fontSize: '13px', color: 'var(--paper-soft)', marginTop: '2px' }}>
              Milestone approved. Instant payout transferred to creator's linked UPI/Bank ledger account without manual delays.
            </div>
          </div>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>TX-HASH: #8849-OK</span>
        </div>
      )}

      {/* Main Grid: Content Vault Player / Reviews on Left, Milestone Ledger on Right */}
      <div className="escrow-vault-grid">
        
        {/* Left: Video Preview & Version Review Dropzone */}
        <div className="satin-card vault-stage-card">
          
          {/* Version Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['V1 (Assembly)', 'V2 (Color Grade)', 'V3 (Final 4K Master)'].map((ver) => {
                const tag = ver.split(' ')[0];
                const isActive = activeVersion === tag;
                return (
                  <button
                    key={ver}
                    type="button"
                    onClick={() => setActiveVersion(tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--satin-border)',
                      background: isActive ? 'rgba(112, 37, 225, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? 'var(--paper-soft)' : 'var(--text-muted)'
                    }}
                  >
                    {ver}
                  </button>
                );
              })}
            </div>

            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>
              HASH: 8f4a1e90...
            </span>
          </div>

          {/* Mock Video Preview Stage */}
          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#07070a',
              border: '1px solid var(--satin-border)',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(112, 37, 225, 0.15) 0%, transparent 80%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>
                4K UHD 60FPS • 9:16 REEL
              </span>
              <span className="match-score-badge" style={{ fontSize: '10px' }}>
                ● DRAFT {activeVersion} READY FOR REVIEW
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(112, 37, 225, 0.3)',
                  border: '1px solid var(--accent-purple)',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 12px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: '#fff',
                  boxShadow: '0 0 24px rgba(112, 37, 225, 0.4)'
                }}
              >
                ▶
              </div>
              <div className="font-display" style={{ fontSize: '18px', color: 'var(--paper-soft)' }}>
                AURA MONSOON LAUNCH — {activeVersion}
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Uploaded Oct 14, 2026 by @tanvi.creates
              </span>
            </div>

            {/* Scrubber Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>00:18</span>
              <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', position: 'relative' }}>
                <div style={{ width: '42%', height: '100%', background: 'var(--accent-purple)', borderRadius: '99px' }} />
              </div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>00:45</span>
            </div>
          </div>

          {/* Timecoded Comments Section */}
          <div style={{ marginTop: '20px' }}>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              TIMECODED CLIENT FEEDBACK & ANNOTATIONS ({comments.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--satin-border)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <span className="mono" style={{ background: 'rgba(223, 182, 64, 0.15)', color: 'var(--accent-gold)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                    {c.timecode}
                  </span>
                  <div>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{c.author}</div>
                    <div style={{ fontSize: '12px', color: 'var(--paper-soft)', marginTop: '2px' }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add timestamped note (e.g. adjust audio ducking at 00:22)..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--satin-border)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: 'var(--paper-soft)',
                  fontSize: '12px'
                }}
              />
              <button
                type="submit"
                className="btn-magnetic"
                style={{ padding: '8px 18px', fontSize: '11px' }}
              >
                POST NOTE
              </button>
            </form>
          </div>
        </div>

        {/* Right: Milestone Payment Stepper & Release Controls */}
        <div className="satin-card vault-ledger-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span className="tech-label-mono">ESCROW PAYMENT PIPELINE</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>
              3 MILESTONES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {milestones.map((ms, idx) => {
              const isLocked = ms.status === 'ESCROWED';
              const isReleased = ms.status === 'RELEASED';
              return (
                <div
                  key={ms.id}
                  style={{
                    background: isLocked ? 'rgba(112, 37, 225, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: isLocked ? '1px solid var(--accent-purple)' : '1px solid var(--satin-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>STEP 0{idx + 1}</span>
                      <h4 style={{ fontSize: '13px', color: 'var(--paper-soft)', margin: '2px 0 4px' }}>
                        {ms.title}
                      </h4>
                      <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Target: {ms.date} • {ms.hashRef}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="font-display" style={{ fontSize: '16px', color: 'var(--paper-soft)' }}>
                        {formatINR(ms.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="milestone-action-row">
                    <span
                      className="mono"
                      style={{
                        fontSize: '9px',
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontWeight: 700,
                        background: isReleased ? 'rgba(16,185,129,0.15)' : isLocked ? 'rgba(223,182,64,0.15)' : 'rgba(255,255,255,0.06)',
                        color: isReleased ? 'var(--accent-green)' : isLocked ? 'var(--accent-gold)' : 'var(--text-muted)'
                      }}
                    >
                      {isReleased ? '✓ RELEASED TO CREATOR' : isLocked ? '🔒 ESCROWED (LOCKED)' : 'PENDING ESCROW'}
                    </span>

                    {isLocked && (
                      <button
                        type="button"
                        onClick={() => handleApproveAndRelease(ms.id)}
                        className="btn-magnetic"
                        style={{ padding: '6px 14px', fontSize: '10px' }}
                      >
                        APPROVE & RELEASE ({formatINR(ms.amount)}) →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security Guarantee Note */}
          <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--satin-border)' }}>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-cyan)', display: 'block', marginBottom: '4px' }}>
              🛡️ ONEVOO ESCROW GUARANTEE
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Funds are held securely in RBI-compliant escrow. Payouts are guaranteed to creators once deliverables pass client sign-off, eliminating non-payment disputes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EscrowContentVault;
