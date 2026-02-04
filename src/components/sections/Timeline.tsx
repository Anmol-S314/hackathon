import React from 'react';
import { motion } from 'framer-motion';
import { HACKATHON_CONFIG } from '../../config';

interface Phase {
    nr: string;
    title: string;
    date: string;
    desc: string;
    color: string;
}

const phases: Phase[] = [
    {
        nr: "01",
        title: "Phase 1",
        date: HACKATHON_CONFIG.TIMELINE.REGISTRATION,
        desc: "Assemble your squad of elite engineers. Submit your innovative idea to secure your spot.",
        color: "bg-cyan-400"
    },
    {
        nr: "02",
        title: "Interim",
        date: HACKATHON_CONFIG.TIMELINE.DEVELOPMENT,
        desc: "Our council reviews all submissions. The top 60 teams will be selected for the grand finale.",
        color: "bg-yellow-400"
    },
    {
        nr: "03",
        title: "Finale",
        date: HACKATHON_CONFIG.TIMELINE.FINALE,
        desc: "The final showdown at Skill Labs. 24 hours to build, deploy, and pitch to victory.",
        color: "bg-pink-primary"
    }
];

/**
 * Timeline section reimagined as a classic Comic Book Grid.
 * Panels use varying spans to create a dynamic, non-uniform graphic novel layout.
 */
export default function Timeline(): React.ReactElement {
    return (
        <section id="timeline" className="py-12 bg-[#1a0033] relative overflow-hidden">
            {/* Retro Comic Halftone Print Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />

            <div className="section-container relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-6xl text-white font-display mb-2 comic-outline">MISSION <span className="text-yellow-400">CHRONICLES</span></h2>
                    <p className="text-base text-white font-bold uppercase tracking-widest italic">The Sequential Story of the Hack</p>
                </div>

                {/* Adaptive Comic Grid Panels */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Panel 1: Wide intro */}
                    <motion.div
                        className="md:col-span-8 group"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        viewport={{ once: true }}
                    >
                        <div className="comic-card h-full bg-cyan-400 !p-5 relative border-[3px] shadow-[6px_6px_0px_#000] rotate-1 group-hover:rotate-0 transition-transform">
                            <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 font-comic text-base rotate-3 shadow-[2px_2px_0px_#FF00E5]">
                                {phases[0].date}
                            </div>
                            <span className="text-3xl font-display text-black opacity-10 absolute bottom-2 left-2">{phases[0].nr}</span>
                            <h3 className="text-2xl font-display text-black mb-2 leading-none uppercase">{phases[0].title}</h3>
                            <p className="text-black font-bold text-base leading-tight max-w-lg">{phases[0].desc}</p>
                        </div>
                    </motion.div>

                    {/* Panel 2: Tall/Narrow Decorative */}
                    <motion.div
                        className="md:col-span-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        viewport={{ once: true }}
                    >
                        <div className="comic-card h-full bg-white !p-6 border-[4px] shadow-[8px_8px_0px_#000] -rotate-2 hover:rotate-0 transition-transform flex flex-col justify-center overflow-hidden relative">
                            <div className="absolute -right-2 -top-2 text-6xl font-display text-purple-primary opacity-10 rotate-12">POW!</div>
                            <div className="bg-pink-primary text-white px-3 py-0.5 font-comic text-xl mb-4 self-start transform -rotate-3 shadow-[3px_3px_0px_#000]">
                                PROTOCOL
                            </div>
                            <p className="font-display text-2xl text-black leading-none uppercase italic">SYNC COMPLETE. READY FOR DEPLOYMENT.</p>
                        </div>
                    </motion.div>

                    {/* Panel 3: Square Content */}
                    <motion.div
                        className="md:col-span-12 group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        viewport={{ once: true }}
                    >
                        <div className="comic-card h-full bg-yellow-400 !p-6 relative border-[3px] shadow-[8px_8px_0px_#000] flex flex-col md:flex-row gap-5 items-start md:items-center">
                            <div className="md:w-1/4">
                                <span className="text-4xl font-display text-black/20 block mb-1">{phases[1].nr}</span>
                                <div className="bg-black text-white px-3 py-0.5 font-comic text-xl inline-block -rotate-2 shadow-[2px_2px_0px_#00FFCC]">
                                    {phases[1].date}
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-3xl font-display text-black mb-2 uppercase leading-none">{phases[1].title}</h3>
                                <p className="text-black font-bold text-lg leading-tight italic">{phases[1].desc}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Panel 4: Grand Finale Hero */}
                    <motion.div
                        className="md:col-span-12 group"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        viewport={{ once: true }}
                    >
                        <div className="comic-card h-full bg-white !p-6 relative border-[3px] shadow-[8px_8px_0px_#000] overflow-hidden group">
                            <div className="absolute -right-12 -bottom-12 text-[10rem] font-display text-neon-green/10 select-none group-hover:scale-110 transition-transform">MAX</div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                                <div>
                                    <div className="bg-purple-primary text-white px-4 py-1 font-comic text-2xl mb-3 inline-block transform -rotate-2 shadow-[3px_3px_0px_#000]">
                                        {phases[2].date}
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-display text-black leading-none uppercase tracking-tighter">
                                        THE <span className="text-pop !-webkit-text-stroke-[1.5px] italic">{phases[2].title}</span>
                                    </h3>
                                </div>
                                <div className="max-w-md">
                                    <p className="text-gray-900 font-bold text-xl leading-none uppercase mb-2">The Final Arena</p>
                                    <p className="text-black font-bold text-base leading-tight">
                                        {phases[2].desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
