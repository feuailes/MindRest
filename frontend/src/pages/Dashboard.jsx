import React from "react";
import DriftChart from "../components/Driftchart";

export default function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
          <span style={{ fontSize: "1.75rem", marginRight: "8px", color: "var(--text-primary)" }}>△</span>
          Your Dashboard
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "48px", fontSize: "1.125rem" }}>
          Track how your stress, mood, and screen habits change over time.
        </p>

        {/* Chart Section */}
        <div
          style={{
            backgroundColor: "var(--card-bg)",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--card-border)",
            marginBottom: "40px",
            transition: "var(--transition-fast)",
          }}
        >
          <h3 style={{ marginBottom: "24px", fontWeight: 600, color: "var(--text-primary)", fontSize: "1.5rem" }}>
            <span style={{ fontSize: "1.25rem", marginRight: "8px", color: "var(--text-primary)" }}>○</span>
            Your Mood Over Time
          </h3>
          <DriftChart />
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--card-bg)",
              padding: "32px",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--card-border)",
              transition: "var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <h4 style={{ marginBottom: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
              <span style={{ fontSize: "1rem", marginRight: "6px", color: "var(--text-primary)" }}>☼</span>
              This Week's Insight
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
              You tend to feel better when you reduce screen time in the evening.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--card-bg)",
              padding: "32px",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--card-border)",
              transition: "var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            <h4 style={{ marginBottom: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
              <span style={{ fontSize: "1rem", marginRight: "6px", color: "var(--text-primary)" }}>✦</span>
              Try This Today
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: "1.6" }}>
              A short calming game or breathing exercise can help you feel more balanced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
