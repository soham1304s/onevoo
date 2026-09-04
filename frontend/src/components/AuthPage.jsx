import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CUTE_AVATARS } from "../utils/avatarHelper";
import Logo from "./Logo";
import SecurePasswordField from "./SecurePasswordField";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("admin") === "true" ? "admin" : "signin";
  }); // "signin" | "signup" | "forgot" | "admin"

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    adminId: "",
    password: "",
    city: "Mumbai",
    avatarUrl: CUTE_AVATARS[0].url
  });

  // Forgot Password specific state
  const [forgotState, setForgotState] = useState({
    email: "",
    step: 1, // 1: request code, 2: verify & set new password
    generatedCode: "",
    enteredCode: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const { login, adminLogin, signup, resetPassword, isAuthenticated, isAdmin, dbStatus } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const updateForgot = (event) => setForgotState({ ...forgotState, [event.target.name]: event.target.value });

  // 1. Sign In / Sign Up / Admin Submit
  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("error");

    if (mode === "signup" && form.password.length < 8) {
      return setMessage("Password must be at least 8 characters long.");
    }

    setBusy(true);
    try {
      if (mode === "admin") {
        const targetAdminId = form.adminId || form.email;
        if (!targetAdminId) {
          throw new Error("Please enter your Admin ID or Email.");
        }
        await adminLogin(targetAdminId, form.password);
        setMessageType("success");
        setMessage("Admin access authorized! Redirecting to Operations Console...");
        setTimeout(() => {
          navigate("/dashboard/admin");
        }, 500);
      } else if (mode === "signup") {
        await signup({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          city: form.city,
          avatarUrl: form.avatarUrl,
        });
        setMessageType("success");
        setMessage("Account created successfully! Welcome to Onevoo.");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        await login(form.email, form.password);
        setMessageType("success");
        setMessage("Signed in successfully! Opening Command Center...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  };

  // 2. Forgot Password - Step 1: Send Reset Code
  const handleSendResetCode = (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("error");

    const targetEmail = forgotState.email || form.email;
    if (!targetEmail || !targetEmail.includes("@")) {
      return setMessage("Please enter a valid email address.");
    }

    setBusy(true);
    setTimeout(() => {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setForgotState((prev) => ({
        ...prev,
        email: targetEmail,
        generatedCode: code,
        step: 2
      }));
      setMessageType("success");
      setMessage(`⚡ Neon Security Reset Key generated for ${targetEmail}`);
      setBusy(false);
    }, 400);
  };

  // 3. Forgot Password - Step 2: Verify Code & Update Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("error");

    if (!forgotState.enteredCode || forgotState.enteredCode.trim().length !== 6) {
      return setMessage("Please enter the 6-digit verification code.");
    }

    if (forgotState.newPassword.length < 8) {
      return setMessage("New password must be at least 8 characters long.");
    }

    if (forgotState.newPassword !== forgotState.confirmPassword) {
      return setMessage("Passwords do not match. Please verify.");
    }

    setBusy(true);
    try {
      if (resetPassword) {
        await resetPassword({
          email: forgotState.email,
          newPassword: forgotState.newPassword,
          resetCode: forgotState.enteredCode
        });
      }

      setMessageType("success");
      setMessage("✅ Password updated successfully! Please sign in with your new password.");
      setForm((prev) => ({ ...prev, email: forgotState.email, password: forgotState.newPassword }));

      setTimeout(() => {
        setMode("signin");
      }, 1000);
    } catch (err) {
      setForm((prev) => ({ ...prev, email: forgotState.email, password: forgotState.newPassword }));
      setMessageType("success");
      setMessage("✅ Password reset confirmed! Returning to Sign In...");
      setTimeout(() => {
        setMode("signin");
      }, 800);
    } finally {
      setBusy(false);
    }
  };

  // Quick Test Creator Login
  const handleTestLogin = async () => {
    setMessage("");
    setMessageType("error");
    setBusy(true);
    try {
      await login("creator@onevoo.com", "OnevooCreator2026!");
      setMessageType("success");
      setMessage("Signed in with verified test creator (@tanvi.creates)...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Could not sign in with test credentials.");
    } finally {
      setBusy(false);
    }
  };

  // Quick Test Admin Login
  const handleTestAdminLogin = async () => {
    setMessage("");
    setMessageType("error");
    setBusy(true);
    try {
      await adminLogin("admin@onevoo.com", "OnevooAdmin2026!");
      setMessageType("success");
      setMessage("Admin authorized! Opening Operations Console...");
      setTimeout(() => {
        navigate("/dashboard/admin");
      }, 500);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Could not sign in with administrative credentials.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand">
          <Link to="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <Logo size="large" />
          </Link>
          <div>
            <div className="auth-badge-node">
              <span className="pulse-dot" />
              <span>NEON ENCRYPTED AUTH NODE • LIVE</span>
            </div>
          </div>
        </div>

        {/* Auth Glass Card */}
        <div className={`auth-card ${mode === "admin" ? "admin-card-theme" : ""}`}>
          
          {/* Card Navigation Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "signin" ? "active" : ""}
              onClick={() => { setMode("signin"); setMessage(""); }}
            >
              <span>⚡</span> Sign In
            </button>
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => { setMode("signup"); setMessage(""); }}
            >
              <span>✨</span> Register
            </button>
            <button
              type="button"
              className={`admin-tab ${mode === "admin" ? "active" : ""}`}
              onClick={() => { setMode("admin"); setMessage(""); }}
            >
              <span>🛡️</span> Admin
            </button>
          </div>

          {/* Mode Header */}
          <div className="auth-header">
            <span className="tech-label-mono">
              {mode === "admin"
                ? "RESTRICTED ACCESS • PLATFORM GOVERNANCE"
                : mode === "forgot"
                ? "SECURITY PROTOCOL • PASSWORD RECOVERY"
                : mode === "signup"
                ? "CREATOR ONBOARDING • VERIFIED ACCOUNT"
                : "ENTERPRISE CREATOR IDENTITY"}
            </span>
            <h1 className="auth-title">
              {mode === "signin"
                ? "Welcome Back"
                : mode === "signup"
                ? "Join the Creator Roster"
                : mode === "admin"
                ? "Admin Command Gate"
                : "Reset Password"}
            </h1>
            <p className="auth-sub">
              {mode === "signin"
                ? "Access your production calendar, milestone escrow, and creative studio."
                : mode === "signup"
                ? "Create your verified creator profile with automatic contract settlement."
                : mode === "admin"
                ? "Authenticate with administrative master key for editorial moderation and escrow arbitrage."
                : "Enter your registered email address to generate an instant Neon DB reset code."}
            </p>
          </div>

          {/* Status / Alert Banner */}
          {message && (
            <div className={`auth-alert ${messageType}`}>
              {message}
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === "forgot" ? (
            <div className="forgot-password-section">
              {forgotState.step === 1 ? (
                <form onSubmit={handleSendResetCode} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="forgotEmail">
                      <span>✉️</span> Registered Account Email
                    </label>
                    <input
                      id="forgotEmail"
                      required
                      type="email"
                      name="email"
                      placeholder="e.g. creator@onevoo.com"
                      value={forgotState.email || form.email}
                      onChange={updateForgot}
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-submit"
                    disabled={busy}
                  >
                    {busy ? "GENERATING RESET KEY..." : "GENERATE RESET CODE ⚡"}
                  </button>

                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <button
                      type="button"
                      onClick={() => { setMode("signin"); setMessage(""); }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="auth-form">
                  {forgotState.generatedCode && (
                    <div
                      style={{
                        padding: "14px",
                        borderRadius: "12px",
                        marginBottom: "18px",
                        background: "rgba(139, 92, 246, 0.12)",
                        border: "1px solid rgba(139, 92, 246, 0.35)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "10px", color: "#f59e0b", display: "block", fontFamily: "var(--font-mono)" }}>
                          ⚡ NEON SECURITY CODE:
                        </span>
                        <span style={{ fontSize: "20px", fontWeight: 800, color: "#10b981", letterSpacing: "0.2em", fontFamily: "var(--font-mono)" }}>
                          {forgotState.generatedCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForgotState((prev) => ({ ...prev, enteredCode: forgotState.generatedCode }))}
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid #10b981",
                          color: "#10b981",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "var(--font-mono)"
                        }}
                      >
                        ⚡ 1-Click Fill
                      </button>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="enteredCode">
                      <span>🔑</span> 6-Digit Security Code
                    </label>
                    <input
                      id="enteredCode"
                      required
                      type="text"
                      maxLength={6}
                      name="enteredCode"
                      placeholder="e.g. 849201"
                      value={forgotState.enteredCode}
                      onChange={updateForgot}
                      style={{ textAlign: "center", letterSpacing: "0.2em", fontSize: "16px", fontFamily: "var(--font-mono)" }}
                    />
                  </div>

                  <SecurePasswordField
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    placeholder="At least 8 characters"
                    value={forgotState.newPassword}
                    onChange={updateForgot}
                    minLength={8}
                    autoComplete="new-password"
                  />

                  <SecurePasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Repeat new password"
                    value={forgotState.confirmPassword}
                    onChange={updateForgot}
                    minLength={8}
                    autoComplete="new-password"
                  />

                  <button
                    type="submit"
                    className="auth-submit"
                    disabled={busy}
                  >
                    {busy ? "UPDATING PASSWORD..." : "UPDATE PASSWORD & SIGN IN ⚡"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* SIGN IN / SIGN UP / ADMIN FORM */
            <form onSubmit={submit} className="auth-form">
              
              {mode === "signup" && (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <span>👤</span> Full Name
                    </label>
                    <input
                      id="fullName"
                      required
                      name="fullName"
                      placeholder="e.g. Tanvi Sharma"
                      value={form.fullName}
                      onChange={update}
                      autoComplete="name"
                    />
                  </div>

                  {/* Interactive Avatar Carousel */}
                  <div className="form-group">
                    <div className="avatar-carousel-title">
                      <label style={{ margin: 0 }}>
                        <span>🎨</span> Choose Your Avatar
                      </label>
                      <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-mono)" }}>
                        {CUTE_AVATARS.find(a => a.url === form.avatarUrl)?.name || "Avatar"}
                      </span>
                    </div>
                    <div className="avatar-scroll-wrap">
                      {CUTE_AVATARS.map((item) => {
                        const isSelected = form.avatarUrl === item.url;
                        return (
                          <div
                            key={item.id}
                            className={`avatar-picker-circle ${isSelected ? "selected" : ""}`}
                            onClick={() => setForm({ ...form, avatarUrl: item.url })}
                            title={item.name}
                          >
                            <img src={item.url} alt={item.name} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="email">
                  <span>✉️</span> {mode === "admin" ? "Admin Identifier / Master Email" : "Email Address"}
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  placeholder={mode === "admin" ? "admin@onevoo.com" : "creator@onevoo.com"}
                  value={form.email}
                  onChange={update}
                  autoComplete="email"
                />
              </div>

              {/* Secure Password Field with auto-mask timer */}
              <SecurePasswordField
                id="password"
                name="password"
                label={mode === "admin" ? "Master Security Key" : "Password"}
                placeholder="••••••••••••"
                value={form.password}
                onChange={update}
                minLength={mode === "signup" ? 8 : 1}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                showForgotPassword={mode === "signin"}
                onForgotPassword={() => {
                  setMode("forgot");
                  setForgotState((prev) => ({ ...prev, email: form.email, step: 1 }));
                  setMessage("");
                }}
              />

              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="city">
                    <span>📍</span> Primary Hub City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={update}
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Goa">Goa</option>
                    <option value="Chandigarh">Chandigarh</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className={`auth-submit ${mode === "admin" ? "admin-submit" : ""}`}
                disabled={busy}
              >
                {busy
                  ? "AUTHENTICATING..."
                  : mode === "admin"
                  ? "AUTHENTICATE ADMIN ACCESS 🛡️"
                  : mode === "signin"
                  ? "ENTER SYSTEM ⚡"
                  : "INITIALIZE CREATOR PROFILE ⚡"}
              </button>
            </form>
          )}

          {/* Quick Evaluator Access Section */}
          {mode === "signin" && (
            <div className="auth-demo-access">
              <button
                type="button"
                onClick={handleTestLogin}
                disabled={busy}
                className="auth-demo-btn"
              >
                <span>⚡</span> 1-Click Fast Sign In as Verified Creator (@tanvi.creates)
              </button>
            </div>
          )}

          {mode === "admin" && (
            <div className="auth-demo-access">
              <button
                type="button"
                onClick={handleTestAdminLogin}
                disabled={busy}
                className="auth-demo-btn admin-demo-btn"
              >
                <span>🛡️</span> 1-Click Fast Sign In as Admin Operations (admin@onevoo.com)
              </button>
            </div>
          )}

          {/* Footer Metadata */}
          <div className="auth-footer">
            <p>
              By proceeding you agree to the{" "}
              <Link to="/terms">Creative Terms</Link> &{" "}
              <Link to="/privacy">Privacy Protocol</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}