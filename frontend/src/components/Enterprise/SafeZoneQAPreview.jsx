import React, { useState } from 'react';

export const SafeZoneQAPreview = () => {
  const [activePlatform, setActivePlatform] = useState('reels'); // 'reels', 'tiktok', 'shorts'
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [qaPassed, setQaPassed] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('4k');

  const platforms = [
    { id: 'reels', name: 'Instagram Reels', safeArea: '80% vertical safe zone (header & audio bar margins)' },
    { id: 'tiktok', name: 'TikTok UI', safeArea: 'Right-side engagement icons & bottom caption safe area' },
    { id: 'shorts', name: 'YouTube Shorts', safeArea: 'Bottom subscribe pill & channel title clearance' },
  ];

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
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>AUTOMATED MEDIA INGESTION & COMPLIANCE PIPELINE</span>
            </div>
            <h3 className="disp-title-h2" style={{ margin: '4px 0 0', fontSize: '20px', color: 'var(--paper-soft)' }}>
              AI SAFE-ZONE QA & <em>AGENCY WATERMARK TRANSLATOR</em>
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ✓ OCR OBSTACLE QA: 99.8% COMPLIANT
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Vertical Safe Zone Preview Simulator */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '280px',
                height: '498px',
                borderRadius: '24px',
                border: '3px solid rgba(255, 255, 255, 0.12)',
                background: '#09090b',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(112, 37, 225, 0.25)',
              }}
            >
              {/* Mock Video Backdrop */}
              <img
                src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=870"
                alt="Safe Zone Video Stream"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Platform Overlay Grids */}
              {activePlatform === 'reels' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {/* Top Bar Safe Zone */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', borderBottom: '1px dashed rgba(236, 72, 153, 0.7)', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="mono" style={{ fontSize: '9px', color: '#ec4899' }}>IG REELS HEADER AREA</span>
                  </div>
                  {/* Right Action Icons Zone */}
                  <div style={{ position: 'absolute', right: 0, top: '160px', bottom: '90px', width: '50px', borderLeft: '1px dashed rgba(236, 72, 153, 0.7)', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>❤️</span>
                    <span style={{ fontSize: '14px' }}>💬</span>
                    <span style={{ fontSize: '14px' }}>✈️</span>
                  </div>
                  {/* Bottom Caption Safe Zone */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px', borderTop: '1px dashed rgba(236, 72, 153, 0.7)', background: 'rgba(236, 72, 153, 0.18)', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <span className="mono" style={{ fontSize: '8px', color: '#ec4899' }}>CAPTION & AUDIO SAFE AREA</span>
                  </div>
                </div>
              )}

              {activePlatform === 'tiktok' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', right: 0, top: '120px', bottom: '110px', width: '56px', borderLeft: '1px dashed rgba(0, 238, 209, 0.7)', background: 'rgba(0, 238, 209, 0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px' }}>+</span>
                    <span style={{ fontSize: '14px' }}>💖</span>
                    <span style={{ fontSize: '14px' }}>💭</span>
                    <span style={{ fontSize: '14px' }}>🔖</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '110px', borderTop: '1px dashed rgba(0, 238, 209, 0.7)', background: 'rgba(0, 238, 209, 0.18)', padding: '8px' }}>
                    <span className="mono" style={{ fontSize: '8px', color: '#00eed1' }}>TIKTOK CAPTION & HASHTAGS ZONE</span>
                  </div>
                </div>
              )}

              {activePlatform === 'shorts' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '95px', borderTop: '1px dashed rgba(244, 63, 94, 0.7)', background: 'rgba(244, 63, 94, 0.18)', padding: '8px' }}>
                    <span className="mono" style={{ fontSize: '8px', color: '#f43f5e' }}>YOUTUBE SHORTS SUBSCRIBE PILL</span>
                  </div>
                </div>
              )}

              {/* Semi-Transparent Agency Watermark */}
              {watermarkEnabled && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-30deg)',
                    padding: '8px 16px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    background: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(4px)',
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ONEVOO PREVIEW • PROPERTY OF AGENCY
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Ingestion Controls */}
          <div>
            <div className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)', marginBottom: '10px' }}>
              SELECT PLATFORM OVERLAY MASK:
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {platforms.map((plat) => (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => setActivePlatform(plat.id)}
                  className="btn-magnetic"
                  style={{
                    fontSize: '11px',
                    padding: '8px 14px',
                    background: activePlatform === plat.id ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: activePlatform === plat.id ? 'var(--accent-purple)' : 'var(--satin-border)',
                  }}
                >
                  {plat.name}
                </button>
              ))}
            </div>

            {/* Platform Safe Area Description */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--satin-border)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ACTIVE GUIDELINE SPECIFICATION:</span>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--paper-soft)' }}>
                {platforms.find((p) => p.id === activePlatform)?.safeArea}
              </p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  style={{ accentColor: 'var(--accent-purple)' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--paper-soft)' }}>
                  Enforce Agency Security Watermark on Draft Previews (Section 2.1)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={qaPassed}
                  onChange={(e) => setQaPassed(e.target.checked)}
                  style={{ accentColor: 'var(--accent-green)' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--paper-soft)' }}>
                  Automated OCR Safe-Zone Text Overlap Detection (AI QA)
                </span>
              </label>
            </div>

            {/* Transcode Output Selector */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--satin-border)' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                TARGET TRANSCODE PROFILES:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['4k', 'fhd', 'prores'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQuality(q)}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: selectedQuality === q ? 'rgba(223, 182, 64, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: selectedQuality === q ? 'var(--accent-gold)' : 'var(--text-muted)',
                      border: `1px solid ${selectedQuality === q ? 'var(--accent-gold)' : 'var(--satin-border)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {q === '4k' ? '2160x3840 4K 60FPS' : q === 'fhd' ? '1080x1920 H.264 MP4' : 'PRORES 422 MASTER'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeZoneQAPreview;
