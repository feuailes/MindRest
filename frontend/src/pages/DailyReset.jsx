import React from "react";

export default function DailyReset() {
  return (
    <div className="main-container">
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2 style={{ 
          fontWeight: 700, 
          color: "var(--text-primary)",
          fontSize: "2.25rem",
          marginBottom: "16px"
        }}>
          Daily Reset
        </h2>
        <p style={{ 
          color: "var(--text-secondary)", 
          fontSize: "1.125rem",
          lineHeight: "1.6"
        }}>
          A simple routine to help you pause, breathe, and feel refreshed.
        </p>
      </div>

      <div className="cards-container">
        <div 
          className="card"
          style={{
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
          <h3 style={{ 
            marginBottom: "12px", 
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1.5rem"
          }}>
            🌿 Pause
          </h3>
          <p style={{ 
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.6"
          }}>
            Step away from screens for 2 minutes.
          </p>
        </div>

        <div 
          className="card"
          style={{
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
          <h3 style={{ 
            marginBottom: "12px", 
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1.5rem"
          }}>
            🫁 Breathe
          </h3>
          <p style={{ 
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.6"
          }}>
            Take 6 slow, deep breaths.
          </p>
        </div>

        <div 
          className="card"
          style={{
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
          <h3 style={{ 
            marginBottom: "12px", 
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1.5rem"
          }}>
            📝 Reflect
          </h3>
          <p style={{ 
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.6"
          }}>
            Ask yourself: "What do I need right now?"
          </p>
        </div>

        <div 
          className="card"
          style={{
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
          <h3 style={{ 
            marginBottom: "12px", 
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1.5rem"
          }}>
            ✨ Reset
          </h3>
          <p style={{ 
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: "1.6"
          }}>
            Return with one clear intention.
          </p>
        </div>
      </div>
    </div>
  );
}
