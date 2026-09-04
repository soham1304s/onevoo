import React, { useState } from 'react';
import useRealTimeDeals from '../../hooks/useRealTimeDeals';
import RealTimeDealDrawer from '../RealTimeDeals/RealTimeDealDrawer';
import ProductionBuilder from '../ProductionBuilder/ProductionBuilder';
import DigitalCallSheet from '../CallSheet/DigitalCallSheet';
import EscrowContentVault from '../EscrowVault/EscrowContentVault';
import SafeZoneQAPreview from '../Enterprise/SafeZoneQAPreview';
import LogisticsOptimizer from '../Enterprise/LogisticsOptimizer';
import EscrowLedgerModal from '../Enterprise/EscrowLedgerModal';
import Logo from '../Logo';
import { formatINR } from '../../utils/costingCalculator';

export const CreativeOSStudio = () => {
  const [activeTab, setActiveTab] = useState('DEALS'); // 'DEALS' | 'BUILDER' | 'CALLSHEET' | 'LOGISTICS' | 'SAFEZONE' | 'VAULT'
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  // Real-Time Deal Stream state
  const {
    deals,
    activeNotification,
    clearNotification,
    simulateIncomingDeal,
    acceptDeal
  } = useRealTimeDeals();

  const handleAcceptDealFromStudio = (dealId) => {
    acceptDeal(dealId);
  };

  const acceptedDealsCount = deals.filter(d => d.status === 'ACCEPTED').length;

  return (
    <div className="creative-os-studio-page wrap" style={{ position: 'relative' }}>
      
      {/* Real-Time Deal Drawer Notification (Aura glow banner) */}
      <RealTimeDealDrawer
        activeDeal={activeNotification}
        onClose={clearNotification}
        onAccept={handleAcceptDealFromStudio}
      />

      {/* Studio Header Banner */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <Logo size="small" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-emerald-ring" />
                <span className="tech-label-mono">REAL-TIME CONTENT PRODUCTION OPERATING SYSTEM</span>
              </div>
            </div>
            <h1 className="disp-title-h1" style={{ margin: '8px 0 12px' }}>
              ONEVOO <em>CREATIVE OS</em>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '640px' }}>
              Enterprise command center for live brand matching, dynamic production budget calculations, constraint-satisfaction shoot scheduling, safe-zone transcoding QA, and milestone escrow locks.
            </p>
          </div>

          {/* Real-Time Simulator Action Button */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowEscrowModal(true)}
              className="btn btn-ghost"
              style={{ padding: '12px 18px', fontSize: '11px' }}
            >
              📊 Double-Entry Ledger Modal
            </button>

            <button
              type="button"
              onClick={simulateIncomingDeal}
              className="btn-magnetic"
              style={{ padding: '12px 20px', fontSize: '11px' }}
              title="Broadcast simulated incoming brand deal event"
            >
              ⚡ SIMULATE LIVE DEAL MATCH
            </button>
          </div>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div
        className="satin-card"
        style={{
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px'
        }}
      >
        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MATCH ENGINE</span>
          <div className="font-display" style={{ fontSize: '22px', color: 'var(--accent-green)', marginTop: '2px' }}>
            98.4% ACCURACY
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Real-time niche scoring</span>
        </div>

        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ACTIVE DEALS STREAM</span>
          <div className="font-display" style={{ fontSize: '22px', color: 'var(--accent-gold)', marginTop: '2px' }}>
            {deals.length} OPPORTUNITIES
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>Live broadcast active</span>
        </div>

        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ACCEPTED CONTRACTS</span>
          <div className="font-display" style={{ fontSize: '22px', color: 'var(--paper-soft)', marginTop: '2px' }}>
            {acceptedDealsCount} SIGNED
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-purple)' }}>Escrow backed</span>
        </div>

        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SYSTEM LATENCY</span>
          <div className="font-display" style={{ fontSize: '22px', color: 'var(--accent-cyan)', marginTop: '2px' }}>
            14MS
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Neon PostgreSQL Synced</span>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', borderBottom: '1px solid var(--satin-border)', paddingBottom: '16px' }}>
        {[
          { id: 'DEALS', label: '1. Live Deal Stream', icon: '⚡' },
          { id: 'BUILDER', label: '2. Production Builder', icon: '🛠️' },
          { id: 'CALLSHEET', label: '3. Call Sheet & Fallback', icon: '📋' },
          { id: 'LOGISTICS', label: '4. Logistics Solver', icon: '🧭' },
          { id: 'SAFEZONE', label: '5. Safe-Zone Transcoder QA', icon: '📱' },
          { id: 'VAULT', label: '6. Content Vault & Escrow', icon: '🔒' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="btn-magnetic"
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              background: activeTab === tab.id ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: activeTab === tab.id ? 'var(--accent-purple)' : 'var(--satin-border)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 0 20px rgba(112, 37, 225, 0.4)' : 'none',
            }}
          >
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="studio-tab-panels">
        
        {/* TAB 1: REAL-TIME DEALS */}
        {activeTab === 'DEALS' && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>MODULE 1 • REAL-TIME DEALS STREAM</span>
                <h2 style={{ fontSize: '24px', textTransform: 'uppercase', margin: '4px 0 0', color: 'var(--paper-soft)' }}>
                  Live Broadcast Ingestion Queue
                </h2>
              </div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {deals.length} active opportunities in queue
              </span>
            </div>

            <div className="deals-stream-grid">
              {deals.map(deal => (
                <div
                  key={deal.id}
                  className="satin-card"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `3px solid ${deal.status === 'ACCEPTED' ? 'var(--accent-green)' : 'var(--accent-gold)'}`
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
                          {deal.brandLogo} {deal.brandName}
                        </span>
                        <h3 style={{ fontSize: '18px', margin: '4px 0 0', color: 'var(--paper-soft)' }}>
                          {deal.campaignTitle}
                        </h3>
                      </div>
                      <div
                        style={{
                          background: deal.matchScore >= 95 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: deal.matchScore >= 95 ? 'var(--accent-green)' : 'var(--accent-gold)',
                          border: `1px solid ${deal.matchScore >= 95 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}
                      >
                        ★ {deal.matchScore}% Match
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {deal.requirements}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderTop: '1px solid var(--satin-border)', paddingTop: '12px' }}>
                      <div>
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>GUARANTEED ESCROW</span>
                        <div className="mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-green)' }}>
                          {formatINR(deal.dealValue)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EXPIRES IN</span>
                        <div className="mono" style={{ fontSize: '12px', color: 'var(--accent-rose)' }}>
                          {deal.expiresInMinutes} mins
                        </div>
                      </div>
                    </div>

                    {deal.status === 'ACCEPTED' ? (
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: 'var(--accent-green)', fontFamily: 'monospace', fontSize: '11px' }}>
                        ✓ ACCEPTED & SENT TO PRODUCTION BUILDER
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAcceptDealFromStudio(deal.id)}
                        className="btn-magnetic"
                        style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '11px' }}
                      >
                        ACCEPT BRIEF & LOCK ESCROW
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTION BUILDER */}
        {activeTab === 'BUILDER' && (
          <ProductionBuilder />
        )}

        {/* TAB 3: DIGITAL CALL SHEET & EMERGENCY FALLBACK */}
        {activeTab === 'CALLSHEET' && (
          <DigitalCallSheet />
        )}

        {/* TAB 4: CONSTRAINT-SATISFACTION LOGISTICS SOLVER */}
        {activeTab === 'LOGISTICS' && (
          <LogisticsOptimizer />
        )}

        {/* TAB 5: AI SAFE-ZONE QA & WATERMARKING ENGINE */}
        {activeTab === 'SAFEZONE' && (
          <SafeZoneQAPreview />
        )}

        {/* TAB 6: MILESTONE ESCROW & CONTENT VAULT */}
        {activeTab === 'VAULT' && (
          <EscrowContentVault />
        )}
      </div>

      {/* Global Escrow Ledger Modal */}
      <EscrowLedgerModal
        isOpen={showEscrowModal}
        onClose={() => setShowEscrowModal(false)}
        dealTitle="Onevoo Enterprise Campaign"
        grossAmount={150000}
      />
    </div>
  );
};

export default CreativeOSStudio;
