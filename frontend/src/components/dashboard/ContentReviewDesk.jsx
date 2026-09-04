import React, { useState } from "react";

export const ContentReviewDesk = ({
  currentVersion = "V2",
  draftUrl = "https://assets.mixkit.co/videos/preview/mixkit-vertical-portrait-of-a-fashion-model-in-studio-41315-large.mp4",
  campaignTitle = "Nike Summer Dynamic Motion Campaign",
  onApprove,
  onRequestChanges,
}) => {
  const [comment, setComment] = useState("");
  const [safeZoneGrid, setSafeZoneGrid] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [activeVersion, setActiveVersion] = useState("V2");
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([
    {
      version: "V1",
      author: "Nike Brand Creative Director",
      time: "Sep 01 • 14:30",
      text: "Color grade in second scene feels slightly dark on mobile screens. Increase contrast and boost mid-tones by +10%.",
      status: "RESOLVED IN V2",
    },
    {
      version: "V2 Draft",
      author: "Nike Brand Manager",
      time: "Sep 02 • 18:45",
      text: "Motion track on footwear logo looks sharp. Safe-zone verified.",
      status: "CURRENT DRAFT",
    },
  ]);

  const handleSendFeedback = () => {
    if (!comment.trim()) return;
    const newEntry = {
      version: activeVersion,
      author: "Brand Reviewer",
      time: "Just now",
      text: comment,
      status: "ACTION REQUIRED",
    };
    setFeedbackHistory([newEntry, ...feedbackHistory]);
    if (onRequestChanges) onRequestChanges(comment);
    setComment("");
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove();
    } else {
      alert("Asset approved! Milestone escrow payout of ₹65,000 has been released to the creator.");
    }
  };

  return (
    <div className="satin-card" style={{ padding: "28px", borderRadius: "20px", position: "relative" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
          borderBottom: "1px solid var(--satin-border)",
          paddingBottom: "16px",
        }}
      >
        <div>
          <span className="tech-label-mono" style={{ fontSize: "10px" }}>ASSET QUALITY CONTROL & REVIEW DESK</span>
          <h3 className="disp-title-h2" style={{ margin: "4px 0 0", fontSize: "22px", textTransform: "uppercase" }}>
            {campaignTitle}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {["V1 Raw", "V2 Draft", "Final Master"].map((ver) => {
            const isCur = ver.startsWith(activeVersion);
            return (
              <button
                key={ver}
                type="button"
                onClick={() => setActiveVersion(ver.split(" ")[0])}
                className="mono"
                style={{
                  padding: "5px 12px",
                  borderRadius: "99px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: isCur ? "rgba(112, 37, 225, 0.3)" : "rgba(255, 255, 255, 0.04)",
                  border: isCur ? "1px solid var(--accent-purple)" : "1px solid var(--satin-border)",
                  color: isCur ? "#fff" : "var(--text-muted)",
                }}
              >
                {ver} {isCur && "●"}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Video Player Frame with Safe Zone */}
        <div>
          <div
            style={{
              background: "#000",
              borderRadius: "16px",
              border: "1px solid var(--satin-border)",
              position: "relative",
              overflow: "hidden",
              height: aspectRatio === "9:16" ? "480px" : "320px",
              maxWidth: aspectRatio === "9:16" ? "280px" : "100%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              src={draftUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Safe Zone Grid Overlay */}
            {safeZoneGrid && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "16px",
                  border: "1px dashed rgba(223, 182, 64, 0.4)",
                  margin: "8px",
                  borderRadius: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: "9px", background: "rgba(0,0,0,0.7)", color: "var(--accent-gold)", padding: "2px 6px", borderRadius: "4px" }}>
                    TOP 15% SAFE ZONE
                  </span>
                  <span className="mono" style={{ fontSize: "9px", background: "rgba(0,0,0,0.7)", color: "var(--accent-green)", padding: "2px 6px", borderRadius: "4px" }}>
                    4K • 60 FPS
                  </span>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span className="mono" style={{ fontSize: "9px", background: "rgba(0,0,0,0.8)", color: "#fff", padding: "2px 8px", borderRadius: "4px" }}>
                    PRIMARY ACTION CENTER
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: "9px", background: "rgba(0,0,0,0.7)", color: "var(--accent-cyan)", padding: "2px 6px", borderRadius: "4px" }}>
                    BOTTOM CAPTION BUFFER
                  </span>
                  <span className="mono" style={{ fontSize: "9px", background: "rgba(0,0,0,0.7)", color: "var(--accent-gold)", padding: "2px 6px", borderRadius: "4px" }}>
                    WCAG 4.5:1 PASS
                  </span>
                </div>
              </div>
            )}

            {/* Top Toolbar Controls */}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                right: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <button
                type="button"
                onClick={() => setSafeZoneGrid(!safeZoneGrid)}
                className="mono"
                style={{
                  background: "rgba(0, 0, 0, 0.75)",
                  border: "1px solid var(--satin-border)",
                  color: safeZoneGrid ? "var(--accent-gold)" : "var(--text-muted)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "9px",
                  cursor: "pointer",
                }}
              >
                {safeZoneGrid ? "GRID: ON" : "GRID: OFF"}
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio(aspectRatio === "9:16" ? "16:9" : "9:16")}
                className="mono"
                style={{
                  background: "rgba(0, 0, 0, 0.75)",
                  border: "1px solid var(--satin-border)",
                  color: "var(--paper-soft)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "9px",
                  cursor: "pointer",
                }}
              >
                RATIO: {aspectRatio}
              </button>
            </div>
          </div>
        </div>

        {/* Action Panel & Revision Ledger */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--paper-soft)" }}>
                Revision & Approval Ledger
              </h4>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-cyan)" }}>
                IMMUTABLE AUDIT LOG
              </span>
            </div>

            {/* Feedback History Cards */}
            <div style={{ display: "grid", gap: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "16px", paddingRight: "4px" }}>
              {feedbackHistory.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "var(--panel)",
                    border: "1px solid var(--satin-border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>
                      [{item.version}] {item.author}
                    </span>
                    <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)" }}>{item.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "11.5px", color: "var(--paper-soft)", lineHeight: 1.35 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment Box */}
            <textarea
              className="mono"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave specific timecode feedback (e.g., at 0:14 brighten highlights)..."
              style={{
                width: "100%",
                background: "var(--panel)",
                border: "1px solid var(--satin-border)",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "12px",
                color: "var(--paper-soft)",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                marginBottom: "12px",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <button
              type="button"
              onClick={handleSendFeedback}
              className="btn-magnetic"
              style={{
                padding: "12px",
                fontSize: "11px",
                fontWeight: 700,
                textAlign: "center",
                borderColor: "var(--satin-border)",
              }}
            >
              REQUEST REVISION
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="btn-magnetic"
              style={{
                padding: "12px",
                fontSize: "11px",
                fontWeight: 800,
                textAlign: "center",
                background: "var(--accent-gold)",
                color: "#000",
                borderColor: "var(--accent-gold)",
              }}
            >
              ✓ APPROVE ASSET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentReviewDesk;
