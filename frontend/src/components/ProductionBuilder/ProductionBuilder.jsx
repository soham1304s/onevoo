import React, { useState, useMemo } from 'react';
import { PRODUCTION_RESOURCES, RESOURCE_CATEGORIES } from '../../data/productionResources';
import { calculateCosting, formatINR, generateQuotationCode } from '../../utils/costingCalculator';

export const ProductionBuilder = ({ onLockEscrow }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [resourceSearch, setResourceSearch] = useState('');
  const [selectedResources, setSelectedResources] = useState([
    PRODUCTION_RESOURCES[0], // Tanvi Sharma
    PRODUCTION_RESOURCES[3], // Kabir Sen (Videographer)
    PRODUCTION_RESOURCES[8], // Sony FX6 Kit
    PRODUCTION_RESOURCES[11], // Bandra Penthouse Studio
    PRODUCTION_RESOURCES[14]  // DaVinci Resolve Grade
  ]);
  const [durationDays, setDurationDays] = useState(2);
  const [quoteExported, setQuoteExported] = useState(false);

  // Filter resources by category & search query
  const filteredCatalog = useMemo(() => {
    return PRODUCTION_RESOURCES.filter((r) => {
      const matchCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
      const query = resourceSearch.toLowerCase().trim();
      const matchSearch = !query || (
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      );
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, resourceSearch]);

  // Compute live costing metrics
  const costing = useMemo(() => {
    return calculateCosting(selectedResources, durationDays);
  }, [selectedResources, durationDays]);

  const toggleResource = (resource) => {
    setSelectedResources((prev) => {
      const exists = prev.some((r) => r.id === resource.id);
      if (exists) {
        return prev.filter((r) => r.id !== resource.id);
      } else {
        return [...prev, resource];
      }
    });
  };

  const handleExportQuote = () => {
    setQuoteExported(true);
    setTimeout(() => setQuoteExported(false), 3000);
  };

  return (
    <div className="production-builder-container" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span className="tech-label-mono">SMART PRODUCTION BUILDER & COSTING ENGINE</span>
        <h2 className="disp-title-h2" style={{ margin: '8px 0 10px' }}>
          BUILD YOUR <em>CUSTOM CREATIVE PACKAGE</em>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '680px', margin: 0 }}>
          Dynamically assemble verified creators, commercial DPs, cinema cameras, studios, and post-production without rigid legacy retainers. All rates feature real-time margin and 18% GST calculations.
        </p>
      </div>

      {/* Main Grid: Left Resource Selector, Right Live Financial Ledger */}
      <div className="production-builder-grid builder-workspace-split">
        
        {/* Left Column: Catalog & Dedicated Scrollable Resource Container */}
        <div>
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ borderRadius: '99px', fontSize: '11px', padding: '6px 14px' }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Duration Slider Bar */}
          <div
            className="satin-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>SHOOT DURATION</div>
              <div className="font-display" style={{ fontSize: '22px', color: 'var(--paper-soft)' }}>
                {durationDays} {durationDays === 1 ? 'DAY' : 'DAYS'} PRODUCTION
              </div>
            </div>
            <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
              <input
                type="range"
                min="1"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }} className="mono">
                <span>1 Day</span>
                <span>7 Days</span>
                <span>14 Days</span>
              </div>
            </div>
          </div>

          {/* Section Indicator Bar & In-Builder Search */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              padding: '0 4px',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                RESOURCE CATALOGUE ({filteredCatalog.length} AVAILABLE • SCROLL ↕)
              </span>
            </div>

            <div style={{ width: '220px' }}>
              <input
                type="text"
                placeholder="Filter resources..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--satin-border)',
                  borderRadius: '6px',
                  color: 'var(--paper-soft)',
                }}
              />
            </div>
          </div>

          {/* DEDICATED SCROLLABLE RESOURCE CONTAINER */}
          <div
            className="builder-resource-scroll-container satin-card"
            style={{
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--satin-border)',
            }}
          >
            {filteredCatalog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <span className="mono" style={{ fontSize: '12px' }}>No resources match your search filter.</span>
              </div>
            ) : (
              <div className="builder-resource-grid">
                {filteredCatalog.map((item) => {
                  const isSelected = selectedResources.some((r) => r.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleResource(item)}
                      className={`resource-card-selectable ${isSelected ? 'is-selected' : ''}`}
                      style={{
                        minHeight: '150px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(112, 37, 225, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--satin-border)',
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {item.icon} {item.category}
                          </span>
                          <span
                            className="mono"
                            style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'var(--accent-green)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            ★ {item.reliabilityScore}%
                          </span>
                        </div>
                        <h4 style={{ fontSize: '13.5px', color: 'var(--paper-soft)', margin: '0 0 4px', fontWeight: 600 }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.35, margin: '0 0 10px' }}>
                          {item.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--satin-border)' }}>
                        <div>
                          <span className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>DAILY RATE</span>
                          <div className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                            {formatINR(item.ratePerDay)}<small style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/d</small>
                          </div>
                        </div>
                        <button
                          type="button"
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--satin-border)',
                            background: isSelected ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? '✓ ADDED' : '+ SELECT'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Financial Breakdown & Invoice Ledger (Pinned & Sticky) */}
        <div className="builder-live-summary-dock">
          <div className="satin-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="tech-label-mono">LIVE FINANCIAL MATRIX</span>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-green)' }}>
                ● REAL-TIME COSTING
              </span>
            </div>

            {/* Selected items chip tray */}
            <div style={{ marginBottom: '16px' }}>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                SELECTED NODES ({selectedResources.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
                {selectedResources.length === 0 ? (
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No resources selected yet.</span>
                ) : (
                  selectedResources.map((res) => (
                    <span
                      key={res.id}
                      onClick={() => toggleResource(res)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--satin-border)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: 'var(--paper-soft)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      title="Click to remove"
                      className="mono"
                    >
                      {res.name.split(' ')[0]} ✕
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Cost Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--satin-border)', paddingTop: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Raw Vendor / Talent Payouts</span>
                <span className="mono" style={{ color: 'var(--paper-soft)' }}>{formatINR(costing.rawCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Onevoo Margin & Coordination</span>
                <span className="mono" style={{ color: 'var(--accent-purple)' }}>+{formatINR(costing.onevooMargin)} ({costing.marginPercentage}%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Statutory GST (18% Baseline)</span>
                <span className="mono" style={{ color: 'var(--text-muted)' }}>+{formatINR(costing.estimatedTax)}</span>
              </div>
            </div>

            {/* Total Invoice */}
            <div style={{ background: 'rgba(112, 37, 225, 0.12)', border: '1px solid rgba(112, 37, 225, 0.3)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
              <div className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>TOTAL CLIENT PRODUCTION INVOICE</div>
              <div className="font-display" style={{ fontSize: '26px', color: 'var(--paper-soft)', margin: '4px 0 2px' }}>
                {formatINR(costing.totalClientInvoice)}
              </div>
              <div className="mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Includes talent insurance, venue liability & 4K master delivery
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn-magnetic"
                style={{ width: '100%', padding: '10px', textAlign: 'center', justifyContent: 'center', fontSize: '11px' }}
                onClick={() => {
                  if (onLockEscrow) onLockEscrow(costing);
                  else alert(`🔒 Digital Escrow Locked for ${formatINR(costing.totalClientInvoice)}! Synchronized in Neon database.`);
                }}
              >
                LOCK IN DIGITAL ESCROW 🔒
              </button>
              
              <button
                type="button"
                onClick={handleExportQuote}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--satin-border)',
                  color: 'var(--paper-soft)',
                  borderRadius: '6px',
                  padding: '9px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {quoteExported ? '✓ QUOTATION CODE COPIED!' : `EXPORT QUOTE (${generateQuotationCode(selectedResources, durationDays)})`}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductionBuilder;
