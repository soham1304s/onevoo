import React, { useState, useEffect, useRef } from "react";

export default function ComingSoonModal({ isOpen, onClose, modalData }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("creator");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const modalRef = useRef(null);

  const defaultData = {
    title: "Booking Application — Coming Soon",
    badgeText: "Private Beta • Q3 2026",
    description:
      "Direct gig booking, automated escrow payout holding, and instant brand contract dispatch are currently undergoing final testing for verified creators.",
    category: "Campaign Booking Engine",
    icon: "🚀",
    progress: 92,
    highlights: [
      "Instant Escrow Payout Guarantee",
      "Automated Brand Contract Generation",
      "AI Creator Rate Card Matching",
      "Direct Agency & Brand Invoicing"
    ]
  };

  const data = { ...defaultData, ...modalData };

  // Prevent background body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSuccess(false);
      setEmail("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Support Keyboard Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Check if waitlist email is saved
  useEffect(() => {
    if (isOpen && data.title) {
      try {
        const saved = JSON.parse(localStorage.getItem("onevoo_waitlist") || "{}");
        if (saved[data.title]) {
          setIsSuccess(true);
          setEmail(saved[data.title]);
        }
      } catch (e) {
        console.error("LocalStorage error", e);
      }
    }
  }, [isOpen, data.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        const saved = JSON.parse(localStorage.getItem("onevoo_waitlist") || "{}");
        saved[data.title] = email;
        localStorage.setItem("onevoo_waitlist", JSON.stringify(saved));
      } catch (e) {
        console.error("LocalStorage save error", e);
      }
    }, 600);
  };

  const handleCopyShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="cs-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-modal-title"
    >
      <div className="cs-modal-card" ref={modalRef}>
        {/* Glow Accent Bar */}
        <div className="cs-modal-glow-bar"></div>

        {/* Close Button */}
        <button
          className="cs-modal-close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="cs-modal-header">
          <div className="cs-badge-row">
            <span className="cs-badge mono">{data.badgeText}</span>
            <span className="cs-category mono">{data.category}</span>
          </div>

          <div className="cs-title-icon-row">
            <span className="cs-feature-icon" aria-hidden="true">
              {data.icon}
            </span>
            <h2 id="cs-modal-title" className="cs-modal-title">
              {data.title}
            </h2>
          </div>

          <p className="cs-modal-desc">{data.description}</p>
        </div>

        {/* Progress Tracker */}
        <div className="cs-progress-box">
          <div className="cs-progress-label">
            <span className="mono">Development Progress</span>
            <strong className="mono">{data.progress}% Completed</strong>
          </div>
          <div className="cs-progress-track">
            <div
              className="cs-progress-fill"
              style={{ width: `${data.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        {data.highlights && data.highlights.length > 0 && (
          <div className="cs-highlights-grid">
            {data.highlights.map((feat, idx) => (
              <div key={idx} className="cs-highlight-item">
                <span className="cs-check-icon">✓</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form or Success State */}
        {isSuccess ? (
          <div className="cs-success-card">
            <div className="cs-success-badge">🎉 Priority Access Reserved</div>
            <h3>You're First in Line for Booking!</h3>
            <p>
              We'll send your priority booking invitation code to <strong>{email}</strong>{" "}
              as soon as testing opens.
            </p>
            <div className="cs-success-actions">
              <button
                type="button"
                className="btn btn-ghost cs-share-btn"
                onClick={handleCopyShare}
              >
                {copiedLink ? "✓ Invite Link Copied!" : "🔗 Share Link"}
              </button>
              <button
                type="button"
                className="btn btn-solid"
                onClick={onClose}
              >
                Got It
              </button>
            </div>
          </div>
        ) : (
          <form className="cs-form" onSubmit={handleSubmit}>
            <div className="cs-form-title">
              <span>⚡ Get Notified When Booking Opens</span>
              <small>Enter your email to reserve your spot on the priority list.</small>
            </div>

            <div className="cs-input-group">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Select your role"
                className="cs-role-select"
              >
                <option value="creator">Creator</option>
                <option value="ugc">UGC Specialist</option>
                <option value="brand">Brand / Sponsor</option>
                <option value="agency">Agency</option>
              </select>
            </div>

            <button
              type="submit"
              className={`btn btn-solid cs-submit-btn ${
                isSubmitting ? "loading" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Reserving Access..." : "Get Priority Early Access →"}
            </button>
          </form>
        )}

        {/* Modal Footer */}
        <div className="cs-modal-footer mono">
          <span>🔒 NO SPAM · CANCEL ANYTIME</span>
          <span>ONEVOO CREATOR SUITE</span>
        </div>
      </div>
    </div>
  );
}
