import React from 'react';

export default function BrandTrustCloud() {
  const brands = [
    { name: 'NIKE', font: 'Impact, sans-serif' },
    { name: 'boAt', font: 'sans-serif', isBoat: true },
    { name: 'SAMSUNG', font: "'Inter', sans-serif", letterSpacing: '0.15em' },
    { name: 'Coca-Cola', font: "'Brush Script MT', cursive, sans-serif", italic: true },
    { name: 'amazon', font: "'Inter', sans-serif", lower: true },
    { name: 'PUMA', font: 'Impact, sans-serif', letterSpacing: '0.1em' },
    { name: 'facebook', font: "'Inter', sans-serif", lower: true },
    { name: 'Adobe', font: "'Inter', sans-serif" },
  ];

  return (
    <div className="brand-trust-section wrap" style={{ position: 'relative' }}>
      <div className="ambient-engineering-grid" />
      <div className="brand-trust-header mono" style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.15em', marginBottom: '24px', textAlign: 'center' }}>
        TRUSTED BY BRANDS & STUDIOS
      </div>
      <div
        className="brands-cloud-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '32px 24px',
          opacity: 0.85,
        }}
      >
        {brands.map((b, idx) => (
          <div
            key={idx}
            className="brand-logo-item"
            style={{
              fontFamily: b.font,
              fontSize: '20px',
              fontWeight: 800,
              fontStyle: b.italic ? 'italic' : 'normal',
              letterSpacing: b.letterSpacing || '0.04em',
              color: 'var(--paper)',
              textTransform: b.lower ? 'lowercase' : 'none',
              transition: 'var(--transition-smooth)',
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            {b.name}
          </div>
        ))}
      </div>
    </div>
  );
}
