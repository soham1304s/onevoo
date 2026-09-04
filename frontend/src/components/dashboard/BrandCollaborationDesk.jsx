import React, { useState, useEffect } from "react";
import ContentReviewDesk from "./ContentReviewDesk";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_BRAND_DELIVERABLES = [
  { id: "del-1", title: "Reel 1: Kinetic High-Speed Monsoon Run (60s)", status: "APPROVED", payout: 50000, date: "Sep 01, 2026", creator: "Tanvi Sharma" },
  { id: "del-2", title: "Reel 2: Studio Footwear Macro Texture (45s)", status: "IN REVIEW (V2)", payout: 45000, date: "Sep 02, 2026", creator: "Aman Sen" },
  { id: "del-3", title: "Reel 3: BTS Director Cut & Grading (60s)", status: "IN PRODUCTION", payout: 30000, date: "Sep 06, 2026", creator: "Rahul Patel" },
  { id: "del-4", title: "Story Set: 3x Interactive Polls & Swipe-Up", status: "COMPLETED", payout: 12000, date: "Aug 30, 2026", creator: "Neha Kapoor" },
  { id: "del-5", title: "Lookbook: 5x High-Res Editorial Stills", status: "PENDING HANDOFF", payout: 10000, date: "Sep 08, 2026", creator: "Kabir Verma" },
];

export default function BrandCollaborationDesk() {
  const { user } = useAuth();
  const storageKey = `onevoo_brand_portal_${user?.email || "default"}`;

  const [brandName, setBrandName] = useState(() => {
    return localStorage.getItem(`${storageKey}_brand_name`) || "Nike India Creative Operations";
  });

  const [campaignTitle, setCampaignTitle] = useState(() => {
    return localStorage.getItem(`${storageKey}_campaign_title`) || "Monsoon Kinetic Summer Launch";
  });

  const [deliverables, setDeliverables] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_deliverables`);
      return saved ? JSON.parse(saved) : DEFAULT_BRAND_DELIVERABLES;
    } catch {
      return DEFAULT_BRAND_DELIVERABLES;
    }
  });

  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({ title: "", payout: "", date: "Sep 15, 2026", creator: "" });

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_brand_name`, brandName);
      localStorage.setItem(`${storageKey}_campaign_title`, campaignTitle);
      localStorage.setItem(`${storageKey}_deliverables`, JSON.stringify(deliverables));
    } catch (e) {
      console.warn("Brand storage sync error:", e);
    }
  }, [brandName, campaignTitle, deliverables, storageKey]);

  // Dynamic calculations
  const totalEscrowBudget = deliverables.reduce((acc, curr) => acc + Number(curr.payout || 0), 0);
  const releasedEscrow = deliverables
    .filter((d) => d.status.includes("APPROVED") || d.status.includes("COMPLETED"))
    .reduce((acc, curr) => acc + Number(curr.payout || 0), 0);
  const lockedEscrow = totalEscrowBudget - releasedEscrow;
  const completedCount = deliverables.filter((d) => d.status.includes("APPROVED") || d.status.includes("COMPLETED")).length;
  const completionPercent = deliverables.length > 0 ? Math.round((completedCount / deliverables.length) * 100) : 0;

  const handleAddDeliverable = (e) => {
    e.preventDefault();
    if (!newDeliverable.title || !newDeliverable.payout) return;
    const item = {
      id: `del-${Date.now()}`,
      title: newDeliverable.title,
      payout: Number(newDeliverable.payout),
      status: "IN REVIEW",
      date: newDeliverable.date || "Sep 15, 2026",
      creator: newDeliverable.creator || "Assigned Creator"
    };
    setDeliverables([...deliverables, item]);
    setNewDeliverable({ title: "", payout: "", date: "Sep 15, 2026", creator: "" });
    setShowAddDeliverableModal(false);
  };

  const handleToggleApprove = (id) => {
    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status.includes("APPROVED") ? "IN REVIEW" : "APPROVED" }
          : item
      )
    );
  };

  const handleDeleteDeliverable = (id) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="brand-collaboration-desk" style={{ position: "relative" }}>
      {/* Top Brand Banner */}
      <div
        className="satin-card"
        style={{
          padding: "22px 26px",
          marginBottom: "24px",
          borderRadius: "18px",
          borderLeft: "4px solid var(--accent-purple)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span className="tech-label-mono" style={{ fontSize: "10px" }}>ENTERPRISE CLIENT COLLABORATION DESK</span>
          <h2 className="disp-title-h2" style={{ margin: "2px 0", fontSize: "24px" }}>
            {brandName}
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
            Campaign: <strong>{campaignTitle}</strong> • Roster: {deliverables.length} Tracked Deliverables
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div
            className="mono"
            style={{
              padding: "5px 12px",
              borderRadius: "99px",
              background: "rgba(112, 37, 225, 0.15)",
              border: "1px solid rgba(112, 37, 225, 0.4)",
              color: "#fff",
              fontSize: "10.5px",
              fontWeight: 700,
            }}
          >
            🔒 SMART ESCROW: ACTIVE
          </div>

          <button
            type="button"
            className="btn-magnetic"
            style={{ padding: "6px 14px", fontSize: "10.5px" }}
            onClick={() => setShowAddDeliverableModal(true)}
          >
            + ADD DELIVERABLE ↗
          </button>
        </div>
      </div>

      {/* KPI Trio */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {/* Escrow Ledger */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>ACTIVE ESCROW LEDGER</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>100% FUNDED</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-display)" }}>
            ₹{totalEscrowBudget.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px" }} className="mono">
            <span style={{ color: "var(--accent-green)" }}>Released: ₹{releasedEscrow.toLocaleString()}</span>
            <span style={{ color: "var(--accent-cyan)" }}>Locked: ₹{lockedEscrow.toLocaleString()}</span>
          </div>
        </div>

        {/* Deliverables Checklist Progress */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>DELIVERABLES MILESTONES</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", fontWeight: 700 }}>
              {completedCount}/{deliverables.length} ASSETS
            </span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
            {completionPercent}% <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>COMPLETED</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px" }} className="mono">
            <span style={{ color: "var(--text-muted)" }}>{completedCount} Approved</span>
            <span style={{ color: "var(--accent-gold)" }}>Live Tracking</span>
          </div>
        </div>

        {/* Campaign ROI & Reach */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>CAMPAIGN ENGAGEMENT & ROI</span>
            <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
            4.2M+ <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>REACH</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px" }} className="mono">
            <span style={{ color: "var(--accent-green)" }}>Avg. Engagement: 8.4%</span>
            <span style={{ color: "var(--text-muted)" }}>CPM: ₹142</span>
          </div>
        </div>
      </div>

      {/* Main Asset Review Deck */}
      <div style={{ marginBottom: "24px" }}>
        <ContentReviewDesk
          currentVersion="V2"
          draftUrl="https://assets.mixkit.co/videos/preview/mixkit-vertical-portrait-of-a-fashion-model-in-studio-41315-large.mp4"
          campaignTitle={`${campaignTitle} (Asset Review)`}
          onApprove={() => {
            alert(`Asset approved! Milestone escrow payment of ₹${Number(deliverables[1]?.payout || 45000).toLocaleString()} unlocked to creator.`);
            if (deliverables[1]) handleToggleApprove(deliverables[1].id);
          }}
        />
      </div>

      {/* Campaign Milestones Table with CRUD actions */}
      <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>PRODUCTION CONTRACT ASSET MANIFEST</span>
            <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
              Deliverables & Escrow Release Ledger
            </h3>
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-cyan)" }}>
            AAA ARBITRATED ESCROW
          </span>
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          {deliverables.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "var(--panel)",
                border: "1px solid var(--satin-border)",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "220px", flex: 1 }}>
                <span
                  onClick={() => handleToggleApprove(item.id)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    background: item.status.includes("APPROVED") || item.status.includes("COMPLETED") ? "rgba(16, 185, 129, 0.2)" : "rgba(223, 182, 64, 0.2)",
                    color: item.status.includes("APPROVED") || item.status.includes("COMPLETED") ? "var(--accent-green)" : "var(--accent-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                  title="Click to toggle Approval Status"
                >
                  {item.status.includes("APPROVED") || item.status.includes("COMPLETED") ? "✓" : "●"}
                </span>

                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--paper-soft)" }}>{item.title}</div>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
                    {item.creator ? `Creator: ${item.creator} • ` : ""}Due: {item.date}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="mono" style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--accent-gold)" }}>
                  ₹{Number(item.payout).toLocaleString()}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleApprove(item.id)}
                  className="mono"
                  style={{
                    fontSize: "9.5px",
                    padding: "3px 8px",
                    borderRadius: "99px",
                    background: item.status.includes("APPROVED") || item.status.includes("COMPLETED")
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                    color: item.status.includes("APPROVED") || item.status.includes("COMPLETED")
                      ? "var(--accent-green)"
                      : "var(--accent-gold)",
                    border: "1px solid var(--satin-border)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {item.status}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteDeliverable(item.id)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", opacity: 0.6 }}
                  title="Delete Deliverable"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Add New Campaign Deliverable */}
      {showAddDeliverableModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowAddDeliverableModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "460px", width: "100%", padding: "28px", borderRadius: "20px", border: "1px solid var(--accent-purple)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--paper-soft)" }}>+ Add Campaign Deliverable</h3>
              <button onClick={() => setShowAddDeliverableModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddDeliverable} style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>DELIVERABLE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1x 4K Cinematic Reel (60s)"
                  value={newDeliverable.title}
                  onChange={(e) => setNewDeliverable({ ...newDeliverable, title: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>ESCROW PAYOUT (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={newDeliverable.payout}
                    onChange={(e) => setNewDeliverable({ ...newDeliverable, payout: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CREATOR ASSIGNED</label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvi Sharma"
                    value={newDeliverable.creator}
                    onChange={(e) => setNewDeliverable({ ...newDeliverable, creator: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-magnetic" style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-purple)", color: "#fff", fontWeight: 800 }}>
                SAVE DELIVERABLE ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
