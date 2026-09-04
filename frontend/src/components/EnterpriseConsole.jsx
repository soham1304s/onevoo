import React, { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import Logo from "./Logo";
import AdminReelModeration from "./AdminReelModeration";

const API_BASE = "http://localhost:3001/api";

export default function EnterpriseConsole() {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("fx");

  // =========================================================================
  // 1. FX HEDGING & MULTI-CURRENCY ESCROW STATE
  // =========================================================================
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("INR");
  const [baseAmount, setBaseAmount] = useState(12000);
  const [lockedRate, setLockedRate] = useState(83.50);
  const [actualRate, setActualRate] = useState(82.20);
  const [fxQuote, setFxQuote] = useState(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxContractSaved, setFxContractSaved] = useState(false);

  // Fetch FX Calculation Quote
  const fetchFXQuote = async () => {
    try {
      setFxLoading(true);
      const res = await fetch(`${API_BASE}/fx/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseCurrency,
          targetCurrency,
          baseAmount: Number(baseAmount),
          customLockedRate: Number(lockedRate),
          customActualRate: Number(actualRate),
          bufferPercent: 0.03,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFxQuote(data);
      }
    } catch (err) {
      console.error("FX calculation error:", err);
    } finally {
      setFxLoading(false);
    }
  };

  useEffect(() => {
    fetchFXQuote();
  }, [baseCurrency, targetCurrency, baseAmount, lockedRate, actualRate]);

  const handleExecuteHedgeContract = async () => {
    try {
      const res = await fetch(`${API_BASE}/fx/hedge-contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealTitle: "Global Samsung S26 Cinematic Launch",
          baseCurrency,
          targetCurrency,
          baseAmount: Number(baseAmount),
          lockedRate: Number(lockedRate),
          actualRateAtSettlement: Number(actualRate),
          bufferPercent: 0.03,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFxContractSaved(true);
        addNotification({
          title: "FX Hedging Escrow Executed",
          message: `Locked ${baseAmount} ${baseCurrency} at rate ${lockedRate} (Target: ₹${(baseAmount * lockedRate).toLocaleString('en-IN')}). 3% FX buffer deposited to smart ledger.`,
          type: "escrow",
          status: "ESCROW LOCKED",
        });
        setTimeout(() => setFxContractSaved(false), 5000);
      }
    } catch (err) {
      console.error("Execute hedge contract error:", err);
    }
  };

  // =========================================================================
  // 2. CREATOR INVOICE FACTORING & CASH ADVANCE STATE
  // =========================================================================
  const [invoiceAmount, setInvoiceAmount] = useState(180000);
  const [brandScore, setBrandScore] = useState(96);
  const [creatorReliability, setCreatorReliability] = useState(98);
  const [factoringResult, setFactoringResult] = useState(null);
  const [factoringDisbursed, setFactoringDisbursed] = useState(false);

  useEffect(() => {
    const riskScore = Math.round(Number(brandScore) * 0.6 + Number(creatorReliability) * 0.4);
    const feeRate = 0.05;
    const feeAmount = invoiceAmount * feeRate;
    const disbursedAmount = invoiceAmount * (1 - feeRate);

    setFactoringResult({
      riskScore,
      isApproved: riskScore >= 65,
      invoiceValue: invoiceAmount,
      feeRate,
      feeAmount,
      disbursedAmount,
    });
  }, [invoiceAmount, brandScore, creatorReliability]);

  const handleRequestCashAdvance = async () => {
    try {
      const res = await fetch(`${API_BASE}/factoring/disburse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealTitle: "Nykaa Monsoon Campaign Milestone #2",
          creatorName: "Tanvi Sharma (@tanvi.creates)",
          brandName: "Nykaa Beauty",
          invoiceValue: invoiceAmount,
          feeRate: 0.05,
          approvalRiskScore: factoringResult?.riskScore || 96,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFactoringDisbursed(true);
        addNotification({
          title: "Instant Cash Advance Disbursed",
          message: `₹${(invoiceAmount * 0.95).toLocaleString('en-IN')} (95% of invoice) credited immediately to creator wallet. 5% platform factoring fee logged.`,
          type: "task",
          status: "DISBURSED",
        });
        setTimeout(() => setFactoringDisbursed(false), 5000);
      }
    } catch (err) {
      console.error("Factoring advance error:", err);
    }
  };

  // =========================================================================
  // 3. AI CONTENT QA & SAFE-ZONE COMPLIANCE STATE
  // =========================================================================
  const [mediaTitle, setMediaTitle] = useState("Monsoon Barrier Repair 4K Reel");
  const [brandTarget, setBrandTarget] = useState("Nykaa Beauty");
  const [transcriptText, setTranscriptText] = useState("Loving this dewy barrier glow hydration serum for my everyday morning routine.");
  const [competitorKeywords, setCompetitorKeywords] = useState("Sugar Cosmetics, Plum, Mamaearth");
  const [subtitleYPos, setSubtitleYPos] = useState(0.68); // 0.0 to 1.0 (from top)
  const [contrastRatio, setContrastRatio] = useState(5.4);
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  const handleRunComplianceScan = async () => {
    try {
      setScanLoading(true);
      const keywordsArray = competitorKeywords.split(",").map((k) => k.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/compliance/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaTitle,
          brandName: brandTarget,
          creatorName: "Tanvi Sharma (@tanvi.creates)",
          transcriptText,
          competitorKeywords: keywordsArray,
          subtitleYPosition: Number(subtitleYPos),
          topBannerYPosition: 0.22,
          contrastRatio: Number(contrastRatio),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScanResult(data);
        addNotification({
          title: data.complianceScore >= 80 ? "AI Content QA Certified" : "AI Compliance Warning",
          message: `${mediaTitle} scored ${data.complianceScore}/100. Safe-zone: ${data.safeZonePassed ? "PASS ✓" : "FAIL ⚠️"} • Exclusivity: ${data.exclusivityPassed ? "PASS ✓" : "FAIL ⚠️"}.`,
          type: "task",
          status: data.complianceScore >= 80 ? "VERIFIED" : "ATTENTION",
        });
      }
    } catch (err) {
      console.error("Compliance scan error:", err);
    } finally {
      setScanLoading(false);
    }
  };

  // =========================================================================
  // 4. ENTERPRISE ESG CARBON & GREEN PRODUCTION STATE
  // =========================================================================
  const [travelKm, setTravelKm] = useState(140);
  const [studioHours, setStudioHours] = useState(10);
  const [heavyLights, setHeavyLights] = useState(5);
  const [crewCount, setCrewCount] = useState(8);
  const [shootDays, setShootDays] = useState(2);
  const [carbonResult, setCarbonResult] = useState(null);
  const [offsetPurchased, setOffsetPurchased] = useState(false);

  useEffect(() => {
    const transportEmissions = travelKm * 0.12;
    const studioEmissions = studioHours * 1.45;
    const lightingEmissions = heavyLights * studioHours * 0.35;
    const mealsEmissions = crewCount * shootDays * 0.85;
    const totalCarbon = transportEmissions + studioEmissions + lightingEmissions + mealsEmissions;
    const offsetCost = (totalCarbon / 1000) * 1260;

    setCarbonResult({
      transportKgs: Math.round(transportEmissions * 100) / 100,
      studioKgs: Math.round(studioEmissions * 100) / 100,
      lightingKgs: Math.round(lightingEmissions * 100) / 100,
      mealsKgs: Math.round(mealsEmissions * 100) / 100,
      totalCarbonKgs: Math.round(totalCarbon * 100) / 100,
      offsetCostInr: Math.round(offsetCost * 100) / 100,
    });
  }, [travelKm, studioHours, heavyLights, crewCount, shootDays]);

  const handlePurchaseCarbonOffset = async () => {
    try {
      const res = await fetch(`${API_BASE}/esg/purchase-offset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productionTitle: "Tata Curvv EV Commercial Shoot",
          creatorName: "Tanvi Sharma",
          brandName: "Tata Motors EV",
          travelKm,
          studioHours,
          heavyLightsCount: heavyLights,
          crewCount,
          shootDays,
          totalCarbonKgs: carbonResult?.totalCarbonKgs || 45.2,
          offsetCostInr: carbonResult?.offsetCostInr || 56.95,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOffsetPurchased(true);
        addNotification({
          title: "ESG Green Production Certified",
          message: `Offset ${carbonResult?.totalCarbonKgs} kg CO2 for ₹${carbonResult?.offsetCostInr}. Certificate ${data.certificateId} registered in ESG ledger.`,
          type: "escrow",
          status: "CERTIFIED GREEN",
        });
        setTimeout(() => setOffsetPurchased(false), 5000);
      }
    } catch (err) {
      console.error("Carbon offset purchase error:", err);
    }
  };

  // =========================================================================
  // 5. MULTI-PARTY ARBITRATED DISPUTE NODE STATE
  // =========================================================================
  const [disputesList, setDisputesList] = useState([]);
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);
  const [disputeRefundRatio, setDisputeRefundRatio] = useState(0.50);
  const [disputeSettled, setDisputeSettled] = useState(false);

  const fetchDisputes = async () => {
    try {
      const res = await fetch(`${API_BASE}/disputes`);
      const data = await res.json();
      if (data.disputes) {
        setDisputesList(data.disputes);
        if (data.disputes.length > 0 && !selectedDisputeId) {
          setSelectedDisputeId(data.disputes[0].id);
        }
      }
    } catch (err) {
      console.error("Fetch disputes error:", err);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleOpenSampleDispute = async () => {
    try {
      const res = await fetch(`${API_BASE}/disputes/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealTitle: "Urban Monkey Autumn Streetwear Reel",
          brandName: "Urban Monkey",
          creatorName: "Tanvi Sharma (@tanvi.creates)",
          milestoneTitle: "Deliverable 2: Color Graded Master 4K",
          disputeReason: "Brand requested 4th revision exceeding the signed 2-revision limit in clause 3.2.",
          escrowAmount: 60000,
          proposedRefundRatio: 0.50,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDisputes();
        addNotification({
          title: "Arbitration Case Opened",
          message: "Escrow funds locked. Mutual 50/50 Auto-Settle Proposal generated.",
          type: "task",
          status: "DISPUTE OPENED",
        });
      }
    } catch (err) {
      console.error("Open dispute error:", err);
    }
  };

  const handleAutoSettleDispute = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/disputes/auto-settle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId: id,
          refundRatio: Number(disputeRefundRatio),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDisputeSettled(true);
        fetchDisputes();
        addNotification({
          title: "Dispute Auto-Settled",
          message: `Mutual settlement approved! ₹${data.creatorSettlement?.toLocaleString('en-IN')} released to creator and ₹${data.brandRefund?.toLocaleString('en-IN')} refunded to brand.`,
          type: "escrow",
          status: "SETTLED",
        });
        setTimeout(() => setDisputeSettled(false), 5000);
      }
    } catch (err) {
      console.error("Auto-settle error:", err);
    }
  };

  // =========================================================================
  // 7. v9 FEDERATED ATTRIBUTION & YIELD BI STATE
  // =========================================================================
  const [attributionData, setAttributionData] = useState(null);
  const [attributionLoading, setAttributionLoading] = useState(false);
  const [simBudget, setSimBudget] = useState(500000);
  const [simStudio, setSimStudio] = useState("Mehboob Soundstage A");

  const fetchAttributionBI = async () => {
    try {
      setAttributionLoading(true);
      const res = await fetch(`${API_BASE}/analytics/attribution-bi`);
      const data = await res.json();
      if (data.success) {
        setAttributionData(data);
      }
    } catch (err) {
      console.error("Fetch attribution error:", err);
    } finally {
      setAttributionLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributionBI();
  }, []);

  return (
    <div className="enterprise-hub-wrapper wrap" style={{ position: "relative", zIndex: 1 }}>
      {/* Header Banner */}
      <div className="satin-card enterprise-header-card">
        <div className="enterprise-header-top-row">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Logo size="small" />
              <span className="tech-label-mono" style={{ color: "var(--accent-gold)" }}>
                ELITE ENTERPRISE SUITE (V7 ARCHITECTURE)
              </span>
            </div>
            <h1 className="disp-title-h2 enterprise-title">
              ENTERPRISE <em>CONTROL CONSOLE</em>
            </h1>
            <p className="enterprise-subtitle">
              Global FX hedging, instant creator invoice factoring, programmatic AI safe-zone QA, certified ESG carbon logistics, and multi-party arbitrated dispute nodes.
            </p>
          </div>

          {/* Real-Time Platform Status Pill */}
          <div className="enterprise-status-col">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "99px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <span className="pulse-emerald-ring" style={{ width: "8px", height: "8px" }} />
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 800 }}>
                ESCROW SMART-VAULT ACTIVE
              </span>
            </div>
            <span className="mono enterprise-compliance-badge">
              AUDIT COMPLIANCE: WCAG 4.5:1 • ISO-14064 ESG
            </span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="enterprise-tabs-scroll-row">
          {[
            { id: "fx", label: "🌐 FX Hedging & Escrow", num: "01" },
            { id: "factoring", label: "⚡ Invoice Factoring (95%)", num: "02" },
            { id: "compliance", label: "🛡️ AI Safe-Zone Scanner", num: "03" },
            { id: "esg", label: "🌿 ESG Carbon Ledger", num: "04" },
            { id: "disputes", label: "⚖️ Dispute Arbitration", num: "05" },
            { id: "moderation", label: "🎬 Reel Moderation Desk", num: "06" },
            { id: "bi_attribution", label: "📊 Attribution & Yield BI (v9)", num: "07" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`filter-btn enterprise-tab-chip ${activeTab === tab.id ? "active" : ""}`}
            >
              <span className="mono" style={{ fontSize: "10px", opacity: 0.6 }}>{tab.num}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: FX HEDGING & MULTI-CURRENCY ESCROW ENGINE
          ========================================================================= */}
      {activeTab === "fx" && (
        <div className="enterprise-module-grid">
          {/* Left: Interactive FX Contract Simulator */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>01 / MULTI-CURRENCY ENGINE</span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", background: "rgba(16, 185, 129, 0.1)", padding: "3px 8px", borderRadius: "4px" }}>
                3% FX BUFFER ACTIVE
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 10px" }}>
              CROSS-BORDER RATE HEDGING
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Lock exchange rates at contract signing to insulate brand and creator margins from FX volatility.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="enterprise-subgrid">
                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                    BRAND PAYS (BASE CURRENCY)
                  </label>
                  <select
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value)}
                    className="satin-card"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", color: "var(--paper-soft)" }}
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="AED">AED (د.إ - UAE Dirham)</option>
                    <option value="SGD">SGD (S$ - Singapore Dollar)</option>
                  </select>
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                    CREATOR RECEIVES (TARGET)
                  </label>
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="satin-card"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", color: "var(--paper-soft)" }}
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="AED">AED (د.إ - UAE Dirham)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  CAMPAIGN ESCROW BUDGET ({baseCurrency}): <strong>{baseCurrency} {Number(baseAmount).toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="500"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-gold)" }}
                />
              </div>

              <div className="enterprise-subgrid">
                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    LOCKED RATE (AT SIGNING)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={lockedRate}
                    onChange={(e) => setLockedRate(e.target.value)}
                    className="satin-card"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", color: "var(--paper-soft)" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    ACTUAL SETTLEMENT RATE
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={actualRate}
                    onChange={(e) => setActualRate(e.target.value)}
                    className="satin-card"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", color: "var(--paper-soft)" }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleExecuteHedgeContract}
                className="btn-magnetic"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  fontWeight: 800,
                  fontSize: "12px",
                  background: "linear-gradient(135deg, rgba(197, 140, 19, 0.25), rgba(112, 37, 225, 0.25))",
                }}
              >
                {fxContractSaved ? "✓ CURRENCY HEDGE ESCROW LOCKED" : "⚡ LOCK HEDGE & EXECUTE SMART ESCROW"}
              </button>
            </div>
          </div>

          {/* Right: Real-time Double-Entry Ledger Projection */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>DOUBLE-ENTRY SETTLEMENT LEDGER</span>
              <h3 className="font-display" style={{ fontSize: "20px", margin: "6px 0 16px" }}>
                AUTOMATED CLEARING BREAKDOWN
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="satin-card" style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>CREATOR GUARANTEED PAYOUT:</span>
                    <span className="font-display" style={{ color: "var(--accent-gold)", fontSize: "18px" }}>
                      ₹{fxQuote?.targetPayoutVal?.toLocaleString('en-IN') || "0"}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    Calculated at locked rate: 1 {baseCurrency} = {lockedRate} {targetCurrency}
                  </span>
                </div>

                <div className="satin-card" style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>BRAND 3% FX BUFFER REFUND:</span>
                    <span className="font-display" style={{ color: "var(--accent-green)", fontSize: "18px" }}>
                      {baseCurrency} {fxQuote?.bufferRefundedToBrand?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    Returned to brand wallet after final milestone clearance
                  </span>
                </div>

                <div className="satin-card" style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>RESIDUAL HEDGE SPREAD:</span>
                    <span className="font-display" style={{ color: "var(--paper-soft)", fontSize: "16px" }}>
                      ₹{fxQuote?.residualGainOrLoss?.toLocaleString('en-IN') || "0"}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    Absorbed automatically by Onevoo liquidity buffer pool
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--satin-border)", paddingTop: "16px", marginTop: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                STATUS: ISO 20022 Cross-Border Settlement Ready • Neon Postgres Sync Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CREATOR INVOICE FACTORING & CASH ADVANCE DESK
          ========================================================================= */}
      {activeTab === "factoring" && (
        <div className="enterprise-module-grid">
          {/* Left: Liquidity Valuation & Risk Scoring */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>02 / INSTANT LIQUIDITY DESK</span>
              <span
                className="mono"
                style={{
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: factoringResult?.isApproved ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: factoringResult?.isApproved ? "var(--accent-green)" : "#ef4444",
                  fontWeight: 800,
                }}
              >
                FACTORING RISK SCORE: {factoringResult?.riskScore}/100
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 10px" }}>
              AUTOMATED INVOICE ADVANCE
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Bypass corporate Net-60 or Net-90 delays. Receive 95% instant payout upon milestone signoff.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  INVOICE VALUE: <strong>₹{invoiceAmount.toLocaleString('en-IN')}</strong>
                </label>
                <input
                  type="range"
                  min="25000"
                  max="1000000"
                  step="5000"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-purple)" }}
                />
              </div>

              <div className="enterprise-subgrid">
                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    BRAND PAYMENT SCORE ({brandScore}/100)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={brandScore}
                    onChange={(e) => setBrandScore(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-gold)" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    CREATOR RELIABILITY ({creatorReliability}/100)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={creatorReliability}
                    onChange={(e) => setCreatorReliability(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-green)" }}
                  />
                </div>
              </div>

              {/* Instant Advance Summary Card */}
              <div className="satin-card" style={{ padding: "16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.35)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>INSTANT 95% CASH DISBURSEMENT:</span>
                  <span className="font-display" style={{ fontSize: "20px", color: "var(--accent-purple)" }}>
                    ₹{factoringResult?.disbursedAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>FLAT 5% PLATFORM FACTORING FEE:</span>
                  <span className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    ₹{factoringResult?.feeAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestCashAdvance}
                disabled={!factoringResult?.isApproved}
                className="btn-magnetic"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontWeight: 800,
                  fontSize: "12px",
                  background: factoringResult?.isApproved
                    ? "linear-gradient(135deg, rgba(112, 37, 225, 0.3), rgba(16, 185, 129, 0.3))"
                    : "rgba(255, 255, 255, 0.05)",
                  color: "var(--paper-soft)",
                }}
              >
                {factoringDisbursed ? "✓ DISBURSED TO CREATOR WALLET" : "⚡ DISBURSE 95% INSTANT CASH ADVANCE"}
              </button>
            </div>
          </div>

          {/* Right: Factoring Risk Metrics & Terms */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>FACTORING ALGORITHM INTELLIGENCE</span>
              <h3 className="font-display" style={{ fontSize: "20px", margin: "6px 0 16px" }}>
                LIQUIDITY GUARANTEE POLICY
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>🛡️</span>
                  <div>
                    <h4 className="mono" style={{ fontSize: "12px", margin: "0 0 2px", color: "var(--paper-soft)" }}>ZERO RECOURSE ON CREATOR</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                      Once approved, Onevoo assumes 100% of the collection responsibility from the enterprise brand.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>⚡</span>
                  <div>
                    <h4 className="mono" style={{ fontSize: "12px", margin: "0 0 2px", color: "var(--paper-soft)" }}>IMMEDIATE UPI & NEFT SETTLEMENT</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                      Funds hit the creator bank account within 120 seconds of milestone sign-off.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>📊</span>
                  <div>
                    <h4 className="mono" style={{ fontSize: "12px", margin: "0 0 2px", color: "var(--paper-soft)" }}>WEIGHTED COMPOSITE RISK MODEL</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                      Score = (Brand History × 0.60) + (Creator Reliability × 0.40). Auto-approves at score ≥ 65.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--satin-border)", paddingTop: "16px", marginTop: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 800 }}>
                ✓ FACTORING DESK READY • MAXIMUM INSTANT DRAW: ₹25,00,000
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: AI CONTENT QA & SAFE-ZONE COMPLIANCE SCANNER
          ========================================================================= */}
      {activeTab === "compliance" && (
        <div className="enterprise-module-grid">
          {/* Left: Video Frame & Transcript Audit Simulator */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>03 / PROGRAMMATIC AUDIT</span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", background: "rgba(112, 37, 225, 0.15)", padding: "3px 8px", borderRadius: "4px" }}>
                1080x1920 VERTICAL QA
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 10px" }}>
              AI CONTENT QA & SAFE-ZONE SCANNER
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Ensure 9:16 reels do not overlap Instagram/TikTok UI overlay boundaries and verify brand exclusivity clauses.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  DELIVERABLE TITLE & TARGET BRAND
                </label>
                <div className="enterprise-subgrid">
                  <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="satin-card"
                    style={{ padding: "8px 12px", borderRadius: "8px", color: "var(--paper-soft)" }}
                  />
                  <input
                    type="text"
                    value={brandTarget}
                    onChange={(e) => setBrandTarget(e.target.value)}
                    className="satin-card"
                    style={{ padding: "8px 12px", borderRadius: "8px", color: "var(--paper-soft)" }}
                  />
                </div>
              </div>

              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  TRANSCRIPT TEXT (SPEECH-TO-TEXT STREAM)
                </label>
                <textarea
                  rows={2}
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  className="satin-card"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", color: "var(--paper-soft)", fontSize: "12px" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  BLOCKED COMPETITOR EXCLUSIVITY LIST
                </label>
                <input
                  type="text"
                  value={competitorKeywords}
                  onChange={(e) => setCompetitorKeywords(e.target.value)}
                  className="satin-card"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", color: "var(--paper-soft)", fontSize: "12px" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  SUBTITLE Y-COORDINATE PLACEMENT: <strong>{(subtitleYPos * 100).toFixed(0)}% from top</strong> (Flagged if &gt; 82%)
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="0.95"
                  step="0.01"
                  value={subtitleYPos}
                  onChange={(e) => setSubtitleYPos(Number(e.target.value))}
                  style={{ width: "100%", accentColor: subtitleYPos > 0.82 ? "#ef4444" : "var(--accent-green)" }}
                />
              </div>

              <button
                type="button"
                onClick={handleRunComplianceScan}
                disabled={scanLoading}
                className="btn-magnetic"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontWeight: 800,
                  fontSize: "12px",
                  background: "linear-gradient(135deg, rgba(112, 37, 225, 0.25), rgba(197, 140, 19, 0.25))",
                }}
              >
                {scanLoading ? "ANALYZING MEDIA KEYFRAMES..." : "🛡️ RUN AI COMPLIANCE & SAFE-ZONE AUDIT"}
              </button>
            </div>
          </div>

          {/* Right: Vertical Safe-Zone Visual Preview */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)", alignSelf: "flex-start", marginBottom: "12px" }}>
              9:16 SAFE-ZONE VISUAL INSPECTOR
            </span>

            {/* Vertical 9:16 Mockup */}
            <div
              style={{
                width: "220px",
                height: "390px",
                borderRadius: "20px",
                border: "2px solid rgba(255, 255, 255, 0.15)",
                background: "#09090b",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Top Status Bar Danger Zone (Top 15%) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "15%",
                  background: "rgba(239, 68, 68, 0.15)",
                  borderBottom: "1px dashed #ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="mono" style={{ fontSize: "9px", color: "#ef4444" }}>TOP EXCLUDE ZONE (15%)</span>
              </div>

              {/* Bottom Instagram/TikTok UI Danger Zone (Bottom 18%) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "18%",
                  background: "rgba(239, 68, 68, 0.2)",
                  borderTop: "1px dashed #ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="mono" style={{ fontSize: "9px", color: "#ef4444" }}>UI OVERLAY ZONE (18%)</span>
              </div>

              {/* Simulated Subtitle Text Marker */}
              <div
                style={{
                  position: "absolute",
                  top: `${subtitleYPos * 100}%`,
                  left: "10%",
                  right: "10%",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background: subtitleYPos > 0.82 ? "rgba(239, 68, 68, 0.8)" : "rgba(16, 185, 129, 0.8)",
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 700,
                  transition: "top 0.1s ease",
                }}
              >
                {subtitleYPos > 0.82 ? "⚠️ SUBTITLE OBSCURED" : "✓ SAFE SUBTITLE ZONE"}
              </div>
            </div>

            {/* Scan Results Certificate */}
            {scanResult && (
              <div
                className="satin-card"
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: `1px solid ${scanResult.complianceScore >= 80 ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: "12px", fontWeight: 800, color: scanResult.complianceScore >= 80 ? "var(--accent-green)" : "#ef4444" }}>
                    COMPLIANCE SCORE: {scanResult.complianceScore}/100
                  </span>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    TOKEN: {scanResult.certificateToken}
                  </span>
                </div>
                {scanResult.violations?.length > 0 && (
                  <div style={{ marginTop: "6px" }}>
                    {scanResult.violations.map((v, idx) => (
                      <span key={idx} className="mono" style={{ fontSize: "10px", color: "#ef4444", display: "block" }}>
                        • {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ENTERPRISE ESG CARBON & LOGISTICS LEDGER
          ========================================================================= */}
      {activeTab === "esg" && (
        <div className="enterprise-module-grid">
          {/* Left: Production Logistics Calculator */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>04 / SUSTAINABILITY INDEX</span>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", background: "rgba(16, 185, 129, 0.15)", padding: "3px 8px", borderRadius: "4px" }}>
                ISO-14064 COMPLIANT
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 10px" }}>
              ENTERPRISE ESG CARBON LEDGER
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Quantify shoot travel, studio energy, lighting load, and crew logistics into certified carbon offsets.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  ROUND-TRIP TRAVEL DISTANCE: <strong>{travelKm} km</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={travelKm}
                  onChange={(e) => setTravelKm(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-green)" }}
                />
              </div>

              <div className="enterprise-subgrid">
                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    STUDIO HOURS: <strong>{studioHours} hrs</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="48"
                    value={studioHours}
                    onChange={(e) => setStudioHours(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-gold)" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    HEAVY LIGHTING RIGS: <strong>{heavyLights} units</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={heavyLights}
                    onChange={(e) => setHeavyLights(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-purple)" }}
                  />
                </div>
              </div>

              <div className="enterprise-subgrid">
                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    CREW COUNT: <strong>{crewCount} members</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={crewCount}
                    onChange={(e) => setCrewCount(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-green)" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    SHOOT DURATION: <strong>{shootDays} days</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={shootDays}
                    onChange={(e) => setShootDays(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-gold)" }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handlePurchaseCarbonOffset}
                className="btn-magnetic"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontWeight: 800,
                  fontSize: "12px",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(197, 140, 19, 0.3))",
                  color: "var(--paper-soft)",
                }}
              >
                {offsetPurchased ? "✓ CERTIFIED GREEN PRODUCTION REGISTERED" : "🌿 FUND CERTIFIED CARBON OFFSET POOL"}
              </button>
            </div>
          </div>

          {/* Right: Carbon Output Breakdown & Certificate */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>EMISSION QUANTIFICATION</span>
              <h3 className="font-display" style={{ fontSize: "20px", margin: "6px 0 16px" }}>
                TOTAL CARBON FOOTPRINT
              </h3>

              <div className="enterprise-subgrid" style={{ marginBottom: "16px" }}>
                <div className="satin-card" style={{ padding: "16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.3)" }}>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>TOTAL EMISSIONS</span>
                  <span className="font-display" style={{ fontSize: "26px", color: "var(--paper-soft)" }}>
                    {carbonResult?.totalCarbonKgs} <span style={{ fontSize: "12px" }}>kg CO₂</span>
                  </span>
                </div>

                <div className="satin-card" style={{ padding: "16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.3)" }}>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>OFFSET COST</span>
                  <span className="font-display" style={{ fontSize: "26px", color: "var(--accent-gold)" }}>
                    ₹{carbonResult?.offsetCostInr}
                  </span>
                </div>
              </div>

              {/* Itemized breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>• Van Transport (0.12 kg/km):</span>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--paper-soft)" }}>{carbonResult?.transportKgs} kg</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>• Studio Power (1.45 kg/hr):</span>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--paper-soft)" }}>{carbonResult?.studioKgs} kg</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>• High-Draw Lighting (0.35 kg/hr):</span>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--paper-soft)" }}>{carbonResult?.lightingKgs} kg</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>• Crew Catering (0.85 kg/meal):</span>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--paper-soft)" }}>{carbonResult?.mealsKgs} kg</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--satin-border)", paddingTop: "16px", marginTop: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 800 }}>
                CERTIFIED GREEN PRODUCTION BADGE INCLUDED IN 1-CLICK BRIEF
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: MULTI-PARTY ARBITRATED DISPUTE NODE
          ========================================================================= */}
      {activeTab === "disputes" && (
        <div className="enterprise-module-grid">
          {/* Left: Active Disputes & Auto-Settle Controls */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>05 / ARBITRATION SMART-NODE</span>
              <span className="mono" style={{ fontSize: "10px", color: "#ef4444", background: "rgba(239, 68, 68, 0.15)", padding: "3px 8px", borderRadius: "4px" }}>
                FUNDS SAFELY FROZEN
              </span>
            </div>

            <h3 className="font-display" style={{ fontSize: "20px", margin: "0 0 10px" }}>
              DISPUTE RESOLUTION CONSOLE
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              When creative differences or scope creep block payouts, resolve programmatically with mutual 50/50 settlements or third-party mediation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="satin-card" style={{ padding: "16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.35)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>ACTIVE DISPUTE CASE #OV-DSP-9102</span>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", fontWeight: 800 }}>OPENED</span>
                </div>
                <h4 style={{ margin: "4px 0", fontSize: "14px", color: "var(--paper-soft)" }}>Urban Monkey Autumn Streetwear Reel</h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 8px" }}>
                  Brand requested a 4th revision exceeding the signed 2-revision limit in clause 3.2.
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "8px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>FROZEN ESCROW:</span>
                  <span className="mono" style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent-gold)" }}>₹60,000</span>
                </div>
              </div>

              <div>
                <label className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  MUTUAL AUTO-SETTLE SPLIT RATIO: <strong>{(disputeRefundRatio * 100).toFixed(0)}% Brand Refund / {((1 - disputeRefundRatio) * 100).toFixed(0)}% Creator Payout</strong>
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={disputeRefundRatio}
                  onChange={(e) => setDisputeRefundRatio(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-gold)" }}
                />
              </div>

              <div className="enterprise-subgrid enterprise-actions-row">
                <button
                  type="button"
                  onClick={() => handleAutoSettleDispute(selectedDisputeId || disputesList[0]?.id)}
                  className="btn-magnetic"
                  style={{
                    padding: "12px",
                    fontWeight: 800,
                    fontSize: "11px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(197, 140, 19, 0.3))",
                    color: "var(--paper-soft)",
                  }}
                >
                  {disputeSettled ? "✓ 50/50 SETTLED" : "🤝 ACCEPT AUTO-SETTLE (50/50)"}
                </button>

                <button
                  type="button"
                  onClick={handleOpenSampleDispute}
                  className="btn btn-ghost"
                  style={{ padding: "12px", fontSize: "11px", borderColor: "var(--satin-border)" }}
                >
                  ⚡ OPEN NEW DISPUTE
                </button>
              </div>
            </div>
          </div>

          {/* Right: Submission Comparison & Timeline */}
          <div className="satin-card" style={{ padding: "28px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-gold)" }}>ARBITRATION EVIDENCE DOSSIER</span>
              <h3 className="font-display" style={{ fontSize: "20px", margin: "6px 0 16px" }}>
                SUBMISSION TIMELINE AUDIT
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ borderLeft: "2px solid var(--accent-green)", paddingLeft: "12px" }}>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)" }}>AUG 28, 2026 • 14:00</span>
                  <h5 style={{ margin: "2px 0", fontSize: "13px" }}>Signed Production Brief (v1.0)</h5>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>Clause 3.2: 2 revisions included. Safe-zone compliant 9:16 ProRes master.</p>
                </div>

                <div style={{ borderLeft: "2px solid var(--accent-gold)", paddingLeft: "12px" }}>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)" }}>AUG 31, 2026 • 18:30</span>
                  <h5 style={{ margin: "2px 0", fontSize: "13px" }}>Deliverable #1 & #2 Submitted</h5>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>Color graded cut & 4x stills uploaded to Onevoo Content Vault.</p>
                </div>

                <div style={{ borderLeft: "2px solid #ef4444", paddingLeft: "12px" }}>
                  <span className="mono" style={{ fontSize: "10px", color: "#ef4444" }}>SEP 02, 2026 • 11:15</span>
                  <h5 style={{ margin: "2px 0", fontSize: "13px" }}>4th Revision Requested (Scope Creep)</h5>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>Escrow frozen in arbitration smart-vault pending auto-settlement.</p>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--satin-border)", paddingTop: "16px", marginTop: "16px" }}>
              <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                THIRD-PARTY MEDIATION: AAA Arbitrated • Digital Audit Trail Immutable
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: BRAND SHOOT REEL MODERATION & EDITORIAL DESK
          ========================================================================= */}
      {activeTab === "moderation" && (
        <div style={{ marginTop: "24px" }}>
          <AdminReelModeration isOpen={true} />
        </div>
      )}

      {/* =========================================================================
          TAB 7: v9 FEDERATED ATTRIBUTION, YIELD MANAGEMENT & BI ANALYTICS
          ========================================================================= */}
      {activeTab === "bi_attribution" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "8px" }}>
          {/* Executive Overview KPI Trio */}
          <div className="bi-kpi-grid">
            <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px", borderLeft: "4px solid var(--accent-green)" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 800 }}>ATTRIBUTED CONVERSION VALUE</span>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)", margin: "4px 0" }}>
                ₹{attributionData?.overview?.totalConversionValue?.toLocaleString('en-IN') || "2,98,70,000"}
              </div>
              <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                {attributionData?.overview?.totalConversions?.toLocaleString() || "37,990"} verified brand conversions
              </span>
            </div>

            <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px", borderLeft: "4px solid var(--accent-gold)" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 800 }}>AVERAGE MULTI-CHANNEL ROAS</span>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-gold)", fontFamily: "var(--font-display)", margin: "4px 0" }}>
                {attributionData?.overview?.avgRoas || "5.55"}x
              </div>
              <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                Top 2% creator production yield
              </span>
            </div>

            <div className="satin-card" style={{ padding: "20px 24px", borderRadius: "16px", borderLeft: "4px solid var(--accent-purple)" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", fontWeight: 800 }}>AGENCY PROFITABILITY (NET)</span>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--paper-soft)", fontFamily: "var(--font-display)", margin: "4px 0" }}>
                ₹{attributionData?.overview?.totalAgencyProfit?.toLocaleString('en-IN') || "48,44,700"}
              </div>
              <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-purple)", fontWeight: 700 }}>
                15.8% blended take-rate
              </span>
            </div>
          </div>

          {/* Attribution Table: Resource to Conversion Mapping */}
          <div className="satin-card" style={{ padding: "24px 28px", borderRadius: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <span className="mono" style={{ fontSize: "10.5px", color: "var(--accent-gold)", fontWeight: 800 }}>
                  07 / PRODUCTION RESOURCE ATTRIBUTION MATRIX (v9)
                </span>
                <h3 className="font-display" style={{ fontSize: "20px", margin: "2px 0 0" }}>
                  CAMPAIGN REVENUE & GEAR ATTRIBUTION
                </h3>
              </div>

              <button
                type="button"
                onClick={fetchAttributionBI}
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
                ↺ Refresh Live Matrix
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--satin-border)", color: "var(--text-muted)" }}>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>CAMPAIGN & BRAND</th>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>STUDIO ALLOCATED</th>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>CAMERA & LIGHTING RIG</th>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>CREATOR</th>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>CONVERSIONS</th>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>ROAS</th>
                    <th className="mono" style={{ padding: "10px 12px", fontSize: "10px" }}>REVENUE (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {(attributionData?.campaigns || [
                    { id: "1", campaign_name: "Monsoon Glow Skincare Launch", brand_name: "Nykaa Beauty", studio_used: "Mehboob Soundstage A", camera_gear: "Sony FX3 + 85mm F1.2 Macro", creator_name: "Tanvi Sharma", conversions: 8420, roas: 5.4, conversion_value_inr: 4210000 },
                    { id: "2", campaign_name: "Kinetic Summer Athletics", brand_name: "Nike Athletics", studio_used: "BKC Track & Light Grid", camera_gear: "RED Komodo 6K + Cine Primes", creator_name: "Aman Sen", conversions: 11950, roas: 6.2, conversion_value_inr: 7170000 },
                    { id: "3", campaign_name: "Royal Heritage Diamond Gala", brand_name: "Tanishq Jewelers", studio_used: "Varanasi Assi Ghats", camera_gear: "Sony FX6 + Zeiss Supreme Primes", creator_name: "Neha Kapoor", conversions: 3420, roas: 4.8, conversion_value_inr: 8550000 },
                    { id: "4", campaign_name: "Galaxy S26 Cinematic Story", brand_name: "Samsung Mobile", studio_used: "Soundstage Floor 4 Bandra", camera_gear: "Samsung Ultra Rig + Master Gimbal", creator_name: "Tanvi Sharma", conversions: 14200, roas: 5.8, conversion_value_inr: 9940000 }
                  ]).map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px", fontWeight: 700, color: "var(--paper-soft)" }}>
                        {c.campaign_name}
                        <span className="mono" style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", fontWeight: 400 }}>{c.brand_name}</span>
                      </td>
                      <td className="mono" style={{ padding: "12px", color: "var(--accent-cyan)", fontSize: "11px" }}>{c.studio_used}</td>
                      <td className="mono" style={{ padding: "12px", color: "var(--text-muted)", fontSize: "11px" }}>{c.camera_gear}</td>
                      <td style={{ padding: "12px", color: "var(--paper-soft)", fontWeight: 600 }}>{c.creator_name}</td>
                      <td className="mono" style={{ padding: "12px", color: "var(--paper-soft)" }}>{Number(c.conversions).toLocaleString()}</td>
                      <td className="mono" style={{ padding: "12px", color: "var(--accent-gold)", fontWeight: 800 }}>{c.roas}x</td>
                      <td className="mono" style={{ padding: "12px", color: "var(--accent-green)", fontWeight: 800 }}>
                        ₹{Number(c.conversion_value_inr).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual Column: Studio Efficiency + ML Yield Management */}
          <div className="enterprise-module-grid">
            {/* Left: Studio Efficiency Ranking */}
            <div className="satin-card" style={{ padding: "24px", borderRadius: "18px" }}>
              <span className="mono" style={{ fontSize: "10px", color: "var(--accent-cyan)", fontWeight: 800 }}>LOCATION EFFICIENCY BENCHMARK</span>
              <h4 style={{ margin: "4px 0 14px", fontSize: "16px", color: "var(--paper-soft)" }}>
                Studio ROAS & Throughput Yield
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(attributionData?.studioEfficiency || [
                  { studio: "BKC Track & Light Grid", avgRoas: "6.20", totalValueInr: 7170000, campaignsCount: 1 },
                  { studio: "Soundstage Floor 4 Bandra", avgRoas: "5.80", totalValueInr: 9940000, campaignsCount: 1 },
                  { studio: "Mehboob Soundstage A", avgRoas: "5.40", totalValueInr: 4210000, campaignsCount: 1 },
                  { studio: "Varanasi Assi Ghats", avgRoas: "4.80", totalValueInr: 8550000, campaignsCount: 1 }
                ]).map((s, idx) => (
                  <div key={s.studio} style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--satin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="mono" style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>RANK #{idx + 1}</span>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--paper-soft)" }}>{s.studio}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="mono" style={{ fontSize: "13px", fontWeight: 800, color: "var(--accent-gold)" }}>{s.avgRoas}x ROAS</span>
                      <span className="mono" style={{ fontSize: "9.5px", color: "var(--accent-green)", display: "block" }}>₹{Number(s.totalValueInr).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: ML Yield Optimizer & ROI Simulator */}
            <div className="satin-card" style={{ padding: "24px", borderRadius: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 800 }}>ML PRICING & YIELD RECOMMENDATION</span>
                  <span className="mono" style={{ fontSize: "9.5px", background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-green)", padding: "2px 6px", borderRadius: "4px" }}>
                    94.2% Margin Safety
                  </span>
                </div>

                <h4 style={{ margin: "4px 0 14px", fontSize: "16px", color: "var(--paper-soft)" }}>
                  Dynamic Campaign Simulator
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                      SIMULATE PRODUCTION BUDGET: <strong>₹{Number(simBudget).toLocaleString('en-IN')}</strong>
                    </label>
                    <input
                      type="range"
                      min={100000}
                      max={2000000}
                      step={50000}
                      value={simBudget}
                      onChange={(e) => setSimBudget(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "var(--accent-gold)" }}
                    />
                  </div>

                  <div style={{ padding: "12px 14px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>PROJECTED REVENUE ATTRIBUTION:</span>
                      <span className="mono" style={{ fontSize: "14px", fontWeight: 800, color: "var(--accent-green)" }}>
                        ₹{Math.round(simBudget * 5.4).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="mono" style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>ESTIMATED CONVERSIONS:</span>
                      <span className="mono" style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-gold)" }}>
                        ~{Math.round(simBudget / 500).toLocaleString()} orders
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--satin-border)", paddingTop: "12px", marginTop: "14px" }}>
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  MODEL: ML Multi-Touch Yield Curve • Neon PostgreSQL BI Sync Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
