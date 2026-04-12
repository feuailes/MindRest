import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PredictionPage from "./Predictionpage";
import { mlApi } from "../services/mlApi";

export default function Assessment() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [risk, setRisk] = useState("Low");
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    screentime: 3, sleep: 8, stress: 3, mood: 8
  });

  const screenTimeMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const sleepLabels = [
    "Perfect Rest", "Very Good", "Good", "Fair", "Average",
    "Disturbed", "Poor", "Very Poor", "Exhausted", "No Sleep"
  ];

  const stressLabels = [
    "Very Relaxed", "Calm", "Comfortable", "Mild Pressure", "Busy",
    "Tense", "Stressed", "Very High Stress", "Near Burnout", "Extreme Overload"
  ];

  const moodLabels = [
    "Excellent", "Happy", "Cheerful", "Stable", "Neutral",
    "Irritable", "Low", "Very Low", "Depressed/Angry", "Emotionally Empty"
  ];

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

  const currentRiskScore = ((inputs.screentime + inputs.sleep + inputs.stress + inputs.mood) / 4).toFixed(1);
  const meterPercentage = (currentRiskScore / 10) * 100;

  return (
    <div className="h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 font-['Inter',_sans-serif] overflow-hidden relative">
      {/* Back Arrow - Leftmost Top Corner */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 text-slate-400 hover:text-[#2A9D8F] transition-all bg-white shadow-sm hover:shadow-md w-10 h-10 rounded-xl flex items-center justify-center z-[100]"
        title="Back to Home"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
      </button>

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 p-8 md:p-14 w-full relative overflow-hidden">



          <div className="mb-14 text-center">
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              <span style={{ color: '#264653' }}>Mind</span>
              <span style={{ color: '#E76F51' }}>Rest</span>
              <span className="text-[#1d4d4f] block md:inline md:ml-3">Assessment</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-[0.3em] font-bold opacity-80">Predict your digital exhaustion risk.</p>
          </div>

          <div className="flex flex-col gap-12">

            {/* Screen Time */}
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center w-full px-1">
                <label className="text-[13px] font-bold text-slate-500 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#2A9D8F] opacity-70">desktop_windows</span>
                  Daily Screen Usage
                </label>
                <div className="text-right flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-[#1d4d4f]">{screenTimeMap[inputs.screentime - 1]}</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">HRS</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.screentime}
                onChange={(e) => setInputs({ ...inputs, screentime: parseInt(e.target.value) })}
                className="w-full accent-[#1d4d4f] outline-none h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Stress */}
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center w-full px-1">
                <label className="text-[13px] font-bold text-slate-500 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#2A9D8F] opacity-70">bolt</span>
                  Perceived Stress
                </label>
                <div className="text-right">
                  <span className="text-[10px] font-black text-[#E76F51] uppercase tracking-widest bg-[#E76F51]/5 px-2 py-1 rounded-md">{stressLabels[inputs.stress - 1]}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.stress}
                onChange={(e) => setInputs({ ...inputs, stress: parseInt(e.target.value) })}
                className="w-full accent-[#1d4d4f] outline-none h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Sleep */}
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center w-full px-1">
                <label className="text-[13px] font-bold text-slate-500 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#2A9D8F] opacity-70">bedtime</span>
                  Sleep Quality
                </label>
                <div className="text-right">
                  <span className="text-[10px] font-black text-[#2A9D8F] uppercase tracking-widest bg-[#2A9D8F]/5 px-2 py-1 rounded-md">{sleepLabels[inputs.sleep - 1]}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.sleep}
                onChange={(e) => setInputs({ ...inputs, sleep: parseInt(e.target.value) })}
                className="w-full accent-[#1d4d4f] outline-none h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Mood */}
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between items-center w-full px-1">
                <label className="text-[13px] font-bold text-slate-500 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#2A9D8F] opacity-70">mood</span>
                  Current Mood
                </label>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{moodLabels[inputs.mood - 1]}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.mood}
                onChange={(e) => setInputs({ ...inputs, mood: parseInt(e.target.value) })}
                className="w-full accent-[#1d4d4f] outline-none h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
              />
            </div>

          </div>

          <button
            onClick={getPrediction}
            disabled={loading}
            className="w-full mt-14 bg-[#1d4d4f] hover:bg-[#2A9D8F] text-white font-black py-5 rounded-[1.5rem] transition-all shadow-[0_10px_30px_rgba(29,77,79,0.15)] hover:shadow-[0_15px_35px_rgba(42,157,143,0.3)] disabled:opacity-50 text-[11px] tracking-[0.3em] uppercase"
          >
            {loading ? "Analyzing..." : "Get Your Result"}
          </button>

        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg transform transition-all animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <PredictionPage
              onClose={() => setShowPopup(false)}
              passedRisk={risk}
              score={Number(currentRiskScore)}
              screenTime={screenTimeMap[inputs.screentime - 1]}
              sleep={inputs.sleep}
              stress={inputs.stress}
              focus={inputs.mood}
            />
          </div>
        </div>
      )}

      {/* Modern Slider Polish */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: #ffffff;
          border: 6px solid #1d4d4f;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: grab;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          border-color: #2A9D8F;
          transform: scale(1.1);
        }
        input[type='range']::-webkit-slider-thumb:active {
          transform: scale(1.2);
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}