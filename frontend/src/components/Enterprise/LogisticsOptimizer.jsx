import React, { useState } from 'react';
import { formatINR } from '../../utils/costingCalculator';

export const LogisticsOptimizer = () => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [budgetLimit, setBudgetLimit] = useState(150000);
  const [isSolving, setIsSolving] = useState(false);
  const [locked, setLocked] = useState(false);

  // Solved schedule slots
  const [solution, setSolution] = useState({
    slotTime: 'Thursday, Sept 4 • 09:30 AM - 05:30 PM',
    location: 'Bandra Daylight Studio XYZ',
    assignedCrew: [
      { role: 'Lead Lifestyle Creator', name: 'Tanvi Sharma', rate: 45000, reliability: '99.4%' },
      { role: 'Director of Photography', name: 'Arjun Mehra (Sony FX6)', rate: 35000, reliability: '98.8%' },
      { role: 'Lighting & Gaffer Lead', name: 'Karan Shah (Aputure 600d)', rate: 18000, reliability: '97.5%' },
      { role: 'Sound Recordist', name: 'Vikram Joshi (Sennheiser 416)', rate: 14000, reliability: '99.1%' },
    ],
    complianceScore: 98.6,
    totalBudget: 112000,
  });

  const handleRunOptimizer = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      setSolution({
        slotTime: selectedCity === 'Mumbai' ? 'Thursday, Sept 4 • 09:30 AM - 05:30 PM' : 'Friday, Sept 5 • 10:00 AM - 06:00 PM',
        location: selectedCity === 'Mumbai' ? 'Bandra Daylight Studio XYZ' : 'Hauz Khas Production Warehouse',
        assignedCrew: [
          { role: 'Lead Creator', name: selectedCity === 'Mumbai' ? 'Tanvi Sharma' : 'Rohan Malhotra', rate: 45000, reliability: '99.4%' },
          { role: 'Director of Photography', name: 'Arjun Mehra (Sony FX6)', rate: 35000, reliability: '98.8%' },
          { role: 'Lighting & Gaffer', name: 'Karan Shah (Aputure 600d)', rate: 18000, reliability: '97.5%' },
          { role: 'Sound Recordist', name: 'Vikram Joshi (Sennheiser)', rate: 14000, reliability: '99.1%' },
        ],
        complianceScore: 99.1,
        totalBudget: 112000,
      });
    }, 700);
  };

  const handleLockSchedule = () => {
    setLocked(true);
    setTimeout(() => {
      alert(`⚡ Schedule Locked: Call sheets dispatched to ${solution.assignedCrew.length} crew members!`);
    }, 200);
  };

  return (
    <div
      className="satin-card"
      style={{
        padding: '28px',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="ambient-engineering-grid" style={{ opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--satin-border)', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-emerald-ring" />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>SECTION 4: CONSTRAINT-SATISFACTION LOGISTICS SOLVER</span>
            </div>
            <h3 className="disp-title-h2" style={{ margin: '4px 0 0', fontSize: '20px', color: 'var(--paper-soft)' }}>
              INTELLIGENT SHOOT <em>LOGISTICS & SCHEDULER</em>
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '6px', background: 'rgba(112, 37, 225, 0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(112, 37, 225, 0.3)' }}>
              COMPLIANCE SCORE: {solution.complianceScore}%
            </span>
          </div>
        </div>

        {/* Input Parameters Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              TARGET CITY:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--satin-border)',
                color: 'var(--paper-soft)',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              <option value="Mumbai">Mumbai (Bandra / Andheri)</option>
              <option value="Delhi NCR">Delhi NCR (South Delhi / Gurgaon)</option>
              <option value="Bengaluru">Bengaluru (Indiranagar / Koramangala)</option>
            </select>
          </div>

          <div>
            <label className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              MAX BUDGET CAP: {formatINR(budgetLimit)}
            </label>
            <input
              type="range"
              min={75000}
              max={300000}
              step={10000}
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-gold)', marginTop: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              className="btn-magnetic"
              onClick={handleRunOptimizer}
              disabled={isSolving}
              style={{ width: '100%', padding: '10px', fontSize: '11px', justifyContent: 'center' }}
            >
              {isSolving ? 'Solving Linear Constraints…' : '⚡ RUN LOGISTICS SOLVER'}
            </button>
          </div>
        </div>

        {/* Solved Constraint Matrix Box */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--satin-border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>OPTIMAL TIME SLOT & VENUE:</span>
              <h4 style={{ margin: '2px 0 0', fontSize: '16px', color: 'var(--paper-soft)' }}>
                {solution.slotTime}
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                📍 {solution.location}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OPTIMIZED COMBINED COST:</span>
              <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-green)' }}>
                {formatINR(solution.totalBudget)}
              </div>
            </div>
          </div>

          {/* Assigned Crew Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {solution.assignedCrew.map((crew, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <div>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>{crew.role}</span>
                  <div style={{ fontSize: '13px', color: 'var(--paper-soft)', fontWeight: 600 }}>{crew.name}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-green)' }}>
                    ★ {crew.reliability} Reliability
                  </span>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--paper-soft)' }}>
                    {formatINR(crew.rate)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lock Action Button */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleLockSchedule}
              disabled={locked}
              className="btn-magnetic"
              style={{
                padding: '12px 24px',
                fontSize: '11px',
                background: locked ? 'var(--accent-green)' : 'var(--accent-purple)',
                borderColor: locked ? 'var(--accent-green)' : 'var(--accent-purple)',
              }}
            >
              {locked ? '✓ SCHEDULE LOCKED & CALL SHEETS DISPATCHED' : '🔒 LOCK OPTIMIZED SCHEDULE & DISPATCH'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOptimizer;
