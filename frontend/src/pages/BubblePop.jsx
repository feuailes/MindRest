import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BubblePop({ onClose }) {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);

    // 1. Logic to create a new bubble
    const createBubble = useCallback(() => {
        const id = Date.now() + Math.random();
        const size = Math.floor(Math.random() * 60) + 40; // Size between 40px and 100px
        const x = Math.random() * 80 + 10; // Percentage 10% to 90% to stay in bounds

        const newBubble = { id, size, x, bottom: -10 };
        setBubbles((prev) => [...prev, newBubble]);
    }, []);

    // 2. Spawn bubbles every 800ms
    useEffect(() => {
        const interval = setInterval(createBubble, 800);
        return () => clearInterval(interval);
    }, [createBubble]);

    // 3. Remove bubbles that fly off screen
    useEffect(() => {
        const cleanup = setInterval(() => {
            setBubbles((prev) => prev.filter((b) => b.bottom < 110));
        }, 2000);
        return () => clearInterval(cleanup);
    }, []);

    const popBubble = (id) => {
        setScore((s) => s + 1);
        setBubbles((prev) => prev.filter((b) => b.id !== id));
        // Optional: Add a pop sound effect here
    };

    return (
        <div className="fixed inset-0 bg-white z-[110] flex flex-col items-center justify-center overflow-hidden font-display">
            {/* HUD (Heads Up Display) */}
            <div className="absolute top-10 left-10 text-[#1d4d4e]">
                <h2 className="text-3xl font-black">Score: {score}</h2>
                <p className="text-slate-500">Pop bubbles to release stress</p>
            </div>

            <button
                onClick={onClose}
                className="absolute top-10 right-10 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
                <span className="material-symbols-outlined text-4xl">close</span>
            </button>

            {/* GAME CANVAS */}
            <div className="relative w-full h-[80vh] max-w-4xl bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                <AnimatePresence>
                    {bubbles.map((bubble) => (
                        <motion.div
                            key={bubble.id}
                            initial={{ bottom: "-10%", left: `${bubble.x}%`, scale: 0 }}
                            animate={{ bottom: "110%", scale: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 6, ease: "linear" }}
                            onClick={() => popBubble(bubble.id)}
                            className="absolute cursor-pointer rounded-full border-2 border-white/50 backdrop-blur-sm"
                            style={{
                                width: bubble.size,
                                height: bubble.size,
                                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(178,226,210,0.4) 60%, rgba(29,77,78,0.1) 100%)",
                                boxShadow: "inset -5px -5px 15px rgba(255,255,255,0.3)",
                            }}
                        >
                            {/* Highlight for "Glass" effect */}
                            <div className="absolute top-[15%] left-[15%] w-[20%] h-[20%] bg-white/60 rounded-full blur-[1px]" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <p className="mt-8 text-slate-400 font-medium animate-pulse">
                Bubbles float up naturally. Click to pop!
            </p>
        </div>
    );
}