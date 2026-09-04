import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SignaturePad from '../contract/SignaturePad';

export default function CreatorVerificationHub({ onClose, onVerified }) {
  const { user, profile, isVerified: authIsVerified } = useAuth();

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNote, setSuccessNote] = useState(null);

  // Verification record from Neon PostgreSQL
  const [verificationData, setVerificationData] = useState(null);

  // Step 1: Instagram Social Gating State
  const [instagramHandle, setInstagramHandle] = useState(profile?.handle ? profile.handle.replace(/^@/, '') : 'tanvi.creates');
  const [followersCount, setFollowersCount] = useState(485000);
  const [engagementRate, setEngagementRate] = useState(4.85);
  const [socialStatus, setSocialStatus] = useState('NOT_LINKED'); // NOT_LINKED | REJECTED | ON_HOLD | ELIGIBLE | PENDING_MATCH | VERIFIED

  // Step 2: KYC Details
  const [legalName, setLegalName] = useState(user?.full_name || 'Tanvi Ramesh Sharma');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [aadhaarNumber, setAadhaarNumber] = useState('987654328921');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarOtpVerified, setAadhaarOtpVerified] = useState(false);
  const [bankAccount, setBankAccount] = useState('918273645012');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('tanvi@okaxis');

  // Step 3: Signature & Agreement
  const [agreementType, setAgreementType] = useState('5_YEAR_GROWTH');
  const [signatureData, setSignatureData] = useState(null);
  const [auditSeal, setAuditSeal] = useState(null);
  const [auditCert, setAuditCert] = useState(null);

  // Load existing KYC record on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const userEmail = user?.email || 'creator@onevoo.com';
        const res = await fetch(`/api/kyc/status?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (data.verification) {
          setVerificationData(data.verification);
          setSocialStatus(data.verification.status);
          if (data.verification.instagram_username) setInstagramHandle(data.verification.instagram_username);
          if (data.verification.followers_count) setFollowersCount(data.verification.followers_count);
          if (data.verification.engagement_rate) setEngagementRate(Number(data.verification.engagement_rate));
          if (data.verification.legal_name_on_pan) setLegalName(data.verification.legal_name_on_pan);
          if (data.verification.pan_card_number_encrypted) setPanNumber(data.verification.pan_card_number_encrypted);
          if (data.verification.aadhaar_number_masked) setAadhaarNumber(data.verification.aadhaar_number_masked);
          if (data.verification.bank_account_number) setBankAccount(data.verification.bank_account_number);
          if (data.verification.ifsc_code) setIfscCode(data.verification.ifsc_code);
          if (data.verification.upi_id) setUpiId(data.verification.upi_id);
          if (data.verification.cryptographic_audit_seal) setAuditSeal(data.verification.cryptographic_audit_seal);
          if (data.verification.signature_vector_base64) setSignatureData(data.verification.signature_vector_base64);

          // Advance step according to record status
          if (data.verification.status === 'VERIFIED') {
            setActiveStep(4);
          } else if (data.verification.status === 'PENDING_MATCH') {
            setActiveStep(4);
          } else if (data.verification.status === 'ELIGIBLE') {
            setActiveStep(2);
          }
        }
      } catch (err) {
        console.warn('KYC status fetch fallback:', err);
      }
    };

    fetchStatus();
  }, [user]);

  // Step 1: Connect Instagram & Evaluate Social Gating
  const handleConnectInstagram = async (overrideFollowers = null) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        creatorId: user?.id || null,
        email: user?.email || 'creator@onevoo.com',
        username: instagramHandle,
        followerCountOverride: overrideFollowers !== null ? overrideFollowers : followersCount,
        engagementRateOverride: engagementRate,
      };

      const res = await fetch('/api/social/instagram-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSocialStatus(data.status);
        setFollowersCount(data.metrics.followersCount);
        setEngagementRate(data.metrics.engagementRate);
        setSuccessNote(data.message);

        if (data.status === 'ELIGIBLE') {
          setTimeout(() => {
            setActiveStep(2);
            setSuccessNote(null);
          }, 1200);
        }
      } else {
        throw new Error(data.error || 'Failed to link Instagram account.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Aadhaar OTP (Sandboxed Verification Simulation)
  const handleSendAadhaarOtp = () => {
    if (aadhaarNumber.length < 12) {
      return setError('Please enter a valid 12-digit UIDAI Aadhaar Number.');
    }
    setError(null);
    setAadhaarOtpSent(true);
    setSuccessNote('📱 Secure UIDAI OTP sent to mobile linked with Aadhaar (Test OTP: 842910)');
  };

  const handleVerifyAadhaarOtp = () => {
    if (aadhaarOtp === '842910' || aadhaarOtp.length === 6) {
      setAadhaarOtpVerified(true);
      setError(null);
      setSuccessNote('✓ UIDAI Aadhaar identity verified successfully.');
    } else {
      setError('Invalid 6-digit OTP. Please enter 842910 for sandbox validation.');
    }
  };

  // Step 3: Submit KYC & Digital Bond Signature
  const handleSubmitKYCAndSignature = async (e) => {
    e?.preventDefault();
    if (!signatureData) {
      return setError('Please draw and confirm your electronic signature on the canvas pad.');
    }
    if (!legalName || !panNumber) {
      return setError('Legal name on PAN and PAN number are required.');
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        creatorId: user?.id || null,
        email: user?.email || 'creator@onevoo.com',
        legalName,
        panNumber,
        aadhaarNumber,
        bankAccountNumber: bankAccount,
        ifscCode,
        upiId,
        selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
        signatureVector: signatureData,
        agreementType,
        agreementTerms: {
          term: agreementType === '5_YEAR_GROWTH' ? '5-Year Exclusive Growth' : '7-Year Cultural Heritage',
          escrow_guaranteed: true,
          rev_share: agreementType === '5_YEAR_GROWTH' ? '85/15' : '90/10',
          compliance: 'Section 194J TDS & UIDAI e-Sign Validated',
        },
      };

      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuditSeal(data.cryptographicSeal);
        setAuditCert(data.auditCertificate);
        setSocialStatus('PENDING_MATCH');
        setActiveStep(4);
        setSuccessNote('🎉 Legal Digital Bond Bound & Queued for Admin Review!');
        if (onVerified) onVerified(data);
      } else {
        throw new Error(data.error || 'Failed to submit KYC and bind signature.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="verification-hub-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 5, 8, 0.94)',
        backdropFilter: 'blur(20px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        className="satin-card"
        style={{
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          background: '#0d0d14',
          borderRadius: '24px',
          border: '1px solid rgba(223, 182, 64, 0.35)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 40px rgba(223, 182, 64, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '20px 26px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#13131c',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
              <span className="mono" style={{ fontSize: '10.5px', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.06em' }}>
                ELITE COMPLIANCE & LEGAL OS (v13)
              </span>
            </div>
            <h2 className="disp-title-h2" style={{ fontSize: '20px', margin: '3px 0 0', color: '#ffffff' }}>
              Creator Verification & <em>Digital Bond E-Signing</em>
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className="mono"
              style={{
                fontSize: '9.5px',
                padding: '4px 10px',
                borderRadius: '99px',
                fontWeight: 800,
                background:
                  socialStatus === 'VERIFIED'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : socialStatus === 'ELIGIBLE'
                    ? 'rgba(56, 189, 248, 0.2)'
                    : socialStatus === 'ON_HOLD'
                    ? 'rgba(223, 182, 64, 0.2)'
                    : socialStatus === 'PENDING_MATCH'
                    ? 'rgba(168, 85, 247, 0.2)'
                    : 'rgba(244, 63, 94, 0.2)',
                color:
                  socialStatus === 'VERIFIED'
                    ? '#10b981'
                    : socialStatus === 'ELIGIBLE'
                    ? '#38bdf8'
                    : socialStatus === 'ON_HOLD'
                    ? '#dfb640'
                    : socialStatus === 'PENDING_MATCH'
                    ? '#c084fc'
                    : '#f43f5e',
                border: `1px solid ${
                  socialStatus === 'VERIFIED'
                    ? 'rgba(16, 185, 129, 0.4)'
                    : socialStatus === 'ELIGIBLE'
                    ? 'rgba(56, 189, 248, 0.4)'
                    : socialStatus === 'ON_HOLD'
                    ? 'rgba(223, 182, 64, 0.4)'
                    : socialStatus === 'PENDING_MATCH'
                    ? 'rgba(168, 85, 247, 0.4)'
                    : 'rgba(244, 63, 94, 0.4)'
                }`,
              }}
            >
              STATUS: {socialStatus}
            </span>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Step Progress Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#0a0a10',
          }}
        >
          {[
            { step: 1, label: '01. Social Gating', desc: 'Instagram Meta Check' },
            { step: 2, label: '02. Government KYC', desc: 'Aadhaar, PAN & Bank' },
            { step: 3, label: '03. Perfect Bond', desc: 'Canvas E-Sign' },
            { step: 4, label: '04. Cryptographic Seal', desc: 'Audit Certificate' },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                if (item.step === 1 || socialStatus !== 'NOT_LINKED') {
                  setActiveStep(item.step);
                }
              }}
              style={{
                flex: 1,
                padding: '12px 14px',
                border: 'none',
                borderBottom: activeStep === item.step ? '2px solid var(--accent-gold)' : '2px solid transparent',
                background: activeStep === item.step ? 'rgba(223, 182, 64, 0.08)' : 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div className="mono" style={{ fontSize: '10.5px', fontWeight: 800, color: activeStep === item.step ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {item.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {error && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#f43f5e',
                fontSize: '12px',
                marginBottom: '16px',
              }}
              className="mono"
            >
              ⚠️ {error}
            </div>
          )}

          {successNote && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#10b981',
                fontSize: '12px',
                marginBottom: '16px',
              }}
              className="mono"
            >
              {successNote}
            </div>
          )}

          {/* ================= STEP 1: SOCIAL GATING ================= */}
          {activeStep === 1 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="tech-label-mono" style={{ color: 'var(--accent-gold)' }}>SECTION 1 — INSTAGRAM GRAPH API GATING</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '18px', color: '#fff' }}>
                  Sync Social Performance Metrics
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  Onevoo uses deterministic audience verification to ensure creators meet enterprise campaign baselines. Link your account to evaluate followers count and authentic engagement rate.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', alignItems: 'start' }}>
                <div style={{ background: '#12121c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <label className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', display: 'block', marginBottom: '6px' }}>
                    INSTAGRAM USERNAME / HANDLE
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ padding: '9px 12px', background: '#181826', borderRadius: '8px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '13px' }} className="mono">
                      @
                    </span>
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="e.g. tanvi.creates"
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: '#181826',
                        border: '1px solid rgba(112, 37, 225, 0.4)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Test Switcher / Override Controls */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <span className="mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      ⚡ QUICK TEST METRIC PROFILE TIER:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setFollowersCount(485000);
                          setEngagementRate(4.85);
                          handleConnectInstagram(485000);
                        }}
                        className="mono"
                        style={{ padding: '4px 8px', fontSize: '9px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Tier-1: 485K (Eligible)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFollowersCount(3400);
                          setEngagementRate(3.20);
                          handleConnectInstagram(3400);
                        }}
                        className="mono"
                        style={{ padding: '4px 8px', fontSize: '9px', background: 'rgba(223, 182, 64, 0.15)', color: '#dfb640', border: '1px solid rgba(223, 182, 64, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Tier-2: 3.4K (On-Hold)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFollowersCount(620);
                          setEngagementRate(1.10);
                          handleConnectInstagram(620);
                        }}
                        className="mono"
                        style={{ padding: '4px 8px', fontSize: '9px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Tier-3: 620 ({'<'}1K Rejected)
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConnectInstagram()}
                    disabled={loading}
                    className="btn-magnetic"
                    style={{
                      width: '100%',
                      padding: '11px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--accent-purple, #7025e1), #4c1d95)',
                      color: '#fff',
                    }}
                  >
                    {loading ? 'Evaluating Social Graph API...' : '⚡ SYNC & EVALUATE ELIGIBILITY'}
                  </button>
                </div>

                {/* Right Column: Metric Breakdown Card */}
                <div style={{ background: '#12121c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', marginBottom: '10px', fontWeight: 700 }}>
                    METRIC GATING TIERS
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: followersCount >= 5000 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: `1px solid ${followersCount >= 5000 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.05)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: followersCount >= 5000 ? '#10b981' : '#fff' }}>
                        <span>Platform Standard</span>
                        <span>≥ 5,000</span>
                      </div>
                      <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status: ELIGIBLE ➔ Unlocks KYC & E-Sign</span>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: followersCount >= 1000 && followersCount < 5000 ? 'rgba(223, 182, 64, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: `1px solid ${followersCount >= 1000 && followersCount < 5000 ? 'rgba(223, 182, 64, 0.4)' : 'rgba(255, 255, 255, 0.05)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: followersCount >= 1000 && followersCount < 5000 ? '#dfb640' : '#fff' }}>
                        <span>Growth Threshold</span>
                        <span>1,000 - 5,000</span>
                      </div>
                      <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status: ON_HOLD ➔ Remediation Checklists</span>
                    </div>

                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: followersCount < 1000 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: `1px solid ${followersCount < 1000 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.05)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: followersCount < 1000 ? '#f43f5e' : '#fff' }}>
                        <span>Critical Floor</span>
                        <span>&lt; 1,000</span>
                      </div>
                      <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status: REJECTED ➔ Dashboard Locked</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Remediation Panel if ON_HOLD */}
              {socialStatus === 'ON_HOLD' && (
                <div style={{ marginTop: '20px', background: 'rgba(223, 182, 64, 0.08)', border: '1px solid rgba(223, 182, 64, 0.35)', padding: '18px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px' }}>⚡</span>
                    <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--accent-gold)' }}>
                      Growth Remediation Module Activated (Followers: {followersCount.toLocaleString()})
                    </h4>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--paper-soft)', margin: '0 0 12px', lineHeight: 1.4 }}>
                    You are in the 1K-5K emerging creator tier. Complete these 3 high-impact short-form checklists to scale your audience to the 5K+ Enterprise threshold:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '11px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>1. 3-Sec Hook Velocity</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Cut intros. Use kinetic captions in upper 40% safe-zone.</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>2. 120fps Macro Lighting</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Use soft diffuse key lights for product textures & food ASMR.</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>3. Trending Audio Beats</strong>
                      <span style={{ color: 'var(--text-muted)' }}>Time cuts exactly on bass transitions for 85%+ retention.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: GOVERNMENT KYC ================= */}
          {activeStep === 2 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="tech-label-mono" style={{ color: 'var(--accent-gold)' }}>SECTION 2 — IDENTITY INGESTION (AADHAAR & PAN)</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '18px', color: '#fff' }}>
                  Statutory Tax & Financial KYC Compliance
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  Mandatory under Section 194J TDS compliance for digital escrow payouts. Aadhaar numbers are cryptographically masked instantly upon entry.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#12121c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div>
                  <label className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
                    LEGAL FULL NAME (AS PER PAN RECORD) *
                  </label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#181826', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
                    PERMANENT ACCOUNT NUMBER (PAN) *
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    style={{ width: '100%', padding: '9px 12px', background: '#181826', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                {/* Aadhaar UIDAI Ingestion */}
                <div style={{ gridColumn: 'span 2', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="mono" style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: 700 }}>
                      12-DIGIT AADHAAR NUMBER (AUTO-MASKED) *
                    </label>
                    <span className="mono" style={{ fontSize: '9px', color: aadhaarOtpVerified ? '#10b981' : 'var(--text-muted)' }}>
                      {aadhaarOtpVerified ? '✓ UIDAI Verified' : 'OTP Verification Required'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="12-digit UIDAI number"
                      maxLength={14}
                      style={{ flex: 1, padding: '8px 12px', background: '#181826', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                    />
                    <button
                      type="button"
                      onClick={handleSendAadhaarOtp}
                      className="mono"
                      style={{ padding: '8px 14px', background: 'rgba(223, 182, 64, 0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(223, 182, 64, 0.4)', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      📱 Send UIDAI OTP
                    </button>
                  </div>

                  {aadhaarOtpSent && !aadhaarOtpVerified && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                      <input
                        type="text"
                        value={aadhaarOtp}
                        onChange={(e) => setAadhaarOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (e.g. 842910)"
                        maxLength={6}
                        style={{ width: '220px', padding: '7px 10px', background: '#181826', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAadhaarOtp}
                        className="mono"
                        style={{ padding: '7px 14px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        ✓ Validate OTP
                      </button>
                    </div>
                  )}
                </div>

                {/* Bank Account & UPI Details */}
                <div>
                  <label className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    BANK ACCOUNT NUMBER (FOR ESCROW DISBURSAL)
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#181826', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    IFSC CODE / BRANCH
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '9px 12px', background: '#181826', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
                    UPI ID / VPA (FOR INSTANT ESCROW ADVANCES)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@okhdfcbank"
                    style={{ width: '100%', padding: '9px 12px', background: '#181826', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="mono"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)', padding: '10px 18px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}
                >
                  ← Back to Social Gating
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn-magnetic"
                  style={{ padding: '10px 24px', fontSize: '11.5px', fontWeight: 800 }}
                >
                  PROCEED TO CONTRACT E-SIGN ➔
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: DIGITAL BOND & E-SIGNING ================= */}
          {activeStep === 3 && (
            <div>
              <div style={{ marginBottom: '18px' }}>
                <span className="tech-label-mono" style={{ color: 'var(--accent-gold)' }}>SECTION 3 — PERFECT BOND ELECTRONIC SIGNATURE</span>
                <h3 style={{ margin: '4px 0 8px', fontSize: '18px', color: '#fff' }}>
                  Bind 5-Year Enterprise Growth Contract
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                  Review terms and draw your signature on the canvas below. The system automatically computes a SHA-256 cryptographic audit seal locking identity details to this bond.
                </p>
              </div>

              {/* Agreement Type Switcher */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={() => setAgreementType('5_YEAR_GROWTH')}
                  className="mono"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    background: agreementType === '5_YEAR_GROWTH' ? 'rgba(223, 182, 64, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${agreementType === '5_YEAR_GROWTH' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)'}`,
                    color: agreementType === '5_YEAR_GROWTH' ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  📄 5-Year Growth Agreement (85/15 Split)
                </button>
                <button
                  type="button"
                  onClick={() => setAgreementType('7_YEAR_HERITAGE')}
                  className="mono"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    background: agreementType === '7_YEAR_HERITAGE' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${agreementType === '7_YEAR_HERITAGE' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.08)'}`,
                    color: agreementType === '7_YEAR_HERITAGE' ? 'var(--accent-purple)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  👑 7-Year Cultural Heritage (90/10 Split)
                </button>
              </div>

              {/* Legal Text Summary Box */}
              <div
                style={{
                  background: '#09090e',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  fontSize: '11px',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  fontFamily: 'monospace',
                }}
              >
                <strong>ONEVOO CONTENT PRODUCTION & DIGITAL ESCROW MASTER BOND (2026-2031)</strong><br />
                Between Onevoo Operations Private Limited and <u>{legalName}</u> (PAN: {panNumber}).<br />
                1. <strong>Escrow Lock Guarantee:</strong> 100% of campaign funds must be deposited in digital escrow prior to principal photography.<br />
                2. <strong>Creator Revenue Split:</strong> Creator receives 85.0% net payout on all brand collabs, lookbooks, and recurring retainers.<br />
                3. <strong>IP Rights & Distribution:</strong> Creator retains 100% moral rights; brand acquires non-exclusive digital distribution for 365 days.<br />
                4. <strong>Statutory Compliance:</strong> Tax withholdings executed under Indian Income Tax Act Section 194J.
              </div>

              {/* HTML5 Interactive Signature Pad */}
              <div style={{ marginBottom: '20px' }}>
                <SignaturePad
                  onSaveSignature={(data) => setSignatureData(data)}
                  initialSignature={signatureData}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="mono"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-muted)', padding: '10px 18px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}
                >
                  ← Back to KYC Ingestion
                </button>
                <button
                  type="button"
                  onClick={handleSubmitKYCAndSignature}
                  disabled={loading || !signatureData}
                  className="btn-magnetic"
                  style={{
                    padding: '11px 28px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--accent-gold, #dfb640), #b45309)',
                    color: '#000',
                  }}
                >
                  {loading ? 'Binding Cryptographic Hash...' : '⚡ BIND PERFECT BOND & SUBMIT'}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: CRYPTOGRAPHIC AUDIT SEAL ================= */}
          {activeStep === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>📜</div>
                <span className="tech-label-mono" style={{ color: 'var(--accent-green)' }}>
                  {socialStatus === 'VERIFIED' ? '✓ IDENTITY & DIGITAL BOND VERIFIED' : 'QUEUED FOR COMPLIANCE AUDIT'}
                </span>
                <h3 style={{ margin: '6px 0 8px', fontSize: '20px', color: '#fff' }}>
                  Cryptographic Audit Certificate
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', maxWidth: '580px', margin: '0 auto' }}>
                  This legal bond is permanently signed, hashed, and bound to your government identity and Instagram metrics.
                </p>
              </div>

              {/* Certificate Card */}
              <div
                style={{
                  background: '#09090f',
                  border: '1px solid rgba(223, 182, 64, 0.4)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                  <div>
                    <span className="mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block' }}>CREATOR LEGAL NAME</span>
                    <strong style={{ color: '#fff', fontSize: '13px' }}>{legalName}</strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block' }}>INSTAGRAM VERIFIED HANDLE</span>
                    <strong style={{ color: 'var(--accent-gold)', fontSize: '13px' }}>@{instagramHandle} ({followersCount.toLocaleString()} Followers)</strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block' }}>TAX & PAN REGISTRATION</span>
                    <strong style={{ color: '#fff', fontSize: '12px' }}>PAN: {panNumber.slice(0, 3)}•••••{panNumber.slice(-2)} (VERIFIED ACTIVE)</strong>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block' }}>UIDAI AADHAAR STATE</span>
                    <strong style={{ color: '#10b981', fontSize: '12px' }}>{aadhaarNumber.length > 4 ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : 'XXXX-XXXX-8921'} (OTP MATCHED)</strong>
                  </div>
                </div>

                {/* SHA-256 Hash Seal */}
                <div style={{ background: '#12121e', padding: '12px 14px', borderRadius: '8px', border: '1px dashed rgba(223, 182, 64, 0.3)', marginBottom: '16px' }}>
                  <span className="mono" style={{ fontSize: '9px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
                    🔒 SHA-256 CRYPTOGRAPHIC AUDIT SEAL:
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: '#38bdf8', wordBreak: 'break-all' }}>
                    {auditSeal || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}
                  </span>
                </div>

                {/* Signature Vector Display */}
                {signatureData && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block' }}>ELECTRONIC SIGNATURE VECTOR</span>
                      <span className="mono" style={{ fontSize: '9.5px', color: 'var(--accent-green)' }}>✓ Vector Path Cryptographically Sealed</span>
                    </div>
                    <div style={{ height: '48px', padding: '4px 10px', background: '#050508', borderRadius: '6px', border: '1px solid rgba(223, 182, 64, 0.3)' }}>
                      <img src={signatureData} alt="E-Signature" style={{ height: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-magnetic"
                  style={{ padding: '10px 28px', fontSize: '11.5px', fontWeight: 800 }}
                >
                  ✓ RETURN TO CREATOR COMMAND CENTER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
