import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PredictionPage from "./Predictionpage";
import { mlApi } from "../services/mlApi";
import { motion, AnimatePresence } from "framer-motion";
import { feedbackApi } from "../services/feedbackApi";

const MOODS = [
  { value: 1, emoji: "😫", label: "Stressed" },
  { value: 2, emoji: "🙁", label: "Tired" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "🤩", label: "Great" }
];

export default function Assessment() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [risk, setRisk] = useState("Low");
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    screentime: 3, sleep: 8, stress: 3, mood: 8
  });

  const [activeFaq, setActiveFaq] = useState(null);

  // Feedback State
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setFeedbackLoading(true);

    try {
      await feedbackApi.submitFeedback(rating, comment);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setRating(null);
      setComment("");
    } catch (error) {
      console.error("Feedback Error:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setFeedbackLoading(false);
    }
  };

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
          >
            {loading ? "Analyzing..." : "Get Your Result"}
          </button>
        </div>
      </div>

        {/* --- EVIDENCE LAYER: FULL-WIDTH BANDED SECTIONS --- */}
        <div className="w-full flex flex-col mt-32">
          
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
                  <h4 className="pillar-heading">Mental Energy</h4>
                  <p className="pillar-text">Too much screen time can drain your brain's focus. We track your usage to see how much "mental fuel" you have left for the day.</p>
                </div>

                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#E76F51]/10 text-[#E76F51]">
                    <span className="material-symbols-outlined !text-[30px]">bedtime</span>
                  </div>
                  <h4 className="pillar-heading">Sleep Recovery</h4>
                  <p className="pillar-text">Sleep is your body's way of recharging. We look at your rest quality to see how well you’re bouncing back each night.</p>
                </div>

                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#1d4d4f]/10 text-[#1d4d4f]">
                    <span className="material-symbols-outlined !text-[30px]">bolt</span>
                  </div>
                  <h4 className="pillar-heading">Stress Patterns</h4>
                  <p className="pillar-text">Stress isn't just a feeling—it's how your body reacts to pressure. We map these patterns to help you find your limit.</p>
                </div>

                <div className="pillar-card border-slate-200/50">
                  <div className="pillar-icon bg-[#264653]/10 text-[#264653]">
                    <span className="material-symbols-outlined !text-[30px]">mood</span>
                  </div>
                  <h4 className="pillar-heading">Daily Outlook</h4>
                  <p className="pillar-text">Your mood acts like a filter. A positive outlook can help handle stress, while a low mood can make digital pressure feel heavier.</p>
                </div>
              </div>
            </div>
          </section>

                 {/* Section 2: Privacy (Full-Width White Band) */}
          <section className="w-full bg-white py-32">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <span className="badge-pill bg-[#1d4d4f]/5 text-[#1d4d4f]">Trust Architecture</span>
              <h3 className="text-4xl font-black mb-6 tracking-tight mt-6">Safe, Secure, and Private.</h3>
              <p className="text-lg text-slate-500 mb-20 leading-relaxed">Your behavioral data is isolated and protected. MindRest is built for your benefit, not for data brokers.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { icon: "lock", label: "Secure Data", desc: "Inputs are isolated and encrypted instantly." },
                  { icon: "shield_person", label: "Anonymous", desc: "No identity data is linked to your wellness logs." },
                  { icon: "cloud_off", label: "Private Logs", desc: "Assessments are stored exclusively for you." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center group p-10 bg-[#fafafa] rounded-[2.5rem] border border-slate-100/50 transition-all hover:shadow-lg hover:bg-white text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:bg-[#2A9D8F]/5 group-hover:text-[#2A9D8F] transition-all duration-300 shadow-sm mb-8 border border-slate-50 mx-auto">
                      <span className="material-symbols-outlined !text-[32px]">{item.icon}</span>
                    </div>
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1d4d4f] mb-3 text-center">{item.label}</h5>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed text-center">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Clarity Hub (FAQ - Full-Width Soft Tint) */}
          <section className="w-full bg-[#fcfcfc] py-32 border-t border-slate-100">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-20">
                <span className="badge-pill bg-[#264653]/10 text-[#264653]">Support FAQ</span>
                <h3 className="text-4xl font-black mt-6 tracking-tight">Assessment Clarity</h3>
              </div>
              
              <div className="flex flex-col gap-6">
                 {[
                   { q: "What should I do if my risk level is high?", a: "A high risk indicates significant digital exhaustion. We recommend taking one of our Daily Resets or exploring the Journaling section to process your triggers." },
                   { q: "How often should I take this assessment?", a: "For the most accurate tracking, we recommend a self-check once every 24 hours to monitor how your recovery cycles change." },
                   { q: "How can I improve my screen-to-sleep ratio?", a: "Small shifts matter. Try putting your devices away 30 minutes before sleep and using our 'Deep Calm' exercise to lower your stress baseline." },
                   { q: "Does this assessment replace a medical checkup?", a: "No. MindRest is a behavioral self-care tool. It is designed to aid your awareness, not to replace professional medical advice or clinical diagnosis." }
                 ].map((item, i) => (
                   <div 
                     key={i} 
                     onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                     className={`group bg-white rounded-[2rem] p-8 text-left border transition-all duration-300 cursor-pointer ${activeFaq === i ? 'border-[#2A9D8F] shadow-xl ring-1 ring-[#2A9D8F]/20' : 'border-slate-100'}`}
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

          {/* Section 5: Experience Feedback (Integrated) */}
          <section className="w-full bg-white py-32 border-t border-slate-50">
            <div className="max-w-xl mx-auto px-6 text-center">
              <span className="badge-pill bg-[#E76F51]/10 text-[#E76F51]">Personal Impact</span>
              <h3 className="text-4xl font-black mt-6 tracking-tight">Share Your Experience</h3>
              <p className="text-slate-500 font-medium text-sm mt-4 mb-16">How did this assessment feel? Your feedback helps us refine the digital sanctuary.</p>

              <form onSubmit={handleFeedbackSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(29,77,79,0.04)] text-left flex flex-col gap-10">
                <div>
                  <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-6 text-center">Select Your Current State</label>
                  <div className="flex justify-center gap-4 md:gap-6">
                    {MOODS.map((m) => (
                      <div key={m.value} className="flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRating(m.value)}
                          className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-3xl transition-all rounded-full ${rating === m.value ? 'bg-[#fdfaf6] border-2 border-[#E76F51] shadow-md' : 'bg-slate-50 border border-slate-100 grayscale-[0.8] opacity-60 hover:grayscale-0 hover:opacity-100 shadow-sm'}`}
                        >
                          {m.emoji}
                        </button>
                        <div className="h-4 flex items-center justify-center">
                          <span className={`text-[8px] uppercase tracking-widest font-black transition-opacity ${rating === m.value ? 'text-[#E76F51] opacity-100' : 'text-slate-400 opacity-0'}`}>
                            {m.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-3">Improvement Suggestions</label>
                  <textarea
                    required
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#fcfdfd] border border-slate-200 rounded-[1.2rem] py-4 px-5 text-[#1D4D4F] focus:outline-none focus:border-[#1D4D4F] transition-all resize-none placeholder-slate-300 text-sm font-medium focus:bg-white"
                    placeholder="Tell us what you'd love to see next..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={feedbackLoading}
                  className="bg-[#1D4D4F] text-white py-4 rounded-[1.2rem] font-bold uppercase tracking-widest text-[11px] hover:bg-[#E76F51] transition-all shadow-xl disabled:opacity-50"
                >
                  {feedbackLoading ? "Sending..." : "Submit Experience"}
                </button>
              </form>
            </div>
          </section>

          {/* Toast Notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 right-10 bg-[#E76F51] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 z-[9999] font-bold text-sm"
              >
                <span className="material-symbols-outlined">check_circle</span>
                Feedback Received
              </motion.div>
            )}
          </AnimatePresence>
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