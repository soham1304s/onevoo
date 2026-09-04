import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_VENDOR_GIGS = [
  { id: "gig-1", title: "Nike Summer Kinetic Shoot", date: "Sep 08, 2026", location: "BKC Outdoor", role: "Lead Cinematographer", rate: 18000 },
  { id: "gig-2", title: "Tanishq Heritage Doc", date: "Sep 12, 2026", location: "Varanasi Ghats", role: "2-Day Lighting Director", rate: 35000 },
  { id: "gig-3", title: "Aura Skincare Lab Shoot", date: "Sep 18, 2026", location: "Bandra Studio", role: "Macro Lens Specialist", rate: 15000 },
];

export default function VendorMarketplaceConsole() {
  const { user, profile } = useAuth();
  const vendorDisplayName = user?.full_name || profile?.full_name || profile?.handle || "Vikram Aditya (Cinematographer & Gear Owner)";
  const storageKey = `onevoo_vendor_${user?.email || "default"}`;

  const [isAvailable, setIsAvailable] = useState(() => {
    return localStorage.getItem(`${storageKey}_avail`) !== "false";
  });

  const [checkInDone, setCheckInDone] = useState(false);

  const [gigs, setGigs] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_gigs`);
      return saved ? JSON.parse(saved) : DEFAULT_VENDOR_GIGS;
    } catch {
      return DEFAULT_VENDOR_GIGS;
    }
  });

  const [showAddGigModal, setShowAddGigModal] = useState(false);
  const [newGig, setNewGig] = useState({ title: "", date: "", location: "", role: "Lead Cinematographer", rate: "" });

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_avail`, String(isAvailable));
      localStorage.setItem(`${storageKey}_gigs`, JSON.stringify(gigs));
    } catch (e) {
      console.warn("Vendor storage sync error:", e);
    }
  }, [isAvailable, gigs, storageKey]);

  const totalUpcomingEarnings = gigs.reduce((acc, curr) => acc + Number(curr.rate || 0), 0);

  const handleAddGig = (e) => {
    e.preventDefault();
    if (!newGig.title || !newGig.rate) return;
    const item = {
      id: `gig-${Date.now()}`,
      title: newGig.title,
      date: newGig.date || "Sep 20, 2026",
      location: newGig.location || "Mumbai Studio",
      role: newGig.role || "Cinematographer",
      rate: Number(newGig.rate)
    };
    setGigs([...gigs, item]);
    setNewGig({ title: "", date: "", location: "", role: "Lead Cinematographer", rate: "" });
    setShowAddGigModal(false);
  };

  const handleDeleteGig = (id) => {
    setGigs((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="vendor-marketplace-console" style={{ position: "relative" }}>
      {/* Header Banner */}
      <div
        className="satin-card"
        style={{
          padding: "22px 26px",
          marginBottom: "24px",
          borderRadius: "18px",
          borderLeft: "4px solid var(--accent-green)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span className="tech-label-mono" style={{ fontSize: "10px" }}>PRODUCTION VENDOR & CREW DISPATCH</span>
          <h2 className="disp-title-h2" style={{ margin: "2px 0", fontSize: "24px" }}>
            {vendorDisplayName}
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
            Gear: <strong>Sony FX3 Cinema Rig + Prime Lens Kit</strong> • Base: Mumbai
          </p>
        </div>

        {/* Master Instant Availability Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={() => setIsAvailable(!isAvailable)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "99px",
              background: isAvailable ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
              border: isAvailable ? "1.5px solid var(--accent-green)" : "1.5px solid var(--accent-rose)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span
              className={isAvailable ? "pulse-emerald-ring" : ""}
              style={{ width: "6px", height: "6px", background: isAvailable ? "var(--accent-green)" : "var(--accent-rose)", borderRadius: "50%" }}
            />
            <span className="mono" style={{ fontSize: "10.5px", fontWeight: 800, color: isAvailable ? "var(--accent-green)" : "var(--accent-rose)" }}>
              {isAvailable ? "DISPATCH READY: ACTIVE" : "STATUS: BUSY / ON-SET"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Trio */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {/* Reliability Score Engine */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>RELIABILITY SCORE</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>TOP 5% ELITE</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-green)", fontFamily: "var(--font-display)" }}>
            96 / 100
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px" }} className="mono">
            <span style={{ color: "var(--text-muted)" }}>On-Time: 98%</span>
            <span style={{ color: "var(--text-muted)" }}>Completion: 100%</span>
          </div>
        </div>

        {/* Vendor Earnings */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>UPCOMING GIG EARNINGS</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)" }}>ESCROW LOCKED</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
            ₹{totalUpcomingEarnings.toLocaleString()}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px" }} className="mono">
            <span style={{ color: "var(--text-muted)" }}>{gigs.length} Production Days</span>
            <span style={{ color: "var(--accent-gold)" }}>Day Rate: ₹18k</span>
          </div>
        </div>

        {/* Next Scheduled Booking */}
        <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px" }}>NEXT CALL TIME</span>
            <span className="pulse-emerald-ring" style={{ width: "6px", height: "6px" }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)" }}>
            {gigs[0]?.date?.split(',')[0] || "Sep 08"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10.5px" }} className="mono">
            <span>{gigs[0]?.title || "Nike Studio"}</span>
            <span style={{ color: "var(--accent-purple)", fontWeight: 700 }}>₹{Number(gigs[0]?.rate || 18000).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Calendar & Assignment Dispatch Workspace */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Today's Assignment Card */}
        <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <span className="tech-label-mono" style={{ fontSize: "10px" }}>TODAY'S PRODUCTION ASSIGNMENT</span>
              <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
                Mehboob Studio Floor 2 • Commercial Shoot
              </h3>
            </div>
            <span className="mono" style={{ fontSize: "9.5px", background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-green)", padding: "2px 8px", borderRadius: "99px", fontWeight: 700 }}>
              ESCROW LOCKED
            </span>
          </div>

          <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
            <div style={{ padding: "10px 12px", borderRadius: "8px", background: "var(--panel)", border: "1px solid var(--satin-border)" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-gold)" }}>CALL TIME & SCHEDULE</span>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--paper-soft)", marginTop: "2px" }}>
                10:00 AM Call Time • Estimated Wrap 05:00 PM (7h Day)
              </div>
            </div>

            <div style={{ padding: "10px 12px", borderRadius: "8px", background: "var(--panel)", border: "1px solid var(--satin-border)" }}>
              <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-cyan)" }}>EQUIPMENT MANIFEST REQUIRED</span>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--paper-soft)", marginTop: "2px" }}>
                Sony FX3 + 85mm F1.2 G-Master + Wireless Transmitter + 2x V-Mounts
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCheckInDone(!checkInDone)}
            className="btn-magnetic"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "11px",
              fontWeight: 800,
              background: checkInDone ? "rgba(16, 185, 129, 0.2)" : "var(--accent-green)",
              color: checkInDone ? "var(--accent-green)" : "#000",
              borderColor: "var(--accent-green)",
            }}
          >
            {checkInDone ? "✓ ON-LOCATION CHECK-IN CONFIRMED (GPS VERIFIED)" : "📍 CONFIRM LOCATION CHECK-IN"}
          </button>
        </div>

        {/* Schedule & Upcoming Gigs Calendar */}
        <div className="satin-card" style={{ padding: "22px 26px", borderRadius: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <span className="tech-label-mono" style={{ fontSize: "10px" }}>DISPATCH SCHEDULE LEDGER</span>
              <h3 style={{ margin: "2px 0 0", fontSize: "16px", color: "var(--paper-soft)" }}>
                Upcoming Production Days
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowAddGigModal(true)}
              className="mono"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--satin-border)",
                color: "var(--accent-gold)",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + ADD GIG
            </button>
          </div>

          <div style={{ display: "grid", gap: "8px", maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
            {gigs.map((g) => (
              <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: "8px", background: "var(--panel)", border: "1px solid var(--satin-border)" }}>
                <div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--paper-soft)" }}>{g.date} • {g.title}</div>
                  <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>{g.location} • {g.role}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="mono" style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent-gold)" }}>₹{Number(g.rate).toLocaleString()}</span>
                  <button onClick={() => handleDeleteGig(g.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11px", cursor: "pointer", opacity: 0.6 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: Add New Gig */}
      {showAddGigModal && (
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
          onClick={() => setShowAddGigModal(false)}
        >
          <div
            className="satin-card"
            style={{ maxWidth: "440px", width: "100%", padding: "26px", borderRadius: "20px", border: "1px solid var(--accent-green)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--paper-soft)" }}>+ Add Scheduled Production Gig</h3>
              <button onClick={() => setShowAddGigModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleAddGig} style={{ display: "grid", gap: "10px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>CAMPAIGN / BRAND SHOOT</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Puma Athletics Track Shoot"
                  value={newGig.title}
                  onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
                  style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>DATE</label>
                  <input
                    type="text"
                    placeholder="e.g. Sep 24, 2026"
                    value={newGig.date}
                    onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>DAY RATE (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 20000"
                    value={newGig.rate}
                    onChange={(e) => setNewGig({ ...newGig, rate: e.target.value })}
                    style={{ width: "100%", background: "var(--panel)", border: "1px solid var(--satin-border)", borderRadius: "8px", padding: "8px 12px", color: "var(--paper-soft)", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-magnetic" style={{ marginTop: "6px", padding: "10px", fontSize: "11px", background: "var(--accent-green)", color: "#000", fontWeight: 800 }}>
                SAVE GIG ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
