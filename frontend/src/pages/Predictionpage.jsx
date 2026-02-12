import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function PredictionPage() {
  const query = new URLSearchParams(useLocation().search);
  const risk = query.get("risk") || "Unknown";

  const riskConfig = {
    High: {
      color: "#DC2626",
      message:
        "You're showing signs of high stress and digital exhaustion. It's okay to slow down and take care of yourself today.",
      suggestion:
        "Try reducing screen time, take longer breaks, and practice some breathing exercises or calming games.",
    },
    Medium: {
      color: "#D97706",
      message:
        "You might be feeling some digital fatigue today.",
      suggestion:
        "Short breaks, gentle stretching, and mindful breathing can help you feel more balanced.",
    },
    Low: {
      color: "#16A34A",
      message:
        "Your wellbeing looks good! You're managing stress and screen time well.",
      suggestion:
        "Keep up the healthy habits — maintain good sleep and continue being mindful of your screen time.",
    },
    Unknown: {
      color: "#334155",
      message: "We couldn't determine your wellbeing level right now.",
      suggestion: "Please try your wellbeing check again.",
    },
  };

  const current = riskConfig[risk];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        padding: "80px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          backgroundColor: "var(--card-bg)",
          padding: "56px 48px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <h2 style={{ marginBottom: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Your Wellbeing Check Results</h2>

        <div
          style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            color: current.color,
            marginBottom: "24px",
          }}
        >
          {risk}
        </div>

        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            marginBottom: "16px",
            lineHeight: "1.7",
          }}
        >
          {current.message}
        </p>

        <div
          style={{
            backgroundColor: "var(--bg-primary)",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "40px",
            marginTop: "32px",
          }}
        >
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-primary)",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            What you can do:
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
            }}
          >
            {current.suggestion}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link to="/dashboard">
            <button
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--button-text)",
                padding: "14px 32px",
                borderRadius: "12px",
                border: "none",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(60,145,230,0.3)",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(60,145,230,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(60,145,230,0.3)";
              }}
            >
              View Dashboard
            </button>
          </Link>

          <Link to="/">
            <button
              style={{
                backgroundColor: "var(--button-secondary-bg)",
                color: "var(--text-primary)",
                padding: "14px 32px",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--button-secondary-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--button-secondary-bg)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
