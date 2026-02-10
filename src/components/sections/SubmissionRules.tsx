import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Zap, Target, AlertTriangle, ExternalLink } from 'lucide-react';
import { HACKATHON_CONFIG } from '../../config';

export default function SubmissionRules(): React.ReactElement {
    const rules = [
        {
            icon: Target,
            title: "TRACK INTEL",
            phase: "PHASE 01",
            color: "bg-red-500",
            desc: "Choose your arena and submit a visionary 5-slide conceptual PPT strategy."
        },
        {
            icon: Layout,
            title: "THE BLUEPRINT",
            phase: "PHASE 01",
            color: "bg-blue-500",
            desc: "Exactly 5 slides required: Intro, Problem, Architecture, AI Workflow, & Impact."
        },
        {
            icon: Zap,
            title: "THE PROTOTYPE",
            phase: "PHASE 02",
            color: "bg-emerald-500",
            desc: "Construct a full-stack beast where your AI agent executes autonomous logic."
        }
    ];

    return (
        <section id="submission" className="py-16 bg-[#1a0033] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

            <div className="section-container relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-6xl text-white font-display uppercase tracking-tight comic-outline mb-2">
                        MISSION <span className="text-yellow-400">PROTOCOLS</span>
                    </h2>
                    <p className="text-base text-white font-bold uppercase mt-2">
                        Operation Guidelines & Submission Briefing
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {rules.map((rule, i) => {
                        const isActive = (HACKATHON_CONFIG.HACKATHON_PHASE === 'PHASE_1' && rule.phase === 'PHASE 01') ||
                            (HACKATHON_CONFIG.HACKATHON_PHASE === 'PHASE_2' && rule.phase === 'PHASE 02');

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2" />
                                <div className="relative bg-white border-[3px] border-black p-6 min-h-[200px] flex flex-col items-center text-center group-hover:-translate-y-1 transition-transform">
                                    {/* Phase Tape Label */}
                                    <div className={`absolute -top-3 -right-4 border-2 border-black text-white font-black shadow-[3px_3px_0px_#000] rotate-12 z-20 flex items-center gap-2 ${rule.color} ${isActive ? 'px-4 py-1.5 text-[10px] md:text-xs' : 'px-3 py-1 text-[9px]'}`}>
                                        {rule.phase}
                                        {isActive && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                            />
                                        )}
                                    </div>

                                    {/* Icon Burst with Phase Color */}
                                    <div className="w-16 h-16 relative mb-4">
                                        <div className={`absolute inset-0 ${rule.color} border-2 border-black rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[2px_2px_0px_#000]`} />
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <rule.icon size={28} className="text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-display text-black mb-2 italic">{rule.title}</h3>
                                    <p className="text-gray-800 font-bold text-xs leading-relaxed uppercase tracking-tight px-2">
                                        {rule.desc}
                                    </p>

                                    {/* Decoration */}
                                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-black opacity-20" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Simplified Advisory Note */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-yellow-400 border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_#000] flex items-center gap-6 relative overflow-hidden">
                        <div className="bg-black text-yellow-400 p-3 border-2 border-yellow-400 shrink-0 shadow-[2px_2px_0px_#000]">
                            <AlertTriangle size={32} />
                        </div>
                        <p className="text-black font-bold text-sm md:text-base uppercase leading-snug italic">
                            <span className="text-red-600 underline mr-1 text-base md:text-lg">NOTE:</span>
                            Phase 2 problem statements are provided by VexStorm & may be different from your Phase 1 PPT concept.
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Resources Required</p>
                        <a
                            href={HACKATHON_CONFIG.PPT_TEMPLATE_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-yellow-400 text-yellow-400 hover:text-black border-2 border-yellow-400/30 hover:border-black px-6 py-3 transition-all duration-300 font-display text-sm uppercase italic tracking-wider group"
                        >
                            <ExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
                            Download Phase 1 Official Template
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
