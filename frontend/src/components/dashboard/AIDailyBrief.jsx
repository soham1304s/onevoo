import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AIDailyBrief = ({ creatorName, alerts = [] }) => {
  const { user, profile } = useAuth();
  const activeCreatorName = creatorName || user?.full_name || profile?.full_name || profile?.handle || user?.email?.split('@')[0] || "Creator";

  const [commandInput, setCommandInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [recommendationAccepted, setRecommendationAccepted] = useState(false);
  const [recProcessing, setRecProcessing] = useState(false);

  const defaultAlerts = [
    {
      icon: "🎥",
      title: "10:00 AM • Commercial Brand Shoot — Crew Load-in",
      description: "Sony FX3 cinema rig & sound technician checked in on Soundstage A. Wardrobe ready.",
      actionLabel: "View Call Sheet ↗",
      badge: "ON-SCHEDULE",
      badgeColor: "var(--accent-green)",
      intentCmd: "Check call sheet and studio load-in for Soundstage A"
    },
    {
      icon: "💰",
      title: "₹32,000 Milestone Escrow Released",
      description: "Tanishq Royal Heritage brand approved deliverable. Funds unlocked into Smart-Vault.",
      actionLabel: "Withdraw Payout ↗",
      badge: "FUNDS READY",
      badgeColor: "var(--accent-gold)",
      intentCmd: "Release escrow milestone for Tanishq Royal Heritage"
    },
    {
      icon: "⚠️",
      title: "Samsung S26 Cinematic Deliverable Due in 24h",
      description: "Color graded 9:16 reel draft is 64% complete. Automated Safe-Zone check passed.",
      actionLabel: "Open Editor ↗",
      badge: "DUE SOON",
      badgeColor: "var(--accent-rose)",
      intentCmd: "Advance Samsung S26 edit to Post-Production"
    }
  ];

  const activeAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const handleExecuteAICommand = async (cmdToRun) => {
    const finalCmd = cmdToRun || commandInput;
    if (!finalCmd.trim()) return;

    try {
      setIsExecuting(true);
      const res = await fetch("http://localhost:3001/api/ai/execute-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: finalCmd,
          userEmail: user?.email || "creator@onevoo.com",
          creatorName: activeCreatorName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExecutionResult(data);
        setCommandInput('');
        setTimeout(() => setExecutionResult(null), 8000);
      }
    } catch (err) {
      console.error("AI execution error:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleConfirmRecommendation = async () => {
    try {
      setRecProcessing(true);
      const res = await fetch("http://localhost:3001/api/deals/auto-mitigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId: "deal-2",
          dealBrand: "Samsung Mobile"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendationAccepted(true);
      }
    } catch (err) {
      console.error("Recommendation confirm error:", err);
    } finally {
      setRecProcessing(false);
    }
  };

  return (
    <div
      className="satin-card"
      style={{
        padding: "24px 28px",
        marginBottom: "24px",
        borderRadius: "20px",
        borderLeft: "4px solid var(--accent-gold)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Subtle Ambient Aura */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "100%",
          background: "radial-gradient(circle at top right, rgba(223, 182, 64, 0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
            <span className="tech-label-mono" style={{ fontSize: "10px", letterSpacing: "0.08em", color: "var(--accent-gold)" }}>
              V10 AUTONOMOUS COGNITIVE OS • AI OPERATIONS NODE
            </span>
          </div>
          <h2 className="disp-title-h2" style={{ margin: "2px 0 4px", fontSize: "clamp(20px, 2.8vw, 28px)" }}>
            Good Morning, {activeCreatorName} 👋
          </h2>
          <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
            Proactive campaign risk modeling, autonomous scheduling agents, and real-time escrow telemetry.
          </p>
        </div>

        <div
          className="mono"
          style={{
            fontSize: "10px",
            padding: "5px 12px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid var(--satin-border)",
            borderRadius: "99px",
            color: "var(--accent-green)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 700,
          }}
        >
          <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
          AUTONOMOUS AGENT ACTIVE
        </div>
      </div>

      {/* NLP Command Bar (Section 1 v10 Engine) */}
      <div
        style={{
          background: "rgba(0,0,0,0.35)",
          border: "1px solid var(--satin-border)",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span className="mono" style={{ fontSize: "10px", color: "var(--accent-cyan)", fontWeight: 800 }}>
            ⚡ COGNITIVE COORDINATOR (NLP COMMAND DISPATCH)
          </span>
          <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
            Natural Language Action Execution
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteAICommand();
          }}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder='e.g. "Schedule Nike shoot for this Friday" or "Advance Samsung edit to Post-Production"...'
            style={{
              flex: 1,
              minWidth: "260px",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--satin-border)",
              borderRadius: "8px",
              color: "var(--paper-soft)",
              fontSize: "12px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={isExecuting}
            className="btn-magnetic"
            style={{
              padding: "10px 18px",
              fontSize: "11px",
              fontWeight: 800,
              background: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))",
              color: "#000",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {isExecuting ? "Executing..." : "⚡ Execute AI Intent"}
          </button>
        </form>

        {/* Quick Command Chips */}
        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
          {[
            { label: "📅 Schedule Nike Shoot Friday", cmd: "Schedule Nike shoot for this Friday on Soundstage A" },
            { label: "⚡ Advance Samsung Edit", cmd: "Advance Samsung S26 edit to Post-Production" },
            { label: "🚨 Dispatch Standby Crew", cmd: "Dispatch emergency standby cinematographer to Mehboob Studio" },
            { label: "💰 Release Milestone Escrow", cmd: "Release escrow milestone for Tanishq Royal Heritage" },
            { label: "💡 Optimize Reel Quote", cmd: "Optimize brand quote for upcoming Nykaa campaign" }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExecuteAICommand(chip.cmd)}
              className="mono"
              style={{
                fontSize: "10px",
                padding: "4px 10px",
                borderRadius: "99px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--satin-border)",
                color: "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-gold)";
                e.currentTarget.style.color = "var(--paper-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--satin-border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Live Execution Feedback Banner */}
        {executionResult && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid var(--accent-green)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
              <span style={{ fontSize: "11.5px", color: "var(--paper-soft)", fontWeight: 600 }}>
                {executionResult.executedAction}
              </span>
            </div>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 800 }}>
              INTENT: {executionResult.intent} • MUTATION SYNCED
            </span>
          </div>
        )}
      </div>

      {/* Alert Feed Items */}
      <div style={{ display: "grid", gap: "10px" }}>
        {activeAlerts.map((alert, idx) => (
          <div
            key={idx}
            className="satin-card"
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              background: "var(--panel)",
              border: "1px solid var(--satin-border)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--line-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--satin-border)";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1, minWidth: "240px" }}>
              <div
                style={{
                  fontSize: "18px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--satin-border)",
                  flexShrink: 0,
                }}
              >
                {alert.icon}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--paper-soft)" }}>
                    {alert.title}
                  </span>
                  {alert.badge && (
                    <span
                      className="mono"
                      style={{
                        fontSize: "8.5px",
                        padding: "1px 6px",
                        borderRadius: "99px",
                        background: "rgba(255, 255, 255, 0.06)",
                        color: alert.badgeColor || "var(--accent-gold)",
                        border: `1px solid ${alert.badgeColor || "var(--accent-gold)"}33`,
                        fontWeight: 700,
                      }}
                    >
                      {alert.badge}
                    </span>
                  )}
                </div>
                <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--text-muted)", lineHeight: 1.35 }}>
                  {alert.description}
                </p>
              </div>
            </div>

            {alert.actionLabel && (
              <button
                type="button"
                className="btn-magnetic"
                style={{
                  padding: "5px 12px",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                }}
                onClick={() => {
                  if (alert.intentCmd) {
                    handleExecuteAICommand(alert.intentCmd);
                  } else {
                    alert(`Navigating to ${alert.actionLabel.replace(' ↗', '')}...`);
                  }
                }}
              >
                {alert.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic Actionable Recommendation Block (Section 5 v10 Core) */}
      <div
        style={{
          marginTop: "16px",
          padding: "16px 20px",
          borderRadius: "14px",
          border: "1px solid rgba(112, 37, 225, 0.35)",
          background: "linear-gradient(135deg, rgba(112, 37, 225, 0.12), rgba(223, 182, 64, 0.08))",
          boxShadow: "0 0 25px rgba(112, 37, 225, 0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>💡</span>
            <span className="mono" style={{ fontSize: "11px", fontWeight: 800, color: "var(--paper-soft)", letterSpacing: "0.05em" }}>
              AI SMART RECOMMENDATION (PROACTIVE MITIGATION)
            </span>
          </div>
          <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-gold)", fontWeight: 700 }}>
            RISK DELTA: -23 PTS (AMBER ➔ GREEN)
          </span>
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 12px" }}>
          Your lead video editor is available tonight. Advancing the edit schedules moves your delivery timeline 
          <strong style={{ color: "var(--paper-soft)" }}> 14 hours ahead of schedule</strong>, reducing campaign risk to healthy green levels.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {!recommendationAccepted ? (
            <button
              type="button"
              onClick={handleConfirmRecommendation}
              disabled={recProcessing}
              className="btn-magnetic"
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 800,
                background: "var(--paper-soft)",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {recProcessing ? "Scheduling Accelerated Render..." : "⚡ Accept & Book Alternative"}
            </button>
          ) : (
            <div
              className="mono"
              style={{
                width: "100%",
                textAlign: "center",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid var(--accent-green)",
                color: "var(--accent-green)",
                fontSize: "11px",
                fontWeight: 800,
              }}
            >
              ✓ Calendar Updated & Video Render Node Confirmed (Delivery Advanced +14h)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDailyBrief;
