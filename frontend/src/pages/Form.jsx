import React, { useState } from "react";
import PredictionPage from "./Predictionpage";
import { mlApi } from "../services/mlApi";

export default function Assessment() {
  const [showPopup, setShowPopup] = useState(false);
  const [risk, setRisk] = useState("Low");
  const [inputs, setInputs] = useState({
    screentime: 1, sleep: 1, stress: 1, mood: 1
  });
  const [loading, setLoading] = useState(false);

  // UI LABELS (Stay the same)
  const screenLabels = ["<2h", "2-4h", "4-6h", "6-8h", "8-10h", "10-12h", "12-14h", "14-16h", "16-18h", "18h+"];
  const sleepLabels = ["Great", "V.Good", "Good", "Fair", "Avg", "Poor", "V.Poor", "Bad", "Exhausted", "None"];
  const stressLabels = ["None", "V.Low", "Low", "Mild", "Mod", "High", "V.High", "Peak", "Burnout", "Extreme"];
  const moodLabels = ["Great", "Happy", "Good", "Stable", "Neutral", "Low", "Sad", "V.Low", "Bad", "Empty"];

  const getPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowPopup(false);

    try {
      /** * MODEL MAPPING:
       * High Exhaustion = High Screen + High Stress + High Sleep(Poor) + High Mood(Bad)
       */
      const mappedInputs = {
        // 1. Screentime: 18h+ (index 10) maps to 18
        screentime: [1, 3, 5, 7, 9, 11, 13, 15, 17, 18][inputs.screentime - 1],

        // 2. Sleep: "None" (index 10) should be a HIGH score for exhaustion (10)
        // "Great" (index 1) should be a LOW score (1)
        sleep: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][inputs.sleep - 1],

        // 3. Stress: "Extreme" (index 10) maps to 10
        stress: inputs.stress,

        // 4. Mood: "Empty" (index 10) should be a HIGH score for exhaustion (10)
        mood: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10][inputs.mood - 1]
      };

      console.log("Sending Mapped Data:", mappedInputs);

      const response = await mlApi.getPrediction(mappedInputs);
      const result = response.risk_label;

      let mappedRisk = "Low Digital Exhaustion";
      if (result === "High") {
        mappedRisk = "High Digital Exhaustion (Burnout Risk)";
      } else if (result === "Moderate") {
        mappedRisk = "Moderate Digital Exhaustion";
      }

      setRisk(mappedRisk);
      setShowPopup(true);

    } catch (err) {
      console.error("Prediction error:", err);
      setRisk("Unable to calculate risk. Please check your connection.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const ChoiceGrid = ({ label, id, list, currentVal }) => (
    <div className="bg-white p-3 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[11px] font-bold text-[#1D4D4F] uppercase tracking-wider">{label}</span>
        <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 border border-teal-100">
          {list[currentVal - 1]}
        </span>
      </div>
      <div className={`grid grid-cols-10 gap-1`}>
        {list.map((_, index) => {
          const val = index + 1;
          const isActive = currentVal === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setInputs({ ...inputs, [id]: val })}
              className={`h-8 flex items-center justify-center border transition-all text-[11px] font-medium ${isActive
                ? "bg-[#1D4D4F] border-[#1D4D4F] text-white"
                : "border-slate-100 bg-white text-slate-400 hover:border-[#1D4D4F]"
                }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F5F7F9] flex flex-col font-sans overflow-hidden">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full flex flex-col shadow-2xl bg-white border-t-[6px] border-[#1D4D4F]">
          <div className="p-6 border-b border-slate-100 text-center shrink-0">
            <h2 className="text-xl font-light text-[#1D4D4F] tracking-tight uppercase">
              MindRest <span className="font-bold">Assessment</span>
            </h2>
            <p className="mt-1 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">
              Analysis Engine v1.2
            </p>
          </div>

          <form onSubmit={getPrediction} className="p-6 space-y-3">
            <ChoiceGrid label="Screen Usage" id="screentime" list={screenLabels} currentVal={inputs.screentime} />
            <ChoiceGrid label="Sleep Quality" id="sleep" list={sleepLabels} currentVal={inputs.sleep} />
            <ChoiceGrid label="Stress Level" id="stress" list={stressLabels} currentVal={inputs.stress} />
            <ChoiceGrid label="Current Mood" id="mood" list={moodLabels} currentVal={inputs.mood} />

            <div className="pt-4 shrink-0">
              <button
                type="submit"
                className="w-full bg-[#E76F51] text-white py-3.5 font-bold text-xs uppercase tracking-widest hover:bg-[#cf5b3f] transition-all"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Generate Analysis"}
              </button>
            </div>
          </form>

          <div className="bg-slate-50 p-2.5 text-center border-t border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
              Secure Local Processing — © 2026 MindRest
            </p>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white shadow-2xl relative max-w-lg w-full border-t-[6px] border-[#E76F51]">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-6 text-slate-400 hover:text-black font-light text-2xl"
            >
              ✕
            </button>
            <PredictionPage 
              passedRisk={risk} 
              score={(inputs.screentime + inputs.sleep + inputs.stress + inputs.mood) / 4}
              screenTime={inputs.screentime}
              sleep={inputs.sleep}
              stress={inputs.stress}
              focus={11 - inputs.mood}
            />
          </div>
        </div>
      )}
    </div>
  );
}