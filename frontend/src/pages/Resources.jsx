import React from 'react';
import { motion } from 'framer-motion';

const RESEARCH_DATA = [
    {
        title: "Digital Eye Strain",
        source: "Mayo Clinic – Screen Time Health",
        description: "Article on how reducing screen exposure can improve eye comfort, posture, and general wellbeing.",
        link: "https://mcpress.mayoclinic.org/living-well/5-ways-slimming-screentime-is-good-for-your-health/"
    },
    {
        title: "Dopamine Fasting",
        source: "Wikipedia / General Science",
        description: "Explanation of the dopamine fasting concept and its intended role in moderating tech‑driven behaviours.",
        link: "https://en.wikipedia.org/wiki/Dopamine_fasting"
    },
    {
        title: "Nature Exposure & Health",
        source: "NIH – Research Review",
        description: "Scientific review showing evidence that being in natural environments supports mental health and stress reduction.",
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8125471/"
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
