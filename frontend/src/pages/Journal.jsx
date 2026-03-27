import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Journal.css";

const PROMPTS = [
    "How has your digital environment felt today: like a tool or like a cage?",
    "In the rush of connectivity, what was the last thing you noticed in silence?",
    "Which digital habit would you like to 'delete' from your life this week?",
    "Describe a moment today where you felt completely disconnected from your screen.",
    "If your laptop could speak, what would it tell you about your posture today?",
    "What is one physical sensation you are ignoring to stay online?"
];

const INSIGHTS_LIBRARY = [
    { title: "The Architecture of Stillness", category: "Environment", link: "https://hbr.org/2018/03/create-a-growth-mindset-on-your-team", desc: "How physical workspace impacts flow.", color: "from-[#2A9D8F] to-[#E9C46A]" },
    { title: "The Dopamine Loop", category: "Habits", link: "https://www.theguardian.com/technology/2018/mar/04/has-dopamine-got-us-hooked-on-tech-facebook-apps-addiction", desc: "How variable rewards keep you scrolling.", color: "from-[#E76F51] to-[#264653]" },
    { title: "The Science of Sleep", category: "Health", link: "https://www.sleepfoundation.org/how-sleep-works/how-electronics-affect-sleep", desc: "Blue light's biological impact.", color: "from-[#F4A261] to-[#E76F51]" }
];

export default function Journal() {
    const [content, setContent] = useState("");
    const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleShuffle = () => {
        setIsFlipped(!isFlipped);
        setTimeout(() => {
            const nextPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
            setCurrentPrompt(nextPrompt);
        }, 150);
    };

    return (
        <div className="journal-page min-h-screen">
            <main className="journal-container py-10">

                {/* CLEAN HEADER REMOVED AS REQUESTED */}

                {/* 2. MAIN WORKSPACE */}
                <div className="journal-main-card">
                    {/* LEFT: Prompt Sidebar */}
                    <aside className="prompt-sidebar" onClick={handleShuffle}>
                        <div className="relative w-full h-full perspective-1000">
                            <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                className="w-full h-full preserve-3d"
                            >
                                <PromptCardFace type="front" title="Today's Prompt" content={currentPrompt} />
                                <PromptCardFace type="back" title="Reflect" content={`"${currentPrompt}"`} />
                            </motion.div>
                        </div>
                    </aside>

                    {/* RIGHT: Notebook */}
                    <section className="notebook-section">
                        <textarea
                            className="journal-textarea"
                            placeholder="Start writing..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="journal-footer">
                            <button className="seal-button">
                                <span className="material-symbols-outlined">lock</span>
                                Seal Entry
                            </button>
                        </div>
                    </section>
                </div>

                {/* 3. INSIGHTS */}
                <section className="marquee-section">
                    <h2 className="text-3xl font-black text-[#1d4d4f] mb-8">Insights Library</h2>
                    <div className="marquee-container">
                        <motion.div
                            animate={{ x: [0, -1200] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="marquee-track"
                        >
                            {[...INSIGHTS_LIBRARY, ...INSIGHTS_LIBRARY].map((article, i) => (
                                <a href={article.link} target="_blank" rel="noopener noreferrer" key={i} className="premium-blog-card block hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
                                    <div className={`h-48 rounded-[2rem] bg-gradient-to-br ${article.color} p-6 text-white flex flex-col justify-between`}>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{article.category}</span>
                                        <h3 className="text-xl font-bold">{article.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm italic mt-4">"{article.desc}"</p>
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}

const PromptCardFace = ({ type, title, content }) => (
    <div className={`absolute inset-0 p-8 flex flex-col justify-between rounded-r-none rounded-[2.5rem] backface-hidden ${type === 'back' ? 'bg-[#1d4d4f] text-white rotate-y-180' : 'bg-[#f0f4f4] text-[#1d4d4f]'}`}>
        <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</span>
            <p className={`mt-8 text-xl leading-relaxed ${type === 'back' ? 'font-serif italic' : 'font-bold'}`}>{content}</p>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-tighter opacity-40">Tap card to shuffle focus</p>
    </div>
);