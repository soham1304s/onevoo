import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { OPPORTUNITIES, CITIES } from "../data/content.js";
import { GIGS } from "../data/gigs.js";
import GigApplicationFlow from "./gigs/GigApplicationFlow";
import Logo from "./Logo";
import { handleImageError } from "../utils/imageFallback";

const INITIAL_BATCH_SIZE = 9;
const INCREMENT_SIZE = 12;

export default function Offerings() {
  const [activeFormat, setActiveFormat] = useState("all");
  const [activeCity, setActiveCity] = useState("All Cities");
  const [selectedGig, setSelectedGig] = useState(null);
  
  // State for Load More and Scrollable Section
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [isScrollContainerActive, setIsScrollContainerActive] = useState(false);
  const scrollSectionRef = useRef(null);

  const handleApplyClick = (item) => {
    // Match with rich GIGS data or construct comprehensive gig object
    const matched = GIGS.find((g) => g.id === item.id || g.title.toLowerCase() === item.title.toLowerCase()) || {
      id: item.id,
      title: item.title,
      brand: item.brand || (item.tag === "Brand Collab" ? "Urban Monkey" : item.tag === "Shoot Opportunity" ? "Tata EV Curvv" : "Nykaa Beauty"),
      brandLogo: "✨",
      city: item.city,
      format: item.tag,
      payout: item.payout,
      payoutNumeric: parseInt(item.payout.replace(/[^0-9]/g, "")) || 45000,
      baseBudget: parseInt(item.payout.replace(/[^0-9]/g, "")) || 45000,
      minBudget: Math.round((parseInt(item.payout.replace(/[^0-9]/g, "")) || 45000) * 0.8),
      maxBudget: Math.round((parseInt(item.payout.replace(/[^0-9]/g, "")) || 45000) * 1.3),
      isNegotiable: true,
      tag: item.tag,
      requiredNiche: "Lifestyle",
      minFollowers: 20000,
      minEngagementRate: 3.2,
      deliverablesCount: 3,
      brandProfile: {
        relationshipScore: 96,
        avgPayoutDays: 12,
        avgRevisionRounds: 1.2,
        brandPitch: item.description || "Modern minimalist visuals with high engagement storytelling."
      },
      image: item.image
    };

    setSelectedGig(matched);
  };

  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES.filter((item) => {
      const matchesFormat =
        activeFormat === "all" ||
        (activeFormat === "collab" && item.tag === "Brand Collab") ||
        (activeFormat === "shoot" && item.tag === "Shoot Opportunity") ||
        (activeFormat === "sponsor" && item.tag === "Sponsor Gig");

      const matchesCity = activeCity === "All Cities" || item.city === activeCity;

      return matchesFormat && matchesCity;
    });
  }, [activeFormat, activeCity]);

  // Reset pagination when filter changes
  const handleFilterChange = (fmtId) => {
    setActiveFormat(fmtId);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  const handleCityChange = (city) => {
    setActiveCity(city);
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  // Load more handler (increments count and activates scroll section)
  const handleLoadMore = () => {
    setIsScrollContainerActive(true);
    setVisibleCount((prev) => Math.min(prev + INCREMENT_SIZE, filteredOpportunities.length));
  };

  // Expand all opportunities handler
  const handleExpandAll = () => {
    setIsScrollContainerActive(true);
    setVisibleCount(filteredOpportunities.length);
  };

  const displayedOpportunities = filteredOpportunities.slice(0, visibleCount);
  const totalCount = filteredOpportunities.length;
  const hasMore = visibleCount < totalCount;
  const progressPercent = Math.min(100, Math.round((visibleCount / Math.max(1, totalCount)) * 100));

  return (
    <section id="showcase" className="sec wrap offerings-showcase-section" style={{ position: "relative" }}>
      {/* Header with Title and Total Deal Pipeline Meta */}
      <div
        className="showcase-header-row"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className="pulse-emerald-ring" style={{ width: "8px", height: "8px" }} />
            <span className="tech-label-mono">REAL-TIME DEAL FLOW • {OPPORTUNITIES.length}+ ACTIVE CAMPAIGNS</span>
          </div>
          <h2 className="disp-title-h2" style={{ margin: "4px 0 10px" }}>
            AVAILABLE <em>CREATOR GIGS</em>
          </h2>
          <p style={{ maxWidth: "580px", margin: 0 }}>
            Browse active brand campaigns, local studio shoots, and long-term sponsorships with dynamic rate negotiation and guaranteed escrow milestones.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div
            className="satin-card"
            style={{
              padding: "8px 16px",
              borderRadius: "99px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>CATALOG:</span>
            <span className="mono" style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent-gold)" }}>
              {OPPORTUNITIES.length} GIGS OPEN
            </span>
          </div>

          <Link to="/opportunities" className="btn-magnetic" style={{ fontSize: "11px", padding: "10px 20px" }}>
            EXPLORE ADVANCED SEARCH →
          </Link>
        </div>
      </div>

      {/* Showcase Filter Controls */}
      <div className="showcase-controls" style={{ position: "relative", zIndex: 1, marginBottom: "28px" }}>
        {/* Category Filters */}
        <div className="filter-row" style={{ marginBottom: "16px" }}>
          {[
            { id: "all", label: "ALL OPPORTUNITIES" },
            { id: "collab", label: "BRAND COLLABS" },
            { id: "shoot", label: "SHOOT OPPORTUNITIES" },
            { id: "sponsor", label: "LONG-TERM SPONSORS" },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => handleFilterChange(fmt.id)}
              className={`filter-btn ${activeFormat === fmt.id ? "active" : ""}`}
              style={{ borderRadius: "99px" }}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* City Filter Row */}
        <div className="theme-toggle-row" style={{ flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", marginRight: "4px" }}>
            CITY:
          </span>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`theme-btn ${activeCity === city ? "active" : ""}`}
              style={{ borderRadius: "99px", padding: "6px 14px", fontSize: "11px" }}
            >
              {city.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Showcase Container (Scrollable when activated) */}
      <div
        ref={scrollSectionRef}
        className={`showcase-wrapper ${isScrollContainerActive ? "showcase-scroll-active" : ""}`}
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "18px",
          transition: "all 0.3s ease",
          ...(isScrollContainerActive
            ? {
                maxHeight: "840px",
                overflowY: "auto",
                padding: "16px 10px 16px 0",
                border: "1px solid var(--satin-border)",
                background: "rgba(0, 0, 0, 0.15)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--accent-gold) rgba(255, 255, 255, 0.05)",
              }
            : {}),
        }}
      >
        <div className="showcase-grid">
          {displayedOpportunities.length > 0 ? (
            displayedOpportunities.map((item) => (
              <div className="showcase-card satin-card" key={item.id} onClick={() => handleApplyClick(item)}>
                {/* Card Background Image & Overlay */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-bg-image"
                    loading="lazy"
                    onError={(e) => handleImageError(e, item.tag)}
                  />
                )}
                <div className="card-image-overlay" />

                {/* Top Row */}
                <div className="card-top">
                  <Logo size="small" />
                  <span className="card-tag mono">{item.tag}</span>
                </div>

                {/* Bottom Row */}
                <div className="card-bottom-info">
                  <h3 className="card-title">{item.title}</h3>

                  {/* Meta details (City & Payout) */}
                  <div className="card-meta-row">
                    <span className="card-city mono">📍 {item.city}</span>
                    <span className="card-payout font-display">{item.payout}</span>
                  </div>

                  <button
                    type="button"
                    className="card-apply-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyClick(item);
                    }}
                  >
                    NEGOTIATE & APPLY →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No opportunities match the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          DEDICATED LOAD MORE / SCROLL DOWN ACTION SECTION IN THAT SPACE
          ========================================================================= */}
      <div
        className="satin-card load-more-space-card"
        style={{
          marginTop: "24px",
          padding: "20px 24px",
          borderRadius: "16px",
          border: "1px solid var(--satin-border)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Progress & Counter Ribbon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "680px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>
              SHOWING <strong style={{ color: "var(--accent-gold)" }}>{Math.min(visibleCount, totalCount)}</strong> OF <strong style={{ color: "var(--paper-soft)" }}>{totalCount}</strong> OPPORTUNITIES
            </span>
          </div>

          <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 800 }}>
            {progressPercent}% LOADED
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            height: "6px",
            borderRadius: "99px",
            background: "rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--accent-purple), var(--accent-gold), var(--accent-green))",
              borderRadius: "99px",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* Action Buttons in that Space */}
        {hasMore ? (
          <div className="load-more-buttons-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "4px", width: "100%" }}>
            <button
              type="button"
              onClick={handleLoadMore}
              className="btn-magnetic"
              style={{
                padding: "12px 28px",
                fontSize: "12px",
                fontWeight: 800,
                background: "linear-gradient(135deg, rgba(112, 37, 225, 0.2), rgba(197, 140, 19, 0.2))",
                borderColor: "var(--accent-gold)",
                color: "var(--paper-soft)",
              }}
            >
              ⚡ LOAD MORE (SHOW NEXT {Math.min(INCREMENT_SIZE, totalCount - visibleCount)} DEALS)
            </button>

            <button
              type="button"
              onClick={handleExpandAll}
              className="btn btn-ghost"
              style={{
                padding: "12px 22px",
                fontSize: "11px",
                borderColor: "var(--satin-border)",
                color: "var(--text-muted)",
              }}
            >
              📜 EXPAND FULL SCROLL FEED ({totalCount} TOTAL)
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "6px 0" }}>
            <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 800 }}>
              ✨ ALL {totalCount} VERIFIED ENTERPRISE GIGS LOADED • SCROLL UP OR FILTER BY CITY TO REFINE
            </span>
          </div>
        )}
      </div>

      {/* v5 Interactive Booking & Rate Negotiation Workspace Modal */}
      {selectedGig && (
        <GigApplicationFlow
          gig={selectedGig}
          onClose={() => setSelectedGig(null)}
        />
      )}
    </section>
  );
}
