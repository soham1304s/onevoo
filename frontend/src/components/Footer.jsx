import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const SocialIcon = ({ children, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="social-icon">
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="footer-main" style={{ position: "relative", overflow: "hidden" }}>
      <div className="ambient-engineering-grid" />
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" style={{ textDecoration: "none" }}>
              <Logo size="medium" />
            </Link>
            <p className="footer-tagline">Creator management, built for short video.</p>
            <div className="footer-status-badge">
              <span className="status-dot"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>COMPANY</h4>
              <a href="/#features">Features</a>
              <Link to="/opportunities">Opportunities</Link>
              <a href="/#soon">Waitlist</a>
              <Link to="/book-demo">Book a Demo</Link>
            </div>
            <div className="footer-col">
              <h4>LEGAL</h4>
              <Link to="/terms">Contracts</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-info">
            <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
              © {new Date().getFullYear()} ONEVOO. ALL RIGHTS RESERVED.
            </div>
          </div>
          <div className="footer-socials">
            <SocialIcon href="https://instagram.com">IG</SocialIcon>
            <SocialIcon href="https://tiktok.com">TT</SocialIcon>
            <SocialIcon href="https://x.com">X</SocialIcon>
          </div>
        </div>
      </div>

      {/* Yellow Glowing Signature Scribble / Heart Doodle in bottom right corner */}
      <div
        className="footer-scribble-doodle"
        style={{
          position: "absolute",
          right: "24px",
          bottom: "16px",
          pointerEvents: "none",
          opacity: 0.85,
        }}
        aria-hidden="true"
      >
        <svg width="48" height="36" viewBox="0 0 80 50" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10 35 C 10 15, 30 10, 40 25 C 50 10, 70 15, 70 30 C 70 45, 45 45, 40 48 C 35 45, 10 45, 10 35 Z" />
          <path d="M40 25 L45 35 L55 20" stroke="var(--accent-gold)" strokeWidth="2" />
        </svg>
      </div>
    </footer>
  );
}
