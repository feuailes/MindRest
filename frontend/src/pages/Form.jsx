import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictionPage from "./Predictionpage";
import { mlApi } from "../services/mlApi";

export default function Assessment() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [risk, setRisk] = useState("Low");
  const [inputs, setInputs] = useState({
    screentime: 3, sleep: 8, stress: 3, mood: 8
  });
  const [loading, setLoading] = useState(false);

  const screenTimeMap = [1, 3, 5, 7, 9, 11, 13, 15, 17, 18];

  const moodEmojis = [
    { threshold: 1, emoji: "😟", label: "HEAVY" },
    { threshold: 3, emoji: "😐", label: "LOW" },
    { threshold: 5, emoji: "🙂", label: "CALM" },
    { threshold: 7, emoji: "😊", label: "VIBRANT" },
    { threshold: 9, emoji: "😎", label: "PEAK" },
  ];

  const getMoodInfo = (val) => {
    return [...moodEmojis].reverse().find(m => val >= m.threshold) || moodEmojis[0];
  };

  const getSleepInfo = (val) => {
    if (val <= 2) return { label: "RESTLESS", color: "text-red-500 bg-red-50" };
    if (val <= 5) return { label: "MINIMAL", color: "text-orange-500 bg-orange-50" };
    if (val <= 7) return { label: "FAIR", color: "text-yellow-600 bg-yellow-50" };
    if (val <= 9) return { label: "OPTIMAL", color: "text-teal-600 bg-teal-50" };
    return { label: "DEEP", color: "text-emerald-600 bg-emerald-50" };
  };

  const getStressInfo = (val) => {
    if (val <= 2) return { label: "ZEN", color: "text-emerald-600 bg-emerald-50" };
    if (val <= 4) return { label: "CALM", color: "text-teal-600 bg-teal-50" };
    if (val <= 6) return { label: "MODERATE", color: "text-yellow-600 bg-yellow-50" };
    if (val <= 8) return { label: "ELEVATED", color: "text-orange-500 bg-orange-50" };
    return { label: "PEAK", color: "text-red-500 bg-red-50" };
  };

  const getPrediction = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setShowPopup(false);

    try {
      const mappedInputs = {
        screentime: screenTimeMap[inputs.screentime - 1],
        sleep: inputs.sleep,
        stress: inputs.stress,
        mood: inputs.mood
      };
      const response = await mlApi.getPrediction(mappedInputs);
      const result = response.risk_label;
      setRisk(result === "High" ? "High" : result === "Moderate" ? "Moderate" : "Low");
      setShowPopup(true);
    } catch (err) {
      setRisk("Error");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] w-full bg-[#F5F9FA] flex flex-col items-center justify-start pt-6 pb-12 p-4 font-sans relative">

      {/* BACK BUTTON (ICON ONLY, NO BOX) */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-10 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-all z-[20]"
        title="Back to Home"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>

      {/* BACKGROUND DECOR */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/30 blur-[100px] rounded-full" />

      {/* ASSESSMENT CARD */}
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative z-10 border border-slate-50 flex flex-col gap-6 shrink-0">

        {/* SCREEN USAGE (Segmented 1-10) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[12px] font-bold text-slate-800">Screen Usage</h3>
              <p className="text-[8px] text-slate-400 font-medium">Cumulative digital exposure</p>
            </div>
            <span className="text-base font-bold text-teal-700">{screenTimeMap[inputs.screentime - 1]}h+</span>
          </div>
          <div className="flex items-center gap-1.5 h-1.5">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputs({ ...inputs, screentime: i + 1 })}
                className={`flex-1 h-full rounded-full transition-all ${i < inputs.screentime ? "bg-[#1D4D4F]" : "bg-slate-100"}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[7px] font-black text-slate-300 tracking-[0.2em] uppercase">
            <span>&lt; 2h</span>
            <span>18h+</span>
          </div>
        </div>

        {/* SLEEP QUALITY (Row 1-10) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-[12px] font-bold text-slate-800">Sleep Quality</h3>
                <p className="text-[8px] text-slate-400 font-medium">Restorative depth and duration</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getSleepInfo(inputs.sleep).color}`}>
                {getSleepInfo(inputs.sleep).label}
              </span>
            </div>
            <span className="text-base font-bold text-teal-700">{inputs.sleep}</span>
          </div>
          <div className="flex justify-between gap-1">
            {[...Array(10)].map((_, i) => {
              const val = i + 1;
              const active = inputs.sleep === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputs({ ...inputs, sleep: val })}
                  className={`flex-1 aspect-square rounded-lg text-[10px] font-bold transition-all border ${active ? "bg-[#1D4D4F] border-[#1D4D4F] text-white" : "bg-[#f8fafc] border-slate-100 text-slate-400"}`}
                >
                  {val}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[7px] font-black text-slate-300 tracking-[0.2em] uppercase">
            <span>Restless</span>
            <span>Deep</span>
          </div>
        </div>

        {/* STRESS LEVEL (Slider 1-10) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-[12px] font-bold text-slate-800">Stress Level</h3>
                <p className="text-[8px] text-slate-400 font-medium">Psychological and physical tension</p>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getStressInfo(inputs.stress).color}`}>
                {getStressInfo(inputs.stress).label}
              </span>
            </div>
            <span className="text-base font-bold text-orange-500">{inputs.stress}</span>
          </div>
          <div className="relative h-4 flex items-center">
            <input
              type="range" min="1" max="10"
              value={inputs.stress}
              onChange={(e) => setInputs({ ...inputs, stress: parseInt(e.target.value) })}
              className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer outline-none"
              style={{ background: `linear-gradient(to right, #E76F51 ${(inputs.stress - 1) * 11.11}%, #f1f5f9 0%)` }}
            />
            <style>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 18px;
                  height: 18px;
                  background: white;
                  border: 4px solid #E76F51;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(231, 111, 81, 0.2);
                }
              `}</style>
          </div>
          <div className="flex justify-between text-[7px] font-black text-slate-300 tracking-[0.2em] uppercase">
            <span>Zen</span>
            <span>Peak</span>
          </div>
        </div>

        {/* CURRENT MOOD (Row 1-10 with Emoji Visuals) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-[12px] font-bold text-slate-800">Current Mood</h3>
                <p className="text-[8px] text-slate-400 font-medium">Emotional baseline today</p>
              </div>
              <div className="text-xl">{getMoodInfo(inputs.mood).emoji}</div>
            </div>
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">
              {getMoodInfo(inputs.mood).label}
            </span>
          </div>
          <div className="flex justify-between gap-1">
            {[...Array(10)].map((_, i) => {
              const val = i + 1;
              const active = inputs.mood === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputs({ ...inputs, mood: val })}
                  className={`flex-1 aspect-square rounded-lg text-[10px] font-bold transition-all border ${active ? "bg-[#1D4D4F] border-[#1D4D4F] text-white" : "bg-[#f8fafc] border-slate-100 text-slate-400"}`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={getPrediction}
          className="w-full py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #2A9D8F 0%, #1D4D4F 100%)' }}
          disabled={loading}
        >
          {loading ? "Generating Analysis..." : (
            <>
              Generate Analysis
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M13 3l3.293 3.293L13 9.586M11 21l-3.293-3.293L11 14.414M3 12h18" /></svg>
            </>
          )}
        </button>

        <p className="text-center text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] -mt-2">Last Assessment 24H Ago</p>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-[1rem]">
          <div className="relative">
            <PredictionPage
              onClose={() => setShowPopup(false)}
              passedRisk={risk}
              score={Number((((inputs.screentime + inputs.sleep + inputs.stress + (11 - inputs.mood)) / 4)).toFixed(1))}
              screenTime={screenTimeMap[inputs.screentime - 1]}
              sleep={inputs.sleep}
              stress={inputs.stress}
              focus={inputs.mood}
            />
          </div>
        </div>
      )}
    </div>
  );
}