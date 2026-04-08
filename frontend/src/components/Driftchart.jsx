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

  const getPoints = () => {
    if (data.length === 1) {
      const y = 100 - (data[0].score / maxScore) * 100;
      return `0,${y} 100,${y}`;
    }

    return data.map((item, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (item.score / maxScore) * 100;
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div className="chart-box" style={{ padding: "10px", marginTop: 5, backgroundColor: "transparent" }}>
      
      <div style={{ position: "relative", height: "180px" }}>
        
        {/* TREND LINE */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2
          }}
        >
          <polyline
            fill="none"
            stroke="#1D4D4F"
            strokeWidth="2.5"
            points={getPoints()}
            style={{
              filter: "drop-shadow(0px 0px 6px rgba(29,77,79,0.6))" // glow
            }}
          />
        </svg>

        {/* BARS */}
        <div style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: "15px", paddingBottom: "40px", borderBottom: "1px solid var(--card-border)", position: "relative", zIndex: 1 }}>
          {data.map((item, i) => {
            const color = item.score >= 5 ? "#1D4D4F" : "#E76F51";

            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${(item.score / maxScore) * 100}%`,
                    backgroundColor: color,
                    borderRadius: "8px 8px 0 0",
                    opacity: 0.75 + (i / data.length) * 0.25,
                    transition: "height 0.8s ease-out",
                    boxShadow: `0px 0px 10px ${color}` // glow on bars
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "10px", transform: "rotate(-45deg)", whiteSpace: "nowrap" }}>
                  {(() => {
                    const d = new Date(item.created_at || item.date);
                    return isNaN(d.getTime()) ? (i+1) : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  })()}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      <div style={{ marginTop: "30px", fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
        * Higher values = better state. Downward trend = rising exhaustion.
      </div>

    </div>
  );
}