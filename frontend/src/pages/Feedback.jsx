import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackApi } from '../services/feedbackApi';

const MOODS = [
    { value: 1, emoji: "😫", label: "Stressed" },
    { value: 2, emoji: "🙁", label: "Tired" },
    { value: 3, emoji: "😐", label: "Okay" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "🤩", label: "Great" }
];

export default function Feedback() {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) return;
        setLoading(true);

        try {
            await feedbackApi.submitFeedback(rating, comment);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            e.target.reset();
            setRating(null);
            setComment("");
        } catch (error) {
            console.error("Feedback Error:", error);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#FFFFFF] py-8 px-6 font-['Plus_Jakarta_Sans'] flex flex-col items-center justify-center min-h-[calc(100vh-70px)]">
            <div className="max-w-[650px] w-full text-center">
                <div className="mb-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#E76F51] uppercase mb-2">The Analytics</p>
                    <h1 className="text-4xl md:text-5xl font-black text-[#264653] tracking-tight mb-2">Submit Feedback</h1>
                    <p className="text-slate-500 font-medium text-sm">Help us refine your digital sanctuary experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(29,77,79,0.04)] text-left flex flex-col gap-6">

                    <div>
                        <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-4 text-center">Current Mood State</label>
                        <div className="flex justify-center gap-3 md:gap-6">
                            {MOODS.map((m) => (
                                <motion.div key={m.value} className="flex flex-col items-center gap-2">
                                    <motion.button
                                        type="button"
                                        onClick={() => setRating(m.value)}
                                        whileHover={{ scale: 1.15, y: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl transition-all rounded-full ${rating === m.value ? 'bg-[#fdfaf6] border-2 border-[#E76F51] filter-none shadow-md' : 'bg-slate-50 border border-slate-100 grayscale-[0.8] opacity-60 hover:grayscale-0 hover:opacity-100 shadow-sm hover:shadow-md'}`}
                                    >
                                        {m.emoji}
                                    </motion.button>
                                    <div className="h-4 flex items-center justify-center">
                                        <span className={`text-[9px] uppercase tracking-widest font-bold transition-opacity ${rating === m.value ? 'text-[#E76F51] opacity-100' : 'text-slate-400 opacity-0'}`}>
                                            {m.label}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {!rating && <p className="text-center text-[#E76F51] text-[10px] mt-2 opacity-60 font-bold tracking-widest uppercase">Select a mood to continue</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-[#1D4D4F] uppercase tracking-widest mb-2">How can MindRest improve your digital balance?</label>
                        <textarea
                            required
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-[#fcfdfd] border border-slate-200 rounded-[0.85rem] py-3 px-4 text-[#1D4D4F] focus:outline-none focus:border-[#1D4D4F] transition-all resize-none placeholder-slate-300 text-sm font-medium focus:shadow-[0_0_0_4px_rgba(29,77,79,0.1)] focus:bg-white"
                            placeholder="Share your thoughts on routines, triggers, or specific features..."
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-2 bg-[#1D4D4F] text-white py-3.5 rounded-[1rem] font-bold uppercase tracking-widest text-xs hover:bg-[#E76F51] border border-transparent hover:border-[#E76F51] transition-all shadow-[0_10px_30px_rgba(29,77,79,0.2)] hover:shadow-[0_10px_30px_rgba(231,111,81,0.3)] w-full focus:outline-none disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-10 right-10 bg-[#E76F51] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 z-[9999] font-bold tracking-wide text-sm"
                    >
                        <span className="material-symbols-outlined font-black text-2xl">check_circle</span>
                        Feedback Received
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
