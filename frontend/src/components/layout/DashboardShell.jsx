import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { useRealTimeDeals } from "../../hooks/useRealTimeDeals";
import CreatorCommandCenter from "../dashboard/CreatorCommandCenter";
import BrandCollaborationDesk from "../dashboard/BrandCollaborationDesk";
import ManagerRosterGrid from "../dashboard/ManagerRosterGrid";
import VendorMarketplaceConsole from "../dashboard/VendorMarketplaceConsole";
import AdminOperationsConsole from "../dashboard/AdminOperationsConsole";

export const DashboardShell = ({ initialRole = "CREATOR" }) => {
  const { user, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentRole, setCurrentRole] = useState(initialRole);
  const { activeNotification, clearNotification, acceptDeal } = useRealTimeDeals("current-user");

  const allRoles = [
    { id: "CREATOR", label: "Creator Command Center", icon: "🎨", subtitle: "Production & Escrow" },
    { id: "BRAND", label: "Brand Collaboration Desk", icon: "🏢", subtitle: "Asset QC & Approvals" },
    { id: "MANAGER", label: "Multi-Roster Grid", icon: "💼", subtitle: "Kanban & Pipeline" },
    { id: "VENDOR", label: "Vendor / Crew Marketplace", icon: "🎥", subtitle: "Schedules & Dispatch" },
    { id: "ADMIN", label: "Platform Operations Console", icon: "🛡️", subtitle: "Disputes & Arbitrage" },
  ];

  // Only show ADMIN role to authenticated administrators
  const roles = allRoles.filter((r) => r.id !== "ADMIN" || isAdmin);

  useEffect(() => {
    if (!isAdmin && currentRole === "ADMIN") {
      setCurrentRole("CREATOR");
    }
  }, [isAdmin, currentRole]);

  return (
    <div
      className="dashboard-shell-root"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--ink)",
        color: "var(--paper-soft)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background Engineering Grid & Hardware Accelerated Orbs */}
      <div
        className="engineering-backdrop-grid"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
      <div className="ambient-glow-wrapper" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div className="glow-orb orb-violet" style={{ top: "-10%", right: "10%", opacity: 0.25 }} />
        <div className="glow-orb orb-cyan" style={{ bottom: "10%", left: "5%", opacity: 0.2 }} />
      </div>

      {/* Real-Time Opportunity Notification Toast */}
      {activeNotification && (
        <div
          className="satin-card"
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            maxWidth: "380px",
            width: "calc(100% - 48px)",
            padding: "16px 20px",
            borderRadius: "14px",
            borderLeft: "4px solid var(--accent-green)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            animation: "pulse 2s infinite ease-in-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 800 }}>
                ⚡ LIVE MATCH OPPORTUNITY
              </span>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--paper-soft)", margin: "3px 0" }}>
                {activeNotification.campaignName}
              </div>
              <p style={{ margin: 0, fontSize: "11.5px", color: "var(--text-muted)" }}>
                Brand: <strong>{activeNotification.brandName}</strong> • Max: ₹{activeNotification.compensationRange?.max?.toLocaleString()}
              </p>

              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => acceptDeal(activeNotification.dealId)}
                  className="btn-magnetic"
                  style={{
                    padding: "6px 14px",
                    fontSize: "10.5px",
                    fontWeight: 800,
                    background: "var(--accent-green)",
                    color: "#000",
                    borderColor: "var(--accent-green)",
                  }}
                >
                  ACCEPT DEAL ↗
                </button>
                <button
                  type="button"
                  onClick={clearNotification}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--satin-border)",
                    color: "var(--text-muted)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "10.5px",
                    cursor: "pointer",
                  }}
                >
                  DISMISS
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={clearNotification}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="dashboard-layout-container" style={{ position: "relative", zIndex: 1, display: "flex", flex: 1 }}>
        {/* Collapsible Sidebar Rail */}
        <aside
          className="satin-card dashboard-sidebar"
          style={{
            width: sidebarOpen ? "260px" : "72px",
            minWidth: sidebarOpen ? "260px" : "72px",
            transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            borderRight: "1px solid var(--satin-border)",
            borderTop: "none",
            borderBottom: "none",
            borderLeft: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: sidebarOpen ? "18px 14px" : "18px 8px",
            background: "var(--panel)",
            backdropFilter: "blur(28px)",
          }}
        >
          <div>
            {/* Sidebar Top: Role Header & Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: sidebarOpen ? "space-between" : "center",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "14px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {sidebarOpen && (
                <div>
                  <span className="tech-label-mono" style={{ fontSize: "9px" }}>COMMAND CENTER</span>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--paper-soft)" }}>
                    {currentRole} WORKSPACE
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mono"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--satin-border)",
                  color: "var(--accent-gold)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
                title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {sidebarOpen ? "◀" : "▶"}
              </button>
            </div>

            {/* Role Switcher Menu */}
            <div style={{ display: "grid", gap: "6px" }}>
              {sidebarOpen && (
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", padding: "0 8px 6px" }}>
                  SWITCH ROLE PERSONA [39]:
                </span>
              )}

              {roles.map((r) => {
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setCurrentRole(r.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: sidebarOpen ? "10px 12px" : "12px 0",
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      borderRadius: "10px",
                      background: isActive ? "linear-gradient(135deg, rgba(223, 182, 64, 0.15), rgba(112, 37, 225, 0.2))" : "transparent",
                      border: isActive ? "1px solid var(--accent-gold)" : "1px solid transparent",
                      color: isActive ? "var(--paper-soft)" : "var(--text-muted)",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all 0.2s ease",
                    }}
                    title={r.label}
                  >
                    <span style={{ fontSize: "18px" }}>{r.icon}</span>
                    {sidebarOpen && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "12px", fontWeight: isActive ? 800 : 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.id}
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.subtitle}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Navigation Links */}
            {sidebarOpen && (
              <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", padding: "0 8px 6px", display: "block" }}>
                  PLATFORM NAVIGATION:
                </span>
                <div style={{ display: "grid", gap: "4px" }}>
                  <Link
                    to="/studio"
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      fontSize: "11.5px",
                      color: "var(--paper-soft)",
                      textDecoration: "none",
                      borderRadius: "6px",
                    }}
                  >
                    ⚡ Creative OS Studio
                  </Link>
                  <Link
                    to="/enterprise-hub"
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      fontSize: "11.5px",
                      color: "var(--paper-soft)",
                      textDecoration: "none",
                      borderRadius: "6px",
                    }}
                  >
                    🌐 Enterprise Hub (FX & Factoring)
                  </Link>
                  <Link
                    to="/opportunities"
                    style={{
                      display: "block",
                      padding: "8px 10px",
                      fontSize: "11.5px",
                      color: "var(--paper-soft)",
                      textDecoration: "none",
                      borderRadius: "6px",
                    }}
                  >
                    💼 Deal Opportunities
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/reels"
                      style={{
                        display: "block",
                        padding: "8px 10px",
                        fontSize: "11.5px",
                        color: "var(--accent-gold)",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontWeight: 700,
                      }}
                    >
                      🛡️ Reel Moderation Desk
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Footer: System Status */}
          <div style={{ paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: sidebarOpen ? "flex-start" : "center" }}>
              <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
              {sidebarOpen && (
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>
                  ALL SYSTEMS OPERATIONAL
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Dynamic Role Workspace Main Content */}
        <main className="dashboard-main-content" style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {currentRole === "CREATOR" && <CreatorCommandCenter />}
          {currentRole === "BRAND" && <BrandCollaborationDesk />}
          {currentRole === "MANAGER" && <ManagerRosterGrid />}
          {currentRole === "VENDOR" && <VendorMarketplaceConsole />}
          {currentRole === "ADMIN" && <AdminOperationsConsole />}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
