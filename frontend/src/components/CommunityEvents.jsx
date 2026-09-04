import React, { useEffect, useState, useMemo } from "react";
import { useNotifications } from "../context/NotificationContext";

const CATEGORIES = [
  "All Categories",
  "Creator Meetup",
  "Studio Shoot",
  "Brand Workshop",
  "Masterclass",
  "Networking Mixer",
  "Launch Party",
];

const emptyEventForm = {
  title: "",
  details: "",
  location: "",
  eventDate: "",
  eventTime: "18:00",
  category: "Creator Meetup",
  imageUrl: "",
  proofUrl: "",
  proofDetails: "",
  organizerName: "",
  organizerContact: "",
  editPasscode: "",
};

// Helper: Parse date strings safely regardless of ISO timestamp or YYYY-MM-DD
const parseDateParts = (rawDate) => {
  if (!rawDate) return null;
  const dateOnly = String(rawDate).split("T")[0];
  const parts = dateOnly.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return { year, month, day, dateOnly };
  }
  return null;
};

export const formatEventDateDisplay = (dateStr) => {
  const parts = parseDateParts(dateStr);
  if (!parts) return "Upcoming Date";
  const d = new Date(parts.year, parts.month, parts.day);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

// Helper: Calculate expiration and countdown
const getEventTiming = (dateStr, timeStr = "18:00") => {
  const parts = parseDateParts(dateStr);
  if (!parts) return { isExpired: false, label: "Scheduled", diffHours: 999 };

  const [hours, minutes] = (timeStr || "18:00").split(":").map(Number);
  const eventDate = new Date(parts.year, parts.month, parts.day, hours || 18, minutes || 0, 0);

  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < -4 * 60 * 60 * 1000) {
    // 4 hours past start time = fully expired
    return { isExpired: true, label: "⏱️ Concluded / Expired", diffHours, badgeClass: "expired" };
  } else if (diffMs <= 0 && diffMs >= -4 * 60 * 60 * 1000) {
    return { isExpired: false, label: "🟢 Happening Today (Live)", diffHours, badgeClass: "live" };
  } else {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const remHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const label = days > 0 ? `⏰ In ${days}d ${remHours}h` : `⏳ In ${remHours}h ${remMins}m`;
    return { isExpired: false, label, diffHours, badgeClass: "upcoming" };
  }
};

export default function CommunityEvents() {
  const { addNotification } = useNotifications();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" | "submit" | "update" | "archive"
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(emptyEventForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [selectedProofEvent, setSelectedProofEvent] = useState(null);
  
  // Update mode state
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);
  const [editPasscodeAuth, setEditPasscodeAuth] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live timer tick for real-time automatic expiration
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 15000); // 15s live evaluation
    return () => clearInterval(timer);
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setEvents(data.events || []))
      .catch(() => setStatus({ type: "error", message: "Events are temporarily offline." }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Compute active vs expired events dynamically
  const { activeEvents, expiredEvents } = useMemo(() => {
    const active = [];
    const expired = [];

    events.forEach((evt) => {
      const timing = getEventTiming(evt.event_date, evt.event_time);
      const enhancedEvt = { ...evt, timing };
      if (timing.isExpired || evt.status === "expired") {
        expired.push(enhancedEvt);
      } else {
        active.push(enhancedEvt);
      }
    });

    return { activeEvents: active, expiredEvents: expired };
  }, [events, nowTick]);

  const displayedEvents = useMemo(() => {
    const sourceList = activeTab === "archive" ? expiredEvents : activeEvents;
    return sourceList.filter((item) => {
      const matchesCat = categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeTab, activeEvents, expiredEvents, categoryFilter, searchQuery]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 1. Submit New Event with Proof
  const handleSubmitNew = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish event.");

      setStatus({
        type: "success",
        message: `🎉 Event published successfully! Save your Organizer Passcode: [ ${data.editPasscode} ] to edit or update this event later.`,
      });

      // Queue in Notification & Task Center
      addNotification({
        title: `Community Event Published: ${form.title}`,
        message: `Event scheduled for ${formatEventDateDisplay(form.eventDate)} at ${form.location}. Save passcode: ${data.editPasscode}`,
        type: "submission",
        status: "ACTIVE & VERIFIED",
        badgeColor: "var(--accent-green)",
        actionText: "View Event",
        actionLink: "/opportunities",
      });

      setForm(emptyEventForm);
      setActiveTab("upcoming");
      fetchEvents();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Unlock Event for Editing with Passcode
  const handleUnlockEvent = (evt) => {
    setSelectedEventToEdit(evt);
    setForm({
      title: evt.title || "",
      details: evt.details || "",
      location: evt.location || "",
      eventDate: evt.event_date ? evt.event_date.split("T")[0] : "",
      eventTime: evt.event_time || "18:00",
      category: evt.category || "Creator Meetup",
      imageUrl: evt.image_url || "",
      proofUrl: evt.proof_url || "",
      proofDetails: evt.proof_details || "",
      organizerName: evt.organizer_name || "",
      organizerContact: evt.organizer_contact || "",
      editPasscode: "",
    });
    setEditPasscodeAuth("");
    setActiveTab("update");
  };

  // 3. Save Updated Event Details
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!selectedEventToEdit) return;
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/events/${selectedEventToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          editPasscode: editPasscodeAuth || form.editPasscode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update event.");

      setStatus({
        type: "success",
        message: `✅ "${data.event.title}" has been updated live on the calendar with verified proof!`,
      });

      // Queue in Notification & Task Center
      addNotification({
        title: `Event Updated: ${data.event.title}`,
        message: `Venue & schedule updated for ${formatEventDateDisplay(data.event.event_date)} at ${data.event.location}.`,
        type: "submission",
        status: "UPDATED LIVE",
        badgeColor: "var(--accent-gold)",
        actionText: "View on Calendar",
        actionLink: "/opportunities",
      });

      setSelectedEventToEdit(null);
      setForm(emptyEventForm);
      setActiveTab("upcoming");
      fetchEvents();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Cancel / Delete Event
  const handleDeleteEvent = async () => {
    if (!selectedEventToEdit || !editPasscodeAuth) {
      setStatus({ type: "error", message: "Organizer Passcode required to remove event." });
      return;
    }
    if (!window.confirm(`Are you sure you want to cancel and remove "${selectedEventToEdit.title}"?`)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events/${selectedEventToEdit.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editPasscode: editPasscodeAuth }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete event.");

      setStatus({ type: "success", message: "Event removed from calendar." });

      addNotification({
        title: `Event Canceled: ${selectedEventToEdit.title}`,
        message: `The event was removed from active listings in Neon DB.`,
        type: "system",
        status: "REMOVED",
        badgeColor: "var(--accent-rose)",
      });

      setSelectedEventToEdit(null);
      setForm(emptyEventForm);
      setActiveTab("upcoming");
      fetchEvents();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="community-events satin-card" aria-labelledby="events-heading" style={{ position: "relative" }}>
      {/* Header with Live Counter & Tab Switcher */}
      <div className="community-events-head" style={{ marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="pulse-emerald-ring" style={{ width: "8px", height: "8px" }} />
            <span className="tech-label-mono" style={{ fontSize: "11px" }}>
              VERIFIED COMMUNITY DEAL FLOW & MEETUPS
            </span>
          </div>
          <h2 id="events-heading" className="disp-title-h2" style={{ margin: "4px 0 8px" }}>
            CREATOR EVENTS & <em>WORKSHOPS</em>
          </h2>
          <p style={{ maxWidth: "580px", margin: 0 }}>
            Discover upcoming local shoots, brand networking summits, and masterclasses. All community submissions include verified organizer proof and automated timely expiration.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className={`filter-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
            style={{ borderRadius: "8px", fontSize: "11px", padding: "8px 14px" }}
          >
            📅 Active Events ({activeEvents.length})
          </button>

          <button
            type="button"
            className={`filter-btn ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("submit");
              setSelectedEventToEdit(null);
              setForm(emptyEventForm);
              setStatus({ type: "", message: "" });
            }}
            style={{ borderRadius: "8px", fontSize: "11px", padding: "8px 14px", background: activeTab === "submit" ? "var(--accent-green)" : "" }}
          >
            ➕ Host / Submit Event
          </button>

          <button
            type="button"
            className={`filter-btn ${activeTab === "update" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("update");
              setStatus({ type: "", message: "" });
            }}
            style={{ borderRadius: "8px", fontSize: "11px", padding: "8px 14px", background: activeTab === "update" ? "var(--accent-gold)" : "" }}
          >
            ✏️ Update Existing Event
          </button>

          <button
            type="button"
            className={`filter-btn ${activeTab === "archive" ? "active" : ""}`}
            onClick={() => setActiveTab("archive")}
            style={{ borderRadius: "8px", fontSize: "11px", padding: "8px 14px" }}
          >
            ⏱️ Expired Archive ({expiredEvents.length})
          </button>
        </div>
      </div>

      {/* Status Feedback Alert */}
      {status.message && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            background: status.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
            border: `1px solid ${status.type === "success" ? "var(--accent-green)" : "var(--accent-rose)"}`,
            color: status.type === "success" ? "var(--accent-green)" : "var(--accent-rose)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{status.message}</span>
          <button
            onClick={() => setStatus({ type: "", message: "" })}
            style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1 & 4: Active Events Grid / Expired Archive View
          ========================================================================= */}
      {(activeTab === "upcoming" || activeTab === "archive") && (
        <div>
          {/* Filter & Search Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            {/* Category Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`theme-btn ${categoryFilter === cat ? "active" : ""}`}
                  onClick={() => setCategoryFilter(cat)}
                  style={{ borderRadius: "99px", padding: "5px 12px", fontSize: "10px" }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <input
              type="text"
              placeholder="Search title, venue, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--satin-border)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "var(--paper-soft)",
                fontSize: "11px",
                fontFamily: "inherit",
                minWidth: "240px",
              }}
            />
          </div>

          {/* Events Grid */}
          <div className="event-list" style={{ marginTop: "10px" }}>
            {loading ? (
              <p className="event-empty mono" style={{ fontSize: "12px" }}>⏳ Fetching latest verified community events...</p>
            ) : displayedEvents.length ? (
              displayedEvents.map((item) => {
                const isItemExpired = item.timing.isExpired;
                return (
                  <article
                    className="event-card satin-card"
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      opacity: isItemExpired ? 0.75 : 1,
                      filter: isItemExpired ? "grayscale(30%)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div>
                      {item.image_url ? (
                        <div style={{ position: "relative", height: "150px", overflow: "hidden" }}>
                          <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                            <span
                              className="mono"
                              style={{
                                fontSize: "9px",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                background: isItemExpired
                                  ? "rgba(239, 68, 68, 0.85)"
                                  : item.timing.badgeClass === "live"
                                  ? "rgba(16, 185, 129, 0.9)"
                                  : "rgba(197, 140, 19, 0.9)",
                                color: "#ffffff",
                                fontWeight: 800,
                              }}
                            >
                              {item.timing.label}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            height: "60px",
                            background: "linear-gradient(135deg, rgba(112, 37, 225, 0.2), rgba(16, 185, 129, 0.15))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 16px",
                          }}
                        >
                          <span className="mono" style={{ fontSize: "10px", color: "var(--accent-purple)", fontWeight: 700 }}>
                            {item.category || "Creator Meetup"}
                          </span>
                          <span
                            className="mono"
                            style={{
                              fontSize: "9px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: isItemExpired ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                              color: isItemExpired ? "var(--accent-rose)" : "var(--accent-green)",
                              fontWeight: 700,
                            }}
                          >
                            {item.timing.label}
                          </span>
                        </div>
                      )}

                      <div className="event-card-content" style={{ padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span className="event-date mono" style={{ fontSize: "10px" }}>
                            🗓️ {formatEventDateDisplay(item.event_date)} • {item.event_time || "18:00"}
                          </span>
                          <span className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)" }}>
                            {item.category}
                          </span>
                        </div>

                        <h3 style={{ margin: "4px 0 6px", fontSize: "17px", fontWeight: 800, color: "var(--paper-soft)" }}>
                          {item.title}
                        </h3>

                        <p className="event-location mono" style={{ fontSize: "11px", marginBottom: "8px" }}>
                          📍 {item.location}
                        </p>

                        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.45, margin: "0 0 12px" }}>
                          {item.details}
                        </p>

                        {/* Verified Proof & Host Badge */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", paddingTop: "8px", borderTop: "1px solid var(--satin-border)" }}>
                          <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                            Host: <strong style={{ color: "var(--paper-soft)" }}>{item.organizer_name}</strong>
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelectedProofEvent(item)}
                            className="mono"
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              color: "var(--accent-green)",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "9px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            🛡️ View Proof Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div style={{ padding: "0 16px 14px", display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleUnlockEvent(item)}
                        className="mono"
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid var(--satin-border)",
                          color: "var(--paper-soft)",
                          fontSize: "11px",
                          cursor: "pointer",
                          fontWeight: 700,
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        ✏️ Edit / Update Event
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                {activeTab === "archive"
                  ? "No expired events in the archive yet."
                  : "No upcoming events match the filter. Submit one below to gather creators!"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: Host / Submit New Event with Proof
          ========================================================================= */}
      {activeTab === "submit" && (
        <form className="event-form satin-card" onSubmit={handleSubmitNew} style={{ display: "flex", flexDirection: "column", gap: "18px", padding: "28px" }}>
          <div style={{ borderBottom: "1px solid var(--satin-border)", paddingBottom: "14px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px", color: "var(--accent-green)" }}>
              COMMUNITY EVENT SUBMISSION ENGINE
            </span>
            <h3 style={{ margin: "4px 0", color: "var(--paper-soft)", fontSize: "20px", fontWeight: 800 }}>
              Publish a Community Event with Verified Proof
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
              Provide valid event specifics and proof credentials (booking confirmation, flyer URL, venue permit, or official ticket link).
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {/* Title */}
            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                EVENT TITLE *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g. Bangalore Creators Meetup 2026"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                CATEGORY *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "12px 14px",
                  border: "1px solid var(--satin-border)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--paper-soft)",
                  font: "14px var(--font-sans)",
                }}
              >
                {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                  <option key={cat} value={cat} style={{ background: "#111", color: "#fff" }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                VENUE / CITY *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleInputChange}
                placeholder="e.g. Indiranagar Studio Hub, Bengaluru"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                EVENT DATE *
              </label>
              <input
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                START TIME (AUTO-EXPIRES AFTER CONCLUSION) *
              </label>
              <input
                name="eventTime"
                type="time"
                value={form.eventTime}
                onChange={handleInputChange}
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
              />
            </div>

            {/* Banner Image URL */}
            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                BANNER / IMAGE URL (OPTIONAL)
              </label>
              <input
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
                style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
              />
            </div>
          </div>

          {/* Proof & Verification Section */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>🛡️</span>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 800 }}>
                ORGANIZER VERIFICATION & PROOF CREDENTIALS *
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontWeight: 700 }}>
                  PROOF / TICKET / VENUE PERMIT LINK *
                </label>
                <input
                  name="proofUrl"
                  type="url"
                  value={form.proofUrl}
                  onChange={handleInputChange}
                  placeholder="https://lu.ma/event... or Google Drive permit URL"
                  required
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontWeight: 700 }}>
                  ORGANIZER NAME & CONTACT HANDLE *
                </label>
                <input
                  name="organizerName"
                  value={form.organizerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Tanvi Sharma (@tanvi.creates)"
                  required
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
                />
              </div>
            </div>

            <div>
              <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontWeight: 700 }}>
                PROOF DESCRIPTION & VERIFICATION DETAILS *
              </label>
              <textarea
                name="proofDetails"
                value={form.proofDetails}
                onChange={handleInputChange}
                placeholder="Detail permit reference, studio booking confirmation #, or organizer authorization notes..."
                style={{ width: "100%", minHeight: "80px", padding: "12px 14px", borderRadius: "8px" }}
                required
              />
            </div>
          </div>

          {/* Event Details */}
          <div>
            <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
              EVENT DESCRIPTION & SCHEDULE *
            </label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleInputChange}
              placeholder="Describe agenda, networking sessions, dress code, speaker line-up, and eligibility to attend..."
              style={{ width: "100%", minHeight: "90px", padding: "12px 14px", borderRadius: "8px" }}
              required
            />
          </div>

          {/* Custom Organizer Passcode */}
          <div>
            <label className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
              SET 6-DIGIT ORGANIZER EDIT PASSCODE (OPTIONAL - WE AUTO-GENERATE IF LEFT BLANK)
            </label>
            <input
              name="editPasscode"
              type="text"
              maxLength="8"
              value={form.editPasscode}
              onChange={handleInputChange}
              placeholder="e.g. 748291 (use this to edit event later)"
              style={{ maxWidth: "320px", padding: "12px 14px", borderRadius: "8px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button className="event-primary-action" type="submit" disabled={isSubmitting} style={{ padding: "14px 28px" }}>
              {isSubmitting ? "Publishing Event..." : "🚀 Publish Event with Verified Proof"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setActiveTab("upcoming")}
              style={{ padding: "14px 22px", fontSize: "11px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 3: Update / Edit Existing Event with Passcode (Fixed CSS & Full Width)
          ========================================================================= */}
      {activeTab === "update" && (
        <div className="satin-card" style={{ padding: "28px", borderRadius: "16px" }}>
          <div style={{ borderBottom: "1px solid var(--satin-border)", paddingBottom: "14px", marginBottom: "20px" }}>
            <span className="tech-label-mono" style={{ fontSize: "10px", color: "var(--accent-gold)" }}>
              ORGANIZER EVENT UPDATE PORTAL
            </span>
            <h3 style={{ margin: "4px 0", color: "var(--paper-soft)", fontSize: "20px", fontWeight: 800 }}>
              Update Event Details & Renew Verification Proof
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
              Select an event and enter your Organizer Passcode to unlock real-time live editing of venue, schedule, or proof documents.
            </p>
          </div>

          {/* Event Selector */}
          {!selectedEventToEdit ? (
            <div>
              <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "12px", fontWeight: 700 }}>
                SELECT THE EVENT YOU WISH TO UPDATE:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => handleUnlockEvent(evt)}
                    className="satin-card"
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border: "1px solid var(--satin-border)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span className="mono" style={{ fontSize: "9px", color: "var(--accent-gold)", fontWeight: 700 }}>
                      {evt.category} • {formatEventDateDisplay(evt.event_date)}
                    </span>
                    <h4 style={{ margin: "6px 0", color: "var(--paper-soft)", fontSize: "16px", fontWeight: 800 }}>{evt.title}</h4>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 10px" }}>📍 {evt.location}</p>
                    <span className="mono" style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 700 }}>
                      Click to Enter Passcode & Edit →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form className="event-form" onSubmit={handleUpdateEvent} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Passcode Unlock Bar */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "12px",
                  background: "rgba(197, 140, 19, 0.1)",
                  border: "1px solid rgba(197, 140, 19, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700, display: "block" }}>
                    ORGANIZER AUTHENTICATION:
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--paper-soft)", fontWeight: 800 }}>
                    Editing: "{selectedEventToEdit.title}"
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--accent-gold)", fontWeight: 700 }}>
                    ORGANIZER PASSCODE:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter 6-digit passcode"
                    value={editPasscodeAuth}
                    onChange={(e) => setEditPasscodeAuth(e.target.value)}
                    required
                    style={{ padding: "10px 14px", width: "200px", borderRadius: "8px", minHeight: "40px" }}
                  />
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                    EVENT TITLE
                  </label>
                  <input name="title" value={form.title} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }} />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                    CATEGORY
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      minHeight: "44px",
                      padding: "12px 14px",
                      border: "1px solid var(--satin-border)",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--paper-soft)",
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                      <option key={cat} value={cat} style={{ background: "#111", color: "#fff" }}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                    LOCATION / VENUE
                  </label>
                  <input name="location" value={form.location} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }} />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                    EVENT DATE
                  </label>
                  <input name="eventDate" type="date" value={form.eventDate} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }} />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                    START TIME
                  </label>
                  <input name="eventTime" type="time" value={form.eventTime} onChange={handleInputChange} required style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }} />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                    BANNER IMAGE URL
                  </label>
                  <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleInputChange} style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }} />
                </div>
              </div>

              {/* Proof Update Fields */}
              <div style={{ padding: "16px 18px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.25)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 800 }}>
                  🛡️ UPDATED PROOF & VERIFICATION CREDENTIALS:
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                  <div>
                    <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontWeight: 700 }}>
                      PROOF / PERMIT LINK *
                    </label>
                    <input
                      name="proofUrl"
                      type="url"
                      value={form.proofUrl}
                      onChange={handleInputChange}
                      placeholder="https://onevoo.com/permits/..."
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
                    />
                  </div>
                  <div>
                    <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontWeight: 700 }}>
                      ORGANIZER NAME & CONTACT HANDLE *
                    </label>
                    <input
                      name="organizerName"
                      value={form.organizerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Tanvi Sharma (@tanvi.creates)"
                      required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", minHeight: "44px" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontWeight: 700 }}>
                    PROOF DETAILS & VENUE CONFIRMATION *
                  </label>
                  <textarea
                    name="proofDetails"
                    value={form.proofDetails}
                    onChange={handleInputChange}
                    placeholder="Updated verification details or confirmation #..."
                    style={{ width: "100%", minHeight: "80px", padding: "12px 14px", borderRadius: "8px" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>
                  EVENT DESCRIPTION & SCHEDULE
                </label>
                <textarea name="details" value={form.details} onChange={handleInputChange} style={{ width: "100%", minHeight: "90px", padding: "12px 14px", borderRadius: "8px" }} required />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "14px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button className="event-primary-action" type="submit" disabled={isSubmitting} style={{ padding: "14px 28px", background: "var(--accent-gold)", color: "#161504", fontWeight: 800 }}>
                    {isSubmitting ? "Saving Changes..." : "💾 Save Live Event Updates"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setSelectedEventToEdit(null);
                      setForm(emptyEventForm);
                    }}
                    style={{ padding: "14px 20px", fontSize: "11px" }}
                  >
                    Cancel
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  disabled={isSubmitting}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid var(--accent-rose)",
                    color: "var(--accent-rose)",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                  }}
                >
                  🗑️ Cancel & Remove Event
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL: Proof & Permit Inspection Modal
          ========================================================================= */}
      {selectedProofEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(5, 5, 8, 0.8)",
            backdropFilter: "blur(14px)",
          }}
          onClick={() => setSelectedProofEvent(null)}
        >
          <div
            className="satin-card"
            style={{
              maxWidth: "540px",
              width: "100%",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid var(--satin-border)",
              background: "var(--satin-bg)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProofEvent(null)}
              style={{
                position: "absolute",
                top: "14px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "var(--paper-soft)",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "18px" }}>🛡️</span>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: 700 }}>
                VERIFIED COMMUNITY PROOF DOSSIER
              </span>
            </div>

            <h3 style={{ margin: "0 0 12px", color: "var(--paper-soft)", fontSize: "18px" }}>
              {selectedProofEvent.title}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "var(--text-muted)" }}>
              <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)" }}>
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>
                  VERIFIED ORGANIZER:
                </span>
                <strong style={{ color: "var(--paper-soft)", fontSize: "13px" }}>
                  {selectedProofEvent.organizer_name}
                </strong>
              </div>

              <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)" }}>
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>
                  PROOF & PERMIT DETAILS:
                </span>
                <p style={{ color: "var(--paper-soft)", margin: "4px 0 0", lineHeight: 1.45 }}>
                  {selectedProofEvent.proof_details || "Official booking authorization verified on file."}
                </p>
              </div>

              {selectedProofEvent.proof_url && (
                <div style={{ marginTop: "4px" }}>
                  <a
                    href={selectedProofEvent.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-magnetic"
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      padding: "8px 16px",
                      textDecoration: "none",
                      color: "var(--accent-green)",
                      borderColor: "var(--accent-green)",
                    }}
                  >
                    View Official Proof / Ticket Link ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}