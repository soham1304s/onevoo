import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifiedRoute({ children, allowedRoles }) {
  const { user, profile, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="auth-gate mono" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="page-loader-spinner" style={{ margin: "0 auto 16px" }} />
          <span style={{ color: "var(--accent-gold)" }}>Verifying Onevoo Role Credentials & Escrow Node…</span>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const userRole = (profile?.role || user?.role || "CREATOR").toUpperCase();

  // Role Gate Check if allowedRoles specified
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <section className="auth-gate wrap" style={{ padding: "100px 24px 60px", textAlign: "center" }}>
        <div className="satin-card" style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 32px", borderRadius: "20px", border: "1px solid var(--accent-rose)" }}>
          <span className="mono" style={{ color: "var(--accent-rose)", fontSize: "11px", fontWeight: 800 }}>
            ACCESS RESTRICTED • ROLE MISMATCH
          </span>
          <h2 style={{ textTransform: "uppercase", margin: "14px 0 16px", color: "var(--paper-soft)" }}>
            Unauthorized Command Center
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
            Your current authenticated account role is <strong>{userRole}</strong>. This specific workspace requires one of: <strong>{allowedRoles.join(", ")}</strong>.
          </p>
          <a className="btn-magnetic" href="/dashboard" style={{ padding: "12px 28px", fontSize: "12px" }}>
            RETURN TO UNIFIED COMMAND CENTER →
          </a>
        </div>
      </section>
    );
  }

  return children;
}