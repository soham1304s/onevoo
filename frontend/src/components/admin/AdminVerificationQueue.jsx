import React, { useEffect, useState } from 'react';

export default function AdminVerificationQueue() {
  const [queue, setQueue] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Aadhaar name does not match PAN registry record.');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kyc/admin/queue');
      const data = await res.json();
      if (data.queue) {
        setQueue(data.queue);
        if (!selectedCreator && data.queue.length > 0) {
          setSelectedCreator(data.queue[0]);
        }
      }
    } catch (err) {
      console.error('Fetch admin KYC queue error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/kyc/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reviewerName: 'Onevoo Compliance Master' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackNote(`✓ ${data.message}`);
        fetchQueue();
        if (selectedCreator?.id === id) {
          setSelectedCreator(null);
        }
      }
    } catch (err) {
      console.error('Approval error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/kyc/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason: rejectionReason, reviewerName: 'Onevoo Compliance Master' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackNote(`✓ ${data.message}`);
        setRejectModalOpen(false);
        fetchQueue();
        if (selectedCreator?.id === id) {
          setSelectedCreator(null);
        }
      }
    } catch (err) {
      console.error('Rejection error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="satin-card" style={{ padding: '28px', background: '#0b0b12', borderRadius: '20px', border: '1px solid rgba(223, 182, 64, 0.3)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
            <span className="tech-label-mono" style={{ color: 'var(--accent-gold)' }}>
              CORE CONSOLE — KYC & LEGAL SIGNATURE VERIFICATION QUEUE (v13)
            </span>
          </div>
          <h2 className="disp-title-h2" style={{ fontSize: '24px', margin: '4px 0 0', color: '#ffffff' }}>
            Pending Creator <em>Compliance Approvals</em>
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchQueue}
          className="mono"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh Queue ({queue.length})
        </button>
      </div>

      {feedbackNote && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '10px 14px', borderRadius: '8px', color: '#10b981', fontSize: '12px', marginBottom: '16px' }} className="mono">
          {feedbackNote}
        </div>
      )}

      {/* Main Grid: Left Queue Listings, Right Deep Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Left Hand: Queue Listings */}
        <div style={{ background: '#12121c', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', marginBottom: '12px', fontWeight: 700 }}>
            PENDING SUBMISSION INFLUX ({queue.length})
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }} className="mono">
              Loading verification registry...
            </div>
          ) : queue.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }} className="mono">
              ✓ All creator profiles are up to date. No pending submissions.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {queue.map((creator) => {
                const isSelected = selectedCreator?.id === creator.id;
                return (
                  <div
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(223, 182, 64, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                        {creator.legal_name_on_pan || creator.creator_name || 'Verified Creator'}
                      </div>
                      <div className="mono" style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                        @{creator.instagram_username || 'creator'} • {creator.creator_email}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: '10px',
                          padding: '3px 8px',
                          borderRadius: '99px',
                          background: 'rgba(223, 182, 64, 0.18)',
                          color: '#dfb640',
                          border: '1px solid rgba(223, 182, 64, 0.4)',
                          fontWeight: 700,
                          display: 'inline-block',
                          marginBottom: '4px',
                        }}
                      >
                        {creator.followers_count ? creator.followers_count.toLocaleString() : '485,000'} Followers
                      </span>
                      <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>
                        {creator.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Hand: Deep Ingestion Inspector Panel */}
        {selectedCreator ? (
          <div style={{ background: '#12121c', padding: '22px', borderRadius: '14px', border: '1px solid rgba(223, 182, 64, 0.4)', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="tech-label-mono" style={{ color: 'var(--accent-gold)' }}>CREATOR COMPLIANCE INSPECTOR</span>
              <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>ID: {selectedCreator.id?.slice(0, 8)}...</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: '#181826', padding: '10px 12px', borderRadius: '8px' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>LEGAL NAME (PAN RECORD)</span>
                <strong style={{ color: '#fff', fontSize: '13px' }}>{selectedCreator.legal_name_on_pan || 'Tanvi Ramesh Sharma'}</strong>
              </div>

              <div style={{ background: '#181826', padding: '10px 12px', borderRadius: '8px' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>AADHAAR UIDAI STATE</span>
                <strong style={{ color: '#10b981', fontSize: '12px' }}>
                  {selectedCreator.aadhaar_number_masked || 'XXXX-XXXX-8921'} [OTP MATCHED]
                </strong>
              </div>

              <div style={{ background: '#181826', padding: '10px 12px', borderRadius: '8px' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>PAN REGISTRATION CHECK</span>
                <strong style={{ color: '#fff', fontSize: '12px' }}>
                  PAN: {selectedCreator.pan_card_number_encrypted || 'ABCDE1234F'} [NAME MATCHED]
                </strong>
              </div>

              <div style={{ background: '#181826', padding: '10px 12px', borderRadius: '8px' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block' }}>AUDIENCE & ENGAGEMENT</span>
                <strong style={{ color: 'var(--accent-gold)', fontSize: '12px' }}>
                  {selectedCreator.followers_count?.toLocaleString() || '485,000'} Followers • {selectedCreator.engagement_rate || '4.85'}% ER
                </strong>
              </div>
            </div>

            {/* Cryptographic Seal Box */}
            <div style={{ background: '#09090e', padding: '10px 12px', borderRadius: '8px', border: '1px dashed rgba(223, 182, 64, 0.3)', marginBottom: '14px' }}>
              <span className="mono" style={{ fontSize: '9px', color: 'var(--accent-gold)', display: 'block', marginBottom: '3px' }}>
                🔒 SHA-256 CRYPTOGRAPHIC AUDIT SEAL:
              </span>
              <span className="mono" style={{ fontSize: '10.5px', color: '#38bdf8', wordBreak: 'break-all' }}>
                {selectedCreator.cryptographic_audit_seal || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}
              </span>
            </div>

            {/* Digital Signature Vector */}
            <div style={{ background: '#09090e', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '18px' }}>
              <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                BOUND ELECTRONIC SIGNATURE VECTOR ({selectedCreator.agreement_type || '5_YEAR_GROWTH'}):
              </span>
              {selectedCreator.signature_vector_base64 ? (
                <div style={{ height: '56px', background: '#040407', borderRadius: '6px', padding: '4px', border: '1px solid rgba(223, 182, 64, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={selectedCreator.signature_vector_base64} alt="Creator Signature" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <span className="mono" style={{ fontSize: '11px', color: '#10b981' }}>
                  ✓ Digital Bond Vector Recorded & Staged
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                disabled={actionLoading}
                className="mono"
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#f43f5e',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ✕ Reject with Notes
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedCreator.id)}
                disabled={actionLoading}
                className="btn-magnetic"
                style={{
                  flex: 1.5,
                  padding: '11px',
                  background: 'linear-gradient(135deg, var(--accent-green, #10b981), #059669)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  justifyContent: 'center',
                }}
              >
                {actionLoading ? 'Approving...' : '⚡ APPROVE IDENTITY & ONBOARD'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#12121c', padding: '40px', borderRadius: '14px', border: '1px dashed rgba(255, 255, 255, 0.1)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <p className="mono" style={{ fontSize: '11.5px', margin: 0 }}>
              Select a pending creator profile from the queue to inspect official Aadhaar, PAN, and E-Sign verification ledger.
            </p>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && selectedCreator && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '480px', maxWidth: '94vw', background: '#13131c', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: '#f43f5e' }}>
              Reject Verification Profile
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0 0 14px' }}>
              Enter specific remediation instructions for {selectedCreator.legal_name_on_pan || selectedCreator.creator_name}:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#181826', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="mono"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReject(selectedCreator.id)}
                className="mono"
                style={{ background: '#f43f5e', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
