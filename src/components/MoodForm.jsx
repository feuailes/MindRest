import React, { useState } from "react";

export default function MoodForm({ onSubmit }) {
  const [fatigue, setFatigue] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(fatigue);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
      <label style={{ display: "block", marginBottom: "10px" }}>
        Rate your fatigue (0-10):
        <input 
          type="number" 
          min="0" 
          max="10"
          value={fatigue}
          onChange={(e) => setFatigue(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          background: "var(--card-bg)",
          border: "1px solid var(--card-hover)",
          cursor: "pointer"
        }}
      >
        Submit
      </button>
    </form>
  );
}
