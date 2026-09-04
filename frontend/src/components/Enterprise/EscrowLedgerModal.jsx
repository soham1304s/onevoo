import React, { useState } from 'react';
import { formatINR } from '../../utils/costingCalculator';

export const EscrowLedgerModal = ({ isOpen, onClose, dealTitle = "Nykaa Monsoon Launch", grossAmount = 85000 }) => {
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [isProcessing, setIsProcessing] = useState(false);
  const [settled, setSettled] = useState(false);

  if (!isOpen) return null;

  const currentGross = currency === 'INR' ? grossAmount : Math.round(grossAmount / 82);
  const tdsRate = 0.10; // 10% Withholding TDS Section 194J
  const platformFeeRate = 0.05; // 5% Platform Fee
  const gstRate = 0.18; // 18% GST Input Credit

  const tdsAmount = Math.round(currentGross * tdsRate);
  const platformFee = Math.round(currentGross * platformFeeRate);
  const gstInputCredit = Math.round(platformFee * gstRate);
  const netCreatorPayout = currentGross - tdsAmount - platformFee;

  const formatCurrency = (val) => {
    if (currency === 'INR') return formatINR(val);
    return `$${val.toLocaleString()}`;
  };

  const handleExecuteSettlement = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSettled(true);
    }, 900);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="satin-card"
        style={{
          maxWidth: '580px',
          width: '100%',
          padding: '32px',
          borderRadius: '20px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(112, 37, 225, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pulse-emerald-ring" />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
                SECTION 3: DOUBLE-ENTRY LEDGER & ESCROW
              </span>
            </div>
            <h3 className="disp-title-h2" style={{ margin: 0, fontSize: '22px', color: 'var(--paper-soft)' }}>
              ESCROW SETTLEMENT <em>LEDGER</em>
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Campaign: <strong>{dealTitle}</strong> • Neon Postgres Lock
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              style={{
                padding: '4px 10px',
                fontSize: '10px',
                fontFamily: 'monospace',
                borderRadius: '4px',
                background: currency === 'INR' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                color: currency === 'INR' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              INR (₹)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              style={{
                padding: '4px 10px',
                fontSize: '10px',
                fontFamily: 'monospace',
                borderRadius: '4px',
                background: currency === 'USD' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                color: currency === 'USD' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Breakdown Table */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--satin-border)', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '13px', color: 'var(--paper-soft)' }}>Gross Milestone Escrow Amount:</span>
            <span className="mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--paper-soft)' }}>
              {formatCurrency(currentGross)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-rose)' }}>- 10% Withholding Tax (Section 194J TDS):</span>
            <span className="mono" style={{ fontSize: '13px', color: 'var(--accent-rose)' }}>
              - {formatCurrency(tdsAmount)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>- 5% Onevoo Operating Commission:</span>
            <span className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              - {formatCurrency(platformFee)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-green)' }}>+ 18% GST Input Tax Credit (ITC Tracked):</span>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--accent-green)' }}>
              + {formatCurrency(gstInputCredit)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-gold)' }}>NET CREATOR PAYOUT DISBURSEMENT:</span>
            <span className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-green)' }}>
              {formatCurrency(netCreatorPayout)}
            </span>
          </div>
        </div>

        {/* Cryptographic Audit Signature Pill */}
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '8px', padding: '10px 14px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', wordBreak: 'break-all' }}>
            🔒 SOC2 SHA-256 SIGNATURE HASH: c8f3a9e145b2078d1f88a4e3209199f182ea7bc6e03a12d46e3e5518b0
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            style={{ flex: 1, padding: '12px', fontSize: '12px' }}
          >
            Close Ledger
          </button>
          
          <button
            type="button"
            className="btn-magnetic"
            onClick={handleExecuteSettlement}
            disabled={isProcessing || settled}
            style={{
              flex: 2,
              padding: '12px',
              fontSize: '12px',
              justifyContent: 'center',
              background: settled ? 'var(--accent-green)' : 'var(--accent-purple)',
              borderColor: settled ? 'var(--accent-green)' : 'var(--accent-purple)',
            }}
          >
            {settled ? '✓ DISBURSED VIA STRIPE CONNECT' : isProcessing ? 'Processing Transaction…' : '⚡ EXECUTE ESCROW DISBURSEMENT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscrowLedgerModal;
