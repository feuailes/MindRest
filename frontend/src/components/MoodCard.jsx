import React from "react";

export default function MoodCard({ title, symbol, description }) {
  return (
    <div
      style={{
        backgroundColor: "var(--card-bg)",
        padding: "32px",
        width: "280px",
        borderRadius: "16px",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--shadow-sm)",
        textAlign: "center",
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
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 600,
          color: "var(--primary)",
          marginBottom: "12px",
        }}
      >
        {symbol}
      </div>

      <h3 style={{ 
        marginBottom: "12px", 
        fontWeight: 600,
        color: "var(--text-primary)",
        fontSize: "1.25rem"
      }}>
        {title}
      </h3>

      <p style={{ 
        fontSize: "1rem", 
        color: "var(--text-secondary)", 
        lineHeight: "1.6" 
      }}>
        {description}
      </p>
    </div>
  );
}
