import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const MAX_FILE_SIZE = 200 * 1024 * 1024;

const FLOW_STAGES = [
  {
    step: "01",
    title: "Brand Brief & Escrow Lock",
    desc: "Brands submit structured briefs with 100% funding deposited in legal digital escrow before matching begins.",
    icon: "🔒",
    metric: "100% Budget Guaranteed",
  },
  {
    step: "02",
    title: "AI Match & Instant Contract",
    desc: "Creators matched by niche reach & reliability scores. Standardized legally-binding agreements signed in 1 click.",
    icon: "📜",
    metric: "0 Legal Ambiguity",
  },
  {
    step: "03",
    title: "Production & Safe-Zone QA",
    desc: "Crew & studio logistics solver paired with automated 9:16 vertical OCR safe-zone compliance transcoding.",
    icon: "🎬",
    metric: "Max 2 Revision Rounds",
  },
  {
    step: "04",
    title: "Instant Tax & Bank Settlement",
    desc: "Section 194J TDS (10%) & GST input credit calculated automatically with instant direct bank disbursement.",
    icon: "⚡",
    metric: "<24h Payout Release",
  },
];

function UploadPanel() {
  const inputRef = useRef(null);
  const { user, profile, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [note, setNote] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStageText, setUploadStageText] = useState("");

  // Form details for the brand shoot reel
  const [brandName, setBrandName] = useState("Starbucks Reserve India");
  const [title, setTitle] = useState("Cold Brew Slow Extraction ASMR");
  const [city, setCity] = useState("Mumbai, Maharashtra");
  const [payoutDisplay, setPayoutDisplay] = useState("₹95,000 Escrow Locked");
  const [caption, setCaption] = useState(
    "Booked my 4K content shoot in Bandra with a certified DP via Onevoo! Payout already escrowed 📸✨"
  );
  const [creatorName, setCreatorName] = useState(user?.full_name || "Verified Creator");
  const [creatorHandle, setCreatorHandle] = useState(profile?.handle || "@creator");
  const [creatorEmail, setCreatorEmail] = useState(user?.email || "creator@onevoo.com");

  // Custom Video Thumbnail / Cover Poster states
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState("");

  // User submissions modal / drawer
  const [mySubmissionsOpen, setMySubmissionsOpen] = useState(false);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // v9 Addition: Interactive Safe-Zone Preview Platform Overlay (IG Reels, TikTok, YouTube Shorts, Margins)
  const [safeZonePlatform, setSafeZonePlatform] = useState("INSTAGRAM");

  useEffect(() => {
    if (user?.full_name) setCreatorName(user.full_name);
    if (user?.email) setCreatorEmail(user.email);
    if (profile?.handle) setCreatorHandle(profile.handle);
    if (profile?.city) setCity(`${profile.city}, India`);
  }, [user, profile]);

  const selectFile = (candidate) => {
    if (!candidate) return;
    const extension = candidate.name.split(".").pop()?.toLowerCase();
    if (!["mp4", "mov", "webm"].includes(extension)) {
      return setNote("Please select an MP4, MOV, or WebM vertical video format.");
    }
    if (candidate.size > MAX_FILE_SIZE) {
      return setNote("Video exceeds the 200 MB portfolio showcase limit.");
    }

    setFile(candidate);
    const url = URL.createObjectURL(candidate);
    setPreviewUrl(url);
    setUploadSuccess(false);
    setNote("✓ 9:16 Vertical Reel loaded. Fill shoot details & submit for Admin approval.");
  };

  const selectThumbnailFile = (candidate) => {
    if (!candidate) return;
    if (!candidate.type.startsWith("image/")) {
      return setNote("Please select a valid JPG, PNG, or WebP image for the thumbnail.");
    }
    setThumbnailFile(candidate);
    const url = URL.createObjectURL(candidate);
    setThumbnailPreviewUrl(url);
    setNote("✓ Custom 9:16 Video Thumbnail loaded.");
  };

  const fetchMySubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const emailQuery = creatorEmail ? `?email=${encodeURIComponent(creatorEmail)}` : "";
      const res = await fetch(`/api/reels/my-submissions${emailQuery}`);
      const data = await res.json();
      if (data.submissions) {
        setMySubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Error fetching my submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSubmitReel = async (e) => {
    e?.preventDefault();

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStageText("Transcoding safe-zone 9:16 vertical stream...");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("video", file);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else if (customThumbnailUrl) {
        formData.append("customThumbnailUrl", customThumbnailUrl);
      }
      formData.append("brandName", brandName.trim() || "Brand Partner");
      formData.append("title", title);
      formData.append("city", city);
      formData.append("payoutDisplay", payoutDisplay);
      formData.append("caption", caption);
      formData.append("creatorName", creatorName);
      formData.append("creatorHandle", creatorHandle);
      formData.append("creatorEmail", creatorEmail);
      if (user?.id) formData.append("userId", user.id);
      if (user?.avatar_url || profile?.avatar_url) {
        formData.append("creatorAvatar", user?.avatar_url || profile?.avatar_url);
      }

      // Simulate progress updates
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 45) {
            setUploadStageText("Uploading to Cloudinary Media CDN...");
            return prev + 15;
          }
          if (prev < 85) {
            setUploadStageText("Staging for Onevoo Admin review & Creator Stories...");
            return prev + 10;
          }
          return prev;
        });
      }, 400);

      const res = await fetch("/api/reels/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);
      setUploadStageText("✓ Upload Complete!");

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadSuccess(true);
        setNote("🎉 Reel submitted! Onevoo Admin team will review it for Creator Stories & Hits.");

        // Push real-time in-app notification
        addNotification({
          title: "Reel Submitted for Admin Review",
          message: `Your brand shoot reel for ${brandName || "Brand Partner"} is now queued for editorial review.`,
          type: "submission",
          status: "QUEUED",
          badgeColor: "var(--accent-gold)",
        });

        // Reset file after 2.5s
        setTimeout(() => {
          setFile(null);
          setPreviewUrl(null);
          setThumbnailFile(null);
          setThumbnailPreviewUrl(null);
          setIsUploading(false);
          setUploadProgress(0);
        }, 2500);
      } else {
        throw new Error(data.error || "Failed to submit reel.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setIsUploading(false);
      setNote(`Upload error: ${err.message}`);
    }
  };

  // Sign In Required Gate for Non-Authenticated Users
  if (!isAuthenticated) {
    return (
      <div
        className="collab-upload satin-card collab-upload-gate"
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div className="collab-upload-gate-inner">
          <div className="collab-upload-gate-badge">
            <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px", flexShrink: 0 }} />
            <span className="tech-label-mono collab-upload-gate-badge-text">
              AUTHENTICATION REQUIRED TO SUBMIT REELS
            </span>
          </div>

          <h3 className="disp-title-h2 collab-upload-gate-title">
            SIGN IN TO SUBMIT YOUR <br className="mobile-br" /><em>9:16 BRAND REEL.</em>
          </h3>

          <p className="collab-upload-gate-desc">
            To protect brand partner briefs and enable automated digital escrow settlements, creators must sign in before submitting portfolio videos. Approved reels are featured dynamically in the <strong>Creator Stories & Hits</strong> carousel!
          </p>

          <div className="collab-upload-gate-chips">
            {["✓ Verified Creator ID", "✓ Automatic Safe-Zone Transcoding", "✓ Protected Escrow Payouts", "✓ Editorial Admin Review"].map((chip, i) => (
              <span
                key={i}
                className="collab-chip mono"
              >
                {chip}
              </span>
            ))}
          </div>

          <Link
            to="/auth"
            className="btn-magnetic collab-upload-gate-btn"
          >
            SIGN IN / JOIN ONEVOO TO SUBMIT REEL ↗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="collab-upload satin-card"
      aria-labelledby="video-upload-title"
      style={{
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Left Column: Explanatory Copy & Quick Actions */}
      <div className="upload-copy">
        <div className="collab-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
            <span className="tech-label-mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>
              CREATOR PORTFOLIO SPOTLIGHT
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              fetchMySubmissions();
              setMySubmissionsOpen(true);
            }}
            className="mono collab-status-btn"
            style={{
              background: "rgba(112, 37, 225, 0.15)",
              border: "1px solid rgba(112, 37, 225, 0.35)",
              color: "var(--accent-purple, #a78bfa)",
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📋 My Submissions Status
          </button>
        </div>

        <h3 id="video-upload-title" className="disp-title-h2" style={{ margin: "4px 0 12px" }}>
          SHOWCASE YOUR BEST <em>9:16 REEL WORK.</em>
        </h3>

        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.55, margin: "0 0 20px", wordBreak: "break-word" }}>
          Upload your signature short-video reel, food ASMR, or lifestyle campaign. Onevoo’s AI matching engine evaluates your editing tempo, color grading, and voiceover clarity to pair you directly with premium brand briefs. Approved reels are featured dynamically in the <strong>Creator Stories & Hits</strong> section!
        </p>

        <div className="collab-chips-row">
          {["9:16 Vertical Ready", "Automatic Safe-Zone QA", "Brand-Fit Matching", "Direct Escrow Access"].map((chip, i) => (
            <span
              key={i}
              className="collab-chip mono"
            >
              ✓ {chip}
            </span>
          ))}
        </div>

        {/* Shoot Metadata Form (Always accessible to signed-in creator) */}
        <form
          onSubmit={handleSubmitReel}
          className="reel-upload-form"
        >
          <div className="reel-upload-fields-grid">
            <div>
              <label className="mono reel-form-label" style={{ fontSize: "10px", display: "block", marginBottom: "4px" }}>
                BRAND PARTNER / SHOOT (FILL IN THE BLANK)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Starbucks Reserve India, Nykaa, Nike..."
                className="reel-form-input"
                required
              />
            </div>

            <div>
              <label className="mono reel-form-label" style={{ fontSize: "10px", display: "block", marginBottom: "4px" }}>
                REEL HEADLINE / THEME
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cold Brew Slow Extraction ASMR"
                className="reel-form-input"
                required
              />
            </div>
          </div>

          {/* Custom Video Thumbnail Upload Section */}
          <div className="reel-thumbnail-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>
                🖼️ VIDEO THUMBNAIL / COVER POSTER (CUSTOMIZE COVER)
              </label>
              {thumbnailPreviewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailFile(null);
                    setThumbnailPreviewUrl(null);
                    setCustomThumbnailUrl("");
                  }}
                  className="mono"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--accent-rose)",
                    fontSize: "9.5px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  ✕ Clear Thumbnail
                </button>
              )}
            </div>

            <div className="thumbnail-upload-row">
              {thumbnailPreviewUrl ? (
                <div
                  style={{
                    position: "relative",
                    width: "56px",
                    height: "80px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: "1.5px solid var(--accent-gold)",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Thumbnail preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <label
                  htmlFor="thumbnail-input-file"
                  className="btn-magnetic mono"
                  style={{
                    padding: "8px 12px",
                    fontSize: "10px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid rgba(223, 182, 64, 0.5)",
                    color: "var(--accent-gold)",
                    background: "rgba(223, 182, 64, 0.12)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    flexShrink: 0,
                  }}
                >
                  📁 UPLOAD COVER
                  <input
                    id="thumbnail-input-file"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => selectThumbnailFile(e.target.files[0])}
                  />
                </label>
              )}

              <div style={{ flex: 1, width: "100%", minWidth: 0 }}>
                <input
                  type="text"
                  value={customThumbnailUrl}
                  onChange={(e) => {
                    setCustomThumbnailUrl(e.target.value);
                    if (e.target.value && !thumbnailFile) {
                      setThumbnailPreviewUrl(e.target.value);
                    }
                  }}
                  placeholder="Or paste cover image URL (e.g. Unsplash, CDN...)"
                  className="reel-form-input"
                />
                <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  {thumbnailFile ? `Selected: ${thumbnailFile.name}` : "Upload an image or URL to ensure unique visual identity in Creator Stories."}
                </span>
              </div>
            </div>
          </div>

          <div className="reel-upload-fields-grid">
            <div>
              <label className="mono reel-form-label" style={{ fontSize: "10px", display: "block", marginBottom: "4px" }}>
                LOCATION / CITY
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="reel-form-input"
              />
            </div>

            <div>
              <label className="mono reel-form-label" style={{ fontSize: "10px", color: "var(--accent-green)", display: "block", marginBottom: "4px" }}>
                CAMPAIGN ESCROW PAYOUT
              </label>
              <input
                type="text"
                value={payoutDisplay}
                onChange={(e) => setPayoutDisplay(e.target.value)}
                placeholder="e.g. ₹85,000 Escrow Locked"
                className="reel-form-input"
              />
            </div>
          </div>

          <div>
            <label className="mono reel-form-label" style={{ fontSize: "10px", display: "block", marginBottom: "4px" }}>
              CAPTION & PRODUCTION HIGHLIGHTS
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Captured 4K 60fps cinematic reel, color graded with custom LUTs..."
              className="reel-form-textarea"
            />
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div style={{ marginTop: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "4px" }} className="mono">
                <span style={{ color: "var(--accent-gold)" }}>{uploadStageText}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", borderRadius: "99px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${uploadProgress}%`,
                    background: "linear-gradient(90deg, var(--accent-purple), var(--accent-green))",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="btn-magnetic"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "12px",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--accent-purple, #7025e1), #4c1d95)",
              borderColor: "var(--accent-purple, #7025e1)",
              color: "#fff",
              cursor: isUploading ? "not-allowed" : "pointer",
              marginTop: "4px",
              fontWeight: 800,
            }}
          >
            {isUploading ? "Uploading to Cloudinary Media CDN..." : file ? "⚡ SUBMIT ATTACHED REEL FOR ADMIN APPROVAL" : "⚡ SUBMIT REEL & THUMBNAIL FOR APPROVAL"}
          </button>
        </form>
      </div>

      {/* Right Column: Dropzone or 9:16 Video Player Preview */}
      <div
        className={`upload-dropzone ${dragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          selectFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: dragging ? "2px dashed var(--accent-gold)" : "1.5px dashed rgba(112, 37, 225, 0.45)",
          borderRadius: "16px",
          padding: file ? "16px" : "36px 24px",
          textAlign: "center",
          background: dragging ? "rgba(112, 37, 225, 0.15)" : "rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          cursor: file ? "default" : "pointer",
          transition: "all 0.3s ease",
          position: "relative",
        }}
        onClick={() => {
          if (!file) inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          onChange={(e) => selectFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        {file && previewUrl ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            {/* v9 Feature: Platform Safe-Zone Template Selector */}
            <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}>
                <span>📸</span> SAFE-ZONE PREVIEW TEMPLATE (v9)
              </span>
              <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.5)", padding: "3px", borderRadius: "99px", border: "1px solid var(--satin-border)", flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { id: "INSTAGRAM", label: "IG Reels" },
                  { id: "TIKTOK", label: "TikTok" },
                  { id: "SHORTS", label: "YT Shorts" },
                  { id: "GUIDELINES", label: "Margins" },
                  { id: "OFF", label: "Clean" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSafeZonePlatform(p.id);
                    }}
                    className="mono"
                    style={{
                      padding: "3px 8px",
                      fontSize: "9.5px",
                      borderRadius: "99px",
                      background: safeZonePlatform === p.id ? "var(--accent-purple)" : "transparent",
                      color: safeZonePlatform === p.id ? "#fff" : "var(--text-muted)",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: safeZonePlatform === p.id ? 800 : 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 9:16 Live Preview Container with Simulated Platform Overlays */}
            <div
              style={{
                width: "220px",
                height: "370px",
                borderRadius: "16px",
                overflow: "hidden",
                margin: "0 auto 12px",
                position: "relative",
                background: "#000",
                boxShadow: "0 15px 35px rgba(0,0,0,0.8), 0 0 25px rgba(112, 37, 225, 0.25)",
                border: "2px solid rgba(112, 37, 225, 0.4)",
              }}
            >
              <video
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* OVERLAY 1: INSTAGRAM REELS SIMULATION */}
              {safeZonePlatform === "INSTAGRAM" && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px 8px" }}>
                  {/* Top Bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#fff", letterSpacing: "0.5px" }}>Reels</span>
                    <span style={{ fontSize: "12px", color: "#fff" }}>📷</span>
                  </div>

                  {/* Right Side Action Buttons */}
                  <div style={{ position: "absolute", right: "8px", bottom: "55px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "16px", color: "#fff" }}>❤️</div>
                      <span className="mono" style={{ fontSize: "8px", color: "#fff", fontWeight: 700 }}>148K</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "16px", color: "#fff" }}>💬</div>
                      <span className="mono" style={{ fontSize: "8px", color: "#fff", fontWeight: 700 }}>2.4K</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "16px", color: "#fff" }}>✈️</div>
                      <span className="mono" style={{ fontSize: "8px", color: "#fff", fontWeight: 700 }}>Share</span>
                    </div>
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "rgba(255,255,255,0.2)", border: "1px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>
                      🎵
                    </div>
                  </div>

                  {/* Bottom Creator Profile & Caption */}
                  <div style={{ textAlign: "left", paddingRight: "35px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "var(--accent-purple)", border: "1px solid #fff" }} />
                      <span style={{ fontSize: "9.5px", fontWeight: 800, color: "#fff" }}>{creatorHandle}</span>
                      <span style={{ fontSize: "8px", background: "rgba(255,255,255,0.25)", color: "#fff", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>Follow</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "8.5px", color: "#eee", lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {caption || "Monsoon campaign reel..."}
                    </p>
                    <span className="mono" style={{ fontSize: "8px", color: "#ccc", marginTop: "2px", display: "block" }}>
                      ♫ Original Audio • {creatorName}
                    </span>
                  </div>
                </div>
              )}

              {/* OVERLAY 2: TIKTOK SIMULATION */}
              {safeZonePlatform === "TIKTOK" && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px 8px" }}>
                  {/* Top Bar */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    <span style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.6)" }}>Following</span>
                    <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#fff", borderBottom: "2px solid #fff" }}>For You</span>
                  </div>

                  {/* Right Side Action Column */}
                  <div style={{ position: "absolute", right: "6px", bottom: "40px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    <div style={{ position: "relative", marginBottom: "4px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-gold)", border: "1.5px solid #fff" }} />
                      <div style={{ position: "absolute", bottom: "-3px", left: "6px", width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-rose)", color: "#fff", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>+</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "15px", color: "#fff" }}>❤️</div>
                      <span className="mono" style={{ fontSize: "8px", color: "#fff" }}>382K</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "15px", color: "#fff" }}>💬</div>
                      <span className="mono" style={{ fontSize: "8px", color: "#fff" }}>4.8K</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "15px", color: "#fff" }}>🔖</div>
                      <span className="mono" style={{ fontSize: "8px", color: "#fff" }}>29K</span>
                    </div>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#222", border: "2px solid #555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", animation: "spin 4s linear infinite" }}>
                      💿
                    </div>
                  </div>

                  {/* Bottom Creator Info */}
                  <div style={{ textAlign: "left", paddingRight: "38px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: 800, color: "#fff", marginBottom: "2px" }}>@{creatorHandle.replace(/^@/, "")}</div>
                    <p style={{ margin: 0, fontSize: "8.5px", color: "#eee", lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {caption}
                    </p>
                  </div>
                </div>
              )}

              {/* OVERLAY 3: YOUTUBE SHORTS SIMULATION */}
              {safeZonePlatform === "SHORTS" && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px 8px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    <span style={{ fontSize: "12px", color: "#fff" }}>🔍 ⋯</span>
                  </div>

                  {/* Right Side Buttons */}
                  <div style={{ position: "absolute", right: "6px", bottom: "45px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", color: "#fff" }}>👍</div>
                      <span className="mono" style={{ fontSize: "7.5px", color: "#fff" }}>250K</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", color: "#fff" }}>👎</div>
                      <span className="mono" style={{ fontSize: "7.5px", color: "#fff" }}>Dislike</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", color: "#fff" }}>💬</div>
                      <span className="mono" style={{ fontSize: "7.5px", color: "#fff" }}>3.1K</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", color: "#fff" }}>↪️</div>
                      <span className="mono" style={{ fontSize: "7.5px", color: "#fff" }}>Share</span>
                    </div>
                  </div>

                  {/* Bottom Subscribe Chip */}
                  <div style={{ textAlign: "left", paddingRight: "35px", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#ff0000" }} />
                      <span style={{ fontSize: "9px", fontWeight: 800, color: "#fff" }}>{creatorHandle}</span>
                      <span style={{ fontSize: "7.5px", background: "#ff0000", color: "#fff", padding: "1px 5px", borderRadius: "99px", fontWeight: 800 }}>Subscribe</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "8.5px", color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
                      {title}
                    </p>
                  </div>
                </div>
              )}

              {/* OVERLAY 4: SAFE MARGINS / DANGER ZONES */}
              {safeZonePlatform === "GUIDELINES" && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  {/* Top 15% Danger Margin */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "15%", background: "rgba(244, 63, 94, 0.25)", borderBottom: "1px dashed #f43f5e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: "7.5px", color: "#f43f5e", fontWeight: 800, background: "rgba(0,0,0,0.7)", padding: "1px 4px", borderRadius: "2px" }}>
                      ⚠️ TOP 15% DANGER ZONE (STATUS BAR / NOTCH)
                    </span>
                  </div>

                  {/* Right 14% Danger Margin */}
                  <div style={{ position: "absolute", top: "15%", bottom: "18%", right: 0, width: "16%", background: "rgba(234, 179, 8, 0.2)", borderLeft: "1px dashed #eab308", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: "7px", color: "#eab308", transform: "rotate(90deg)", whiteSpace: "nowrap", fontWeight: 800 }}>
                      ACTIONS
                    </span>
                  </div>

                  {/* Bottom 18% Danger Margin */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "18%", background: "rgba(244, 63, 94, 0.25)", borderTop: "1px dashed #f43f5e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: "7.5px", color: "#f43f5e", fontWeight: 800, background: "rgba(0,0,0,0.7)", padding: "1px 4px", borderRadius: "2px" }}>
                      ⚠️ BOTTOM 18% DANGER ZONE (SUBTITLE CLIPPING)
                    </span>
                  </div>

                  {/* Center Safe Zone */}
                  <div style={{ position: "absolute", top: "15%", bottom: "18%", left: 0, right: "16%", border: "1px dashed rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: "8px", color: "var(--accent-green)", fontWeight: 800, background: "rgba(0,0,0,0.7)", padding: "2px 6px", borderRadius: "4px" }}>
                      ✓ 100% SAFE TITLE & SUBJECT ZONE
                    </span>
                  </div>
                </div>
              )}

              {/* Safe-zone QA Badge on Video */}
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  left: "4px",
                  right: safeZonePlatform !== "OFF" && safeZonePlatform !== "GUIDELINES" ? "36px" : "4px",
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(4px)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <span className="mono" style={{ fontSize: "8px", color: "var(--accent-green)", fontWeight: 700 }}>
                  ✓ QA Verified
                </span>
                <span className="mono" style={{ fontSize: "8px", color: "var(--accent-gold)" }}>
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
            </div>

            <strong style={{ color: "var(--paper-soft)", fontSize: "13px", display: "block" }}>
              {file.name}
            </strong>
            <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginTop: "2px" }}>
              Cloudinary Video CDN Ready • Admin Staged
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreviewUrl(null);
                setNote("");
                setUploadSuccess(false);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mono"
              style={{
                marginTop: "10px",
                background: "rgba(244, 63, 94, 0.15)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "var(--accent-rose)",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              Choose Different Reel
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(112, 37, 225, 0.2)",
                color: "var(--accent-gold)",
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(226, 184, 66, 0.4)",
                fontSize: "22px",
              }}
            >
              ↑
            </div>
            <strong style={{ color: "var(--paper-soft)", fontSize: "15px" }}>
              Drop your vertical reel sample here
            </strong>
            <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              MP4, MOV, or WebM • Up to 200 MB
            </span>
            <button
              type="button"
              className="btn-magnetic"
              style={{ padding: "8px 22px", fontSize: "11px", marginTop: "6px" }}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              BROWSE FROM DEVICE
            </button>
          </>
        )}

        {note && (
          <p
            className="mono"
            style={{
              fontSize: "11px",
              margin: "6px 0 0",
              color: uploadSuccess ? "var(--accent-green)" : "var(--accent-gold)",
            }}
          >
            {note}
          </p>
        )}
      </div>

      {/* User Submissions Status Drawer / Modal */}
      {mySubmissionsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={() => setMySubmissionsOpen(false)}
        >
          <div
            className="satin-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "28px",
              borderRadius: "20px",
              background: "#101016",
              border: "1px solid rgba(112, 37, 225, 0.4)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)" }}>CREATOR TRACKER</span>
                <h3 style={{ margin: "2px 0 0", fontSize: "18px", color: "var(--paper-soft)" }}>
                  My Brand Shoot Reel Submissions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMySubmissionsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {loadingSubmissions ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }} className="mono">
                Loading your submissions...
              </div>
            ) : mySubmissions.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p>No reel submissions found for {creatorEmail}.</p>
                <button
                  type="button"
                  onClick={() => {
                    setMySubmissionsOpen(false);
                    inputRef.current?.click();
                  }}
                  className="btn-magnetic"
                  style={{ padding: "8px 18px", fontSize: "11px", marginTop: "10px" }}
                >
                  ⚡ Upload Your First Reel
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {mySubmissions.map((sub) => {
                  const isApproved = sub.status === "APPROVED";
                  const isRejected = sub.status === "REJECTED";

                  return (
                    <div
                      key={sub.id}
                      className="satin-card"
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${
                          isApproved
                            ? "rgba(16, 185, 129, 0.4)"
                            : isRejected
                            ? "rgba(244, 63, 94, 0.4)"
                            : "rgba(245, 158, 11, 0.4)"
                        }`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>
                            {sub.title}
                          </strong>
                          <span className="mono" style={{ fontSize: "11px", color: "var(--accent-purple)" }}>
                            PARTNER: {sub.brand_name} • 🔒 {sub.payout_display}
                          </span>
                        </div>

                        <span
                          className="mono"
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "99px",
                            background: isApproved
                              ? "rgba(16, 185, 129, 0.15)"
                              : isRejected
                              ? "rgba(244, 63, 94, 0.15)"
                              : "rgba(245, 158, 11, 0.15)",
                            color: isApproved
                              ? "var(--accent-green)"
                              : isRejected
                              ? "var(--accent-rose)"
                              : "var(--accent-gold)",
                            border: `1px solid ${
                              isApproved
                                ? "rgba(16, 185, 129, 0.4)"
                                : isRejected
                                ? "rgba(244, 63, 94, 0.4)"
                                : "rgba(245, 158, 11, 0.4)"
                            }`,
                          }}
                        >
                          {isApproved ? "FEATURED LIVE 🟢" : isRejected ? "NOT APPROVED 🔴" : "PENDING ADMIN REVIEW ⏳"}
                        </span>
                      </div>

                      <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--paper-soft)", lineHeight: 1.4 }}>
                        "{sub.caption}"
                      </p>

                      {isApproved && (
                        <div style={{ fontSize: "11px", color: "var(--accent-green)" }} className="mono">
                          ✓ Featured on Homepage Creator Stories & Hits!
                        </div>
                      )}

                      {isRejected && (
                        <div
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: "rgba(244, 63, 94, 0.1)",
                            border: "1px solid rgba(244, 63, 94, 0.25)",
                            fontSize: "11px",
                            color: "var(--accent-rose)",
                          }}
                        >
                          <strong>Onevoo Team Feedback:</strong>
                          <p style={{ margin: "2px 0 0", color: "var(--paper-soft)" }}>
                            "your reel for featuring in the creator stories and gigs section not get approved by onevoo team.{sub.rejection_reason ? ` Note: ${sub.rejection_reason}` : ''}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BeforeAfter() {
  const [selectedStage, setSelectedStage] = useState(0);

  return (
    <section id="customize" className="sec wrap growth-path before-after-section" style={{ position: "relative" }}>
      <div className="ambient-engineering-grid" style={{ opacity: 0.5 }} />

      {/* Header with Title and Trust Badges */}
      <div className="flow-header-wrap" style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: "48px" }}>
        <div className="flow-badge-pill" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span className="pulse-emerald-ring" style={{ width: "7px", height: "7px", flexShrink: 0 }} />
          <span className="tech-label-mono flow-header-badge-text">
            PARADIGM SHIFT • SOLO CREATOR HEADACHES VS. MANAGED CREATIVE OS
          </span>
        </div>

        <h2 className="disp-title-h2 flow-header-title">
          THE MODERN CREATOR WORKFLOW. <br />
          <em>FROM CHAOS TO CERTAINTY.</em>
        </h2>

        <p className="flow-header-desc">
          See how Onevoo transforms the broken legacy creator experience—chasing invoices for 90 days, endless unpaid revision loops, and vague DMs—into a streamlined, 100% escrow-backed creative engine.
        </p>
      </div>

      {/* Side by Side Flow Comparison Cards */}
      <div
        className="flow-cards-container"
      >
        {/* Solo Mode Card (The Broken Legacy Way) */}
        <article
          className="satin-card"
          style={{
            background: "linear-gradient(160deg, rgba(20, 16, 18, 0.9) 0%, rgba(10, 8, 9, 0.95) 100%)",
            border: "1px solid rgba(244, 63, 94, 0.25)",
            padding: "32px",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-rose)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  THE BROKEN LEGACY MODEL
                </span>
                <h3 style={{ fontSize: "22px", color: "var(--paper-soft)", margin: "2px 0 0", fontWeight: 700 }}>
                  SOLO CREATOR CHAOS
                </h3>
              </div>
              <span
                className="mono"
                style={{
                  fontSize: "10px",
                  background: "rgba(244, 63, 94, 0.15)",
                  color: "var(--accent-rose)",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                }}
              >
                ⚠ High Risk
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Cold Pitching & Ghosted DMs", desc: "20+ hours wasted sending cold emails with a 2% response rate." },
                { label: "Unprotected Net-90 Payouts", desc: "Chasing finance teams for months with zero leverage if a brand defaults." },
                { label: "Endless Unpaid Revisions", desc: "Vague client feedback resulting in 5+ revision loops without compensation." },
                { label: "Legal Ambiguity & Stolen IP", desc: "No formal usage boundaries; brands run paid ads without permission." },
                { label: "Solo Production Hassles", desc: "Sourcing DPs, camera packages, and studio spaces all by yourself." },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "var(--accent-rose)", fontSize: "14px", fontWeight: 800, marginTop: "1px" }}>✕</span>
                  <div>
                    <strong style={{ fontSize: "13px", color: "var(--paper-soft)", display: "block" }}>{item.label}</strong>
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", lineHeight: 1.4 }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(244, 63, 94, 0.08)",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              textAlign: "center",
            }}
          >
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-rose)", fontWeight: 700 }}>
              VERDICT: 40% OF CREATOR TIME & REVENUE LOST TO ADMIN CHAOS
            </span>
          </div>
        </article>

        {/* Center Animated Directional Hub */}
        <div
          className="flow-arrow-hub"
        >
          <div
            className="flow-arrow-icon"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(112, 37, 225, 0.2)",
              border: "1px solid var(--accent-purple)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: "18px",
              boxShadow: "0 0 25px rgba(112, 37, 225, 0.5)",
              animation: "pulseGlow 2.5s infinite",
              transition: "transform 0.3s ease",
            }}
            aria-hidden="true"
          >
            →
          </div>
          <span className="mono flow-arrow-text" style={{ fontSize: "9px", color: "var(--accent-gold)", letterSpacing: "0.1em" }}>
            UPGRADE
          </span>
        </div>

        {/* Onevoo Managed Flow Card (The Automated Creative OS) */}
        <article
          className="satin-card"
          style={{
            background: "linear-gradient(160deg, rgba(18, 14, 28, 0.9) 0%, rgba(10, 8, 18, 0.95) 100%)",
            border: "1.5px solid var(--accent-purple)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba(112, 37, 225, 0.35)",
            padding: "32px",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  THE ENTERPRISE CREATIVE OS
                </span>
                <h3 style={{ fontSize: "22px", color: "#fff", margin: "2px 0 0", fontWeight: 700 }}>
                  THE ONEVOO MANAGED FLOW
                </h3>
              </div>
              <span
                className="mono"
                style={{
                  fontSize: "10px",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "var(--accent-green)",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  fontWeight: 700,
                }}
              >
                ● 100% Escrow Backed
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "High-Ticket Inbound Brand Briefs", desc: "Pre-funded briefs matched directly to your profile from top Indian brands." },
                { label: "100% Upfront Digital Escrow Lock", desc: "Funds secured before you pick up the camera. Automated instant payout." },
                { label: "Strict 2-Round Revision Limit", desc: "Structured SLAs protect your time with automated client sign-off triggers." },
                { label: "Clear IP & Commercial Whitelisting", desc: "Explicit 90-day organic boundaries; separate paid riders for ad usage." },
                { label: "Turnkey Crew & Studio Logistics", desc: "Book Sony FX6 DPs, lighting setups, and prime studio spaces in 1 click." },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "var(--accent-green)", fontSize: "14px", fontWeight: 800, marginTop: "1px" }}>✓</span>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#fff", display: "block" }}>{item.label}</strong>
                    <span style={{ fontSize: "11.5px", color: "var(--paper-soft)", lineHeight: 1.4 }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginTop: "24px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(112, 37, 225, 0.2)",
              border: "1px solid rgba(112, 37, 225, 0.4)",
              textAlign: "center",
            }}
          >
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>
              VERDICT: 100% PEACE OF MIND • FOCUS ENTIRELY ON CREATING
            </span>
          </div>
        </article>
      </div>

      {/* 4-Stage Visual Production Pipeline Stepper */}
      <div style={{ position: "relative", zIndex: 2, marginBottom: "32px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span className="tech-label-mono" style={{ fontSize: "10.5px" }}>THE 4-STAGE PRODUCTION LIFECYCLE</span>
          <h3 className="disp-title-h2 flow-stages-title" style={{ margin: "4px 0 0" }}>
            HOW AN ENTERPRISE DEAL <em>FLOWS ON ONEVOO</em>
          </h3>
        </div>

        <div className="pipeline-stages-grid">
          {FLOW_STAGES.map((stg, index) => {
            const isSelected = selectedStage === index;
            return (
              <div
                key={stg.step}
                onClick={() => setSelectedStage(index)}
                className="satin-card"
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  border: isSelected ? "1.5px solid var(--accent-purple)" : "1px solid var(--satin-border)",
                  background: isSelected ? "rgba(112, 37, 225, 0.15)" : "rgba(255, 255, 255, 0.02)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: "12px",
                        fontWeight: 800,
                        color: isSelected ? "var(--accent-gold)" : "var(--accent-purple)",
                      }}
                    >
                      {stg.step}
                    </span>
                    <span style={{ fontSize: "18px" }}>{stg.icon}</span>
                  </div>

                  <h4 style={{ fontSize: "14px", color: "var(--paper-soft)", margin: "0 0 6px", fontWeight: 700 }}>
                    {stg.title}
                  </h4>
                  <p style={{ fontSize: "11.5px", color: "var(--text-muted)", margin: 0, lineHeight: 1.45 }}>
                    {stg.desc}
                  </p>
                </div>

                <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid var(--satin-border)" }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: "9.5px",
                      color: "var(--accent-green)",
                      fontWeight: 700,
                      display: "block",
                    }}
                  >
                    ● {stg.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portfolio Showcase Dropzone */}
      <UploadPanel />
    </section>
  );
}