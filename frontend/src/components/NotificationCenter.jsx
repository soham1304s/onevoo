import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "task" | "escrow"
  const panelRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "task") return item.type === "task" || item.type === "submission";
    if (activeFilter === "escrow") return item.type === "escrow";
    return true;
  });

  return (
    <div className="notification-center-root" ref={panelRef} style={{ position: "relative" }}>
      {/* Bell Icon Trigger Button */}
      <button
        type="button"
        className="notification-bell-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            // mark viewed
          }
        }}
        aria-label="Notification & Task Activity Center"
        title="Notification & Queued Task Center"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--satin-border)",
          color: "var(--paper-soft)",
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s ease",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread Counter Badge Pill */}
        {unreadCount > 0 && (
          <span
            className="mono notification-badge-pill"
            style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              background: "var(--accent-rose)",
              color: "#ffffff",
              fontSize: "9px",
              fontWeight: 800,
              padding: "2px 5px",
              borderRadius: "99px",
              minWidth: "16px",
              textAlign: "center",
              boxShadow: "0 0 10px rgba(244, 63, 94, 0.6)",
              lineHeight: 1,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="notification-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Flyout Panel */}
      {isOpen && (
        <div className="notification-flyout-panel">
          {/* Header */}
          <div className="notification-panel-header">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 800 }}>
                  LIVE ACTIVITY CENTER
                </span>
              </div>
              <h3 className="notification-panel-title">
                Notifications & Tasks
              </h3>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="mono"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent-gold)",
                  fontSize: "10.5px",
                  cursor: "pointer",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="notification-tabs-bar">
            {[
              { id: "all", label: `All (${notifications.length})` },
              { id: "task", label: "Tasks / Submissions" },
              { id: "escrow", label: "Escrow" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`mono ${activeFilter === tab.id ? "active" : ""}`}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontSize: "10px",
                  fontWeight: activeFilter === tab.id ? 800 : 600,
                  borderRadius: "6px",
                  border: activeFilter === tab.id ? "1px solid rgba(223, 182, 64, 0.4)" : "1px solid transparent",
                  background: activeFilter === tab.id ? "rgba(223, 182, 64, 0.15)" : "transparent",
                  color: activeFilter === tab.id ? "var(--accent-gold)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="notification-list-body">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => {
                const s = (item.status || "").toUpperCase();
                let badgeBg = "rgba(223, 182, 64, 0.18)";
                let badgeColor = "#dfb640";
                let badgeBorder = "rgba(223, 182, 64, 0.4)";

                if (s.includes("APPROVED") || s.includes("FEATURED") || s.includes("SETTLED")) {
                  badgeBg = "rgba(16, 185, 129, 0.18)";
                  badgeColor = "#10b981";
                  badgeBorder = "rgba(16, 185, 129, 0.4)";
                } else if (s.includes("NOT APPROVED") || s.includes("REJECTED") || s.includes("DISPUTE")) {
                  badgeBg = "rgba(244, 63, 94, 0.18)";
                  badgeColor = "#f43f5e";
                  badgeBorder = "rgba(244, 63, 94, 0.4)";
                } else if (s.includes("ESCROW") || s.includes("FUNDS")) {
                  badgeBg = "rgba(56, 189, 248, 0.18)";
                  badgeColor = "#38bdf8";
                  badgeBorder = "rgba(56, 189, 248, 0.4)";
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className="notification-item"
                    style={{
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: item.isRead ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.07)",
                      border: item.isRead ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(223, 182, 64, 0.4)",
                      position: "relative",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: "9px",
                          padding: "2px 8px",
                          borderRadius: "99px",
                          background: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeBorder}`,
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {item.status || "UPDATE"}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
                          {item.time}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(item.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "0 4px",
                          }}
                          title="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <h4 style={{ margin: "2px 0 4px", fontSize: "13px", fontWeight: 700, color: "#ffffff", lineHeight: 1.35 }}>
                      {item.title}
                    </h4>

                    <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8", lineHeight: 1.45, wordBreak: "break-word" }}>
                      {item.message}
                    </p>

                    {item.actionText && (
                      <div style={{ marginTop: "8px" }}>
                        <Link
                          to={item.actionLink || "/opportunities"}
                          onClick={() => setIsOpen(false)}
                          className="mono"
                          style={{
                            fontSize: "10.5px",
                            color: "var(--accent-gold)",
                            fontWeight: 700,
                            textDecoration: "underline",
                          }}
                        >
                          {item.actionText} →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "28px", marginBottom: "6px" }}>🔔</div>
                <p className="mono" style={{ fontSize: "11px", margin: 0 }}>
                  No active tasks or notifications queued.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notification-panel-footer">
              <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                {notifications.length} total events logged
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="mono"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent-rose)",
                  fontSize: "10px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
