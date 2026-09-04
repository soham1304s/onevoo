import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const stats = [
    { value: "250+", label: "CREATOR GIGS LIVE" },
    { value: "120+", label: "BRAND PARTNERS" },
    { value: "98%", label: "ON-TIME PAYOUTS" },
    { value: "4.9/5", label: "CREATOR RATING" },
  ];

  return (
    <div className="hero-wrapper" style={{ position: "relative" }}>
      <header className="hero wrap" id="features" style={{ position: "relative", padding: "60px 24px 30px" }}>
        
        {/* Left Column Content */}
        <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
          <span className="tech-label-mono" style={{ marginBottom: "16px" }}>
            REAL-TIME CREATOR PRODUCTION OPERATING SYSTEM
          </span>
          <h1 className="disp-title-h1" style={{ marginBottom: "20px" }}>
            FROM SOLO SCRAMBLE<br />
            TO A <em>SIGNED BRIEF</em>.
          </h1>
          <p className="hero-desc" style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6, maxWidth: "480px", marginBottom: "32px" }}>
            Onevoo turns scattered creator admin into an enterprise momentum loop — live deal matching, dynamic production costing, digital call sheets, and milestone escrow locks.
          </p>
          <div className="hero-ctas" style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "36px", flexWrap: "wrap" }}>
            <Link to="/studio" className="btn-magnetic" style={{ padding: "14px 28px", fontSize: "12px", letterSpacing: "0.08em" }}>
              ENTER CREATIVE OS ⚡
            </Link>
            <Link to="/opportunities" className="btn btn-ghost" style={{ borderRadius: "99px", padding: "14px 28px", fontSize: "12px", letterSpacing: "0.06em", fontWeight: 700 }}>
              BROWSE DEALS
            </Link>
          </div>

          {/* Yellow Starburst Doodle (8-ray asterisk) */}
          <div className="hero-doodle-spark" aria-hidden="true" style={{ marginTop: "8px" }}>
            <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
              <path d="M20 2V38" stroke="var(--accent-gold)" strokeWidth="3" strokeLinecap="round" />
              <path d="M2 20H38" stroke="var(--accent-gold)" strokeWidth="3" strokeLinecap="round" />
              <path d="M7.27 7.27L32.73 32.73" stroke="var(--accent-gold)" strokeWidth="3" strokeLinecap="round" />
              <path d="M7.27 32.73L32.73 7.27" stroke="var(--accent-gold)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right Column Visual Showcase */}
        <div className="hero-visual-col" style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center" }}>
          <div className="hero-portrait-container" style={{ position: "relative" }}>
            {/* Ambient Purple Lighting Glow */}
            <div
              style={{
                position: "absolute",
                inset: "-30px",
                background: "radial-gradient(circle at 60% 40%, rgba(112, 37, 225, 0.45) 0%, rgba(112, 37, 225, 0.2) 45%, transparent 70%)",
                filter: "blur(50px)",
                zIndex: 0,
                pointerEvents: "none"
              }}
            />
            
            <div className="hero-portrait-card satin-card" style={{ width: "100%", maxWidth: "340px", height: "430px", borderRadius: "24px", overflow: "hidden", position: "relative", zIndex: 1, padding: 0 }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"
                alt="Onevoo Featured Creator"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(112, 37, 225, 0.15) 0%, transparent 40%, rgba(9, 9, 11, 0.94) 100%)" }} />
              
              {/* Creator Tag Overlays */}
              <div className="portrait-badge top-badge mono" style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(14, 14, 18, 0.88)", padding: "6px 12px", borderRadius: "99px", border: "1px solid rgba(255, 255, 255, 0.12)", fontSize: "11px", color: "var(--paper-soft)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="pulse-emerald-ring" style={{ width: "7px", height: "7px" }} />
                <span>@onevoo.creator</span>
              </div>

              <div className="portrait-badge bottom-badge" style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px", background: "rgba(14, 14, 18, 0.9)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="badge-payout font-display" style={{ fontSize: "20px", color: "var(--accent-gold)" }}>₹2.4L<small style={{ fontSize: "11px", color: "var(--text-muted)" }}>/mo</small></div>
                  <div className="badge-caption mono" style={{ fontSize: "10px", color: "var(--accent-green)" }}>⚡ Real-Time Deal Flow</div>
                </div>
                <span className="mono" style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "6px", background: "rgba(112, 37, 225, 0.25)", color: "var(--paper-soft)", border: "1px solid rgba(112, 37, 225, 0.4)" }}>14 MATCHES</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4-Item Metric Counters Row */}
      <div className="hero-stats-bar wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="stats-row-clean" style={{ textAlign: "left", borderTop: "1px solid var(--satin-border)", paddingTop: "28px" }}>
          {stats.map((stat, idx) => (
            <div className="stat-clean-item" key={idx}>
              <div className="stat-number font-display" style={{ fontSize: "clamp(32px, 3.8vw, 46px)", color: "var(--paper-soft)", letterSpacing: "-0.01em", lineHeight: 1 }}>{stat.value}</div>
              <div className="stat-text mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.12em", marginTop: "6px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
