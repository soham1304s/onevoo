import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductionBuilder from './ProductionBuilder/ProductionBuilder';
import DigitalCallSheet from './CallSheet/DigitalCallSheet';
import EscrowContentVault from './EscrowVault/EscrowContentVault';

export const CreativeOSPreview = () => {
  const [activeEngine, setActiveEngine] = useState('BUILDER');

  return (
    <section id="creative-os-engine" className="sec wrap creative-os-preview-section" style={{ position: 'relative', paddingTop: '20px' }}>
      
      {/* Section Head */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
        <div>
          <span className="tech-label-mono">ENTERPRISE PRODUCTION WORKFLOW ENGINE</span>
          <h2 className="disp-title-h2" style={{ margin: '8px 0 10px' }}>
            TEST THE <em>CREATIVE OS</em> LIVE
          </h2>
          <p style={{ maxWidth: '600px', color: 'var(--text-muted)' }}>
            Experience the real-time production builder, digital call sheet with automated emergency crew fallback, and milestone escrow vault.
          </p>
        </div>

        <Link to="/studio" className="btn-magnetic" style={{ padding: '12px 24px', fontSize: '11px' }}>
          LAUNCH FULL OS STUDIO ⚡
        </Link>
      </div>

      {/* Engine Switcher Tabs */}
      <div className="engine-switcher-tabs touch-scroll-row">
        {[
          { id: 'BUILDER', label: '1. Production Builder', fullLabel: '1. Dynamic Production Builder', icon: '🛠️' },
          { id: 'CALLSHEET', label: '2. Call Sheet & Fallback', fullLabel: '2. Shoot-Day Call Sheet & Emergency Fallback', icon: '📋' },
          { id: 'ESCROW', label: '3. Escrow & Vault', fullLabel: '3. Milestone Escrow & Content Vault', icon: '🔒' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`studio-tab-btn ${activeEngine === tab.id ? 'active' : ''}`}
            onClick={() => setActiveEngine(tab.id)}
          >
            <span>{tab.icon}</span>
            <span className="tab-label-full">{tab.fullLabel}</span>
            <span className="tab-label-compact">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Embedded Live Engine Frame */}
      <div className="satin-card creative-os-engine-card">
        {activeEngine === 'BUILDER' && <ProductionBuilder />}
        {activeEngine === 'CALLSHEET' && <DigitalCallSheet />}
        {activeEngine === 'ESCROW' && <EscrowContentVault />}
      </div>
    </section>
  );
};

export default CreativeOSPreview;
