import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layout, Zap, Target } from 'lucide-react';

export default function SubmissionRules(): React.ReactElement {
    const rules = [
        {
            icon: Target,
            title: "Problem Statement",
            desc: "Clearly define the real-world challenge you are tackling within your chosen track."
        },
        {
            icon: Layout,
            title: "5-Slide Format",
            desc: "Exactly 5 slides required: Intro, Problem, Architecture, AI Workflow, & Impact."
        },
        {
            icon: Zap,
            title: "Full Stack Agent",
            desc: "The prototype must be a full-stack application with a functioning AI agent backend."
        },
        {
            icon: FileText,
            title: "Selection Board",
            desc: "Evaluations by The Infinity Team & an elite panel of Technical Architects."
        }
    ];

    return (
        <section id="submission" className="py-16 bg-[#240a45] relative overflow-hidden">
            <div className="section-container relative z-[100]">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl text-white font-display mb-2 comic-outline">
                        MISSION <span className="text-pink-primary">PROTOCOLS</span>
                    </h2>
                    <p className="text-base text-gray-400 font-bold uppercase tracking-widest italic">
                        Phase 1 & 2: Submission Guidelines
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {rules.map((rule, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white border-[3px] border-black p-5 shadow-[6px_6px_0px_#8B5CF6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                        >
                            <div className="w-12 h-12 bg-neon-green border-[2px] border-black flex items-center justify-center mb-4 -rotate-3 group-hover:rotate-6 transition-transform">
                                <rule.icon size={24} className="text-black" />
                            </div>
                            <h3 className="text-xl font-display text-black mb-2 uppercase italic leading-none">{rule.title}</h3>
                            <p className="text-gray-800 font-bold text-xs leading-snug">{rule.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 bg-yellow-400 border-[3px] border-black p-6 shadow-[8px_8px_0px_#000] rotate-1 max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                            <Target size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-display text-black uppercase mb-1 leading-none">Evaluation Criteria</h4>
                            <p className="text-black font-bold text-sm md:text-base leading-tight italic">
                                "The Infinity Team will filter for feasibility, novelty, and relevance. Shortlisting the top 15 teams for the Finale."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
