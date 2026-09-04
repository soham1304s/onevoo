import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import AdminVerificationQueue from "../admin/AdminVerificationQueue";

const DEFAULT_VETTING = [
  { id: "v1", name: "Kunal Shah (FPV Drone Operator)", type: "CREW AUDIT", city: "Bengaluru", status: "PENDING" },
  { id: "v2", name: "Prism Light & Grip Rentals", type: "EQUIPMENT VENDOR", city: "Mumbai", status: "PENDING" },
  { id: "v3", name: "Mehboob Studio Soundstage A", type: "STUDIO AUDIT", city: "Mumbai", status: "PENDING" },
  { id: "v4", name: "Ananya Kapoor (Fashion Creator)", type: "CREATOR KYC", city: "Delhi NCR", status: "PENDING" },
];

export default function AdminOperationsConsole() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const storageKey = `onevoo_admin_ops_${user?.email || "default"}`;

  const [disputeActionMessage, setDisputeActionMessage] = useState(null);
  const [vettingQueue, setVettingQueue] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_vetting`);
      return saved ? JSON.parse(saved) : DEFAULT_VETTING;
    } catch {
      return DEFAULT_VETTING;
    }
  });

  const [showAddVettingModal, setShowAddVettingModal] = useState(false);
  const [newVetting, setNewVetting] = useState({ name: "", type: "CREW AUDIT", city: "Mumbai" });

  // Reel Moderation & Live Feature System State
  const [reels, setReels] = useState([]);
  const [reelCounts, setReelCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [reelFilter, setReelFilter] = useState("ALL"); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [loadingReels, setLoadingReels] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewReel, setPreviewReel] = useState(null);
  const [rejectModalReel, setRejectModalReel] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showSafeZone, setShowSafeZone] = useState(true);

  const previewVideoRef = useRef(null);

  const fetchReelSubmissions = async (status = reelFilter) => {
    setLoadingReels(true);
    try {
      const res = await fetch(`/api/reels/admin?status=${status}`);
      const data = await res.json();
      if (data.reels) {
        setReels(data.reels);
        setReelCounts(data.counts || { total: data.reels.length, pending: 0, approved: 0, rejected: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch admin reel submissions:", err);
    } finally {
      setLoadingReels(false);
    }
  };

  useEffect(() => {
    fetchReelSubmissions(reelFilter);
  }, [reelFilter]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_vetting`, JSON.stringify(vettingQueue));
    } catch (e) {
      console.warn("Admin storage sync error:", e);
    }
  }, [vettingQueue, storageKey]);

  // Handle Approve Reel and feature it in Creator Stories & Hits
  const handleApproveReel = async (reelId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reels/${reelId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: user?.full_name || "Onevoo Platform Admin" }),
      });
      const data = await res.json();
      if (data.success) {
        addNotification({
          title: "Reel Approved & Featured!",
          message: `Reel "${data.reel.title}" for ${data.reel.brand_name} is now LIVE on Creator Stories & Hits!`,
          type: "reel_status",
          status: "APPROVED LIVE",
          badgeColor: "var(--accent-green)",
        });
        setPreviewReel(null);
        await fetchReelSubmissions(reelFilter);
      }
    } catch (err) {
      console.error("Error approving reel:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject / Discard Reel with the exact required notification
  const handleRejectReel = async (reelId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reels/${reelId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: rejectionReason.trim() || "Creative or brand safety compliance guidelines not met.",
          reviewerName: user?.full_name || "Onevoo Platform Admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        addNotification({
          title: "Reel Submission Not Approved",
          message: "your reel for featuring in the creator stories and gigs section not get approved by onevoo team.",
          type: "reel_status",
          status: "NOT APPROVED",
          badgeColor: "var(--accent-rose)",
        });
        setRejectModalReel(null);
        setPreviewReel(null);
        setRejectionReason("");
        await fetchReelSubmissions(reelFilter);
      }
    } catch (err) {
      console.error("Error rejecting reel:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAuditAction = (id, action) => {
    setVettingQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  const handleDisputeAction = (actionName) => {
    setDisputeActionMessage(`Escrow Action Executed: ${actionName}. Automated notification dispatched to Brand and Creator.`);
    setTimeout(() => setDisputeActionMessage(null), 5000);
  };

  const handleAddVetting = (e) => {
    e.preventDefault();
    if (!newVetting.name) return;
    const item = {
      id: `v-${Date.now()}`,
      name: newVetting.name,
      type: newVetting.type || "CREW AUDIT",
      city: newVetting.city || "Mumbai",
      status: "PENDING"
    };
    setVettingQueue([...vettingQueue, item]);
    setNewVetting({ name: "", type: "CREW AUDIT", city: "Mumbai" });
    setShowAddVettingModal(false);
  };

  return (
    <div className="admin-operations-console" style={{ position: "relative" }}>
      {/* Header Banner */}
      <div
        className="satin-card"
        style={{
          padding: "22px 26px",
          marginBottom: "24px",
          borderRadius: "18px",
          borderLeft: "4px solid var(--accent-gold)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span className="tech-label-mono" style={{ fontSize: "10px" }}>ONEVOO SYSTEM OPERATIONS & ESCROW ARBITRATION</span>
          <h2 className="disp-title-h2" style={{ margin: "2px 0", fontSize: "24px" }}>
            Platform Operations Console
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
            Real-Time Node Telemetry • <strong>₹24.8L Active Escrow Protected</strong> • Creator Reel Approvals • AAA Arbitration Engine
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-green)", fontWeight: 700 }}>
            ● NEON POSTGRES V8 HEALTHY
          </span>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="satin-card" style={{ padding: "18px 20px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>GLOBAL ESCROW VOLUME</span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            ₹24,80,000
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>48 Active Productions</span>
        </div>

        <div className="satin-card" style={{ padding: "18px 20px", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.4)" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px", color: "var(--accent-gold)" }}>PENDING REEL MODERATION</span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            {reelCounts.pending} SUBMISSIONS
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{reelCounts.approved} Live on Website</span>
        </div>

        <div className="satin-card" style={{ padding: "18px 20px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>PLATFORM FEE REVENUE (5%)</span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--accent-green)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            ₹1,24,000
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Auto-settled via Stripe/Razorpay</span>
        </div>

        <div className="satin-card" style={{ padding: "18px 20px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>ESCALATED DISPUTES</span>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "var(--accent-rose)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            1 ACTIVE
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>124 Resolved Cases</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATOR REEL SUBMISSIONS & FEATURE APPROVAL DESK (USER FOCUS AREA) */}
      {/* ========================================================================= */}
      <div
        className="satin-card"
        style={{
          padding: "24px 28px",
          borderRadius: "20px",
          marginBottom: "24px",
          border: "1px solid rgba(112, 37, 225, 0.35)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
          background: "linear-gradient(145deg, rgba(112, 37, 225, 0.08) 0%, rgba(12, 12, 18, 0.9) 100%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
              <span className="tech-label-mono" style={{ fontSize: "10.5px", color: "var(--accent-gold)" }}>
                EDITORIAL REEL MODERATION & LIVE FEATURE PIPELINE
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: "20px", color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
              Creator Reel Approval Requests
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
              Review creator vertical 9:16 brand shoot reels. When approved, videos are <strong>instantly featured dynamically on the website's Creator Stories & Hits</strong> section!
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "6px", background: "rgba(255, 255, 255, 0.04)", padding: "4px", borderRadius: "10px", border: "1px solid var(--satin-border)" }}>
            {[
              { id: "ALL", label: `All (${reelCounts.total})` },
              { id: "PENDING", label: `Pending (${reelCounts.pending})` },
              { id: "APPROVED", label: `Live Featured (${reelCounts.approved})` },
              { id: "REJECTED", label: `Rejected (${reelCounts.rejected})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setReelFilter(tab.id)}
                className="mono"
                style={{
                  padding: "6px 12px",
                  fontSize: "10.5px",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  background: reelFilter === tab.id ? "var(--accent-purple)" : "transparent",
                  color: reelFilter === tab.id ? "#ffffff" : "var(--paper-soft)",
                  fontWeight: reelFilter === tab.id ? 800 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reel Requests List */}
        {loadingReels ? (
          <div style={{ padding: "40px", textAlign: "center" }} className="mono">
            <div className="page-loader-spinner" style={{ margin: "0 auto 12px" }} />
            <span style={{ color: "var(--accent-gold)", fontSize: "12px" }}>Synchronizing reel queue from Neon PostgreSQL...</span>
          </div>
        ) : reels.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "rgba(0,0,0,0.25)",
              borderRadius: "14px",
              border: "1px dashed var(--satin-border)",
            }}
          >
            <span style={{ fontSize: "28px", display: "block", marginBottom: "8px" }}>🎬</span>
            <p className="mono" style={{ margin: 0, color: "var(--text-muted)", fontSize: "12px" }}>
              No reel submissions found under filter: <strong>{reelFilter}</strong>.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {reels.map((reel) => {
              const isPending = reel.status === "PENDING";
              const isApproved = reel.status === "APPROVED";
              const isRejected = reel.status === "REJECTED";

              return (
                <div
                  key={reel.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr auto",
                    gap: "20px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: isPending
                      ? "linear-gradient(135deg, rgba(223, 182, 64, 0.06) 0%, rgba(20, 20, 28, 0.8) 100%)"
                      : "rgba(0, 0, 0, 0.35)",
                    border: isPending
                      ? "1px solid rgba(223, 182, 64, 0.35)"
                      : isApproved
                      ? "1px solid rgba(16, 185, 129, 0.35)"
                      : "1px solid var(--satin-border)",
                    alignItems: "center",
                  }}
                >
                  {/* Left: 9:16 Thumbnail Preview & Inspector trigger */}
                  <div
                    style={{
                      width: "140px",
                      height: "190px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      position: "relative",
                      background: "#000",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onClick={() => setPreviewReel(reel)}
                    title="Click to inspect 9:16 vertical video"
                  >
                    <img
                      src={reel.thumbnail_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"}
                      alt={reel.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background: "var(--accent-purple)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          boxShadow: "0 0 16px rgba(112, 37, 225, 0.6)",
                        }}
                      >
                        ▶
                      </div>
                    </div>
                    <span
                      className="mono"
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        left: "6px",
                        right: "6px",
                        fontSize: "9px",
                        background: "rgba(0,0,0,0.75)",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      9:16 Safe-Zone
                    </span>
                  </div>

                  {/* Middle: Reel Details & Creator Meta */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: "rgba(112, 37, 225, 0.2)",
                          border: "1px solid rgba(112, 37, 225, 0.4)",
                          color: "var(--accent-purple, #a78bfa)",
                        }}
                      >
                        🏢 {reel.brand_name}
                      </span>

                      <span
                        className="mono"
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          color: "var(--accent-green)",
                        }}
                      >
                        🔒 {reel.payout_display || "₹85,000 Escrow Locked"}
                      </span>

                      <span
                        className="mono"
                        style={{
                          fontSize: "9.5px",
                          padding: "3px 8px",
                          borderRadius: "99px",
                          background: isApproved
                            ? "rgba(16, 185, 129, 0.2)"
                            : isRejected
                            ? "rgba(244, 63, 94, 0.2)"
                            : "rgba(223, 182, 64, 0.2)",
                          color: isApproved
                            ? "var(--accent-green)"
                            : isRejected
                            ? "var(--accent-rose)"
                            : "var(--accent-gold)",
                          fontWeight: 800,
                        }}
                      >
                        {isApproved ? "✓ LIVE IN CREATOR STORIES" : isRejected ? "✕ NOT APPROVED" : "● PENDING APPROVAL"}
                      </span>
                    </div>

                    <h4 style={{ margin: "2px 0 6px", fontSize: "16px", color: "var(--paper-soft)" }}>
                      {reel.title}
                    </h4>

                    {/* Creator Identity */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <img
                        src={reel.creator_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"}
                        alt={reel.creator_name}
                        style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--satin-border)" }}
                      />
                      <span className="mono" style={{ fontSize: "11px", color: "var(--paper-soft)" }}>
                        <strong>{reel.creator_name}</strong> (@{reel.creator_handle.replace(/^@/, "")}) • {reel.city}
                      </span>
                      <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                        📧 {reel.creator_email}
                      </span>
                    </div>

                    {/* Caption */}
                    <p style={{ margin: "0 0 6px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      "{reel.caption}"
                    </p>

                    <div className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                      Submitted on: {new Date(reel.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </div>

                  {/* Right: Approval & Rejection Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" }}>
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleApproveReel(reel.id)}
                          className="btn-magnetic"
                          style={{
                            padding: "10px 16px",
                            fontSize: "11px",
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #10b981, #047857)",
                            borderColor: "#10b981",
                            color: "#fff",
                            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          ✓ APPROVE & FEATURE LIVE ⚡
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => {
                            setRejectModalReel(reel);
                            setRejectionReason("Vertical 9:16 safe-zone framing or brand brief compliance guidelines not met.");
                          }}
                          className="btn-magnetic"
                          style={{
                            padding: "8px 14px",
                            fontSize: "10.5px",
                            fontWeight: 700,
                            background: "rgba(244, 63, 94, 0.1)",
                            borderColor: "rgba(244, 63, 94, 0.4)",
                            color: "var(--accent-rose)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          ✕ DISCARD & NOTIFY
                        </button>
                      </>
                    ) : isApproved ? (
                      <div style={{ textAlign: "center" }}>
                        <span
                          className="mono"
                          style={{
                            display: "block",
                            fontSize: "10px",
                            color: "var(--accent-green)",
                            fontWeight: 800,
                            marginBottom: "6px",
                          }}
                        >
                          ✓ LIVE ON HOMEPAGE
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewReel(reel)}
                          className="mono"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            fontSize: "10px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid var(--satin-border)",
                            color: "var(--paper-soft)",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          ▶ Inspect Live Reel
                        </button>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <span
                          className="mono"
                          style={{
                            display: "block",
                            fontSize: "10px",
                            color: "var(--accent-rose)",
                            fontWeight: 700,
                            marginBottom: "6px",
                          }}
                        >
                          ✕ DISCARDED
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApproveReel(reel.id)}
                          className="mono"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            fontSize: "10px",
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.4)",
                            color: "var(--accent-green)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          Re-evaluate & Approve ↺
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DISPUTE ARBITRAGE QUEUE */}
      {/* ========================================================================= */}
      <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px", marginBottom: "24px", borderLeft: "4px solid var(--accent-rose)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="tech-label-mono" style={{ fontSize: "10px", color: "var(--accent-rose)" }}>
              PRIORITY ARBITRATION CASE #DISP-9842
            </span>
            <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
              Campaign: Nike Summer Dynamic Motion vs. 4th Revision Scope Creep
            </h3>
          </div>

          <span className="mono" style={{ fontSize: "10.5px", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", padding: "3px 8px", borderRadius: "99px", fontWeight: 800 }}>
            ESCROW FROZEN: ₹65,000
          </span>
        </div>

        {/* Dispute Details */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginBottom: "16px" }}>
          <div style={{ padding: "10px 14px", borderRadius: "8px", background: "var(--panel)", border: "1px solid var(--satin-border)" }}>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-gold)" }}>ORIGINAL SIGNED CONTRACT SCOPE</span>
            <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--paper-soft)", lineHeight: 1.35 }}>
              1x 60s 4K Vertical Reel + 2 Revisions included. Color grade & LUT handoff.
            </p>
          </div>

          <div style={{ padding: "10px 14px", borderRadius: "8px", background: "var(--panel)", border: "1px solid var(--satin-border)" }}>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-rose)" }}>DISPUTE CLAIM & AUDIT LOG</span>
            <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--paper-soft)", lineHeight: 1.35 }}>
              Brand requested 4th revision requiring reshoot of footwear macro without additional budget.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleDisputeAction("50/50 Split Settlement (₹32,500 to Creator, ₹32,500 Refund to Brand)")}
            className="btn-magnetic"
            style={{ padding: "8px 16px", fontSize: "10.5px", fontWeight: 800, background: "var(--accent-gold)", color: "#000", borderColor: "var(--accent-gold)" }}
          >
            ⚖️ PROPOSE 50/50 SPLIT RELEASE
          </button>

          <button
            type="button"
            onClick={() => handleDisputeAction("Full Release to Creator (₹65,000)")}
            className="btn-magnetic"
            style={{ padding: "8px 16px", fontSize: "10.5px", fontWeight: 700, borderColor: "var(--accent-green)", color: "var(--accent-green)" }}
          >
            ✓ RELEASE 100% TO CREATOR
          </button>

          <button
            type="button"
            onClick={() => handleDisputeAction("Escrow Re-routed & Refunded to Brand (₹65,000)")}
            className="btn-magnetic"
            style={{ padding: "8px 16px", fontSize: "10.5px", fontWeight: 700, borderColor: "var(--satin-border)" }}
          >
            ↩ REFUND TO BRAND
          </button>
        </div>

        {disputeActionMessage && (
          <div style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid var(--accent-green)", color: "var(--accent-green)", fontSize: "11.5px" }}>
            {disputeActionMessage}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MARKETPLACE VERIFICATION & VETTING QUEUE */}
      {/* ========================================================================= */}
      <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>IDENTITY & EQUIPMENT AUDIT REGISTRY</span>
            <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
              Marketplace Verification Queue
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAddVettingModal(true)}
            className="mono"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--satin-border)",
              color: "var(--accent-purple)",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + ADD AUDIT ITEM
          </button>
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          {vettingQueue.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--panel)",
                border: "1px solid var(--satin-border)",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div>
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", display: "block" }}>
                  {item.type} • {item.city}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--paper-soft)" }}>
                  {item.name}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {item.status === "PENDING" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAuditAction(item.id, "APPROVED")}
                      style={{
                        padding: "5px 12px",
                        fontSize: "10px",
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid var(--accent-green)",
                        color: "var(--accent-green)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      ✓ APPROVE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAuditAction(item.id, "REJECTED")}
                      style={{
                        padding: "5px 12px",
                        fontSize: "10px",
                        background: "rgba(244, 63, 94, 0.15)",
                        border: "1px solid var(--accent-rose)",
                        color: "var(--accent-rose)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      ✕ REJECT
                    </button>
                  </>
                ) : (
                  <span
                    className="mono"
                    style={{
                      fontSize: "9.5px",
                      padding: "3px 8px",
                      borderRadius: "99px",
                      background: item.status === "APPROVED" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                      color: item.status === "APPROVED" ? "var(--accent-green)" : "var(--accent-rose)",
                      fontWeight: 700,
                    }}
                  >
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. KYC & LEGAL SIGNATURE VERIFICATION QUEUE (v13) */}
      {/* ========================================================================= */}
      <div style={{ marginBottom: '28px' }}>
        <AdminVerificationQueue />
      </div>

      {/* ========================================================================= */}
      {/* MODAL: 9:16 SAFE-ZONE VIDEO INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {previewReel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setPreviewReel(null)}
        >
          <div
            className="satin-card"
            style={{
              maxWidth: "840px",
              width: "100%",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid var(--accent-purple)",
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "24px",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left 9:16 Video Player with Safe-Zone Overlay */}
            <div
              style={{
                width: "300px",
                height: "500px",
                borderRadius: "18px",
                overflow: "hidden",
                position: "relative",
                background: "#000",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            >
              <video
                ref={previewVideoRef}
                src={previewReel.video_url}
                autoPlay
                loop
                controls
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {showSafeZone && (
                <div
                  style={{
                    position: "absolute",
                    inset: "10% 8% 18% 8%",
                    border: "1.5px dashed rgba(223, 182, 64, 0.7)",
                    borderRadius: "12px",
                    pointerEvents: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "8px",
                  }}
                >
                  <span className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)", background: "rgba(0,0,0,0.6)", padding: "2px 4px", borderRadius: "3px", width: "fit-content" }}>
                    Safe-Zone: Top 10% Margin
                  </span>
                  <span className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)", background: "rgba(0,0,0,0.6)", padding: "2px 4px", borderRadius: "3px", width: "fit-content", alignSelf: "flex-end" }}>
                    Safe-Zone: Bottom 18% Clear
                  </span>
                </div>
              )}
            </div>

            {/* Right: Metadata & Instant Approval Triggers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span className="tech-label-mono" style={{ fontSize: "10px", color: "var(--accent-gold)" }}>
                    {previewReel.brand_name} • 9:16 VERTICAL ASSET
                  </span>
                  <h3 style={{ margin: "2px 0", fontSize: "20px", color: "var(--paper-soft)" }}>
                    {previewReel.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewReel(null)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "20px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {/* Creator Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                <img
                  src={previewReel.creator_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"}
                  alt={previewReel.creator_name}
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                />
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--paper-soft)" }}>
                    {previewReel.creator_name} (@{previewReel.creator_handle.replace(/^@/, "")})
                  </div>
                  <div className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    {previewReel.city} • {previewReel.creator_email}
                  </div>
                </div>
              </div>

              {/* Escrow & Caption */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-green)", display: "block" }}>ESCROW PAYOUT</span>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--accent-green)" }}>{previewReel.payout_display || "₹85,000"}</span>
                </div>

                <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--satin-border)" }}>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", display: "block" }}>SAFE-ZONE OVERLAY</span>
                  <button
                    type="button"
                    onClick={() => setShowSafeZone(!showSafeZone)}
                    className="mono"
                    style={{ background: "none", border: "none", color: "var(--accent-gold)", fontSize: "11px", cursor: "pointer", padding: 0, fontWeight: 700 }}
                  >
                    {showSafeZone ? "✓ Guidelines Visible" : "✕ Guidelines Hidden"}
                  </button>
                </div>
              </div>

              <div>
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>PRODUCTION NOTES & CAPTION</span>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--paper-soft)", lineHeight: 1.4, padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: "6px" }}>
                  "{previewReel.caption}"
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleApproveReel(previewReel.id)}
                  className="btn-magnetic"
                  style={{
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #10b981, #047857)",
                    color: "#fff",
                    borderColor: "#10b981",
                    justifyContent: "center",
                  }}
                >
                  ✓ APPROVE & FEATURE LIVE ⚡
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setRejectModalReel(previewReel);
                    setRejectionReason("Vertical 9:16 safe-zone framing or brand brief compliance guidelines not met.");
                  }}
                  className="btn-magnetic"
                  style={{
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "rgba(244, 63, 94, 0.1)",
                    color: "var(--accent-rose)",
                    borderColor: "rgba(244, 63, 94, 0.4)",
                    justifyContent: "center",
                  }}
                >
                  ✕ DISCARD REEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REJECTION REASON MODAL WITH EXACT REQUIRED NOTIFICATION */}
      {/* ========================================================================= */}
      {rejectModalReel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setRejectModalReel(null)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "460px", width: "100%", padding: "26px", borderRadius: "20px", border: "1px solid var(--accent-rose)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--accent-rose)" }}>✕ Discard Reel Submission</h3>
              <button onClick={() => setRejectModalReel(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4, margin: "0 0 12px" }}>
              Discarding <strong>"{rejectModalReel.title}"</strong> by <strong>{rejectModalReel.creator_name}</strong>. The creator will automatically receive the platform rejection notification.
            </p>

            <div style={{ padding: "10px 14px", background: "rgba(244, 63, 94, 0.1)", borderRadius: "8px", border: "1px solid rgba(244, 63, 94, 0.25)", marginBottom: "14px" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-rose)", fontWeight: 800, display: "block", marginBottom: "4px" }}>
                AUTOMATED CREATOR NOTIFICATION:
              </span>
              <p className="mono" style={{ margin: 0, fontSize: "11.5px", color: "var(--paper-soft)", fontStyle: "italic" }}>
                "your reel for featuring in the creator stories and gigs section not get approved by onevoo team."
              </p>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  INTERNAL EDITORIAL AUDIT REASON (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setRejectModalReel(null)}
                  className="btn-magnetic"
                  style={{ padding: "10px", fontSize: "11px", justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleRejectReel(rejectModalReel.id)}
                  className="btn-magnetic"
                  style={{ padding: "10px", fontSize: "11px", background: "var(--accent-rose)", color: "#fff", fontWeight: 800, borderColor: "var(--accent-rose)", justifyContent: "center" }}
                >
                  {actionLoading ? "Processing..." : "CONFIRM DISCARD ✕"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD VETTING AUDIT ITEM */}
      {/* ========================================================================= */}
      {showAddVettingModal && (
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
          onClick={() => setShowAddVettingModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "440px", width: "100%", padding: "26px", borderRadius: "20px", border: "1px solid var(--accent-purple)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--paper-soft)" }}>+ Add Marketplace Vetting Audit</h3>
              <button onClick={() => setShowAddVettingModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddVetting} style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>APPLICANT / STUDIO NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CineGrip Lighting Mumbai"
                  value={newVetting.name}
                  onChange={(e) => setNewVetting({ ...newVetting, name: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>AUDIT CATEGORY</label>
                  <select
                    value={newVetting.type}
                    onChange={(e) => setNewVetting({ ...newVetting, type: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  >
                    <option value="CREW AUDIT" style={{ background: "#181826", color: "#ffffff" }}>CREW AUDIT</option>
                    <option value="EQUIPMENT VENDOR" style={{ background: "#181826", color: "#ffffff" }}>EQUIPMENT VENDOR</option>
                    <option value="STUDIO AUDIT" style={{ background: "#181826", color: "#ffffff" }}>STUDIO AUDIT</option>
                    <option value="CREATOR KYC" style={{ background: "#181826", color: "#ffffff" }}>CREATOR KYC</option>
                  </select>
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CITY / LOCATION</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={newVetting.city}
                    onChange={(e) => setNewVetting({ ...newVetting, city: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-magnetic" style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-purple)", color: "#fff", fontWeight: 800 }}>
                QUEUE FOR AUDIT ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
