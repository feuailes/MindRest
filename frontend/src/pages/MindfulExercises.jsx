import React from "react";

export default function MindfulExercises() {
  const exercises = [
    {
      title: "Box Breathing",
      desc: "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat.",
    },
    {
      title: "5-4-3-2-1 Grounding",
      desc: "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    },
    {
      title: "Progressive Muscle Relaxation",
      desc: "Tense and then relax each muscle group slowly, one at a time.",
    },
    {
      title: "Mindful Observation",
      desc: "Pick one object and observe it for 2 minutes without judging or thinking about it.",
    },
  ];

  return (
    <div className="main-container">
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h2 style={{ 
          fontWeight: 700, 
          color: "var(--text-primary)",
          fontSize: "2.25rem",
          marginBottom: "16px"
        }}>
          Mindful Exercises
        </h2>
        <p style={{ 
          color: "var(--text-secondary)", 
          fontSize: "1.125rem",
          lineHeight: "1.6"
        }}>
          Simple techniques to help you feel calmer and more centered.
        </p>
      </div>

      <div className="cards-container">
        {exercises.map((ex, i) => (
          <div 
            key={i} 
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
              {ex.title}
            </h3>
            <p style={{ 
              color: "var(--text-secondary)",
              fontSize: "1rem",
              lineHeight: "1.6"
            }}>
              {ex.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
