import React, { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="soon" className="sec wrap soon-section" style={{ position: "relative", paddingTop: "40px", paddingBottom: "100px" }}>
      <div className="ambient-engineering-grid" />
      <div
        className="soon premium-card"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "64px 32px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #120e1e 0%, #09080e 100%)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          textAlign: "center",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <span className="mono" style={{ color: "var(--accent-purple)", fontSize: "11px", letterSpacing: "0.15em", display: "block", marginBottom: "12px" }}>
          GET EARLY ACCESS
        </span>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", textTransform: "uppercase", marginBottom: "16px" }}>
          CREATOR PAYOUTS DASHBOARD
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "560px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Track every collaboration, sponsor payment, and contract milestone in one unified place.
        </p>

        {submitted ? (
          <div className="soon-confirm mono" style={{ color: "var(--accent-green)", fontSize: "15px", fontWeight: 700 }}>
            ✓ You're on the priority list! We’ll notify you as spots open.
          </div>
        ) : (
          <form className="soon-form" onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", maxWidth: "460px", margin: "0 auto", justifyContent: "center" }}>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address for notifications"
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: "99px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--line-strong)",
                color: "var(--paper)",
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button
              type="submit"
              className="btn btn-solid"
              style={{
                borderRadius: "99px",
                padding: "14px 28px",
                fontSize: "12px",
                letterSpacing: "0.08em"
              }}
            >
              NOTIFY ME
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
