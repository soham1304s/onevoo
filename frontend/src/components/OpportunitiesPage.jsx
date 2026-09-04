import React, { useState, useMemo, useEffect } from 'react';
import { GIGS } from '../data/gigs';
import GigCard from './GigCard';
import GigDetailsDrawer from './GigDetailsDrawer';
import GigApplicationFlow from './gigs/GigApplicationFlow';
import Pagination from './Pagination';
import GigCardSkeleton from './GigCardSkeleton';
import useRealTimeDeals from '../hooks/useRealTimeDeals';
import RealTimeDealDrawer from './RealTimeDeals/RealTimeDealDrawer';
import DailyBrief from './dashboard/DailyBrief';
import { formatINR } from '../utils/costingCalculator';
import CommunityEvents from './CommunityEvents';

const OpportunitiesPage = () => {
  const [selectedGig, setSelectedGig] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [activeFormat, setActiveFormat] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [minBudget, setMinBudget] = useState(0);
  const [sortBy, setSortBy] = useState('match-desc');
  const [escrowOnly, setEscrowOnly] = useState(false);

  const [appliedGigs, setAppliedGigs] = useState(() => {
    try {
      const savedGigs = window.localStorage.getItem('appliedGigs');
      return savedGigs ? JSON.parse(savedGigs) : {};
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return {};
    }
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Real-time Deal Flow Hook
  const {
    activeNotification,
    clearNotification,
    simulateIncomingDeal,
    acceptDeal
  } = useRealTimeDeals();

  // Effect to save appliedGigs to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem('appliedGigs', JSON.stringify(appliedGigs));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [appliedGigs]);

  // Simulate data fetching on filter change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTag, activeFormat, selectedCity, minBudget, sortBy, currentPage]);

  // Unique lists for filter options
  const allTags = useMemo(() => ['All', ...new Set(GIGS.map(g => g.tag))], []);
  const allFormats = useMemo(() => ['All', 'Instagram Reel', 'TikTok', 'YouTube Shorts', 'Commercial Shoot', '30-Day Campaign'], []);
  const allCities = useMemo(() => ['All', ...new Set(GIGS.map(g => g.city).filter(Boolean))], []);

  const handleApply = (gigId, bookingRef, applicantDetails) => {
    setAppliedGigs(prev => ({
      ...prev,
      [gigId]: applicantDetails,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveTag('All');
    setActiveFormat('All');
    setSelectedCity('All');
    setMinBudget(0);
    setSortBy('match-desc');
    setEscrowOnly(false);
    setCurrentPage(1);
  };

  // Pipeline Metrics
  const totalPipelineValue = useMemo(() => {
    return GIGS.reduce((acc, g) => acc + (g.payoutNumeric || 0), 0);
  }, []);

  const filteredAndSortedGigs = useMemo(() => {
    const filtered = GIGS.filter(gig => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = (
        gig.title.toLowerCase().includes(searchTermLower) ||
        gig.brand.toLowerCase().includes(searchTermLower) ||
        gig.description.toLowerCase().includes(searchTermLower) ||
        gig.tag.toLowerCase().includes(searchTermLower) ||
        (gig.city && gig.city.toLowerCase().includes(searchTermLower))
      );

      const tagMatch = activeTag === 'All' || gig.tag === activeTag;
      const formatMatch = activeFormat === 'All' || gig.format === activeFormat;
      const cityMatch = selectedCity === 'All' || gig.city === selectedCity;
      const budgetMatch = (gig.payoutNumeric || 0) >= minBudget;
      const escrowMatch = !escrowOnly || gig.escrowStatus?.includes('Escrow');

      return searchMatch && tagMatch && formatMatch && cityMatch && budgetMatch && escrowMatch;
    });

    switch (sortBy) {
      case 'match-desc':
        return filtered.sort((a, b) => (b.matchScore || 90) - (a.matchScore || 90));
      case 'payout-desc':
        return filtered.sort((a, b) => (b.payoutNumeric || 0) - (a.payoutNumeric || 0));
      case 'payout-asc':
        return filtered.sort((a, b) => (a.payoutNumeric || 0) - (b.payoutNumeric || 0));
      case 'newest':
        return filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      default:
        return filtered;
    }
  }, [searchTerm, activeTag, activeFormat, selectedCity, minBudget, sortBy, escrowOnly]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const featuredGigs = useMemo(() => GIGS.filter(gig => gig.featured), []);
  const regularGigs = useMemo(() => filteredAndSortedGigs, [filteredAndSortedGigs]);
  const currentRegularGigs = regularGigs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {/* Real-Time Live Opportunity Stream Notification */}
      <RealTimeDealDrawer
        activeDeal={activeNotification}
        onClose={clearNotification}
        onAccept={(dealId) => acceptDeal(dealId)}
      />

      <div className="opportunities-page wrap" style={{ position: "relative" }}>
        
        {/* Section 6: Daily Brief Creative Command Center */}
        <DailyBrief onOpenDeal={(deal) => setSelectedGig(deal)} />

        {/* Real-Time Creator Gigs Header */}
        <div className="sec-head" style={{ textAlign: 'center', margin: '0 auto 40px', position: "relative", zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="pulse-emerald-ring" />
            <span className="tech-label-mono">VERIFIED ENTERPRISE BRAND OPPORTUNITIES</span>
          </div>
          
          <h2 className="disp-title-h2" style={{ margin: '8px 0 12px' }}>
            EXPLORE <em>CREATOR GIGS</em>
          </h2>

          <p style={{ maxWidth: '680px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Browse active brand deals, commercial shoots, and vertical video retainers. Algorithmic matching with 100% milestone escrow holding backed by Neon PostgreSQL.
          </p>

          {/* Quick Pipeline Stats Ribbon */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              marginTop: '20px',
            }}
          >
            <div className="satin-card" style={{ padding: '8px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PIPELINE VALUE:</span>
              <span className="mono" style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {formatINR(totalPipelineValue)}
              </span>
            </div>

            <div className="satin-card" style={{ padding: '8px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE BOOKINGS:</span>
              <span className="mono" style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-green)' }}>
                {GIGS.length} GIGS OPEN
              </span>
            </div>

            <button
              type="button"
              onClick={simulateIncomingDeal}
              className="btn-magnetic"
              style={{ padding: '8px 16px', fontSize: '10px' }}
            >
              ⚡ SIMULATE INCOMING BRAND DEAL
            </button>
          </div>
        </div>

        <CommunityEvents />

        {/* Multi-Dimensional Filter Controls */}
        <div
          className="satin-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '36px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Row 1: Search, Sort & City Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            {/* Search Input */}
            <div>
              <label htmlFor="search-gigs" className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                SEARCH BRAND OR KEYWORD:
              </label>
              <input
                type="text"
                id="search-gigs"
                placeholder="Search Nykaa, Samsung, Fashion, 4K..."
                className="search-input"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--satin-border)', borderRadius: '8px', color: '#fff' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* City Location Filter */}
            <div>
              <label htmlFor="city-select" className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                PRIMARY LOCATION:
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--satin-border)', borderRadius: '8px', color: '#fff' }}
              >
                {allCities.map(city => (
                  <option key={city} value={city} style={{ background: '#111' }}>{city === 'All' ? 'All Locations (India & Global)' : city}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <label htmlFor="sort-by" className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                SORT RESULTS:
              </label>
              <select
                id="sort-by"
                className="sort-select"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--satin-border)', borderRadius: '8px', color: '#fff' }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="match-desc" style={{ background: '#111' }}>★ Highest AI Profile Match</option>
                <option value="payout-desc" style={{ background: '#111' }}>💰 Payout: High to Low</option>
                <option value="payout-asc" style={{ background: '#111' }}>Payout: Low to High</option>
                <option value="newest" style={{ background: '#111' }}>Newest Added</option>
              </select>
            </div>

            {/* Min Budget Range */}
            <div>
              <label className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                MIN PAYOUT: {minBudget === 0 ? 'All Budgets' : formatINR(minBudget)}
              </label>
              <input
                type="range"
                min={0}
                max={250000}
                step={25000}
                value={minBudget}
                onChange={e => setMinBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-gold)', marginTop: '8px' }}
              />
            </div>
          </div>

          {/* Row 2: Format Pills */}
          <div style={{ marginBottom: '16px' }}>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', display: 'block', marginBottom: '8px' }}>
              CONTENT FORMAT:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {allFormats.map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setActiveFormat(fmt)}
                  className="btn-magnetic"
                  style={{
                    fontSize: '11px',
                    padding: '6px 14px',
                    background: activeFormat === fmt ? 'var(--accent-purple)' : 'rgba(255,255,255,0.03)',
                    borderColor: activeFormat === fmt ? 'var(--accent-purple)' : 'var(--satin-border)',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Category Tags */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div className="filter-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-btn ${activeTag === tag ? 'active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                  style={{ fontSize: '11px', padding: '5px 12px' }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {(searchTerm || activeTag !== 'All' || activeFormat !== 'All' || selectedCity !== 'All' || minBudget > 0) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-ghost"
                style={{ fontSize: '11px', padding: '6px 14px' }}
              >
                Clear All Filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="showcase-grid">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <GigCardSkeleton key={index} />
            ))}
          </div>
        ) : currentRegularGigs.length > 0 ? (
          <>
            <div className="showcase-grid">
              {currentRegularGigs.map((gig, index) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  index={index}
                  onSelect={() => setSelectedGig(gig)}
                  isApplied={!!appliedGigs[gig.id]}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(regularGigs.length / itemsPerPage)}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          <div className="no-results satin-card" style={{ padding: '60px 24px', textAlign: 'center', borderRadius: '16px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ textTransform: 'uppercase', color: 'var(--paper-soft)' }}>No matching opportunities found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '8px auto 20px' }}>
              No active brand deals match your current location, budget, or format filters.
            </p>
            <button className="btn-magnetic" onClick={handleClearFilters} style={{ padding: '10px 20px', fontSize: '11px' }}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* v5 Interactive Booking Session & Rate Negotiation Engine */}
      {selectedGig && (
        <GigApplicationFlow
          gig={selectedGig}
          onClose={() => setSelectedGig(null)}
          onApplied={(gigId, bookingRef, details) => {
            handleApply(gigId, bookingRef, details);
          }}
        />
      )}
    </>
  );
};

export default OpportunitiesPage;