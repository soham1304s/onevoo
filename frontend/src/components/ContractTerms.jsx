import React, { useState } from "react";
import { Link } from "react-router-dom";

const AGREEMENT_TEMPLATES = [
  {
    id: "reel",
    name: "4K Commercial Reel Agreement",
    icon: "📸",
    code: "ONV-REEL-2026-MUM",
    payout: "₹85,000",
    escrowDeposit: "100% In Escrow",
    deliverables: "1x 4K Master Reel (9:16) + 3x Supporting Stories",
    reviewWindow: "48 Hours (Auto-approval on expiry)",
    usageLicence: "Organic 90 Days • India Territory",
    paymentTrigger: "Instant Escrow Disbursement upon QA Sign-off",
    revisions: "Max 2 Creative Revision Rounds Included",
    killFee: "50% Guaranteed Compensation if cancelled <48h",
    disclosure: "ASCI Compliant • Mandatory #Ad / #Collab tags",
    shaHash: "SHA-256: 8e4c9f1a20b7...d31a (Verified)",
  },
  {
    id: "retainer",
    name: "30-Day Multi-Reel Retainer",
    icon: "🎥",
    code: "ONV-RET-2026-BLR",
    payout: "₹2,40,000 / month",
    escrowDeposit: "Full Month Escrowed",
    deliverables: "4x High-Production Reels + 8x Stories + Raw B-Roll",
    reviewWindow: "72 Hours per milestone deliverable",
    usageLicence: "Organic + Paid Ad Whitelisting (180 Days)",
    paymentTrigger: "Bi-weekly milestone release (50% / 50%)",
    revisions: "1 Revision per video asset",
    killFee: "1 Month Notice Period with Full Milestone Settlement",
    disclosure: "ASCI & Platform Ad Safety Standardized",
    shaHash: "SHA-256: f19b4e72ac88...90bc (Verified)",
  },
  {
    id: "studio",
    name: "Full Studio Shoot & DP Contract",
    icon: "✨",
    code: "ONV-STU-2026-DEL",
    payout: "₹1,75,000",
    escrowDeposit: "100% In Escrow",
    deliverables: "1-Day 10hr Studio Shoot + Cinema DP (Sony FX6) + Color Grade",
    reviewWindow: "3 Business Days post-mastering",
    usageLicence: "Full Commercial Master Rights • Global Digital",
    paymentTrigger: "Direct NEFT / Stripe Transfer on Call Sheet completion",
    revisions: "Color Grade & Sound Mix Fine-tune (2 Rounds)",
    killFee: "75% Payout on same-day weather/venue cancellation",
    disclosure: "Includes Venue & Equipment Insurance Coverage",
    shaHash: "SHA-256: 4a2d81f09c53...e782 (Verified)",
  },
];

const TRUST_PILLARS = [
  {
    number: "01",
    title: "100% Upfront Digital Escrow",
    summary: "No chasing invoices or 90-day payment delays.",
    detail: "Brand budgets are deposited into a secure legal escrow vault before production begins. Once deliverables meet the brief, funds release automatically to your bank account.",
    badge: "Mathematical Guarantee",
    icon: "🔒",
  },
  {
    number: "02",
    title: "Crystal-Clear Scope & Deliverables",
    summary: "Every pixel, aspect ratio, and deadline defined upfront.",
    detail: "Each agreement names the exact deliverables, technical specifications (4K 60fps / 9:16), review owners, and maximum revision limits (strictly 2 rounds) before cameras roll.",
    badge: "Anti-Scope Creep",
    icon: "📐",
  },
  {
    number: "03",
    title: "Protected IP & Licensing Boundaries",
    summary: "Your copyright remains yours. Usage is explicitly bounded.",
    detail: "Commercial usage is restricted by channel, territory, and duration (e.g. 90-day organic). Paid ad whitelisting and broadcast extensions require additional paid rider contracts.",
    badge: "Creator Sovereignty",
    icon: "📜",
  },
  {
    number: "04",
    title: "Guaranteed Kill-Fees & Dispute Protection",
    summary: "Clear exits and cancellation safety on every single shoot.",
    detail: "If a brand cancels last-minute or delays review windows, pre-agreed kill-fees (up to 75%) and emergency crew compensations are triggered automatically by the system.",
    badge: "Zero-Risk Protocol",
    icon: "🛡️",
  },
];

export default function ContractTerms() {
  const [activeTemplateId, setActiveTemplateId] = useState("reel");

  const activeTemplate =
    AGREEMENT_TEMPLATES.find((t) => t.id === activeTemplateId) ||
    AGREEMENT_TEMPLATES[0];

  return (
    <section id="contracts" className="sec wrap contract-section" style={{ position: "relative", padding: "80px 24px 100px" }}>
      <div className="ambient-engineering-grid" style={{ opacity: 0.5 }} />

      {/* Header */}
      <div
        className="contract-header-grid"
        style={{
          position: "relative",
          zIndex: 2,
          marginBottom: "48px",
        }}
      >
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="pulse-emerald-ring" />
            <span className="tech-label-mono" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
              ENTERPRISE LEGAL ASSURANCE & CREATOR SAFETY PROTOCOL
            </span>
          </div>

          <h2 className="disp-title-h2" style={{ fontSize: "clamp(30px, 4.5vw, 52px)", lineHeight: 1.05, margin: "8px 0 16px" }}>
            BUILT ON UNCOMPROMISING TRUST. <br />
            <em>ZERO SURPRISES. ZERO DELAYS.</em>
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6, maxWidth: "600px", margin: 0 }}>
            Onevoo replaces ambiguous emails with legally-binding, standardized digital contracts. Every project is anchored by digital escrow, strict revision boundaries, automated tax compliance, and instant milestone releases.
          </p>
        </div>

        {/* Right Trust Badges Banner */}
        <div
          className="satin-card"
          style={{
            padding: "26px",
            background: "linear-gradient(145deg, rgba(112, 37, 225, 0.12) 0%, rgba(12, 12, 16, 0.8) 100%)",
            border: "1px solid rgba(112, 37, 225, 0.35)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(112, 37, 225, 0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)", fontWeight: 700 }}>
              VERIFIED TRUST PROTOCOL
            </span>
            <span
              className="mono"
              style={{
                fontSize: "10px",
                background: "rgba(16, 185, 129, 0.2)",
                color: "var(--accent-green)",
                padding: "2px 8px",
                borderRadius: "99px",
                border: "1px solid rgba(16, 185, 129, 0.4)",
              }}
            >
              ● 100% ENFORCEABLE
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "ESCROW ASSURANCE", val: "100% Upfront Deposit" },
              { label: "REVISION LIMIT", val: "Max 2 Rounds Cap" },
              { label: "TAX COMPLIANCE", val: "10% TDS & 18% GST Auto" },
              { label: "SETTLEMENT SLA", val: "<24h Instant Release" },
            ].map((stat, i) => (
              <div key={i} style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px", borderRadius: "8px", border: "1px solid var(--satin-border)" }}>
                <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", display: "block" }}>{stat.label}</span>
                <span style={{ fontSize: "12px", color: "var(--paper-soft)", fontWeight: 700 }}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Interactive Contract Blueprint Simulator, Right Trust Pillars */}
      <div
        className="contract-blueprint"
        style={{
          position: "relative",
          zIndex: 2,
          alignItems: "start",
        }}
      >
        {/* Left Column: Interactive Contract Template Simulator */}
        <div
          className="satin-card"
          style={{
            padding: "28px",
            border: "1px solid var(--satin-border)",
            background: "rgba(12, 12, 16, 0.85)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Template Switcher Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
            {AGREEMENT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTemplateId(t.id)}
                className={`filter-btn ${activeTemplateId === t.id ? "active" : ""}`}
                style={{
                  fontSize: "11px",
                  borderRadius: "99px",
                  padding: "6px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Agreement Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--satin-border)",
              paddingBottom: "14px",
              marginBottom: "18px",
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>CONTRACT IDENTIFIER</span>
              <div className="mono" style={{ fontSize: "12px", color: "var(--accent-gold)", fontWeight: 700 }}>
                {activeTemplate.code}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>ESCROW STATUS</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
                <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 700 }}>
                  {activeTemplate.escrowDeposit}
                </span>
              </div>
            </div>
          </div>

          {/* Contract Itemized Fields */}
          <div className="contract-fields-grid">
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--satin-border)", padding: "12px", borderRadius: "8px" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>DELIVERABLES</span>
              <strong style={{ fontSize: "12.5px", color: "var(--paper-soft)", display: "block" }}>{activeTemplate.deliverables}</strong>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--satin-border)", padding: "12px", borderRadius: "8px" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>REVIEW SLA</span>
              <strong style={{ fontSize: "12.5px", color: "var(--paper-soft)", display: "block" }}>{activeTemplate.reviewWindow}</strong>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--satin-border)", padding: "12px", borderRadius: "8px" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>USAGE RIGHTS & LICENCE</span>
              <strong style={{ fontSize: "12.5px", color: "var(--paper-soft)", display: "block" }}>{activeTemplate.usageLicence}</strong>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--satin-border)", padding: "12px", borderRadius: "8px" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>PAYMENT RELEASE TRIGGER</span>
              <strong style={{ fontSize: "12.5px", color: "var(--accent-green)", display: "block" }}>{activeTemplate.paymentTrigger}</strong>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--satin-border)", padding: "12px", borderRadius: "8px" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>REVISION SAFEGUARD</span>
              <strong style={{ fontSize: "12.5px", color: "var(--paper-soft)", display: "block" }}>{activeTemplate.revisions}</strong>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--satin-border)", padding: "12px", borderRadius: "8px" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>CANCELLATION KILL-FEE</span>
              <strong style={{ fontSize: "12.5px", color: "var(--accent-gold)", display: "block" }}>{activeTemplate.killFee}</strong>
            </div>
          </div>

          {/* Legal Disclosure & Cryptographic Verification Box */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "10px",
              background: "rgba(112, 37, 225, 0.08)",
              border: "1px solid rgba(112, 37, 225, 0.25)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700, display: "block" }}>
                🔒 STATUTORY ADVERTISING & AUDIT STANDARD
              </span>
              <p style={{ color: "var(--paper-soft)", fontSize: "11.5px", margin: "2px 0 0", lineHeight: 1.4 }}>
                {activeTemplate.disclosure}
              </p>
            </div>

            <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", background: "rgba(0,0,0,0.4)", padding: "4px 8px", borderRadius: "6px" }}>
              {activeTemplate.shaHash}
            </span>
          </div>
        </div>

        {/* Right Column: 4 Core Trust Pillars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {TRUST_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="satin-card"
              style={{
                padding: "20px 22px",
                border: "1px solid var(--satin-border)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-purple)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--satin-border)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "var(--accent-purple)",
                      background: "rgba(112, 37, 225, 0.15)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {pillar.number}
                  </span>
                  <h4 style={{ margin: 0, fontSize: "14.5px", color: "var(--paper-soft)", fontWeight: 700 }}>
                    {pillar.icon} {pillar.title}
                  </h4>
                </div>

                <span
                  className="mono"
                  style={{
                    fontSize: "9px",
                    background: "rgba(226, 184, 66, 0.12)",
                    color: "var(--accent-gold)",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    border: "1px solid rgba(226, 184, 66, 0.3)",
                    fontWeight: 700,
                  }}
                >
                  {pillar.badge}
                </span>
              </div>

              <p style={{ fontSize: "12.5px", color: "var(--paper-soft)", margin: "0 0 6px", fontWeight: 500 }}>
                {pillar.summary}
              </p>
              <p style={{ fontSize: "11.5px", color: "var(--text-muted)", margin: 0, lineHeight: 1.45 }}>
                {pillar.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Legal Transparency Strip */}
      <div
        className="satin-card"
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          borderRadius: "14px",
          border: "1px solid var(--satin-border)",
          background: "rgba(255,255,255,0.02)",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="mono" style={{ color: "var(--accent-gold)", fontSize: "11px", fontWeight: 700 }}>
              100% LEGAL TRANSPARENCY & STATUTORY ASSURANCE
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: 0 }}>
            Read Onevoo’s Master Creative Services Agreement, Section 194J Tax Handbook, and Creator Privacy Protocol.
          </p>
        </div>

        <div className="contract-actions-row">
          <Link
            to="/terms"
            className="btn-magnetic contract-btn-primary"
            style={{ padding: "12px 20px", fontSize: "11px" }}
          >
            VIEW FULL CONTRACT TERMS →
          </Link>
          <Link
            to="/privacy"
            className="btn btn-ghost contract-btn-secondary"
            style={{ borderRadius: "99px", padding: "12px 20px", fontSize: "11px", borderColor: "var(--satin-border)" }}
          >
            PRIVACY PROTOCOL →
          </Link>
        </div>
      </div>

      <p className="mono" style={{ position: "relative", zIndex: 2, color: "var(--text-muted)", fontSize: "10.5px", marginTop: "16px", textAlign: "center" }}>
        🔒 Onevoo contracts are legally enforceable under the Indian Contract Act (1872) & IT Act (2000). Automated milestone escrow protected by Neon PostgreSQL audit logs.
      </p>
    </section>
  );
}