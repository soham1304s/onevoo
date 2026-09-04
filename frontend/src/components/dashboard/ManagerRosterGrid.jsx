import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_MANAGER_DEALS = [
  {
    id: "d1",
    creator: "Rahul Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    campaign: "Sony FX3 Masterclass",
    brand: "Sony Alpha India",
    value: 55000,
    stage: "NEGOTIATION",
    deliverable: "1x 4K Masterclass Reel",
  },
  {
    id: "d2",
    creator: "Aman Sen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    campaign: "Nike Kinetic Summer",
    brand: "Nike Athletics",
    value: 147000,
    stage: "PRE-PRODUCTION",
    deliverable: "3x Reels • Crew Checked In",
  },
  {
    id: "d3",
    creator: "Neha Kapoor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    campaign: "Tanishq Royal Heritage",
    brand: "Tanishq Jewelers",
    value: 40000,
    stage: "ON-LOCATION",
    deliverable: "Shoot Day • Mehboob Floor 2",
  },
  {
    id: "d4",
    creator: "Tanvi Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    campaign: "Samsung S26 Cinematic",
    brand: "Samsung Mobile",
    value: 85000,
    stage: "POST-PRODUCTION",
    deliverable: "Edit V2 • Safe-Zone QA Passed",
  },
  {
    id: "d5",
    creator: "Kabir Verma",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80",
    campaign: "Swiggy Gourmet Monsoons",
    brand: "Swiggy India",
    value: 38000,
    stage: "COMPLETED",
    deliverable: "Escrow Settled & Released",
  },
];

export default function ManagerRosterGrid() {
  const { user } = useAuth();
  const storageKey = `onevoo_manager_roster_${user?.email || "default"}`;

  const [pipelineDeals, setPipelineDeals] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_deals`);
      return saved ? JSON.parse(saved) : DEFAULT_MANAGER_DEALS;
    } catch {
      return DEFAULT_MANAGER_DEALS;
    }
  });

  // v9 Addition: Emergency Standby Crew Queue State
  const [standbyCrew, setStandbyCrew] = useState([]);
  const [standbyLoading, setStandbyLoading] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState("");
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ creator: "", brand: "", campaign: "", value: "", stage: "NEGOTIATION", deliverable: "" });

  const fetchStandbyCrew = async () => {
    try {
      setStandbyLoading(true);
      const res = await fetch("/api/standby-crew/on-call");
      const data = await res.json();
      if (data.crew) {
        setStandbyCrew(data.crew);
      }
    } catch (err) {
      console.error("Error fetching standby crew:", err);
    } finally {
      setStandbyLoading(false);
    }
  };

  useEffect(() => {
    fetchStandbyCrew();
  }, []);

  const handleDispatchStandby = async (crewMember) => {
    try {
      const res = await fetch("/api/standby-crew/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crewId: crewMember.id,
          campaignName: "Priority On-Location Shoot Day",
          studioLocation: "Mehboob Studio Floor 2",
          managerEmail: user?.email || "manager@onevoo.com",
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Automatically insert into active roster pipeline
        const replacementDeal = {
          id: `standby-deal-${Date.now()}`,
          creator: crewMember.full_name,
          avatar: crewMember.avatar_url,
          campaign: `🚨 Standby Backup: ${crewMember.role.split('(')[0]}`,
          brand: "Emergency Dispatch (Locked Escrow)",
          value: Number(crewMember.day_rate),
          stage: "ON-LOCATION",
          deliverable: `${crewMember.gear_spec} • GPS Dispatched`,
        };
        setPipelineDeals([replacementDeal, ...pipelineDeals]);
        setDispatchSuccessMsg(`✓ ${crewMember.full_name} dispatched to set! Escrow of ₹${Number(crewMember.day_rate).toLocaleString('en-IN')} locked.`);
        setTimeout(() => setDispatchSuccessMsg(""), 6000);
        fetchStandbyCrew();
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_deals`, JSON.stringify(pipelineDeals));
    } catch (e) {
      console.warn("Manager storage sync error:", e);
    }
  }, [pipelineDeals, storageKey]);

  const stages = [
    { key: "NEGOTIATION", label: "01. Negotiation", color: "var(--accent-purple)" },
    { key: "PRE-PRODUCTION", label: "02. Pre-Production", color: "var(--accent-cyan)" },
    { key: "ON-LOCATION", label: "03. On-Location", color: "var(--accent-gold)" },
    { key: "POST-PRODUCTION", label: "04. Post-Production", color: "var(--accent-rose)" },
    { key: "COMPLETED", label: "05. Settled", color: "var(--accent-green)" },
  ];

  // Dynamic calculations
  const totalGrossBillings = pipelineDeals.reduce((acc, curr) => acc + Number(curr.value || 0), 0);
  const agencyNetMargin = Math.round(totalGrossBillings * 0.15);
  const outstandingInvoices = pipelineDeals
    .filter((d) => d.stage !== "COMPLETED")
    .reduce((acc, curr) => acc + Number(curr.value || 0), 0);

  const handleAdvanceStage = (id) => {
    setPipelineDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const curIdx = stages.findIndex((s) => s.key === d.stage);
        const nextIdx = (curIdx + 1) % stages.length;
        return { ...d, stage: stages[nextIdx].key };
      })
    );
  };

  const handleDeleteDeal = (id) => {
    setPipelineDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDeal = (e) => {
    e.preventDefault();
    if (!newDeal.creator || !newDeal.brand || !newDeal.value) return;
    const item = {
      id: `d-${Date.now()}`,
      creator: newDeal.creator,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      campaign: newDeal.campaign || "Custom Campaign",
      brand: newDeal.brand,
      value: Number(newDeal.value),
      stage: newDeal.stage || "NEGOTIATION",
      deliverable: newDeal.deliverable || "1x 4K Master Video"
    };
    setPipelineDeals([...pipelineDeals, item]);
    setNewDeal({ creator: "", brand: "", campaign: "", value: "", stage: "NEGOTIATION", deliverable: "" });
    setShowAddDealModal(false);
  };

  return (
    <div className="manager-roster-grid" style={{ position: "relative" }}>
      {/* Header */}
      <div
        className="satin-card"
        style={{
          padding: "22px 26px",
          marginBottom: "24px",
          borderRadius: "18px",
          borderLeft: "4px solid var(--accent-cyan)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span className="tech-label-mono" style={{ fontSize: "10px" }}>TALENT AGENCY MANAGEMENT OS</span>
          <h2 className="disp-title-h2" style={{ margin: "2px 0", fontSize: "24px" }}>
            Multi-Roster Control Grid
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
            Managing <strong>{pipelineDeals.length} Roster Deals</strong> across 5 Production Stages • 15% Standard Agency Fee
          </p>
        </div>

        <button
          type="button"
          className="btn-magnetic"
          style={{ padding: "6px 16px", fontSize: "10.5px" }}
          onClick={() => setShowAddDealModal(true)}
        >
          + NEW ROSTER DEAL ↗
        </button>
      </div>

      {/* Financial Analytics Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        <div className="satin-card" style={{ padding: "18px 22px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>GROSS ROSTER BILLINGS</span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            ₹{totalGrossBillings.toLocaleString()}
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-green)" }}>+34% vs last month</span>
        </div>

        <div className="satin-card" style={{ padding: "18px 22px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>AGENCY NET MARGIN (15%)</span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            ₹{agencyNetMargin.toLocaleString()}
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Auto-split on settlement</span>
        </div>

        <div className="satin-card" style={{ padding: "18px 22px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>OUTSTANDING INVOICES</span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            ₹{outstandingInvoices.toLocaleString()}
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-cyan)" }}>95% Factoring eligible</span>
        </div>

        <div className="satin-card" style={{ padding: "18px 22px", borderRadius: "16px" }}>
          <span className="tech-label-mono" style={{ fontSize: "9.5px" }}>ACTIVE CREW ON SET</span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-green)", fontFamily: "var(--font-display)", margin: "3px 0" }}>
            10 CREW
          </div>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>5 Photographers • 3 Cine • 2 Drone</span>
        </div>
      </div>

      {/* Kanban Pipeline Boards */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "var(--paper-soft)" }}>
            Active Roster Deal Pipeline
          </h3>
          <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
            CLICK ➔ ON CARD TO ADVANCE STAGE
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {stages.map((st) => {
            const stageDeals = pipelineDeals.filter((d) => d.stage === st.key);
            return (
              <div
                key={st.key}
                className="satin-card"
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  background: "rgba(0, 0, 0, 0.25)",
                  borderTop: `3px solid ${st.color}`,
                  minWidth: "190px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span className="mono" style={{ fontSize: "10px", fontWeight: 700, color: st.color }}>
                    {st.label}
                  </span>
                  <span className="mono" style={{ fontSize: "9.5px", background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: "99px" }}>
                    {stageDeals.length}
                  </span>
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  {stageDeals.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "var(--panel)",
                        border: "1px solid var(--satin-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <img
                            src={d.avatar}
                            alt={d.creator}
                            style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--paper-soft)" }}>
                            {d.creator}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteDeal(d.id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11px", cursor: "pointer", opacity: 0.6 }}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ fontSize: "11px", color: "var(--paper-soft)", fontWeight: 600, marginBottom: "2px" }}>
                        {d.campaign}
                      </div>
                      <div className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        {d.brand}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "6px" }}>
                        <span className="mono" style={{ fontSize: "11.5px", fontWeight: 800, color: "var(--accent-gold)" }}>
                          ₹{Number(d.value).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(d.id)}
                          className="mono"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid var(--satin-border)",
                            color: "var(--accent-cyan)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "9px",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                          title="Advance to next pipeline stage"
                        >
                          ➔ ADVANCE
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div style={{ padding: "16px 0", textAlign: "center", fontSize: "10.5px", color: "var(--text-muted)" }} className="mono">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* v9 ADDITION: REAL-TIME EMERGENCY STANDBY CREW QUEUE (ON-CALL DISPATCH) */}
      {/* ========================================================================= */}
      <div
        className="satin-card"
        style={{
          padding: "22px 26px",
          borderRadius: "18px",
          marginBottom: "24px",
          borderLeft: "4px solid var(--accent-rose)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="mono" style={{ fontSize: "10px", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", padding: "2px 8px", borderRadius: "99px", fontWeight: 800 }}>
                🚨 EMERGENCY STANDBY QUEUE (v9)
              </span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>
                {standbyCrew.filter(c => c.on_call_today).length} On-Call Verified Specialists
              </span>
            </div>
            <h3 style={{ margin: "4px 0 2px", fontSize: "16px", color: "var(--paper-soft)" }}>
              Instant Shoot-Day Replacement & Backup Roster
            </h3>
            <p style={{ margin: 0, fontSize: "11.5px", color: "var(--text-muted)" }}>
              Vetted local crew members designated as "On-Call Today" for immediate 1-click booking if an active team member cancels.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStandbyCrew}
            className="mono"
            style={{
              padding: "6px 12px",
              fontSize: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--satin-border)",
              color: "var(--paper-soft)",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ↺ Refresh Live Radar
          </button>
        </div>

        {/* Success Banner */}
        {dispatchSuccessMsg && (
          <div
            className="mono"
            style={{
              marginBottom: "14px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid var(--accent-green)",
              color: "var(--accent-green)",
              fontSize: "11.5px",
              fontWeight: 700,
            }}
          >
            {dispatchSuccessMsg}
          </div>
        )}

        {/* Standby Crew Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {standbyCrew.map((crew) => (
            <div
              key={crew.id}
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "var(--panel)",
                border: crew.status === "DISPATCHED" ? "1px solid var(--accent-green)" : "1px solid var(--satin-border)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <img
                  src={crew.avatar_url}
                  alt={crew.full_name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--accent-gold)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--paper-soft)" }}>
                      {crew.full_name}
                    </span>
                    <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 800 }}>
                      ★ {crew.rating}
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: "10px", color: "var(--accent-cyan)" }}>
                    {crew.role}
                  </div>
                  <div className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                    📍 {crew.proximity_landmark} • {crew.shoots_completed} Shoots Done
                  </div>
                </div>
              </div>

              <div style={{ padding: "6px 8px", borderRadius: "6px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: "8.5px", color: "var(--accent-gold)", display: "block" }}>GEAR KIT ON STANDBY:</span>
                <span style={{ fontSize: "10.5px", color: "var(--paper-soft)", lineHeight: 1.2 }}>{crew.gear_spec}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
                <div>
                  <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", display: "block" }}>DAY RATE</span>
                  <span className="mono" style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--accent-green)" }}>
                    ₹{Number(crew.day_rate).toLocaleString()}
                  </span>
                </div>

                {crew.status === "DISPATCHED" ? (
                  <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 800, padding: "4px 10px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)" }}>
                    ✓ DISPATCHED ON-SET
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDispatchStandby(crew)}
                    className="btn-magnetic"
                    style={{
                      padding: "6px 14px",
                      fontSize: "10px",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, var(--accent-rose), #9f1239)",
                      color: "#fff",
                      borderColor: "var(--accent-rose)",
                    }}
                  >
                    🚨 DISPATCH STANDBY (1-CLICK) ↗
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Add New Roster Deal */}
      {showAddDealModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowAddDealModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "460px", width: "100%", padding: "28px", borderRadius: "20px", border: "1px solid var(--accent-cyan)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--paper-soft)" }}>+ Add New Roster Deal</h3>
              <button onClick={() => setShowAddDealModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddDeal} style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>TALENT / CREATOR NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Patel"
                  value={newDeal.creator}
                  onChange={(e) => setNewDeal({ ...newDeal, creator: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>BRAND SPONSOR</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Alpha India"
                  value={newDeal.brand}
                  onChange={(e) => setNewDeal({ ...newDeal, brand: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CAMPAIGN TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Sony FX3 Cinema Masterclass"
                  value={newDeal.campaign}
                  onChange={(e) => setNewDeal({ ...newDeal, campaign: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>GROSS DEAL VALUE (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 75000"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>INITIAL STAGE</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  >
                    <option value="NEGOTIATION">01. Negotiation</option>
                    <option value="PRE-PRODUCTION">02. Pre-Production</option>
                    <option value="ON-LOCATION">03. On-Location</option>
                    <option value="POST-PRODUCTION">04. Post-Production</option>
                    <option value="COMPLETED">05. Settled</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-magnetic" style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-cyan)", color: "#000", fontWeight: 800 }}>
                SAVE TO KANBAN ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
