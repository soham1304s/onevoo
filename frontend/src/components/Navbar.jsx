import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import AvatarPickerModal from "./AvatarPickerModal";
import NotificationCenter from "./NotificationCenter";
import AdminReelModeration from "./AdminReelModeration";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [moderationOpen, setModerationOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="nav" style={{ backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}>
        <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          <Logo size="medium" />
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent-gold)' : undefined,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 800,
              })}
            >
              <span className="pulse-emerald-ring" style={{ width: '6px', height: '6px' }} />
              COMMAND CENTER
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/studio"
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent-gold)' : undefined,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              })}
            >
              CREATIVE OS
            </NavLink>
          </li>
          <li>
            <a href="/#features">FEATURES</a>
          </li>
          <li>
            <a href="/#customize">SOLO VS MANAGED</a>
          </li>
          <li>
            <NavLink to="/opportunities">OPPORTUNITIES</NavLink>
          </li>
          <li>
            <NavLink
              to="/enterprise-hub"
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent-gold)' : undefined,
                fontWeight: 700,
              })}
            >
              ENTERPRISE HUB
            </NavLink>
          </li>
          <li>
            <NavLink to="/terms">CONTRACTS</NavLink>
          </li>
          <li>
            <a href="/#soon">WAITLIST</a>
          </li>
        </ul>

        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <svg className="theme-icon sun-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="theme-icon moon-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Admin Reel Moderation Desk Quick Trigger - ONLY VISIBLE TO AUTHENTICATED ADMINS */}
          {isAuthenticated && user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => setModerationOpen(true)}
              className="mono nav-desktop-cta"
              style={{
                background: "linear-gradient(135deg, rgba(223, 182, 64, 0.25), rgba(180, 83, 9, 0.4))",
                border: "1px solid var(--accent-gold)",
                color: "var(--accent-gold)",
                padding: "6px 14px",
                borderRadius: "99px",
                fontSize: "10.5px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 0 15px rgba(223, 182, 64, 0.2)",
              }}
              title="Open Onevoo Editorial & Reel Moderation Desk"
            >
              <span className="pulse-emerald-ring" style={{ width: "5px", height: "5px" }} />
              🛡️ MODERATION
            </button>
          )}

          {/* Real-Time Notification & Queued Task Center */}
          <NotificationCenter />

          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                onClick={() => setAvatarPickerOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--satin-border)",
                  padding: "5px 12px 5px 6px",
                  borderRadius: "99px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                className="user-chip-button"
                title="Click to customize avatar or upload photo"
              >
                <UserAvatar
                  user={user}
                  profile={profile}
                  size="small"
                />
                <span className="mono user-chip-handle" style={{ fontSize: "11px", color: "var(--paper-soft)", fontWeight: 600 }}>
                  {profile?.handle || user?.full_name?.split(" ")[0]}
                </span>
                <span className="pulse-emerald-ring user-chip-pulse" style={{ width: "6px", height: "6px" }} title="Neon Postgres Authenticated" />
              </div>

              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost nav-desktop-cta"
                style={{
                  borderRadius: "99px",
                  padding: "8px 16px",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  borderColor: "var(--satin-border)"
                }}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn btn-solid nav-desktop-cta"
              style={{
                borderRadius: "99px",
                padding: "10px 22px",
                fontSize: "12px",
                letterSpacing: "0.08em",
                background: "var(--accent-purple)",
                borderColor: "var(--accent-purple)",
                boxShadow: "0 0 20px rgba(112, 37, 225, 0.35)"
              }}
            >
              SIGN IN
            </Link>
          )}

          <button
            className={`menu-btn ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Responsive Drawer Menu */}
      <div className={`drawer ${menuOpen ? "open" : ""}`}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo size="small" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <ul className="drawer-links">
          <li>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'var(--accent-gold)' }}>
              ⚡ COMMAND CENTER
            </NavLink>
          </li>
          <li>
            <NavLink to="/studio" onClick={() => setMenuOpen(false)}>
              CREATIVE OS STUDIO
            </NavLink>
          </li>
          <li>
            <NavLink to="/opportunities" onClick={() => setMenuOpen(false)}>
              OPPORTUNITIES
            </NavLink>
          </li>
          <li>
            <NavLink to="/enterprise-hub" onClick={() => setMenuOpen(false)}>
              ENTERPRISE HUB
            </NavLink>
          </li>
          {isAuthenticated && user?.role === 'admin' && (
            <li>
              <button
                type="button"
                onClick={() => { setModerationOpen(true); setMenuOpen(false); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-gold)",
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                🛡️ REEL MODERATION
              </button>
            </li>
          )}
          <li>
            <a href="/#features" onClick={() => setMenuOpen(false)}>FEATURES</a>
          </li>
          <li>
            <a href="/#customize" onClick={() => setMenuOpen(false)}>SOLO VS MANAGED</a>
          </li>
          <li>
            <NavLink to="/terms" onClick={() => setMenuOpen(false)}>
              CONTRACTS
            </NavLink>
          </li>
          <li>
            <a href="/#soon" onClick={() => setMenuOpen(false)}>WAITLIST</a>
          </li>
        </ul>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="theme-toggle-btn drawer-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{ width: '100%', justifyContent: 'center', gap: '10px', height: '42px', borderRadius: '99px' }}
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setAvatarPickerOpen(true); setMenuOpen(false); }}
                style={{ borderRadius: "99px", textAlign: "center", padding: "10px", width: "100%", fontSize: "12px" }}
              >
                🎨 Change Avatar ({user?.email})
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{ borderRadius: "99px", textAlign: "center", padding: "10px", width: "100%", color: "var(--accent-rose)", borderColor: "rgba(244,63,94,0.3)" }}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="btn btn-solid"
              onClick={() => setMenuOpen(false)}
              style={{ borderRadius: "99px", textAlign: "center", padding: "12px", background: "var(--accent-purple)" }}
            >
              SIGN IN
            </NavLink>
          )}
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
      />

      {/* Admin Reel Moderation Desk Modal */}
      {moderationOpen && (
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
            overflowY: "auto",
          }}
          onClick={() => setModerationOpen(false)}
        >
          <div
            style={{
              maxWidth: "1080px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AdminReelModeration isOpen={true} onClose={() => setModerationOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
