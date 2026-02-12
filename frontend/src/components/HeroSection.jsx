import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="hero-section fade-in-up"
      style={{
        position: "relative",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: 'url("/MindRest-Image.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px) brightness(1.15)",
          zIndex: -1,
        }}
      />

      {/* White Content Box */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          padding: "60px 40px",
          borderRadius: "12px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--card-border)",
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "var(--text-primary)" }}>
          Small games.<br />
          <span style={{ color: "var(--primary)" }}>Big calm.</span>
        </h1>

        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "40px" }}>
          MindRest helps you understand digital fatigue and restore focus through
          mindful play, calming exercises, and gentle awareness.
        </p>

        <Link to="/moodform">
          <button
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--button-text)",
              padding: "12px 32px",
              borderRadius: "8px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(60,145,230,0.3)",
            }}
          >
            Start calmly
          </button>
        </Link>
      </div>
    </section>
  );
}
