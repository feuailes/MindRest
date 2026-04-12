import React from 'react';
import { motion } from 'framer-motion';

const RESEARCH_DATA = [
    {
        title: "I Did a Digital Detox: Here's What I Learned",
        source: "Zapier Productivity Blog",
        description: "A creator's personal account of undertaking a complete digital detox for a day, exploring the immediate clarity and focus it brought.",
        link: "https://zapier.com/blog/digital-detox/"
    },
    {
        title: "7 Benefits of Escaping Digital Noise",
        source: "PositivePsychology Blog",
        description: "A deep dive into the psychological benefits of reducing screen time, escaping the noise, and reclaiming your emotional regulation.",
        link: "https://positivepsychology.com/digital-detox/"
    },
    {
        title: "How to Do a Digital Detox",
        source: "Medical News Today",
        description: "A comprehensive medical and psychological guide on setting boundaries with technology, managing screen time, and finding better balance.",
        link: "https://www.medicalnewstoday.com/articles/digital-detox"
    }
];

export default function Resources() {
    return (
        <div className="min-h-screen bg-[#FCFAF8] py-20 px-6 font-['Plus_Jakarta_Sans']">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <p className="text-sm font-bold tracking-[0.2em] text-[#E76F51] uppercase mb-4">The Science</p>
                    <h1 className="text-5xl md:text-6xl font-black text-[#264653] tracking-tight">Research & Publications</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {RESEARCH_DATA.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -8 }}
                            className="bg-white p-10 rounded-[2rem] border border-[#eaeaea]/50 flex flex-col items-start shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
                        >
                            <span className="text-xs font-bold text-[#E76F51] uppercase tracking-widest mb-4">{item.source}</span>
                            <h3 className="text-2xl font-black text-[#264653] mb-4 leading-snug">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">{item.description}</p>
                            <button
                                onClick={() => window.open(item.link, "_blank")}
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#264653] border-b-[1.5px] border-[#264653] pb-1 hover:text-[#E76F51] hover:border-[#E76F51] transition-colors mt-auto"
                            >
                                Read Paper
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
