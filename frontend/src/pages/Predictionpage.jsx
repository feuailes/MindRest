import React from "react";
import { Link } from "react-router-dom";

export default function PredictionPage({ passedRisk = "Low" }) {
  const isHigh = passedRisk.includes("High");
  const isLow = passedRisk.includes("Low");
  const riskKey = isHigh ? "High" : isLow ? "Low" : "Moderate";

  const theme = {
    teal: "#1D4D4F",
    orange: "#E76F51",
    overlay: "rgba(0, 0, 0, 0.3)"
  };

  const riskConfig = {
    High: {
      label: "High Exhaustion",
      percent: 90,
      mitigations: [
        { task: "Digital Detox", dur: "5m", icon: "🧠", type: "Mental Sanctuary" },
        { task: "Launch Breathing Circle", dur: "Game", icon: "⭕", type: "Calm Engine", link: "/games" },
        { task: "Neural Strain", icon: "📊", type: "ML Insight", desc: "High-beta brainwave patterns detected." }
      ]
    },
    Moderate: {
      label: "Moderate Fatigue",
      percent: 50,
      mitigations: [
        { task: "Eye Palming", dur: "2m", icon: "👁️", type: "Visual Sanctuary" },
        { task: "Focus Flow", dur: "Game", icon: "🌊", type: "Focus Engine", link: "/games" },
        { task: "Recovery Insight", icon: "💡", type: "ML Insight", desc: "Micro-breaks restore 15% focus decay." }
      ]
    },
    Low: {
      label: "Low Exhaustion",
      percent: 15,
      mitigations: [
        { task: "Posture Check", dur: "1m", icon: "🧘", type: "Physical Sanctuary" },
        { task: "Launch Reaction Test", dur: "Game", icon: "⚡", type: "Reflex Engine", link: "/games" },
        { task: "Steady Baseline", icon: "📈", type: "ML Insight", desc: "Digital vitals remain in optimal Alpha zone." }
      ]
    }
  };

  const current = riskConfig[riskKey];

  return (
    /* pt-20 shifts the modal downward from the top of the screen */
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24" style={{ backgroundColor: theme.overlay, backdropFilter: "blur(2px)" }}>

      <div className="bg-white p-8 font-sans w-full max-w-md rounded-[35px] shadow-2xl relative">

        {/* --- DYNAMIC ORANGE GAUGE --- */}
        <div className="relative w-56 h-36 mx-auto mb-2">
          <svg viewBox="0 0 100 70" className="w-full h-full">
            <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke={theme.orange}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 - (125.6 * (current.percent / 100))}
              style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
            />
          </svg>
          {/* Exhaustion text placed below the arc, no longer overriding the line */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-2xl font-black uppercase tracking-tighter" style={{ color: theme.orange }}>
              {current.label}
            </span>
          </div>
        </div>

        {/* --- MITIGATION HUB --- */}
        <div className="space-y-3 mb-8 mt-4">
          <div className="flex justify-between items-center px-1 mb-4 border-b pb-2">
            <span className="text-[11px] font-black text-[#1D4D4F] uppercase tracking-widest">Mitigation Hub</span>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Analysis Engine v1.2</span>
          </div>

          {current.mitigations.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-slate-100 rounded-xl group hover:border-[#1D4D4F] transition-all text-left">
              <div className="flex items-center gap-4">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="text-[13px] font-bold text-[#1D4D4F] leading-tight">{m.task}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    {m.type} — {m.desc || m.dur}
                  </p>
                </div>
              </div>
              {m.link ? (
                <Link to={m.link} className="text-[10px] font-black text-[#E76F51] border-b-2 border-[#E76F51] pb-0.5 uppercase tracking-tighter">
                  Play
                </Link>
              ) : (
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{m.dur}</span>
              )}
            </div>
          ))}
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="space-y-3">
          <Link to="/journal" className="block text-center p-4 bg-[#1D4D4F] text-white font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all rounded-xl shadow-lg">
            Record to Daily Journal
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}