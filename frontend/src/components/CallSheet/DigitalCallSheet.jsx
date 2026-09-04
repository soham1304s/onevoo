import React, { useState } from 'react';
import { INITIAL_CALL_SHEET } from '../../data/callSheetData';
import { PRODUCTION_RESOURCES } from '../../data/productionResources';
import { findAlternativeCrew } from '../../utils/emergencyFallback';
import { formatINR } from '../../utils/costingCalculator';

export const DigitalCallSheet = () => {
  const [callSheet, setCallSheet] = useState(INITIAL_CALL_SHEET);
  const [equipmentList, setEquipmentList] = useState(INITIAL_CALL_SHEET.equipmentChecklist);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [fallbackMatches, setFallbackMatches] = useState([]);
  const [selectedReplacement, setSelectedReplacement] = useState(null);
  const [resolutionNotice, setResolutionNotice] = useState(null);

  // Toggle equipment check status
  const toggleEquipment = (id) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, loaded: !item.loaded } : item))
    );
  };

  // Simulate an emergency cancellation by a crew member
  const triggerEmergencyCancellation = (roleId) => {
    const targetRole = callSheet.crewRoles.find((r) => r.roleId === roleId);
    if (!targetRole) return;

    // Mark role as cancelled
    setCallSheet((prev) => ({
      ...prev,
      crewRoles: prev.crewRoles.map((r) =>
        r.roleId === roleId ? { ...r, status: 'CANCELLED' } : r
      )
    }));

    // Find alternative matches using fallback algorithm
    const alternatives = findAlternativeCrew(
      targetRole.category,
      PRODUCTION_RESOURCES,
      targetRole.originalRate
    );

    setFallbackMatches(alternatives);
    setEmergencyActive(true);
    setResolutionNotice(null);
  };

  // Replace cancelled crew with chosen alternative
  const resolveEmergencyReplacement = (candidate) => {
    setCallSheet((prev) => ({
      ...prev,
      crewRoles: prev.crewRoles.map((r) =>
        r.status === 'CANCELLED'
          ? {
              ...r,
              assignedToName: `${candidate.name} (Emergency Backup)`,
              phone: candidate.phone,
              originalRate: candidate.ratePerDay,
              status: 'CONFIRMED'
            }
          : r
      )
    }));

    setEmergencyActive(false);
    setFallbackMatches([]);
    setResolutionNotice({
      name: candidate.name,
      costDelta: candidate.costDelta,
      score: candidate.reliabilityScore
    });
  };

  return (
    <div className="digital-callsheet-container" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span className="tech-label-mono">PRODUCTION OPERATING SYSTEM • SHOOT-DAY NODE</span>
          <h2 className="disp-title-h2" style={{ margin: '8px 0 6px' }}>
            DIGITAL CALL SHEET & <em>EMERGENCY FALLBACK</em>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Live shoot status synchronization, automated equipment packing checklist, and sub-minute emergency crew dispatch.
          </p>
        </div>

        {/* Live Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '10px 18px',
            borderRadius: '99px'
          }}
        >
          <span className="pulse-emerald-ring" />
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 700 }}>
            SHOOT-DAY MODE ACTIVE
          </span>
        </div>
      </div>

      {/* Emergency Cancellation Alert Banner (If active) */}
      {emergencyActive && (
        <div
          className="satin-card"
          style={{
            border: '1px solid var(--accent-rose)',
            background: 'rgba(244, 63, 94, 0.12)',
            boxShadow: '0 0 40px rgba(244, 63, 94, 0.2)',
            marginBottom: '28px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="mono" style={{ color: 'var(--accent-rose)', fontWeight: 700, fontSize: '12px' }}>
              ⚠️ EMERGENCY CANCELLATION DETECTED — 12H TO CALL TIME
            </span>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              AUTOMATIC FALLBACK ENGINE TRIGGERED
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--paper-soft)', marginBottom: '16px' }}>
            The primary DP has reported an emergency cancellation. The Onevoo safety node has scanned verified available replacements in the Mumbai metropolitan radius:
          </p>

          {/* Alternative Candidates List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            {fallbackMatches.map((cand) => (
              <div
                key={cand.vendorId}
                style={{
                  background: 'rgba(9, 9, 11, 0.85)',
                  border: '1px solid var(--satin-border)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="match-score-badge" style={{ fontSize: '10px' }}>
                      ★ {cand.reliabilityScore}% SAFETY
                    </span>
                    <span className="mono" style={{ fontSize: '11px', color: cand.costDelta >= 0 ? 'var(--accent-gold)' : 'var(--accent-green)' }}>
                      Variance: {cand.costDelta >= 0 ? `+${formatINR(cand.costDelta)}` : formatINR(cand.costDelta)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', color: 'var(--paper-soft)', margin: '6px 0 2px' }}>
                    {cand.name}
                  </h4>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    📍 {cand.city} • Rate: {formatINR(cand.ratePerDay)}/day
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => resolveEmergencyReplacement(cand)}
                  className="btn-magnetic"
                  style={{ width: '100%', padding: '10px', fontSize: '11px', textAlign: 'center' }}
                >
                  DEPLOY BACKUP & UPDATE CALL SHEET →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Success Notice */}
      {resolutionNotice && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span className="mono" style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '12px' }}>
              ✓ EMERGENCY RESOLVED SUCCESSFULLY
            </span>
            <div style={{ fontSize: '13px', color: 'var(--paper-soft)', marginTop: '2px' }}>
              Assigned <strong>{resolutionNotice.name}</strong> ({resolutionNotice.score}% Reliability). Digital call sheet dispatched via SMS & WhatsApp to all stakeholders.
            </div>
          </div>
          <button
            onClick={() => setResolutionNotice(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Details Summary Strip */}
      <div
        className="satin-card"
        style={{
          padding: '24px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}
      >
        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CAMPAIGN & BRAND</span>
          <h4 style={{ fontSize: '16px', color: 'var(--paper-soft)', marginTop: '4px' }}>{callSheet.campaignName}</h4>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>{callSheet.date}</span>
        </div>

        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CALL / WRAP TIMES</span>
          <div className="font-display" style={{ fontSize: '20px', color: 'var(--accent-green)', marginTop: '2px' }}>
            {callSheet.callTime} - {callSheet.wrapTime}
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>First Shot: {callSheet.firstShotTime}</span>
        </div>

        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LOCATION & GPS</span>
          <div style={{ fontSize: '12px', color: 'var(--paper-soft)', marginTop: '2px' }}>
            {callSheet.locationAddress}
          </div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>📍 {callSheet.gpsCoords}</span>
        </div>

        <div>
          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ON-SITE PRODUCER</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-soft)', marginTop: '2px' }}>
            {callSheet.producerContact.name}
          </div>
          <a
            href={`tel:${callSheet.producerContact.phone}`}
            className="mono"
            style={{ fontSize: '11px', color: 'var(--accent-purple)', textDecoration: 'none' }}
          >
            📞 {callSheet.producerContact.phone}
          </a>
        </div>
      </div>

      {/* Two Columns: Crew Contacts & Equipment Loaded Checklist */}
      <div className="callsheet-crew-grid">
        
        {/* Crew & Talent List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="tech-label-mono">ACTIVE CREW & TALENT ROSTER ({callSheet.crewRoles.length})</span>
            {!emergencyActive && (
              <button
                type="button"
                onClick={() => triggerEmergencyCancellation('role-02')}
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid var(--accent-rose)',
                  color: 'var(--accent-rose)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Test automatic fallback matching when a DP cancels"
              >
                🚨 TEST EMERGENCY CANCELLATION
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {callSheet.crewRoles.map((role) => (
              <div
                key={role.roleId}
                className="satin-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: role.status === 'CANCELLED' ? '3px solid var(--accent-rose)' : '3px solid var(--accent-green)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{role.roleName}</span>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        background: role.status === 'CANCELLED' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)',
                        color: role.status === 'CANCELLED' ? 'var(--accent-rose)' : 'var(--accent-green)'
                      }}
                    >
                      {role.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', color: 'var(--paper-soft)', margin: '4px 0 2px' }}>
                    {role.assignedToName}
                  </h4>
                  <a href={`tel:${role.phone}`} className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)', textDecoration: 'none' }}>
                    📞 {role.phone}
                  </a>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RATE / DAY</span>
                  <div className="font-display" style={{ fontSize: '16px', color: 'var(--paper-soft)' }}>
                    {formatINR(role.originalRate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Load Checklist */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="tech-label-mono">EQUIPMENT LOAD STATUS</span>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
              {equipmentList.filter((e) => e.loaded).length}/{equipmentList.length} PACKED
            </span>
          </div>

          <div className="satin-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {equipmentList.map((eq) => (
                <label
                  key={eq.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: eq.loaded ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--satin-border)',
                    cursor: 'pointer',
                    transition: 'var(--transition-snappy)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={eq.loaded}
                    onChange={() => toggleEquipment(eq.id)}
                    style={{ accentColor: 'var(--accent-green)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      color: eq.loaded ? 'var(--paper-soft)' : 'var(--text-muted)',
                      textDecoration: eq.loaded ? 'none' : 'none',
                      flex: 1
                    }}
                  >
                    {eq.name}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '9px',
                      color: eq.loaded ? 'var(--accent-green)' : 'var(--accent-gold)'
                    }}
                  >
                    {eq.loaded ? '✓ LOADED' : 'PENDING'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalCallSheet;
