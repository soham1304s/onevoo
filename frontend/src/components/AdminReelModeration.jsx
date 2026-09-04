import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function AdminReelModeration({ isOpen = true, onClose = null }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [reels, setReels] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState("PENDING"); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'
  const [selectedReel, setSelectedReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSafeZoneOverlay, setShowSafeZoneOverlay] = useState(true);

  const videoRef = useRef(null);

  const fetchAdminReels = async (targetFilter = filter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reels/admin?status=${targetFilter}`);
      const data = await res.json();
      if (data.reels) {
        setReels(data.reels);
        setCounts(data.counts || { total: 0, pending: 0, approved: 0, rejected: 0 });
        if (!selectedReel && data.reels.length > 0) {
          setSelectedReel(data.reels[0]);
        } else if (selectedReel) {
          const found = data.reels.find((r) => r.id === selectedReel.id);
          setSelectedReel(found || data.reels[0] || null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReels(filter);
  }, [filter]);

  // Handle Approve Reel
  const handleApprove = async (reelId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reels/${reelId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: user?.full_name || "Onevoo Editorial Admin" }),
      });
      const data = await res.json();
      if (data.success) {
        addNotification({
          title: "Reel Approved & Featured!",
          message: `Reel "${data.reel.title}" for ${data.reel.brand_name} is now live on Creator Stories & Hits!`,
          type: "reel_status",
          status: "APPROVED LIVE",
          badgeColor: "var(--accent-green)",
        });
        await fetchAdminReels(filter);
      }
    } catch (err) {
      console.error("Error approving reel:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject Reel (with exact required notification)
  const handleReject = async (reelId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reels/${reelId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: rejectionReason.trim() || "Vertical 9:16 safe-zone framing or brand brief compliance guidelines not met.",
          reviewerName: user?.full_name || "Onevoo Editorial Admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Exact user requirement message dispatch
        addNotification({
          title: "Reel Submission Not Approved",
          message: "your reel for featuring in the creator stories and gigs section not get approved by onevoo team.",
          type: "reel_status",
          status: "NOT APPROVED",
          badgeColor: "var(--accent-rose)",
        });
        setRejectModalOpen(false);
        setRejectionReason("");
        await fetchAdminReels(filter);
      }
    } catch (err) {
      console.error("Error rejecting reel:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Reel
  const handleDelete = async (reelId) => {
    if (!window.confirm("Are you sure you want to permanently delete this reel record?")) return;
    try {
      await fetch(`/api/reels/${reelId}`, { method: "DELETE" });
      await fetchAdminReels(filter);
      if (selectedReel?.id === reelId) setSelectedReel(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return { label: "FEATURED LIVE", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", color: "var(--accent-green)" };
      case "REJECTED":
        return { label: "NOT APPROVED", bg: "rgba(244, 63, 94, 0.15)", border: "rgba(244, 63, 94, 0.4)", color: "var(--accent-rose)" };
      default:
        return { label: "PENDING REVIEW", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", color: "var(--accent-gold)" };
    }
  };

  return (
    <div
      className="admin-moderation-desk"
      style={{
        background: "var(--satin-bg, #0b0b0f)",
        color: "var(--paper-soft, #f4f4f5)",
        borderRadius: "20px",
        border: "1px solid var(--satin-border, rgba(255,255,255,0.08))",
        boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          padding: "20px 28px",
          background: "linear-gradient(135deg, rgba(112, 37, 225, 0.18) 0%, rgba(12, 12, 18, 0.95) 100%)",
          borderBottom: "1px solid var(--satin-border, rgba(255,255,255,0.08))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--accent-purple, #7025e1), #4c1d95)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
              boxShadow: "0 0 20px rgba(112, 37, 225, 0.4)",
            }}
          >
            🛡️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="tech-label-mono" style={{ fontSize: "10px", color: "var(--accent-gold, #e2b842)" }}>
                ONEVOO EDITORIAL DESK
              </span>
              <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
            </div>
            <h2 className="disp-title-h2" style={{ margin: "2px 0 0", fontSize: "20px" }}>
              Brand Shoot Reel <em>Moderation Hub</em>
            </h2>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {[
            { key: "PENDING", label: `⏳ Pending (${counts.pending})` },
            { key: "APPROVED", label: `🟢 Approved (${counts.approved})` },
            { key: "REJECTED", label: `🔴 Discarded (${counts.rejected})` },
            { key: "ALL", label: `All (${counts.total})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className="mono"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 600,
                border: filter === tab.key ? "1px solid var(--accent-purple, #7025e1)" : "1px solid rgba(255,255,255,0.06)",
                background: filter === tab.key ? "rgba(112, 37, 225, 0.25)" : "rgba(255,255,255,0.03)",
                color: filter === tab.key ? "#fff" : "var(--text-muted, #94a3b8)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "12px",
                cursor: "pointer",
                marginLeft: "8px",
              }}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Queue on Left, 9:16 Video Player & Inspector on Right */}
      <div
        className="admin-reel-moderation-grid"
        style={{
          display: "grid",
          minHeight: "560px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Left Column: Submissions Queue List */}
        <div
          style={{
            borderRight: "1px solid var(--satin-border, rgba(255,255,255,0.08))",
            padding: "20px",
            maxHeight: "700px",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted, #94a3b8)" }}>
              QUEUE: {reels.length} SUBMISSIONS
            </span>
            <button
              type="button"
              onClick={() => fetchAdminReels(filter)}
              className="mono"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent-purple, #7025e1)",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              🔄 Refresh Queue
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }} className="mono">
              Loading submissions from Neon DB...
            </div>
          ) : reels.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <span style={{ fontSize: "36px", display: "block", marginBottom: "10px" }}>✨</span>
              <strong style={{ display: "block", color: "var(--paper-soft)", fontSize: "14px" }}>
                No submissions in {filter} queue
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                Creators submitting brand reels from the Showcase section will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reels.map((reel) => {
                const isSelected = selectedReel?.id === reel.id;
                const statusStyle = getStatusBadge(reel.status);

                return (
                  <div
                    key={reel.id}
                    onClick={() => setSelectedReel(reel)}
                    className="satin-card"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border: isSelected ? "1.5px solid var(--accent-gold, #e2b842)" : "1px solid rgba(255,255,255,0.06)",
                      background: isSelected ? "rgba(112, 37, 225, 0.12)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.2s ease",
                      boxShadow: isSelected ? "0 8px 24px rgba(0,0,0,0.5)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={reel.creator_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                          alt={reel.creator_name}
                          style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }}
                        />
                        <div>
                          <strong style={{ fontSize: "13px", color: "var(--paper-soft)", display: "block" }}>
                            {reel.creator_name}
                          </strong>
                          <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)" }}>
                            @{reel.creator_handle} • 📍 {reel.city?.split(",")[0]}
                          </span>
                        </div>
                      </div>

                      <span
                        className="mono"
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "99px",
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </div>

                    <div style={{ margin: "6px 0", fontSize: "12px", color: "var(--paper-soft)", fontWeight: 600 }}>
                      🎬 {reel.title}
                    </div>

                    <p style={{ margin: "0 0 8px", fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      "{reel.caption}"
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="mono">
                      <span style={{ fontSize: "10px", color: "var(--accent-purple)", fontWeight: 700 }}>
                        PARTNER: {reel.brand_name}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--accent-green)" }}>
                        🔒 {reel.payout_display}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: 9:16 Video Player, Safe-Zone QA & Moderation Controls */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", background: "rgba(0,0,0,0.2)" }}>
          {selectedReel ? (
            <>
              {/* Creator & Brand Banner */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)" }}>BRAND PARTNER:</span>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>{selectedReel.brand_name}</strong>
                  </div>
                  <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
                    {selectedReel.title}
                  </h3>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setShowSafeZoneOverlay(!showSafeZoneOverlay)}
                    className="mono"
                    style={{
                      fontSize: "10px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: showSafeZoneOverlay ? "rgba(112, 37, 225, 0.3)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(112, 37, 225, 0.5)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    📐 {showSafeZoneOverlay ? "Hide Safe-Zone" : "Show Safe-Zone"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="mono"
                    style={{
                      fontSize: "10px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
                </div>
              </div>

              {/* 9:16 Vertical Reel Player */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "280px",
                    height: "460px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    position: "relative",
                    background: "#000",
                    border: "2px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(112, 37, 225, 0.25)",
                  }}
                >
                  <video
                    ref={videoRef}
                    src={selectedReel.video_url}
                    poster={selectedReel.thumbnail_url}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Safe Zone Visual Overlays for Quality Assessment */}
                  {showSafeZoneOverlay && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        zIndex: 5,
                      }}
                    >
                      {/* Top Notch Danger Zone (15%) */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "15%",
                          background: "rgba(244, 63, 94, 0.12)",
                          borderBottom: "1px dashed rgba(244, 63, 94, 0.5)",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "2px 8px",
                        }}
                      >
                        <span className="mono" style={{ fontSize: "8px", color: "var(--accent-rose)" }}>
                          ⚠️ Notch/Status UI Area (15%)
                        </span>
                      </div>

                      {/* Bottom Controls Danger Zone (18%) */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "18%",
                          background: "rgba(244, 63, 94, 0.12)",
                          borderTop: "1px dashed rgba(244, 63, 94, 0.5)",
                          display: "flex",
                          alignItems: "flex-start",
                          padding: "2px 8px",
                        }}
                      >
                        <span className="mono" style={{ fontSize: "8px", color: "var(--accent-rose)" }}>
                          ⚠️ Meta/Caption Overlay Area (18%)
                        </span>
                      </div>

                      {/* Center Green Safe Zone */}
                      <div
                        style={{
                          position: "absolute",
                          top: "15%",
                          bottom: "18%",
                          left: "8%",
                          right: "8%",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          className="mono"
                          style={{
                            fontSize: "9px",
                            color: "var(--accent-green)",
                            background: "rgba(0,0,0,0.6)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          ✓ 9:16 SAFE ZONE PASS
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Vignette */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.85) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />

                  {/* Overlay Info Header */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      right: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      zIndex: 3,
                    }}
                  >
                    <img
                      src={selectedReel.creator_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                      alt={selectedReel.creator_name}
                      style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid #fff" }}
                    />
                    <span className="mono" style={{ fontSize: "10px", color: "#fff", fontWeight: 700 }}>
                      @{selectedReel.creator_handle}
                    </span>
                  </div>

                  {/* Overlay Info Footer */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      right: "10px",
                      zIndex: 3,
                    }}
                  >
                    <div className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)" }}>
                      🔒 {selectedReel.payout_display}
                    </div>
                    <div style={{ fontSize: "11px", color: "#fff", lineHeight: 1.2 }}>
                      {selectedReel.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Moderation Actions Bar */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "auto",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {selectedReel.status !== "APPROVED" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleApprove(selectedReel.id)}
                    className="btn-magnetic"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      fontSize: "12px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      borderColor: "#10b981",
                      color: "#fff",
                      cursor: "pointer",
                      justifyContent: "center",
                    }}
                  >
                    {actionLoading ? "Processing..." : "✓ APPROVE & FEATURE IN STORIES"}
                  </button>
                )}

                {selectedReel.status !== "REJECTED" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setRejectModalOpen(true)}
                    className="btn-magnetic"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      fontSize: "12px",
                      background: "rgba(244, 63, 94, 0.15)",
                      borderColor: "rgba(244, 63, 94, 0.4)",
                      color: "var(--accent-rose)",
                      cursor: "pointer",
                      justifyContent: "center",
                    }}
                  >
                    ✕ DISCARD / REJECT
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(selectedReel.id)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    borderRadius: "8px",
                    padding: "0 14px",
                    cursor: "pointer",
                  }}
                  title="Delete record"
                >
                  🗑️
                </button>
              </div>

              {/* Status Message or Rejection Note */}
              {selectedReel.status === "REJECTED" && selectedReel.rejection_reason && (
                <div
                  className="satin-card"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "rgba(244, 63, 94, 0.08)",
                    border: "1px solid rgba(244, 63, 94, 0.25)",
                    fontSize: "11px",
                    color: "var(--accent-rose)",
                  }}
                >
                  <strong>Rejection Note Delivered to Creator:</strong>
                  <p style={{ margin: "4px 0 0", color: "var(--paper-soft)" }}>
                    "your reel for featuring in the creator stories and gigs section not get approved by onevoo team. Note: {selectedReel.rejection_reason}"
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }} className="mono">
              Select a reel from the queue to inspect and moderate.
            </div>
          )}
        </div>
      </div>

      {/* Discard / Reject Reason Modal */}
      {rejectModalOpen && selectedReel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(10px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="satin-card"
            style={{
              maxWidth: "480px",
              width: "100%",
              padding: "28px",
              borderRadius: "18px",
              background: "#121218",
              border: "1px solid rgba(244, 63, 94, 0.4)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "24px" }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--paper-soft)" }}>
                Discard / Reject Reel Submission
              </h3>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.45, margin: "0 0 16px" }}>
              The creator <strong>@{selectedReel.creator_handle}</strong> will receive the official status notification:
              <br />
              <em style={{ color: "var(--accent-rose)", display: "block", marginTop: "6px" }}>
                "your reel for featuring in the creator stories and gigs section not get approved by onevoo team."
              </em>
            </p>

            <label className="mono" style={{ fontSize: "11px", color: "var(--paper-soft)", display: "block", marginBottom: "6px" }}>
              Reason or Editorial Feedback (Optional):
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Vertical 9:16 safe-zone framing or brand brief compliance guidelines not met."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                fontSize: "12px",
                boxSizing: "border-box",
                marginBottom: "20px",
                fontFamily: "inherit",
              }}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleReject(selectedReel.id)}
                className="btn-magnetic"
                style={{
                  background: "var(--accent-rose)",
                  borderColor: "var(--accent-rose)",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {actionLoading ? "Sending Notification..." : "Confirm & Discard Reel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
