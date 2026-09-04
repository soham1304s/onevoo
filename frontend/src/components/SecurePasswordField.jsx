import React, { useState, useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function SecurePasswordField({
  id = "password",
  name = "password",
  value = "",
  onChange,
  placeholder = "••••••••••••",
  required = true,
  minLength = 8,
  autoComplete = "current-password",
  label = "Password",
  showForgotPassword = false,
  onForgotPassword,
  helperText,
  disabled = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isScrambling, setIsScrambling] = useState(false);
  const [scrambleDisplay, setScrambleDisplay] = useState("");
  const [showAutoMaskNotice, setShowAutoMaskNotice] = useState(false);

  const timerRef = useRef(null);
  const scrambleRef = useRef(null);
  const noticeTimeoutRef = useRef(null);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (scrambleRef.current) clearInterval(scrambleRef.current);
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  // Trigger high-tech encryption scramble effect
  const triggerScrambleAndMask = (wasAuto = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsScrambling(true);
    let iterations = 0;
    const maxIterations = 8;
    const len = Math.max(value.length, 8);

    if (scrambleRef.current) clearInterval(scrambleRef.current);

    scrambleRef.current = setInterval(() => {
      let result = "";
      for (let i = 0; i < len; i++) {
        result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setScrambleDisplay(result);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(scrambleRef.current);
        scrambleRef.current = null;
        setIsScrambling(false);
        setIsVisible(false);
        setTimeLeft(0);

        if (wasAuto) {
          setShowAutoMaskNotice(true);
          if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
          noticeTimeoutRef.current = setTimeout(() => {
            setShowAutoMaskNotice(false);
          }, 3500);
        }
      }
    }, 35);
  };

  const handleToggle = () => {
    if (disabled || isScrambling) return;

    if (isVisible) {
      // User manually toggled off -> run encryption scramble and mask
      triggerScrambleAndMask(false);
    } else {
      // User revealed password -> start 5-second countdown timer
      setIsVisible(true);
      setTimeLeft(5);
      setShowAutoMaskNotice(false);

      if (timerRef.current) clearInterval(timerRef.current);

      let currentSec = 5;
      timerRef.current = setInterval(() => {
        currentSec -= 1;
        setTimeLeft(currentSec);

        if (currentSec <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // Auto-hide when timer expires
          triggerScrambleAndMask(true);
        }
      }, 1000);
    }
  };

  return (
    <div className="secure-password-group" style={{ marginBottom: "20px" }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label htmlFor={id} className="mono" style={{ fontSize: "11px", margin: 0 }}>
            {label}
          </label>
          {showForgotPassword && onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="forgot-link mono"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent-purple)",
                fontSize: "11px",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                transition: "color 0.2s ease",
              }}
            >
              Forgot password?
            </button>
          )}
        </div>
      )}

      <div className="secure-password-input-wrap" style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          id={id}
          required={required}
          type={isVisible && !isScrambling ? "text" : "password"}
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          value={isScrambling ? scrambleDisplay : value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="secure-password-input"
          style={{
            width: "100%",
            padding: "12px 90px 12px 16px", // extra right padding for eye button & timer
            borderRadius: "8px",
            border: isVisible
              ? "1px solid var(--accent-gold)"
              : isScrambling
              ? "1px solid var(--accent-green)"
              : "1px solid var(--satin-border)",
            background: isVisible ? "rgba(223, 182, 64, 0.04)" : "rgba(255, 255, 255, 0.04)",
            color: isScrambling ? "var(--accent-green)" : "var(--paper-soft)",
            fontFamily: isScrambling || isVisible ? "var(--font-mono)" : "inherit",
            fontSize: "14px",
            letterSpacing: isScrambling ? "0.15em" : isVisible ? "0.05em" : "normal",
            transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
            boxShadow: isVisible ? "0 0 12px rgba(223, 182, 64, 0.15)" : "none",
          }}
        />

        {/* Right Action Container (Timer + Eye Button) */}
        <div
          style={{
            position: "absolute",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 3,
          }}
        >
          {/* Active Countdown Indicator */}
          {isVisible && timeLeft > 0 && !isScrambling && (
            <div
              className="password-countdown-pill mono"
              title={`Auto-encrypts in ${timeLeft} seconds`}
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: timeLeft <= 2 ? "var(--accent-rose)" : "var(--accent-gold)",
                background: timeLeft <= 2 ? "rgba(244, 63, 94, 0.15)" : "rgba(223, 182, 64, 0.15)",
                border: `1px solid ${timeLeft <= 2 ? "rgba(244, 63, 94, 0.4)" : "rgba(223, 182, 64, 0.4)"}`,
                padding: "2px 6px",
                borderRadius: "99px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                animation: timeLeft <= 2 ? "pulse-fast 0.6s infinite" : "none",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: timeLeft <= 2 ? "var(--accent-rose)" : "var(--accent-gold)",
                  display: "inline-block",
                }}
              />
              {timeLeft}s
            </div>
          )}

          {/* Scramble Glitch Tag */}
          {isScrambling && (
            <span
              className="mono"
              style={{
                fontSize: "9px",
                color: "var(--accent-green)",
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                padding: "2px 5px",
                borderRadius: "4px",
                fontWeight: 700,
              }}
            >
              ENCRYPTING
            </span>
          )}

          {/* Eye Icon Toggle Button */}
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isVisible ? "Hide password (Encrypt)" : "Show password (5s decrypt timer)"}
            title={isVisible ? "Click to encrypt & mask immediately" : "Click to reveal (Auto-masks in 5s)"}
            className="password-eye-btn"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isVisible ? "var(--accent-gold)" : "var(--text-muted)",
              transition: "color 0.2s ease, transform 0.2s ease",
              borderRadius: "6px",
            }}
          >
            {isVisible ? (
              // Open Eye (Revealed)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
              </svg>
            ) : (
              // Slashed Eye (Masked / Hidden)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Auto-Mask Notice Badge */}
      {showAutoMaskNotice && (
        <div
          className="mono"
          style={{
            marginTop: "6px",
            fontSize: "10px",
            color: "var(--accent-green)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <span>🔒</span> Auto-encrypted & masked for screen security.
        </div>
      )}

      {helperText && !showAutoMaskNotice && (
        <span className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
