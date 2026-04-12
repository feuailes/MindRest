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

  const screenTimeMap = [1, 3, 5, 7, 9, 11, 13, 15, 17, 18];
  
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 font-['Inter',_sans-serif]">
      <div className="w-full max-w-xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-10 w-full relative overflow-hidden">
          
          {/* Minimalist Header Gauge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-50">
             <div 
               className="h-full transition-all duration-500 ease-out" 
               style={{ 
                 width: `${meterPercentage}%`, 
                 backgroundColor: meterPercentage > 60 ? '#E76F51' : meterPercentage > 40 ? '#F4A261' : '#2A9D8F' 
               }}
             />
          </div>

          <div className="mb-8 mt-2 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1d4d4f]">Cognitive Load</h1>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Live Assessment</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[#E76F51]">{currentRiskScore}</span>
              <span className="text-sm font-bold text-slate-300">/10</span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            
            {/* Screen Time */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">desktop_windows</span>
                  Screen Usage
                </label>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">HOURS</span>
                  <span className="text-sm font-bold text-slate-900">{screenTimeMap[inputs.screentime - 1]}h+</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.screentime}
                onChange={(e) => setInputs({ ...inputs, screentime: parseInt(e.target.value) })}
                className="w-full accent-slate-800 outline-none h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stress */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">bolt</span>
                  Stress Level
                </label>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stressLabels[inputs.stress - 1]}</span>
                  <span className="text-sm font-bold text-slate-900">{inputs.stress}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.stress}
                onChange={(e) => setInputs({ ...inputs, stress: parseInt(e.target.value) })}
                className="w-full accent-slate-800 outline-none h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Sleep */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">bedtime</span>
                  Sleep Quality
                </label>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{sleepLabels[inputs.sleep - 1]}</span>
                  <span className="text-sm font-bold text-slate-900">{inputs.sleep}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.sleep}
                onChange={(e) => setInputs({ ...inputs, sleep: parseInt(e.target.value) })}
                className="w-full accent-slate-800 outline-none h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Mood */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">mood</span>
                  Current Mood
                </label>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{moodLabels[inputs.mood - 1]}</span>
                  <span className="text-sm font-bold text-slate-900">{inputs.mood}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10"
                value={inputs.mood}
                onChange={(e) => setInputs({ ...inputs, mood: parseInt(e.target.value) })}
                className="w-full accent-slate-800 outline-none h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

          </div>

          <button
            onClick={getPrediction}
            disabled={loading}
            className="w-full mt-10 bg-[#2A9D8F] hover:bg-[#1d4d4f] text-white font-black py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm tracking-widest uppercase"
          >
            {loading ? "Analyzing Pattern..." : "Generate Analysis"}
          </button>

        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg">
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

      {/* Global minimal custom slider styling */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          background: #2A9D8F;
          border: 4px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(42,157,143,0.4);
          transition: transform 0.1s;
        }
        input[type='range']::-webkit-slider-thumb:active {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}