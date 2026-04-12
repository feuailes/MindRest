import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScreenExhaustionChart from "../components/ScreenExhaustionChart";

export default function PredictionPage(props) {
  const navigate = useNavigate();
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(!props.passedRisk);

  const [localData, setLocalData] = useState({
    passedRisk: props.passedRisk || "Low",
    score: props.score || 0,
    screenTime: props.screenTime || 0,
    focus: props.focus || 0,
    sleep: props.sleep || 0,
    stress: props.stress || 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.latest_assessment) {
          const la = result.latest_assessment;
          setLocalData({
            passedRisk: la.risk_level,
            score: (la.sleep_hours + la.stress_level + la.screen_time + la.mood_rating) / 4,
            screenTime: la.screen_time,
            sleep: la.sleep_hours,
            stress: la.stress_level,
            focus: la.mood_rating
          });
          setHistory(result.assessment_history || []);
        } else {
          navigate("/assessment");
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    if (!props.passedRisk) fetchData();
    else setLoading(false);
  }, [props.passedRisk, navigate]);

  const scoreNum = Number(localData.score) || 0;
  useEffect(() => {
    const targetValue = scoreNum <= 1 ? 0 : Math.min(((scoreNum - 1) / 9) * 100, 100);
    let startTimestamp = null;
    const duration = 1200;
    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(2, -10 * progress);
      setAnimatedPercent(easedProgress * targetValue);
      if (progress < 1) window.requestAnimationFrame(animate);
    };
    const animationId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationId);
  }, [scoreNum]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold tracking-widest uppercase text-[10px]">Processing Neural Flow...</div>;

  let contentKey = "Low";
  let themeColor = "#1D4D4F"; // UI Teal
  if (scoreNum >= 8 || localData.passedRisk.toLowerCase().includes("high")) {
    contentKey = "High"; themeColor = "#ef4444";
  } else if (scoreNum >= 4 || localData.passedRisk.toLowerCase().includes("moderate")) {
    contentKey = "Moderate"; themeColor = "#E76F51"; // UI Orange
  }

  const getReason = () => {
    let reasons = [];
    if (localData.screenTime > 6) reasons.push("Screen");
    if (localData.stress >= 7) reasons.push("Stress");
    if (localData.sleep >= 7) reasons.push("Sleep");
    return reasons.length === 0 ? "Balanced" : reasons.slice(0, 2).join("+");
  };

  const getNeuralInsight = () => {
    const insights = [];
    const { stress, focus: mood, screenTime: st, sleep, passedRisk } = localData;
    const isHigh = passedRisk.toLowerCase().includes("high");
    const isModerate = passedRisk.toLowerCase().includes("moderate");

    if (isHigh) {
      if (stress >= 8) insights.push("Your stress levels are very high; you need to stop and rest.");
      if (st >= 8) insights.push("Too much screen time is making you extremely tired.");
      if (sleep >= 8) insights.push("You are very tired from lack of sleep.");
      if (mood >= 8) insights.push("Your emotional energy is very low right now.");
      if (insights.length === 0) insights.push("Your exhaustion level is high; a break is needed.");
      insights.push("You may need a break and recovery time.");
    } else if (isModerate) {
      if (stress >= 7) insights.push("You're starting to get stressed; try taking a short break.");
      if (st >= 7) insights.push("Your screen habits are starting to affect your energy.");
      if (sleep >= 7) insights.push("A little more rest would help you feel better.");
      if (insights.length === 0) insights.push("You're starting to feel tired; try balancing rest and work.");
      insights.push("Try balancing screen time and rest.");
    } else {
      // Low risk / Balanced
      if (stress >= 8 || st >= 8) {
        insights.push("Even though you're doing okay, watch your stress and screen time today.");
      } else {
        insights.push("Your habits are currently well-balanced.");
      }
      insights.push("Your current habits are stable.");
    }

    return insights.join(" ");
  };

  const getDynamicContent = () => {
    if (contentKey === "High") {
      return {
        label: "High Exhaustion", sub: "Rest Now",
        explanation: getNeuralInsight(),
        recoveryTime: "",
        steps: [
          { title: "Muscle Relaxation", sub: "Deep physical release.", path: "/exercises" },
          { title: "Colorblind (Slow)", sub: "Minimum stimulus game.", path: "/games" },
          { title: "Burnout Relief Log", sub: "Release mental pressure.", path: "/journal" }
        ]
      };
    }
    if (contentKey === "Moderate") {
      return {
        label: "Moderate Exhaustion", sub: "Pause Needed",
        explanation: getNeuralInsight(),
        recoveryTime: "",
        steps: [
          { title: "Box Breathing", sub: "Steady neural rhythm.", path: "/exercises" },
          { title: "Pattern Match", sub: "Light cognitive focus.", path: "/games" },
          { title: "Clarity Journal", sub: "Record your thoughts.", path: "/journal" }
        ]
      };
    }
    return {
      label: "Low Exhaustion", sub: "You are fine",
      explanation: getNeuralInsight(),
      recoveryTime: "",
      steps: [
        { title: "Power Posture", sub: "Align your neural axis.", path: "/exercises" },
        { title: "Focus Challenge", sub: "Quick reaction test.", path: "/games" },
        { title: "Gratitude Journal", sub: "Positive neural framing.", path: "/journal" }
      ]
    };
  };

  const content = getDynamicContent();
  const radius = 40;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (circumference * (animatedPercent / 100));

  return (
    <div className="flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      <div className="bg-white p-6 w-full max-w-[420px] rounded-[30px] shadow-2xl relative border-b-4" style={{ borderBottomColor: themeColor }}>
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={() => props.onClose ? props.onClose() : navigate("/assessment")} 
          className="absolute top-5 right-6 text-slate-300 hover:text-red-400 text-lg font-bold z-[50]"
        >
          ✕
        </button>

        {/* HEADER SECTION */}
        <div className="flex flex-col items-center mb-4">
           {/* GAUGE */}
           <div className="relative w-40 h-28 mb-2">
              <svg viewBox="0 0 100 65" className="w-full h-full">
                <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#F1F5F9" strokeWidth="12" strokeLinecap="round" />
                <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={themeColor} strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{scoreNum.toFixed(1)}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Neural Index</span>
              </div>
           </div>
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{content.label}</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{content.sub}</p>
        </div>

        {/* REASON/INSIGHT GRID */}
        <div className="grid grid-cols-2 gap-3 mb-4">
           <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reasoning</span>
              <p className="text-xs font-bold text-slate-700 leading-tight">{getReason()}</p>
           </div>
           <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Insight</span>
              <p className="text-[11px] font-medium text-slate-500 italic leading-snug">"{content.explanation}"</p>
           </div>
        </div>

        {/* PLAN SECTION (INTERACTIVE) */}
        <div className="bg-[#f1f5f9]/50 p-4 rounded-2xl mb-5">
           <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-[10px] font-black text-slate-800 uppercase">Recovery Plan</h3>
           </div>
           <div className="space-y-2">
              {content.steps.map((step, i) => (
                <Link to={step.path} key={i} className="bg-white p-3 rounded-xl flex items-center gap-3 border border-slate-50 hover:border-teal-400 transition-all group scale-100 hover:scale-[1.02]">
                   <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-black text-[11px] group-hover:bg-teal-500 group-hover:text-white transition-colors" style={{ backgroundColor: themeColor + '20', color: themeColor }}>{i+1}</div>
                   <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-none group-hover:text-teal-700">{step.title}</p>
                      <p className="text-[9px] text-slate-400 font-medium mt-1">{step.sub}</p>
                   </div>
                   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="text-slate-200 group-hover:text-teal-400"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
           </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
           <Link to="/dashboard" className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white text-center shadow-md" style={{ backgroundColor: "#1D4D4F" }}>Dashboard</Link>
           <button 
             onClick={() => props.onClose ? props.onClose() : navigate("/assessment")}
             className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white text-center shadow-md" 
             style={{ backgroundColor: "#E76F51" }}
           >
             Retake
           </button>
        </div>
      </div>
    </div>
  );
}