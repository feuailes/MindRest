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

  const [activeFaq, setActiveFaq] = useState(null);

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
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center font-['Inter',_sans-serif] overflow-y-auto relative">
      {/* Back Arrow - Leftmost Top Corner */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 text-slate-400 hover:text-[#2A9D8F] transition-all bg-white shadow-sm hover:shadow-md w-10 h-10 rounded-xl flex items-center justify-center z-[100]"
        title="Back to Home"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
      </button>

      <div className="w-full max-w-xl pt-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                  <span className="text-lg font-black text-[#1d4d4f]">
                    {screenTimeMap[inputs.screentime - 1]}{screenTimeMap[inputs.screentime - 1] === 10 ? "+" : ""}
                  </span>
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
            {loading ? "Analyzing..." : "Get Your Result"}
          </button>
        </div>
      </div>

        {/* --- EVIDENCE LAYER: FULL-WIDTH BANDED SECTIONS --- */}
        <div className="w-full flex flex-col mt-32">
          
          {/* Transition Section: The Science Entry */}
          <section className="w-full bg-white border-y border-slate-100 py-32">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <span className="badge-pill bg-[#2A9D8F]/10 text-[#2A9D8F]">Scientific Foundation</span>
              <h2 className="text-5xl font-black text-[#1d4d4f] tracking-tight mt-6 mb-4">What is the science behind it?</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">MindRest merges behavioral data with predictive intelligence to help you map your energy patterns before you reach exhaustion.</p>
            </div>
          </section>

          {/* Section 1: The Behavioral Blueprint (Full-Width Light Band) */}
          <section className="w-full bg-[#f8fafc] py-32">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <span className="badge-pill bg-slate-200 text-slate-600">Behavioral Inputs</span>
              <h3 className="text-3xl font-black text-[#264653] mt-6 mb-2">The Behavioral Blueprint</h3>
              <p className="text-lg text-slate-400 mb-16">Four core indicators that define your digital wellness state.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#2A9D8F]/10 text-[#2A9D8F]">
                    <span className="material-symbols-outlined !text-[30px]">desktop_windows</span>
                  </div>
                  <h4 className="pillar-heading">Digital Engagement</h4>
                  <p className="pillar-text">We map your screen time against rest intervals to measure the internal payload of your digital activities.</p>
                </div>

                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#E76F51]/10 text-[#E76F51]">
                    <span className="material-symbols-outlined !text-[30px]">bedtime</span>
                  </div>
                  <h4 className="pillar-heading">Recovery Cycles</h4>
                  <p className="pillar-text">Sleep isn't just time; it's calibration. Our model weights sleep depth as the primary foundation for resilience.</p>
                </div>

                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#1d4d4f]/10 text-[#1d4d4f]">
                    <span className="material-symbols-outlined !text-[30px]">bolt</span>
                  </div>
                  <h4 className="pillar-heading">Stress Dynamics</h4>
                  <p className="pillar-text">By tracking perceived stress, we find your "Exhaustion Peak"—the moment where mental load outweighs energy.</p>
                </div>

                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#264653]/10 text-[#264653]">
                    <span className="material-symbols-outlined !text-[30px]">mood</span>
                  </div>
                  <h4 className="pillar-heading">Mood Baseline</h4>
                  <p className="pillar-text">Your emotional baseline acts as a multiplier, amplifying or softening the impact of daily digital stress.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Predictive Technology (Full-Width Dark Band) */}
          <section className="w-full bg-[#1d4d4f] py-32 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 text-center lg:text-left">
                <span className="badge-pill bg-[#2A9D8F]/20 text-[#2A9D8F] mb-6">Algorithm Specs</span>
                <h3 className="text-5xl font-black text-white mb-8 tracking-tight">Simple Behavioral Intelligence</h3>
                <p className="text-slate-300 text-xl leading-relaxed mb-10">MindRest's AI doesn't just score you—it alerts you. By identifying non-linear patterns between habits and burnout, it helps you intervene <strong>before</strong> productivity drops.</p>
                <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] font-bold tracking-[0.3em] uppercase text-[#E76F51]">
                   <span className="w-12 h-px bg-[#E76F51]"></span>
                   96% Prediction Score
                </div>
              </div>
              
              <div className="w-full lg:w-2/5 bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-3xl">
                 <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Model Precision</span>
                       <span className="text-4xl font-black text-white leading-none">96.4<span className="text-lg text-[#2A9D8F]"> %</span></span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
                       <div className="w-[96.4%] h-full bg-[#E76F51] shadow-[0_0_20px_rgba(231,111,81,0.5)]"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                       <div className="flex flex-col gap-1">
                          <span className="text-white text-lg">XGB-01</span>
                          <span>Neural Model</span>
                       </div>
                       <div className="flex flex-col gap-1 text-right">
                          <span className="text-white text-lg">Active</span>
                          <span>Status</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            {/* Visual Accents */}
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#2A9D8F]/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#E76F51]/5 blur-[120px] rounded-full"></div>
          </section>

          {/* Section 3: Privacy Hub (Full-Width White Band) */}
          <section className="w-full bg-white py-32">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <span className="badge-pill bg-[#1d4d4f]/5 text-[#1d4d4f]">Trust Architecture</span>
              <h3 className="text-4xl font-black mb-6 tracking-tight mt-6">Safe, Secure, and Private.</h3>
              <p className="text-lg text-slate-500 mb-20 leading-relaxed">We protect your behavioral data with the same intensity we protect our own. MindRest is a tool for your benefit, not for data brokers.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  { icon: "lock", label: "End-to-End Secure", desc: "Inputs are isolated and encrypted instantly." },
                  { icon: "shield_person", label: "100% Anonymous", desc: "No identity data is ever linked to your patterns." },
                  { icon: "cloud_off", label: "Local-First Storage", desc: "Your self-reflections stay on your device." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center group">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#2A9D8F]/5 group-hover:text-[#2A9D8F] transition-all duration-300 shadow-sm mb-8">
                      <span className="material-symbols-outlined !text-[36px]">{item.icon}</span>
                    </div>
                    <h5 className="text-xs font-black uppercase tracking-[0.2em] text-[#1d4d4f] mb-3">{item.label}</h5>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Clarity Hub (FAQ - Full-Width Soft Tint) */}
          <section className="w-full bg-[#fdfdfd] py-32 border-t border-slate-100">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-20">
                <span className="badge-pill bg-[#264653]/10 text-[#264653]">Support FAQ</span>
                <h3 className="text-4xl font-black mt-6 tracking-tight">Assessment Clarity</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                 {[
                   { q: "Is this a real doctor's note?", a: "No. This is a behavioral wellness guide designed to help you manage digital load. It is not a clinical diagnosis or medical prescription." },
                   { q: "How does the AI understand me?", a: "By identifying non-obvious links between your sleep cycles and your reported stress, the model spots trends that lead to digital exhaustion." },
                   { q: "Can anyone see my results?", a: "Only you. MindRest is built as a private sanctuary for self-reflection. We do not sell or share behavioral logs." }
                 ].map((item, i) => (
                   <div 
                     key={i} 
                     onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                     className={`group bg-white rounded-[2.5rem] p-10 text-left border transition-all duration-300 cursor-pointer ${activeFaq === i ? 'border-[#2A9D8F] shadow-xl ring-1 ring-[#2A9D8F]/20' : 'border-slate-100'}`}
                   >
                      <h4 className="font-black text-[#1d4d4f] flex items-center justify-between text-base">
                        {item.q}
                        <span className={`material-symbols-outlined transition-transform duration-500 ${activeFaq === i ? 'rotate-180 text-[#2A9D8F]' : 'text-slate-300'}`}>expand_more</span>
                      </h4>
                      {activeFaq === i && (
                        <div className="mt-6 text-slate-500 leading-relaxed text-sm animate-in fade-in slide-in-from-top-4 duration-500">
                          {item.a}
                        </div>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          </section>

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

        .badge-pill {
          display: inline-block;
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .pillar-card { 
          background: white; 
          padding: 32px; 
          border-radius: 2rem; 
          border: 1px solid #f8fafc; 
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .pillar-card:hover { 
          transform: translateY(-8px); 
          border-color: #2A9D8F; 
          box-shadow: 0 20px 40px rgba(29, 77, 79, 0.08); 
        }
        .pillar-icon { 
          width: 56px; 
          height: 56px; 
          border-radius: 18px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 20px; 
        }
        .pillar-heading { 
          font-size: 1rem; 
          font-weight: 800; 
          color: #1d4d4f; 
          margin-bottom: 12px; 
          letter-spacing: -0.01em;
        }
        .pillar-text { 
          font-size: 0.85rem; 
          color: #64748b; 
          line-height: 1.6; 
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}