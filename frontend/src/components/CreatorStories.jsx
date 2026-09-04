import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CREATOR_STORIES } from "../data/content.js";
import StoryViewerModal from "./StoryViewerModal";
import CreatorVerificationHub from "./verification/CreatorVerificationHub";

// Curated library of authentic 9:16 high-production posters by vertical niche
const THEMED_REEL_POSTERS = {
  coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80", // Cold brew artisan extraction
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80", // Specialty cafe aesthetic
  beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", // Skincare / beauty studio glow
  fashion: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", // Fashion editorial portrait
  fitness: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", // Athletic kinetic workout
  jewelry: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80", // Royal Rajputi bridal jewellery
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Cinematic hardware review
  heritage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80", // Varanasi Assi Ghat heritage
  culinary: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80", // Gourmet Indian street food
  art: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80", // Kumartuli cultural idol sculpting
};

const DIVERSE_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80",
];

const getReelThumbnail = (reel, index) => {
  if (reel.thumbnail_url && !reel.thumbnail_url.includes("53994a69daeb")) {
    return reel.thumbnail_url;
  }
  const text = `${reel.title || ""} ${reel.brand_name || ""} ${reel.caption || ""}`.toLowerCase();
  if (text.includes("coffee") || text.includes("starbucks") || text.includes("brew") || text.includes("cafe")) return THEMED_REEL_POSTERS.coffee;
  if (text.includes("beauty") || text.includes("nykaa") || text.includes("skin") || text.includes("glam")) return THEMED_REEL_POSTERS.beauty;
  if (text.includes("nike") || text.includes("athletic") || text.includes("fitness") || text.includes("sport")) return THEMED_REEL_POSTERS.fitness;
  if (text.includes("tanishq") || text.includes("jewel") || text.includes("royal") || text.includes("bridal")) return THEMED_REEL_POSTERS.jewelry;
  if (text.includes("samsung") || text.includes("galaxy") || text.includes("tech") || text.includes("hardware")) return THEMED_REEL_POSTERS.tech;
  if (text.includes("varanasi") || text.includes("ghat") || text.includes("heritage")) return THEMED_REEL_POSTERS.heritage;
  if (text.includes("food") || text.includes("chef") || text.includes("delhi") || text.includes("paranthe")) return THEMED_REEL_POSTERS.culinary;
  if (text.includes("kolkata") || text.includes("art") || text.includes("sculpt")) return THEMED_REEL_POSTERS.art;

  const fallbackList = Object.values(THEMED_REEL_POSTERS);
  return fallbackList[index % fallbackList.length];
};

const getReelAvatar = (reel, index) => {
  if (reel.creator_avatar && !reel.creator_avatar.includes("53994a69daeb")) {
    return reel.creator_avatar;
  }
  return DIVERSE_AVATARS[index % DIVERSE_AVATARS.length];
};

export default function CreatorStories() {
  const [stories, setStories] = useState(CREATOR_STORIES);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showVerificationHub, setShowVerificationHub] = useState(false);
  const scrollContainerRef = useRef(null);

  // Fetch live approved brand shoot reels from Neon DB & Cloudinary CDN
  useEffect(() => {
    const fetchApprovedReels = async () => {
      try {
        const res = await fetch("/api/reels/approved");
        const data = await res.json();
        if (data.reels && data.reels.length > 0) {
          const liveReels = data.reels.map((reel, idx) => ({
            id: `live-${reel.id}`,
            name: reel.creator_name,
            username: reel.creator_handle.replace(/^@/, ""),
            city: reel.city,
            culturalTheme: reel.title,
            avatar: getReelAvatar(reel, idx),
            bgImage: getReelThumbnail(reel, idx),
            videoUrl: reel.video_url,
            time: "Live Feature",
            views: reel.views_count || "34.2K",
            brand: reel.brand_name,
            payout: reel.payout_display || "₹85,000 Escrow Locked",
            stickerText: reel.title,
            caption: reel.caption,
            bio: `Onevoo Verified Creator • ${reel.brand_name} Brand Partner`,
            badge: "Live Featured Reel",
            isLiveApproved: true,
          }));

          // Merge live approved reels at front of stories (avoiding duplicate usernames if present)
          const merged = [...liveReels, ...CREATOR_STORIES.filter(s => !liveReels.some(lr => lr.username === s.username))];
          setStories(merged);
        }
      } catch (err) {
        console.warn("Could not fetch live approved reels, falling back to static stories:", err);
      }
    };

    fetchApprovedReels();
  }, []);

  const handleStoryClick = (index) => {
    setSelectedStoryIndex(index);
    setModalOpen(true);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section id="stories" className="sec wrap creator-stories-section" style={{ position: "relative" }}>
      <div className="ambient-engineering-grid" style={{ opacity: 0.6 }} />
      
      {/* Header with Title and Scroll Controls */}
      <div
        className="stories-header-row"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className="pulse-emerald-ring" />
            <span className="tech-label-mono" style={{ fontSize: "11px" }}>
              AUTHENTIC INDIAN CREATORS & CULTURAL REELS
            </span>
          </div>
          <h2 className="disp-title-h2" style={{ margin: "4px 0 8px", fontSize: "clamp(28px, 4vw, 44px)" }}>
            CREATOR <em>STORIES & HITS</em>
          </h2>
          <p style={{ margin: 0, maxWidth: "580px", color: "var(--text-muted)", fontSize: "14px" }}>
            Real Indian creators across Mumbai, Delhi, Jaipur, Varanasi, Kolkata & Bengaluru landing high-ticket brand deals and production days.
          </p>
        </div>

        {/* Navigation Arrows & Live Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={scrollLeft}
              className="btn-magnetic"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                cursor: "pointer",
              }}
              aria-label="Scroll left"
              title="Scroll Left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="btn-magnetic"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                cursor: "pointer",
              }}
              aria-label="Scroll right"
              title="Scroll Right"
            >
              →
            </button>
          </div>

          <Link
            to="/opportunities"
            className="mono view-all-link"
            style={{
              color: "var(--accent-purple)",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              paddingLeft: "8px",
            }}
          >
            VIEW ALL ({stories.length}) →
          </Link>
        </div>
      </div>

      {/* Side-by-Side Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="stories-horizontal-scroll"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          gap: "18px",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          paddingBottom: "16px",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--accent-purple) rgba(255, 255, 255, 0.03)",
        }}
      >
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(index)}
            className="story-card satin-card"
            style={{
              flex: "0 0 260px",
              width: "260px",
              height: "450px",
              cursor: "pointer",
              borderRadius: "18px",
              overflow: "hidden",
              border: story.isLiveApproved ? "1.5px solid var(--accent-gold)" : "1px solid var(--satin-border)",
              position: "relative",
              scrollSnapAlign: "start",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
              e.currentTarget.style.borderColor = "var(--accent-gold)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(112, 37, 225, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.borderColor = story.isLiveApproved ? "var(--accent-gold)" : "var(--satin-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Story Background Visual or Video Preview */}
            {story.videoUrl ? (
              <video
                src={story.videoUrl}
                poster={story.bgImage}
                autoPlay
                loop
                muted
                playsInline
                className="story-bg"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                }}
              />
            ) : (
              <img
                src={story.bgImage}
                alt={story.name}
                className="story-bg"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  transition: "transform 0.6s ease",
                }}
              />
            )}

            {/* Dark Vignette Overlay */}
            <div
              className="story-overlay"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.92) 100%)",
                zIndex: 1,
              }}
            />

            {/* Live Featured Badge if approved */}
            {story.isLiveApproved && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "12px",
                  zIndex: 3,
                  background: "linear-gradient(135deg, rgba(226, 184, 66, 0.95), rgba(180, 83, 9, 0.95))",
                  color: "#000",
                  padding: "2px 8px",
                  borderRadius: "99px",
                  fontSize: "8.5px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                className="mono"
              >
                <span className="pulse-emerald-ring" style={{ width: "4px", height: "4px" }} />
                LIVE FEATURED
              </div>
            )}

            {/* Top Story Header */}
            <div
              style={{
                position: "absolute",
                top: story.isLiveApproved ? "34px" : "14px",
                left: "14px",
                right: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={story.avatar}
                  alt={story.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent-purple)",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <span className="mono" style={{ fontSize: "11px", color: "#fff", fontWeight: 700, display: "block", lineHeight: 1.1 }}>
                    @{story.username}
                  </span>
                  <span className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)" }}>
                    📍 {story.city?.split(",")[0]}
                  </span>
                </div>
              </div>

              <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: "4px" }}>
                {story.time}
              </span>
            </div>

            {/* Floating Cultural Sticker */}
            <div
              style={{
                position: "absolute",
                top: "44%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "88%",
                zIndex: 2,
                textAlign: "center",
              }}
            >
              <div
                className="font-display"
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  background: "rgba(18, 14, 28, 0.88)",
                  border: "1px solid rgba(139, 92, 246, 0.5)",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)",
                  letterSpacing: "0.03em",
                }}
              >
                {story.stickerText}
              </div>

              <div style={{ marginTop: "8px" }}>
                <span
                  className="mono"
                  style={{
                    fontSize: "9.5px",
                    background: "rgba(16, 185, 129, 0.28)",
                    color: "#10b981",
                    padding: "3px 10px",
                    borderRadius: "99px",
                    border: "1px solid rgba(16, 185, 129, 0.6)",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                    display: "inline-block",
                  }}
                >
                  🔒 {story.payout}
                </span>
              </div>
            </div>

            {/* Bottom Story Footer */}
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "14px",
                right: "14px",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                <span className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)" }}>PARTNER:</span>
                <span className="mono" style={{ fontSize: "9px", color: "var(--paper-soft)", fontWeight: 700 }}>
                  {story.brand}
                </span>
              </div>

              <p style={{ fontSize: "11.5px", color: "var(--paper-soft)", margin: "0 0 10px", lineHeight: 1.35 }}>
                {story.caption}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "var(--text-muted)" }} className="mono">
                <span>👁️ {story.views}</span>
                <span style={{ color: "var(--accent-purple)", fontWeight: 700 }}>
                  {story.videoUrl ? "▶ WATCH REEL ↗" : "WATCH STORY ↗"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Creator Verification CTA Banner */}
      <div
        className="satin-card creator-verification-cta-banner"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="creator-cta-info" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="creator-avatars-cluster" style={{ display: "flex", marginLeft: "10px" }}>
            {stories.slice(0, 4).map((c, i) => (
              <img
                key={c.id}
                src={c.avatar}
                alt={c.name}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "2px solid var(--satin-border, #09090b)",
                  marginLeft: "-10px",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>

          <div>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--paper-soft)" }}>
              Join 2,400+ Verified Indian Creators Earning on Onevoo
            </h4>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Automatic milestone escrow payments, zero payment delays, and direct brand access.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowVerificationHub(true)}
          className="btn-magnetic creator-verification-btn"
        >
          <span className="btn-lightning-icon">⚡</span>
          <span>APPLY FOR CREATOR VERIFICATION</span>
          <span className="btn-arrow-icon">→</span>
        </button>
      </div>

      {/* Creator Verification Hub Modal */}
      {showVerificationHub && (
        <CreatorVerificationHub
          onClose={() => setShowVerificationHub(false)}
          onVerified={() => setShowVerificationHub(false)}
        />
      )}

      {/* Full Screen Story / Reel Viewer Modal */}
      <StoryViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        stories={stories}
        initialIndex={selectedStoryIndex || 0}
      />
    </section>
  );
}
