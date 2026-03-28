import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PredictionPage({ passedRisk = "", score = 0, screenTime = 0, focus = 0, sleep = 0, stress = 0 }) {
  const navigate = useNavigate();
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const scoreNum = Number(score) || 0;
  const screenTimeNum = Number(screenTime) || 0;
  const focusNum = Number(focus) || 0;
  const sleepNum = Number(sleep) || 0;
  const stressNum = Number(stress) || 0;

  // Animate gauge smoothly from 0 to target
  useEffect(() => {
    // 1-10 scale mapping to 0-100 percentage.
    // 1.0 -> 0%, 10.0 -> 100%.
    const targetValue = scoreNum <= 1 ? 0 : Math.min(((scoreNum - 1) / 9) * 100, 100);

    let startTimestamp = null;
    const duration = 1200; // 1.2 seconds for a soft, premium build-up

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function for a more premium interaction (easeOutExpo)
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimatedPercent(easedProgress * targetValue);

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    const animationId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationId);
  }, [scoreNum]);

  let contentKey = "Low";
  let themeColor = "#1D4D4F"; // Teal

  if (scoreNum >= 8 || passedRisk.toLowerCase().includes("high")) {
    contentKey = "High";
    themeColor = "#ef4444"; // Red
  } else if (scoreNum >= 4 || passedRisk.toLowerCase().includes("moderate")) {
    contentKey = "Moderate";
    themeColor = "#E76F51"; // Orange
  }

  const getReason = () => {
    if (screenTimeNum > 6) return `${screenTimeNum}h Screen Usage`;
    if (stressNum > 7) return "High stress levels";
    if (sleepNum < 5) return "Not enough sleep";
    if (focusNum < 4) return "Low focus";
    return "Balanced routine";
  };

  const getDynamicContent = () => {
    if (contentKey === "High") {
      return {
        label: "High Digital Exhaustion",
        sub: "Rest Immediately",
        reason: getReason(),
        explanation: "Your brain is very tired. Take a full break to recover.",
        fixes: [
          { type: "Physical", label: "Full Stretch", link: "/exercises" },
          { type: "Mental", label: "Deep Breathing", link: "/games" },
          { type: "Journal", label: "Brain Dump", link: "/journal" }
        ]
      };
    }
    if (contentKey === "Moderate") {
      return {
        label: "Moderate Digital Exhaustion",
        sub: "Take Short Breaks",
        reason: getReason(),
        explanation: "Your brain is a bit tired. Take small breaks to refresh.",
        fixes: [
          { type: "Visual", label: "Quick Eye Palming", link: "/exercises" },
          { type: "Mental", label: "Focus Music", link: "/games" },
          { type: "Journal", label: "Reflect", link: "/journal" }
        ]
      };
    }
    return {
      label: "Low Digital Exhaustion",
      sub: "You are fine",
      reason: getReason(),
      explanation: "Your brain is doing fine. Keep your current routine.",
      fixes: [
        { type: "Physical", label: "Posture Fix", link: "/exercises" },
        { type: "Mental", label: "Mindful Check", link: "/games" },
        { type: "Journal", label: "Gratitude", link: "/journal" }
      ]
    };
  };

  const content = getDynamicContent();
  const radius = 40;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (circumference * (animatedPercent / 100));

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-100/90 backdrop-blur-md font-sans">

      <div className="bg-white p-8 w-full max-w-md rounded-[40px] shadow-2xl relative border-b-4 transition-all"
        style={{ borderBottomColor: themeColor }}>

        {/* CLOSE BUTTON */}
        <button onClick={() => navigate("/")} className="absolute top-6 right-8 text-slate-300 hover:text-red-400 transition-colors">
          <span className="text-2xl font-light">×</span>
        </button>

        {/* GAUGE & SCORE */}
        <div className="relative w-48 h-32 mx-auto mb-4">
          <svg viewBox="0 0 100 65" className="w-full h-full">
            <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke={themeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
            <span className="text-5xl font-black" style={{ color: themeColor }}>
              {scoreNum.toFixed(1)}
            </span>
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Exhaustion Index</span>
          </div>
        </div>

        {/* LABELS */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: themeColor }}>{content.label}</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{content.sub}</p>
        </div>

        {/* DATA */}
        <div className="bg-slate-50 p-5 rounded-[30px] border border-slate-100 mb-6 space-y-3">
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block">The Reason</span>
            <p className="text-sm font-bold text-slate-700">{content.reason}</p>
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase block">Neural Insight</span>
            <p className="text-[11px] font-medium text-slate-500 italic">"{content.explanation}"</p>
          </div>
        </div>

        {/* FIXES */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {content.fixes.map((f, i) => (
            <Link key={i} to={f.link} className="flex flex-col items-center p-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-300 transition-all">
              <span className="text-[7px] font-black text-slate-300 uppercase mb-1">{f.type}</span>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">{f.label}</span>
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Link to="/dashboard" className="flex-1 py-3 bg-[#E76F51] text-white font-black text-[9px] uppercase rounded-xl text-center shadow-md">Dashboard</Link>
          <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-slate-100 text-slate-400 font-black text-[9px] uppercase rounded-xl">Retake</button>
        </div>

      </div>
    </div>
  );
}