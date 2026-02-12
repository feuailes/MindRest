import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Assessment() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    screen: "",
    sleep: 5,
    stress: 5,
    mood: 6,
    longDay: "",
  });
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      navigate(
        `/result?risk=${encodeURIComponent(data.risk)}&confidence=${encodeURIComponent(
          data.confidence
        )}`
      );
    } catch (err) {
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardWidth = windowWidth < 500 ? "90%" : "720px";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        padding: "60px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <form
        onSubmit={handlePredict}
        style={{
          width: "100%",
          maxWidth: cardWidth,
          backgroundColor: "var(--card-bg)",
          padding: "48px 40px",
          borderRadius: "20px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--card-border)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          transition: "width 0.3s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "16px",
            fontWeight: 700,
            fontSize: "2rem",
            color: "var(--text-primary)",
          }}
        >
          Digital Wellbeing Check
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginBottom: "40px",
            fontSize: "1rem",
            lineHeight: "1.6",
          }}
        >
          A few quick questions to understand how you're feeling today. Your answers are private and help us provide personalized insights.
        </p>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid var(--input-border)",
              fontSize: "1rem",
              backgroundColor: "var(--input-bg)",
              transition: "var(--transition-fast)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-orange)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(var(--accent-orange-rgb), 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--input-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Gender */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            Gender *
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid var(--input-border)",
              fontSize: "1rem",
              backgroundColor: "var(--input-bg)",
              cursor: "pointer",
              transition: "var(--transition-fast)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-orange)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(var(--accent-orange-rgb), 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--input-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Screen Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            How many hours did you spend on screens today? *
          </label>
          <input
            type="number"
            name="screen"
            min="0"
            value={form.screen}
            onChange={handleChange}
            required
            placeholder="e.g., 6"
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid var(--input-border)",
              fontSize: "1rem",
              backgroundColor: "var(--input-bg)",
              transition: "var(--transition-fast)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-orange)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(var(--accent-orange-rgb), 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--input-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Sleep */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            How was your sleep last night? (1-10) *
          </label>
          <input
            type="number"
            name="sleep"
            min="1"
            max="10"
            value={form.sleep}
            onChange={handleChange}
            required
            placeholder="1 = poor, 10 = excellent"
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid var(--input-border)",
              fontSize: "1rem",
              backgroundColor: "var(--input-bg)",
              transition: "var(--transition-fast)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-orange)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(var(--accent-orange-rgb), 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--input-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Stress */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            Your stress level today: <span style={{ color: "var(--primary)" }}>{form.stress}/10</span>
          </label>
          <input
            type="range"
            name="stress"
            min="1"
            max="10"
            value={form.stress}
            onChange={handleChange}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              outline: "none",
              WebkitAppearance: "none",
              background: `linear-gradient(to right, var(--accent-orange) 0%, var(--accent-orange) ${((form.stress - 1) / 9) * 100}%, var(--input-border) ${((form.stress - 1) / 9) * 100}%, var(--input-border) 100%)`,
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <span>Calm</span>
            <span>Very Stressed</span>
          </div>
        </div>

        {/* Mood */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            How's your mood right now: <span style={{ color: "var(--accent)" }}>{form.mood}/10</span>
          </label>
          <input
            type="range"
            name="mood"
            min="1"
            max="10"
            value={form.mood}
            onChange={handleChange}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "4px",
              outline: "none",
              WebkitAppearance: "none",
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((form.mood - 1) / 9) * 100}%, var(--input-border) ${((form.mood - 1) / 9) * 100}%, var(--input-border) 100%)`,
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <span>Low</span>
            <span>Great</span>
          </div>
        </div>

        {/* Reflection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            How do you usually feel after a long day?
          </label>
          <textarea
            name="longDay"
            rows={4}
            value={form.longDay}
            onChange={handleChange}
            placeholder="Tired, calm, motivated, drained..."
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid var(--input-border)",
              fontSize: "1rem",
              fontFamily: "inherit",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              resize: "vertical",
              transition: "var(--transition-fast)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-orange)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(var(--accent-orange-rgb), 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--input-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Predict Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--button-text)",
              padding: "16px 48px",
              borderRadius: "12px",
              border: "none",
              fontWeight: 600,
              fontSize: "1.05rem",
              cursor: loading ? "wait" : "pointer",
              width: windowWidth < 500 ? "100%" : "auto",
              boxShadow: "0 4px 16px rgba(var(--accent-orange-rgb), 0.3)",
              transition: "var(--transition-fast)",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(60,145,230,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(60,145,230,0.3)";
            }}
          >
            {loading ? "Getting your insights..." : "See My Results"}
          </button>
        </div>
      </form>
    </div>
  );
}
