import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-init-1",
    title: "Community Event Live & Verified",
    message: "Your submission 'Onevoo VIP Creator Summit 2026' was verified with studio permit credentials.",
    type: "submission",
    status: "ACTIVE",
    badgeColor: "var(--accent-green)",
    time: "Just now",
    timestamp: Date.now() - 1000 * 60 * 5,
    isRead: false,
    actionText: "View Event",
    actionLink: "/opportunities",
  },
  {
    id: "notif-init-2",
    title: "Escrow Milestone Initialized",
    message: "Smart Escrow Ledger locked ₹48,450 for Minimalist Furniture Campaign.",
    type: "escrow",
    status: "ESCROW LOCKED",
    badgeColor: "var(--accent-gold)",
    time: "1 hour ago",
    timestamp: Date.now() - 1000 * 60 * 60,
    isRead: false,
    actionText: "Review Agreement",
    actionLink: "/terms",
  },
  {
    id: "notif-init-3",
    title: "Neon Postgres Creator Verified",
    message: "Connected authority profile @tanvi.creates authenticated with 54,000 reach.",
    type: "task",
    status: "VERIFIED",
    badgeColor: "var(--accent-purple)",
    time: "Yesterday",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    isRead: true,
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("onevoo_notifications");
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [toasts, setToasts] = useState([]);

  // Fetch backend notifications from Neon PostgreSQL
  useEffect(() => {
    const fetchBackendNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.notifications && data.notifications.length > 0) {
          const formatted = data.notifications.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || "reel_status",
            status: n.status || "ACTIVE",
            badgeColor: n.badge_color || (n.status === "NOT APPROVED" ? "var(--accent-rose)" : "var(--accent-green)"),
            time: "Recently",
            timestamp: new Date(n.created_at).getTime(),
            isRead: n.is_read || false,
          }));

          setNotifications((prev) => {
            const combined = [...formatted, ...prev.filter((p) => !formatted.some((f) => f.id === p.id || f.title === p.title))];
            return combined;
          });
        }
      } catch {
        // ignore offline fallback
      }
    };

    fetchBackendNotifications();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("onevoo_notifications", JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Add notification & push instant toast
  const addNotification = ({
    title,
    message,
    type = "task",
    status = "QUEUED",
    badgeColor = "var(--accent-green)",
    actionText = null,
    actionLink = null,
  }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      status,
      badgeColor,
      time: "Just now",
      timestamp: Date.now(),
      isRead: false,
      actionText,
      actionLink,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Push toast
    const toastId = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id: toastId, ...newNotif }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4500);

    return newNotif;
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack */}
      <div
        className="toast-stack-container"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
          maxWidth: "380px",
          width: "100%",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-item satin-card"
            style={{
              padding: "14px 18px",
              borderRadius: "12px",
              background: "var(--satin-bg)",
              border: "1px solid var(--satin-border)",
              boxShadow: "0 14px 35px rgba(0,0,0,0.4)",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              animation: "slideInRight 0.3s ease",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: t.badgeColor || "var(--accent-green)",
                marginTop: "6px",
                boxShadow: `0 0 10px ${t.badgeColor || "var(--accent-green)"}`,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: "10px", color: t.badgeColor || "var(--accent-green)", fontWeight: 700 }}>
                  {t.status || "NOTIFICATION"}
                </span>
                <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                  Just now
                </span>
              </div>
              <h4 style={{ margin: "2px 0 4px", fontSize: "13px", fontWeight: 700, color: "var(--paper-soft)" }}>
                {t.title}
              </h4>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                {t.message}
              </p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
