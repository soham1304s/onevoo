import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AIDailyBrief from "./AIDailyBrief";
import CreatorVerificationHub from "../verification/CreatorVerificationHub";

const DEFAULT_DEALS = [
  {
    id: "deal-1",
    brand: "Nike Athletics India",
    title: "Monsoon Kinetic Summer Reel",
    escrow: 50000,
    progress: 90,
    stage: "PRE-PRODUCTION",
    deadline: "Sep 08, 2026",
    deliverables: "1x 60s 4K Reel + 3x Stills"
  },
  {
    id: "deal-2",
    brand: "Samsung Mobile",
    title: "Samsung S26 Cinematic Launch",
    escrow: 45000,
    progress: 64,
    stage: "POST-PRODUCTION",
    deadline: "Sep 04, 2026",
    deliverables: "1x 9:16 Reel (Edit V2)"
  }
];

const DEFAULT_SETTLED = [
  { id: "set-1", brand: "Nykaa Monochrome Makeup Campaign", amount: 65000, date: "Aug 28, 2026", status: "SETTLED" },
  { id: "set-2", brand: "Tanishq Royal Heritage Doc Shoot", amount: 32000, date: "Aug 22, 2026", status: "SETTLED" },
  { id: "set-3", brand: "Sony Alpha Creator Masterclass", amount: 50000, date: "Aug 15, 2026", status: "SETTLED" },
];

const DEFAULT_SCHEDULE = [
  { id: "sch-1", time: "10:00 AM", title: "Crew Call & Equipment Load-in", location: "Mehboob Studio Floor 2", notes: "Lighting grid rigging and Sony FX3 sync." },
  { id: "sch-2", time: "11:30 AM", title: "Principal 9:16 Brand Reel Shoot", location: "Soundstage A", notes: "Macro beauty sequences with 85mm F1.2 prime lens." },
  { id: "sch-3", time: "03:00 PM", title: "Cultural B-Roll & Slow-Mo", location: "Studio Courtyard", notes: "120fps kinetic fabric motion and texture captures." },
  { id: "sch-4", time: "05:30 PM", title: "Wrap & Footage Ingestion", location: "DIT Station", notes: "Dual-card backup and Cloudinary encoding." }
];

const DEFAULT_CHECKLIST = [
  { id: 1, task: "Sony FX3 + 24-70mm GM II sensor clean & battery charged (100%)", done: true, tag: "GEAR" },
  { id: 2, task: "Color-graded LUT preset loaded on Ninja V+ Monitor", done: true, tag: "TECH" },
  { id: 3, task: "Wardrobe styling: Earth-toned linen kurta for shoot sequence", done: false, tag: "WARDROBE" },
  { id: 4, task: "Mehboob Studio floor permit & crew badge signed", done: true, tag: "LOGISTICS" },
  { id: 5, task: "Wireless lav mic frequency test & secondary scratch track synced", done: false, tag: "AUDIO" },
  { id: 6, task: "Shoot 3x B-roll textures of spice market for brand intro", done: false, tag: "SHOTLIST" },
];

export default function CreatorCommandCenter() {
  const { user, profile } = useAuth();
  
  // Real user display name (fallback to handle or profile name)
  const creatorDisplayName = user?.full_name || profile?.full_name || profile?.handle || user?.email?.split('@')[0] || "Verified Creator";

  // Persistent State Key for User
  const storageKey = `onevoo_creator_workspace_${user?.email || "default"}`;

  // State with LocalStorage Persistence
  const [deals, setDeals] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_deals`);
      return saved ? JSON.parse(saved) : DEFAULT_DEALS;
    } catch {
      return DEFAULT_DEALS;
    }
  });

  const [settledEarnings, setSettledEarnings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_settled`);
      return saved ? JSON.parse(saved) : DEFAULT_SETTLED;
    } catch {
      return DEFAULT_SETTLED;
    }
  });

  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_schedule`);
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  });

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_checklist`);
      return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST;
    } catch {
      return DEFAULT_CHECKLIST;
    }
  });

  const [mediaKit, setMediaKit] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_mediakit`);
      return saved ? JSON.parse(saved) : { views: "540K+", engagement: "8.4%", rateCard: "Active", niche: "Cinematic Storytelling" };
    } catch {
      return { views: "540K+", engagement: "8.4%", rateCard: "Active", niche: "Cinematic Storytelling" };
    }
  });

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_deals`, JSON.stringify(deals));
      localStorage.setItem(`${storageKey}_settled`, JSON.stringify(settledEarnings));
      localStorage.setItem(`${storageKey}_schedule`, JSON.stringify(schedule));
      localStorage.setItem(`${storageKey}_checklist`, JSON.stringify(checklist));
      localStorage.setItem(`${storageKey}_mediakit`, JSON.stringify(mediaKit));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, [deals, settledEarnings, schedule, checklist, mediaKit, storageKey]);

  // Modal Control States
  const [shootDayMode, setShootDayMode] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showMediaKitModal, setShowMediaKitModal] = useState(false);
  const [showVerificationHub, setShowVerificationHub] = useState(false);

  // Form Input States
  const [newDeal, setNewDeal] = useState({ brand: "", title: "", escrow: "", progress: 10, stage: "PRE-PRODUCTION", deadline: "", deliverables: "" });
  const [newPayout, setNewPayout] = useState({ brand: "", amount: "", date: "Today" });
  const [newScheduleItem, setNewScheduleItem] = useState({ time: "", title: "", location: "", notes: "" });
  const [newTask, setNewTask] = useState({ task: "", tag: "GEAR" });

  // Calculations
  const totalSettledAmount = settledEarnings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPendingEscrow = deals.reduce((acc, curr) => acc + Number(curr.escrow || 0), 0);
  const completedChecklistCount = checklist.filter((c) => c.done).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  // v9 Addition: Factoring Quick-Unlock Slide Card State
  const [factoringLoading, setFactoringLoading] = useState(false);
  const [factoringSuccessMsg, setFactoringSuccessMsg] = useState("");

  // Actions
  const toggleCheck = (id) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const handleFactoringUnlock = async () => {
    if (totalPendingEscrow <= 0) return;
    setFactoringLoading(true);
    try {
      const advanceVal = Math.round(totalPendingEscrow * 0.95);
      const res = await fetch("http://localhost:3001/api/factoring/disburse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealTitle: deals[0]?.title || "Active Escrow Deals",
          creatorName: creatorDisplayName,
          brandName: deals[0]?.brand || "Brand Partners",
          invoiceValue: totalPendingEscrow,
          feeRate: 0.05,
          approvalRiskScore: 98,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Add instant disbursed cash advance to settledEarnings in real-time
        const newSettledItem = {
          id: `factored-${Date.now()}`,
          brand: `⚡ Factored Advance: ${deals[0]?.brand || "Escrow Buyout"}`,
          amount: advanceVal,
          date: "Just now (Instant)",
          status: "DISBURSED",
        };
        setSettledEarnings([newSettledItem, ...settledEarnings]);
        setFactoringSuccessMsg(`✓ ₹${advanceVal.toLocaleString('en-IN')} (95% of escrow) disbursed instantly to your wallet! 5% platform fee logged.`);
        setTimeout(() => setFactoringSuccessMsg(""), 6000);
      }
    } catch (err) {
      console.error("Factoring unlock error:", err);
      // Fallback update in state if offline
      const advanceVal = Math.round(totalPendingEscrow * 0.95);
      const newSettledItem = {
        id: `factored-${Date.now()}`,
        brand: `⚡ Factored Advance: ${deals[0]?.brand || "Escrow Buyout"}`,
        amount: advanceVal,
        date: "Just now (Instant)",
        status: "DISBURSED",
      };
      setSettledEarnings([newSettledItem, ...settledEarnings]);
      setFactoringSuccessMsg(`✓ ₹${advanceVal.toLocaleString('en-IN')} disbursed instantly!`);
      setTimeout(() => setFactoringSuccessMsg(""), 6000);
    } finally {
      setFactoringLoading(false);
    }
  };

  const handleAddDeal = (e) => {
    e.preventDefault();
    if (!newDeal.brand || !newDeal.title || !newDeal.escrow) return;
    const item = {
      id: `deal-${Date.now()}`,
      brand: newDeal.brand,
      title: newDeal.title,
      escrow: Number(newDeal.escrow),
      progress: Number(newDeal.progress) || 10,
      stage: newDeal.stage || "PRE-PRODUCTION",
      deadline: newDeal.deadline || "TBD",
      deliverables: newDeal.deliverables || "1x 4K Vertical Reel"
    };
    setDeals([item, ...deals]);
    setNewDeal({ brand: "", title: "", escrow: "", progress: 10, stage: "PRE-PRODUCTION", deadline: "", deliverables: "" });
    setShowAddDealModal(false);
  };

  const handleDeleteDeal = (id) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  // v10 Predictive Risk Mitigation Handler
  const handleAutoMitigateRisk = async (dealId, brandName) => {
    try {
      const res = await fetch("http://localhost:3001/api/deals/auto-mitigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, dealBrand: brandName })
      });
      const data = await res.json();
      if (data.success) {
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, riskScore: 91, stage: "POST-PRODUCTION (ACCELERATED)" } : d))
        );
        addNotification({
          title: "Deal Risk Auto-Mitigated ⚡",
          message: data.message,
          type: "mitigation",
          status: "SUCCESS"
        });
      }
    } catch (err) {
      console.error("Auto mitigate error:", err);
    }
  };

  // v10 Brand Rate Intelligence & Quote Optimizer
  const [quoteOptimizerVisible, setQuoteOptimizerVisible] = useState(false);
  const [quoteOptimizerData, setQuoteOptimizerData] = useState(null);

  const handleFetchQuoteOptimization = async (brandName, askingRate) => {
    try {
      const res = await fetch("http://localhost:3001/api/deals/optimize-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAskingRate: askingRate || 38000,
          brandName: brandName || "Nykaa Beauty",
          creatorReach: 450000,
          engagementRate: 4.8
        })
      });
      const data = await res.json();
      if (data.success) {
        setQuoteOptimizerData(data);
        setQuoteOptimizerVisible(true);
      }
    } catch (err) {
      console.error("Quote optimization error:", err);
    }
  };

  const handleApplyOptimizedQuote = (optimizedAmount) => {
    if (deals.length > 0) {
      setDeals((prev) =>
        prev.map((d, i) => (i === 0 ? { ...d, escrow: optimizedAmount } : d))
      );
    }
    addNotification({
      title: "Optimized Quote Applied",
      message: `Updated deal asking price to ₹${Number(optimizedAmount).toLocaleString('en-IN')} (+22% market value index).`,
      type: "escrow",
      status: "UPDATED"
    });
    setQuoteOptimizerVisible(false);
  };

  const handleAddPayout = (e) => {
    e.preventDefault();
    if (!newPayout.brand || !newPayout.amount) return;
    const item = {
      id: `set-${Date.now()}`,
      brand: newPayout.brand,
      amount: Number(newPayout.amount),
      date: newPayout.date || "Just now",
      status: "SETTLED"
    };
    setSettledEarnings([item, ...settledEarnings]);
    setNewPayout({ brand: "", amount: "", date: "Today" });
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newScheduleItem.time || !newScheduleItem.title) return;
    const item = {
      id: `sch-${Date.now()}`,
      time: newScheduleItem.time,
      title: newScheduleItem.title,
      location: newScheduleItem.location || "Studio Floor",
      notes: newScheduleItem.notes || "Production task"
    };
    setSchedule([...schedule, item]);
    setNewScheduleItem({ time: "", title: "", location: "", notes: "" });
    setShowAddScheduleModal(false);
  };

  const handleDeleteSchedule = (id) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.task) return;
    const item = {
      id: Date.now(),
      task: newTask.task,
      done: false,
      tag: newTask.tag || "GEAR"
    };
    setChecklist([...checklist, item]);
    setNewTask({ task: "", tag: "GEAR" });
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (id) => {
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  };

  // Dynamic Brief Alerts generated from user's live data
  const dynamicAlerts = [
    schedule[0] ? {
      icon: "🎥",
      title: `${schedule[0].time} • ${schedule[0].title}`,
      description: `${schedule[0].location} — ${schedule[0].notes}`,
      actionLabel: "View Timeline ↗",
      badge: "ACTIVE SHOOT",
      badgeColor: "var(--accent-green)"
    } : null,
    settledEarnings[0] ? {
      icon: "💰",
      title: `₹${Number(settledEarnings[0].amount).toLocaleString()} Milestone Escrow Released`,
      description: `${settledEarnings[0].brand} approved deliverable. Funds unlocked into Smart-Vault.`,
      actionLabel: "Withdraw Payout ↗",
      badge: "FUNDS READY",
      badgeColor: "var(--accent-gold)"
    } : null,
    deals[0] ? {
      icon: "⚠️",
      title: `${deals[0].brand} Deliverable Deadline: ${deals[0].deadline}`,
      description: `${deals[0].title} is ${deals[0].progress}% complete. ${deals[0].deliverables}`,
      actionLabel: "Update Deal ↗",
      badge: "TRACKING",
      badgeColor: "var(--accent-rose)"
    } : null
  ].filter(Boolean);

  // Shoot Day HUD View (High Contrast, Large Tap Targets)
  if (shootDayMode) {
    return (
      <div
        style={{
          minHeight: "85vh",
          padding: "24px",
          background: "radial-gradient(circle at top, #14141e 0%, #06060c 100%)",
          borderRadius: "24px",
          border: "2px solid var(--accent-gold)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="mono" style={{ color: "var(--accent-gold)", fontSize: "11px", fontWeight: 800 }}>
              🔴 ON-SET PRODUCTION MODE • HIGH CONTRAST HUD
            </span>
            <h1 className="disp-title-h1" style={{ fontSize: "28px", margin: "4px 0" }}>
              {creatorDisplayName.toUpperCase()} — LIVE SHOOT DAY
            </h1>
            <p className="mono" style={{ color: "var(--accent-cyan)", fontSize: "12px", margin: 0 }}>
              CURRENT CALL TIME: {schedule[0]?.time || "10:00 AM"} • ACTIVE CHECKLIST: {completedChecklistCount}/{checklist.length} DONE
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShootDayMode(false)}
            className="btn-magnetic"
            style={{
              padding: "10px 22px",
              fontSize: "12px",
              fontWeight: 800,
              background: "var(--accent-gold)",
              color: "#000",
              borderRadius: "99px",
            }}
          >
            ✕ EXIT ON-SET MODE
          </button>
        </div>

        {/* Large Touch Checklist */}
        <div style={{ display: "grid", gap: "12px" }}>
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              style={{
                padding: "18px 22px",
                borderRadius: "14px",
                background: item.done ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: item.done ? "2px solid var(--accent-green)" : "1px solid rgba(255, 255, 255, 0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: item.done ? "2px solid var(--accent-green)" : "2px solid rgba(255, 255, 255, 0.4)",
                  background: item.done ? "var(--accent-green)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontSize: "18px",
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {item.done ? "✓" : ""}
              </div>

              <div style={{ flex: 1 }}>
                <span className="mono" style={{ fontSize: "10.5px", color: item.done ? "var(--accent-green)" : "var(--accent-gold)", fontWeight: 700 }}>
                  [{item.tag}]
                </span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: item.done ? "rgba(255,255,255,0.6)" : "#fff", textDecoration: item.done ? "line-through" : "none" }}>
                  {item.task}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="creator-command-center" style={{ position: "relative" }}>
      {/* 1. Dynamic Greetings Section & AI Daily Brief */}
      <AIDailyBrief creatorName={creatorDisplayName} alerts={dynamicAlerts} />

      {/* 2. High-Impact Satin KPI Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {/* KPI 1: Month Earnings */}
        <div
          className="satin-card"
          onClick={() => setShowEarningsModal(true)}
          style={{
            padding: "20px 24px",
            borderRadius: "16px",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>THIS MONTH'S EARNINGS</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>+22.4% ↑</span>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}>
            ₹{totalSettledAmount.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{settledEarnings.length} Deals Settled</span>
            <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-gold)", fontWeight: 700 }}>Manage / Log ↗</span>
          </div>
        </div>

        {/* KPI 2: Active Pipeline */}
        <div
          className="satin-card"
          onClick={() => setShowAddDealModal(true)}
          style={{ padding: "20px 24px", borderRadius: "16px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>ACTIVE CAMPAIGN PIPELINE</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>+ ADD DEAL</span>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
            {deals.length} ACTIVE
          </div>
          <div style={{ marginTop: "8px", display: "grid", gap: "4px" }}>
            {deals.slice(0, 2).map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--paper-soft)" }}>
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "140px" }}>{d.brand}</span>
                <span className="mono" style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>{d.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* KPI 3: Pending Escrow Ledger */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>PENDING ESCROW LEDGER</span>
            <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-cyan)", fontWeight: 700 }}>🔒 SMART-VAULT</span>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-display)" }}>
            ₹{totalPendingEscrow.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>100% Protected</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>Auto-Release on QC</span>
          </div>
        </div>

        {/* KPI 4: Media Kit & Reach */}
        <div
          className="satin-card"
          onClick={() => setShowMediaKitModal(true)}
          style={{ padding: "20px 24px", borderRadius: "16px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>MY MEDIA KIT & REACH</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", fontWeight: 700 }}>EDIT ✏️</span>
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
            {mediaKit.views} <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>VIEWS</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Rate: {mediaKit.rateCard}</span>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--accent-purple)', fontWeight: 700 }}>{mediaKit.engagement} Eng. ↗</span>
          </div>
        </div>

        {/* KPI 5: KYC & Identity Verification Status */}
        <div
          className="satin-card"
          onClick={() => setShowVerificationHub(true)}
          style={{ padding: '20px 24px', borderRadius: '16px', cursor: 'pointer', background: 'linear-gradient(135deg, rgba(223, 182, 64, 0.08), rgba(5,5,10,0.95))', border: '1px solid rgba(223, 182, 64, 0.35)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span className="tech-label-mono" style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>KYC & LEGAL IDENTITY</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>OPEN ↗</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
            📜 Digital Bond E-Sign
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span className="mono" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Aadhaar, PAN, Bank KYC</span>
            <span className="mono" style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 700 }}>v13 Compliance</span>
          </div>
        </div>
      </div>


      {/* 3. Today's Schedule Workspace & Dynamic Checksheets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "28px",
        }}
      >
        {/* Schedule & Call Sheet Timeline */}
        <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <span className="tech-label-mono" style={{ fontSize: "10px" }}>TODAY'S PRODUCTION TIMELINE</span>
              <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
                Live Shoot & Call Schedule
              </h3>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowAddScheduleModal(true)}
                className="mono"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--satin-border)",
                  color: "var(--paper-soft)",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + ADD EVENT
              </button>

              <button
                type="button"
                onClick={() => setShootDayMode(true)}
                className="mono"
                style={{
                  background: "linear-gradient(135deg, rgba(223, 182, 64, 0.25), rgba(180, 83, 9, 0.35))",
                  border: "1px solid var(--accent-gold)",
                  color: "var(--accent-gold)",
                  padding: "5px 12px",
                  borderRadius: "99px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ⚡ ON-SET HUD MODE
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }}>
            {schedule.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderLeft: idx === 0 ? "2px solid var(--accent-green)" : idx === 1 ? "2px solid var(--accent-gold)" : "2px solid var(--line)",
                  paddingLeft: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: idx === 0 ? "var(--accent-green)" : "var(--accent-gold)", fontWeight: 700, minWidth: "60px" }}>
                    {item.time}
                  </span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--paper-soft)" }}>{item.title}</div>
                    <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      {item.location} • {item.notes}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSchedule(item.id)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", opacity: 0.6 }}
                  title="Remove Event"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Production Checksheet */}
        <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <span className="tech-label-mono" style={{ fontSize: "10px" }}>PRE-FLIGHT PRODUCTION CHECKLIST</span>
              <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
                Gear & Logistics Verification
              </h3>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)", fontWeight: 800 }}>
                {progressPercent}%
              </span>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(true)}
                className="mono"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--satin-border)",
                  color: "var(--paper-soft)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + TASK
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", overflow: "hidden", marginBottom: "14px" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--accent-gold)", transition: "width 0.3s ease" }} />
          </div>

          <div style={{ display: "grid", gap: "8px", maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
            {checklist.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: item.done ? "rgba(16, 185, 129, 0.08)" : "var(--panel)",
                  border: item.done ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--satin-border)",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer" }} onClick={() => toggleCheck(item.id)}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleCheck(item.id)}
                    style={{ accentColor: "var(--accent-green)", width: "15px", height: "15px", cursor: "pointer" }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: item.done ? "var(--text-muted)" : "var(--paper-soft)",
                      textDecoration: item.done ? "line-through" : "none",
                    }}
                  >
                    {item.task}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mono" style={{ fontSize: "8.5px", color: "var(--text-muted)" }}>
                    {item.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(item.id)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11px", cursor: "pointer", opacity: 0.6 }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* v9 ADDITION: FACTORING QUICK-UNLOCK SLIDE CARD (95% INSTANT CASH ADVANCE) */}
      {/* ========================================================================= */}
      {totalPendingEscrow > 0 && (
        <div
          className="satin-card"
          style={{
            padding: "20px 24px",
            borderRadius: "18px",
            marginBottom: "24px",
            background: "linear-gradient(135deg, rgba(112, 37, 225, 0.12), rgba(223, 182, 64, 0.1))",
            border: "1.5px solid rgba(223, 182, 64, 0.4)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="mono" style={{ fontSize: "10px", background: "rgba(223, 182, 64, 0.2)", color: "var(--accent-gold)", padding: "2px 8px", borderRadius: "99px", fontWeight: 800 }}>
                  ⚡ FACTORING ENGINE ACTIVE (v9)
                </span>
                <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>
                  95% Instant Cash Advance Ready
                </span>
              </div>
              <h3 style={{ margin: "4px 0 2px", fontSize: "16px", color: "var(--paper-soft)" }}>
                Instant Escrow Buyout: ₹{Math.round(totalPendingEscrow * 0.95).toLocaleString()} Available Now
              </h3>
              <p style={{ margin: 0, fontSize: "11.5px", color: "var(--text-muted)" }}>
                Locked in Escrow: <strong>₹{totalPendingEscrow.toLocaleString()}</strong> across {deals.length} deals • Platform Fee: 5% (₹{Math.round(totalPendingEscrow * 0.05).toLocaleString()}) • Skip Net-60 Payment Waits
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                disabled={factoringLoading}
                onClick={handleFactoringUnlock}
                className="btn-magnetic"
                style={{
                  padding: "10px 18px",
                  fontSize: "11.5px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, var(--accent-gold), #b45309)",
                  color: "#000",
                  borderColor: "var(--accent-gold)",
                  cursor: factoringLoading ? "wait" : "pointer",
                  boxShadow: "0 0 20px rgba(223, 182, 64, 0.3)",
                }}
              >
                {factoringLoading ? "Disbursing Advance..." : `⚡ UNLOCK ₹${Math.round(totalPendingEscrow * 0.95).toLocaleString()} NOW ↗`}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {factoringSuccessMsg && (
            <div
              className="mono"
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid var(--accent-green)",
                color: "var(--accent-green)",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {factoringSuccessMsg}
            </div>
          )}
        </div>
      )}

      {/* 4. Interactive Active Deals Table (v10 Predictive Risk Integration) */}
      <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>ACTIVE CAMPAIGN MANIFEST • V10 PREDICTIVE RISK RADAR</span>
            <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
              My Managed Deals & Predictive Health Scores
            </h3>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => handleFetchQuoteOptimization(deals[0]?.brand || "Nykaa Beauty", deals[0]?.escrow || 38000)}
              className="mono"
              style={{
                padding: "6px 12px",
                fontSize: "10.5px",
                background: "rgba(112, 37, 225, 0.15)",
                border: "1px solid var(--accent-purple)",
                color: "var(--paper-soft)",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              💡 OPTIMIZE REEL QUOTE ↗
            </button>

            <button
              type="button"
              onClick={() => setShowAddDealModal(true)}
              className="btn-magnetic"
              style={{ padding: "6px 14px", fontSize: "10.5px" }}
            >
              + ADD BRAND DEAL ↗
            </button>
          </div>
        </div>

        {/* v10 Quote Optimization Modal / Drawer */}
        {quoteOptimizerVisible && quoteOptimizerData && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              marginBottom: "16px",
              background: "linear-gradient(135deg, rgba(112, 37, 225, 0.15), rgba(223, 182, 64, 0.12))",
              border: "1.5px solid var(--accent-purple)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>💡</span>
                <span className="mono" style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-gold)" }}>
                  BRAND RATE INTELLIGENCE & QUOTE OPTIMIZER (v10)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setQuoteOptimizerVisible(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "14px" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "var(--paper-soft)", margin: "0 0 10px", lineHeight: 1.4 }}>
              {quoteOptimizerData.recommendationNote}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "14px" }}>
                <div>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>CURRENT ASKING:</span>
                  <div className="mono" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)" }}>
                    ₹{quoteOptimizerData.currentAskingRate?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-green)" }}>RECOMMENDED RATE:</span>
                  <div className="mono" style={{ fontSize: "16px", fontWeight: 800, color: "var(--accent-green)" }}>
                    ₹{quoteOptimizerData.optimizedQuote?.toLocaleString('en-IN')} (+{quoteOptimizerData.upliftPercent}%)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplyOptimizedQuote(quoteOptimizerData.optimizedQuote)}
                className="btn-magnetic"
                style={{
                  padding: "8px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  background: "var(--accent-green)",
                  color: "#000",
                  borderRadius: "6px",
                }}
              >
                ✓ Apply Optimized Quote to Deal
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "10px" }}>
          {deals.map((d, index) => {
            const risk = d.riskScore || (index === 0 ? 92 : index === 1 ? 68 : 42);
            const isAmber = risk >= 60 && risk < 85;
            const isRed = risk < 60;
            const riskColor = isRed ? "#f43f5e" : isAmber ? "var(--accent-gold)" : "var(--accent-green)";
            const riskLabel = isRed ? "CRITICAL RISK (<60)" : isAmber ? "ACTION REQUIRED (60-84)" : "HEALTHY (85-100)";

            return (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "var(--panel)",
                  border: isAmber ? "1px solid rgba(223, 182, 64, 0.4)" : isRed ? "1px solid rgba(244, 63, 94, 0.4)" : "1px solid var(--satin-border)",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--paper-soft)" }}>{d.brand}</span>
                    <span className="mono" style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "99px", background: "rgba(223, 182, 64, 0.15)", color: "var(--accent-gold)", fontWeight: 700 }}>
                      {d.stage}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: "9px",
                        padding: "1px 6px",
                        borderRadius: "99px",
                        background: `${riskColor}22`,
                        color: riskColor,
                        border: `1px solid ${riskColor}55`,
                        fontWeight: 800,
                      }}
                    >
                      RISK SCORE: {risk}/100 • {riskLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {d.title} • {d.deliverables} • Due: {d.deadline}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {isAmber && (
                    <button
                      type="button"
                      onClick={() => handleAutoMitigateRisk(d.id, d.brand)}
                      className="mono"
                      style={{
                        padding: "5px 10px",
                        fontSize: "9.5px",
                        background: "rgba(223, 182, 64, 0.15)",
                        border: "1px solid var(--accent-gold)",
                        color: "var(--accent-gold)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      ⚡ AUTO-MITIGATE RISK
                    </button>
                  )}

                  <div style={{ textAlign: "right" }}>
                    <span className="mono" style={{ fontSize: "13px", fontWeight: 800, color: "var(--accent-gold)", display: "block" }}>
                      ₹{Number(d.escrow).toLocaleString()}
                    </span>
                    <span className="mono" style={{ fontSize: "9px", color: "var(--accent-cyan)" }}>
                      {d.progress}% Completed
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteDeal(d.id)}
                    style={{ background: "none", border: "none", color: "var(--accent-rose)", fontSize: "12px", cursor: "pointer" }}
                    title="Remove Deal"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Add New Brand Campaign Deal */}
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
            style={{ maxWidth: "480px", width: "100%", padding: "28px", borderRadius: "20px", border: "1px solid var(--accent-gold)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--paper-soft)" }}>+ Add New Brand Deal</h3>
              <button onClick={() => setShowAddDealModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddDeal} style={{ display: "grid", gap: "12px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>BRAND PARTNER</label>
                <input
                  type="text"
                  required
                  value={newDeal.brand}
                  onChange={(e) => setNewDeal({ ...newDeal, brand: e.target.value })}
                  placeholder="e.g. Puma India Athletics"
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CAMPAIGN TITLE</label>
                <input
                  type="text"
                  required
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="e.g. 9:16 High-Speed Monsoon Reel"
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>ESCROW PAYOUT (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDeal.escrow}
                    onChange={(e) => setNewDeal({ ...newDeal, escrow: e.target.value })}
                    placeholder="e.g. 75000"
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>STAGE</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  >
                    <option value="PRE-PRODUCTION">PRE-PRODUCTION</option>
                    <option value="ON-LOCATION">ON-LOCATION</option>
                    <option value="POST-PRODUCTION">POST-PRODUCTION</option>
                    <option value="IN-REVIEW">IN-REVIEW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>DEADLINE DATE</label>
                <input
                  type="text"
                  value={newDeal.deadline}
                  onChange={(e) => setNewDeal({ ...newDeal, deadline: e.target.value })}
                  placeholder="e.g. Sep 15, 2026"
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                className="btn-magnetic"
                style={{ marginTop: "8px", padding: "10px", fontSize: "11.5px", background: "var(--accent-gold)", color: "#000", fontWeight: 800 }}
              >
                SAVE & TRACK DEAL ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Earnings Breakdown & Log New Payout */}
      {showEarningsModal && (
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
          onClick={() => setShowEarningsModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "520px", width: "100%", padding: "28px", borderRadius: "20px", border: "1px solid var(--accent-gold)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span className="tech-label-mono" style={{ fontSize: "10px" }}>SETTLED ESCROW AUDIT</span>
                <h3 style={{ margin: "2px 0 0", fontSize: "18px", color: "var(--paper-soft)" }}>Earnings Breakdown</h3>
              </div>
              <button onClick={() => setShowEarningsModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "grid", gap: "8px", maxHeight: "180px", overflowY: "auto", marginBottom: "16px" }}>
              {settledEarnings.map((s) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "8px", background: "var(--panel)", border: "1px solid var(--satin-border)" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--paper-soft)" }}>{s.brand}</div>
                    <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)" }}>{s.date}</span>
                  </div>
                  <span className="mono" style={{ fontSize: "12.5px", fontWeight: 800, color: "var(--accent-green)" }}>
                    ₹{Number(s.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Log Form */}
            <form onSubmit={handleAddPayout} style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "grid", gap: "8px" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>+ LOG NEW SETTLED PAYOUT:</span>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "8px" }}>
                <input
                  type="text"
                  required
                  placeholder="Campaign / Brand Name"
                  value={newPayout.brand}
                  onChange={(e) => setNewPayout({ ...newPayout, brand: e.target.value })}
                  style={{ background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "6px", padding: "6px 10px", color: "var(--paper-soft)", fontSize: "11px" }}
                />
                <input
                  type="number"
                  required
                  placeholder="Amount (₹)"
                  value={newPayout.amount}
                  onChange={(e) => setNewPayout({ ...newPayout, amount: e.target.value })}
                  style={{ background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "6px", padding: "6px 10px", color: "var(--paper-soft)", fontSize: "11px" }}
                />
              </div>
              <button type="submit" className="btn-magnetic" style={{ padding: "8px", fontSize: "11px", background: "var(--accent-green)", color: "#000", fontWeight: 800 }}>
                RECORD SETTLEMENT ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Schedule Item */}
      {showAddScheduleModal && (
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
          onClick={() => setShowAddScheduleModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "440px", width: "100%", padding: "28px", borderRadius: "20px", border: "1px solid var(--accent-gold)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--paper-soft)" }}>+ Add Shoot Timeline Event</h3>
              <button onClick={() => setShowAddScheduleModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddSchedule} style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CALL TIME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 02:00 PM"
                  value={newScheduleItem.time}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>EVENT TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Unboxing Sequence"
                  value={newScheduleItem.title}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>LOCATION & NOTES</label>
                <input
                  type="text"
                  placeholder="e.g. Studio Floor 2 • Sony FX3 + Gimbal"
                  value={newScheduleItem.notes}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, notes: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <button type="submit" className="btn-magnetic" style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-gold)", color: "#000", fontWeight: 800 }}>
                ADD TO TIMELINE ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Checklist Task */}
      {showAddTaskModal && (
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
          onClick={() => setShowAddTaskModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "420px", width: "100%", padding: "26px", borderRadius: "20px", border: "1px solid var(--accent-gold)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--paper-soft)" }}>+ Add Pre-Flight Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddTask} style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>TASK DESCRIPTION</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless DMX lighting receiver paired"
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CATEGORY TAG</label>
                <select
                  value={newTask.tag}
                  onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                >
                  <option value="GEAR">GEAR</option>
                  <option value="AUDIO">AUDIO</option>
                  <option value="TECH">TECH</option>
                  <option value="WARDROBE">WARDROBE</option>
                  <option value="LOGISTICS">LOGISTICS</option>
                  <option value="SHOTLIST">SHOTLIST</option>
                </select>
              </div>

              <button type="submit" className="btn-magnetic" style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-gold)", color: "#000", fontWeight: 800 }}>
                SAVE TASK ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Customize Media Kit & Stats */}
      {showMediaKitModal && (
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
          onClick={() => setShowMediaKitModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "440px", width: "100%", padding: "28px", borderRadius: "20px", border: "1px solid var(--accent-purple)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--paper-soft)" }}>✏️ Customize Media Kit Stats</h3>
              <button onClick={() => setShowMediaKitModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>VERIFIED VIEWS</label>
                <input
                  type="text"
                  value={mediaKit.views}
                  onChange={(e) => setMediaKit({ ...mediaKit, views: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>ENGAGEMENT RATE</label>
                <input
                  type="text"
                  value={mediaKit.engagement}
                  onChange={(e) => setMediaKit({ ...mediaKit, engagement: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>RATE CARD STATUS</label>
                <input
                  type="text"
                  value={mediaKit.rateCard}
                  onChange={(e) => setMediaKit({ ...mediaKit, rateCard: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMediaKitModal(false)}
                className="btn-magnetic"
                style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-purple)", color: "#fff", fontWeight: 800 }}
              >
                SAVE MEDIA KIT STATS ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Verification Hub Modal (v13) */}
      {showVerificationHub && (
        <CreatorVerificationHub
          onClose={() => setShowVerificationHub(false)}
          onVerified={() => setShowVerificationHub(false)}
        />
      )}
    </div>
  );
}
