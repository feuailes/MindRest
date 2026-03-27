import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXERCISE_DATA = [
  // VISUAL
  { id: 1, title: "20-20-20 Rule", category: "Visual", duration: 1, level: "Easy", desc: "Look at something 20 feet away for 20 seconds every 20 minutes." },
  { id: 2, title: "Eye Palming", category: "Visual", duration: 2, level: "Easy", desc: "Warm your palms and cover your eyes to relax the optic nerves." },
  { id: 3, title: "Blink Rapidly", category: "Visual", duration: 1, level: "Easy", desc: "Blink 10 times quickly to moisten eyes and reduce digital strain." },
  { id: 4, title: "Focus Shifting", category: "Visual", duration: 3, level: "Med", desc: "Alternate focus between your thumb and a distant object." },
  { id: 5, title: "Vertical Tracking", category: "Visual", duration: 2, level: "Med", desc: "Slowly move eyes up and down without moving your head." },
  { id: 6, title: "Circle Gaze", category: "Visual", duration: 2, level: "Easy", desc: "Slowly rotate your eyes in a circle to stretch the ocular muscles." },
  // PHYSICAL
  { id: 7, title: "Neck Rotations", category: "Physical", duration: 2, level: "Easy", desc: "Gently roll your neck to release tension from tech-neck." },
  { id: 8, title: "Shoulder Shrugs", category: "Physical", duration: 1, level: "Easy", desc: "Release upper back stress by shrugging and dropping shoulders." },
  { id: 9, title: "Wrist Flexion", category: "Physical", duration: 2, level: "Easy", desc: "Counteract typing fatigue by stretching your wrists." },
  { id: 10, title: "Desk Pushups", category: "Physical", duration: 3, level: "Hard", desc: "Use your desk for 10 light pushups to boost circulation." },
  { id: 11, title: "Seated Twist", category: "Physical", duration: 2, level: "Med", desc: "Rotate your torso while seated to realign your spine." },
  { id: 12, title: "Leg Extensions", category: "Physical", duration: 2, level: "Easy", desc: "Stretch your legs under the desk to prevent stiffness." },
  // MENTAL
  { id: 13, title: "Box Breathing", category: "Mental", duration: 4, level: "Med", desc: "Inhale, hold, exhale, and hold for 4 seconds each." },
  { id: 14, title: "Digital Detox", category: "Mental", duration: 5, level: "Hard", desc: "Close your eyes and visualize a world without screens." },
  { id: 15, title: "Gratitude Pause", category: "Mental", duration: 2, level: "Easy", desc: "Write down three things you appreciate that aren't digital." },
  { id: 16, title: "Mindful Observation", category: "Mental", duration: 3, level: "Med", desc: "Pick one object in the room and notice every detail." },
  { id: 17, title: "Affirmation Check", category: "Mental", duration: 1, level: "Easy", desc: "Repeat: 'I am in control of my technology'." },
  { id: 18, title: "Senses Audit", category: "Mental", duration: 3, level: "Med", desc: "Identify 5 things you see, 4 you feel, and 3 you hear." }
];

export default function MindfulExercises() {
  const [filter, setFilter] = useState("All Practices");
  const [activeExercise, setActiveExercise] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (activeExercise && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [activeExercise, timeLeft]);

  const startExercise = (ex) => {
    setActiveExercise(ex);
    setTimeLeft(ex.duration * 60);
  };

  const getIcon = (cat) => {
    switch (cat) {
      case "Visual": return "visibility";
      case "Physical": return "accessibility_new";
      case "Mental": return "psychology";
      default: return "self_improvement";
    }
  };

  const filtered = filter === "All Practices"
    ? EXERCISE_DATA
    : EXERCISE_DATA.filter(ex => ex.category === filter);

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8f8] font-['Inter']">

      {/* 1. ACTIVE TIMER OVERLAY WITH DYNAMIC ANIMATIONS */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1d4d4e] flex flex-col items-center justify-center p-6 text-center"
          >
            <button
              onClick={() => setActiveExercise(null)}
              className="absolute top-20 right-8 lg:top-24 lg:right-12 text-slate-400 hover:text-[#e76f51] hover:scale-110 transition-all z-[110] bg-white p-3 rounded-full shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl font-black">close</span>
            </button>

            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="max-w-xl w-full">
              <span className="text-[#b2e2d2] uppercase tracking-[0.3em] font-black text-sm">{activeExercise.category} Practice</span>
              <h2 className="text-white text-5xl font-black mt-4 mb-10">{activeExercise.title}</h2>

              {/* DYNAMIC VISUALIZER BLOCK */}
              <div className="relative w-72 h-72 mx-auto flex items-center justify-center bg-black/10 rounded-[3rem] backdrop-blur-sm">

                {/* Visualizer A: Eye Tracking (Visual Category) */}
                {activeExercise.category === "Visual" && timeLeft > 0 && (
                  <motion.div
                    animate={{
                      x: activeExercise.id === 5 ? 0 : [-100, 100, -100],
                      y: activeExercise.id === 5 ? [-100, 100, -100] : 0,
                      scale: activeExercise.id === 4 ? [1, 0.3, 1] : 1
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 bg-[#e76f51] rounded-full shadow-[0_0_30px_#e76f51]"
                  />
                )}

                {/* Visualizer B: Breathing Core (Mental Category) */}
                {activeExercise.category === "Mental" && timeLeft > 0 && (
                  <motion.div
                    animate={{ scale: [1, 2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 border-4 border-[#b2e2d2] rounded-[2rem] opacity-60"
                  />
                )}

                {/* Visualizer C: Pulse (Physical Category) */}
                {activeExercise.category === "Physical" && timeLeft > 0 && (
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-40 h-40 bg-white/10 rounded-full"
                  />
                )}

                {/* Shared Circular Progress Ring */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  <circle cx="144" cy="144" r="130" stroke="white" strokeOpacity="0.05" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="144" cy="144" r="130" stroke="#e76f51" strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray="816"
                    animate={{ strokeDashoffset: 816 - (816 * timeLeft) / (activeExercise.duration * 60) }}
                  />
                </svg>

                {/* Timer Text */}
                <span className="absolute text-white text-5xl font-black font-mono">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <p className="text-slate-300 text-xl mt-10 italic max-w-md mx-auto leading-relaxed">"{activeExercise.desc}"</p>

              {timeLeft === 0 && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setActiveExercise(null)}
                  className="mt-10 px-12 py-4 bg-[#e76f51] text-white font-black rounded-full uppercase tracking-widest text-xs"
                >
                  Exercise Complete
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* 3. TABS */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-10">
        <div className="flex gap-4 border-b border-gray-200 pb-6 overflow-x-auto no-scrollbar">
          {["All Practices", "Visual", "Physical", "Mental"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${filter === tab ? "bg-[#1d4d4e] text-white shadow-lg" : "bg-white text-[#1d4d4e] border border-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. GRID */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((ex) => (
              <motion.div
                key={ex.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm flex flex-col h-full group hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-[#1d4d4e]/30 uppercase tracking-[0.2em]">{ex.category}</span>
                    <h3 className="text-2xl font-bold text-[#1d4d4e] leading-tight mt-1">{ex.title}</h3>
                  </div>
                  <div className="p-4 bg-[#f6f8f8] rounded-2xl text-[#1d4d4e] group-hover:bg-[#1d4d4e] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">{getIcon(ex.category)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-[#f6f8f8] rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{ex.level} • {ex.duration}m</span>
                </div>
                <p className="text-slate-400 text-sm italic mb-10 flex-grow leading-relaxed">"{ex.desc}"</p>
                <button
                  onClick={() => startExercise(ex)}
                  className="w-full py-4 bg-[#e76f51] text-white font-black rounded-2xl hover:bg-[#1d4d4e] transition-all uppercase tracking-widest text-[10px] shadow-md shadow-[#e76f51]/10"
                >
                  Start Routine
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}