import React from "react";

export default function DriftChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-box card" style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
        <p>Your emotional drift data will appear here once you log your first few assessments.</p>
      </div>
    );
  }

  const maxScore = 10;

  return (
    <div className="chart-box card" style={{ padding: "30px", marginTop: 12, backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "16px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "15px", paddingBottom: "20px", borderBottom: "1px solid var(--card-border)" }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <div
              style={{
                width: "100%",
                height: `${(item.score / maxScore) * 100}%`,
                backgroundColor: "var(--accent)",
                borderRadius: "8px 8px 0 0",
                opacity: 0.6 + (i / data.length) * 0.4,
                transition: "height 0.8s ease-out"
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "10px", transform: "rotate(-45deg)", whiteSpace: "nowrap" }}>
              {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "30px", fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
        * Higher bars indicate better mood stability based on your assessments.
      </div>
    </div>
  );
}

