import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, GraduationCap, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Track {
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
}

const tracks: Track[] = [
    {
        title: "Bio-Genesis",
        desc: "Healthcare AI. Build patient triage agents and diagnostic assistants.",
        icon: Activity,
        color: "bg-blue-400"
    },
    {
        title: "Capital-Core",
        desc: "FinTech AI. Create fraud detection agents and personalized financial advisors.",
        icon: Shield,
        color: "bg-purple-400"
    },
    {
        title: "Grid-Master",
        desc: "Infrastructure & Smart Cities AI. Create agents for traffic management and energy efficiency.",
        icon: Cpu,
        color: "bg-orange-400"
    },
    {
        title: "Lore-Keeper",
        desc: "Education AI. Create personalized learning tutors that adapt to every student.",
        icon: GraduationCap,
        color: "bg-green-400"
    }
];

/**
 * Section displaying the different hackathon tracks/categories.
 */
export default function Tracks(): React.ReactElement {
    const navigate = useNavigate();

    return (
        <section id="tracks" className="py-12 bg-purple-dark">
            <div className="section-container">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-6xl text-white font-display uppercase tracking-tight comic-outline mb-2">
                        MISSION <span className="text-yellow-400">TRACKS</span>
                    </h2>
                    <p className="text-base text-white font-bold uppercase mt-2">
                        Use the examples as inspiration but build anything you want.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
                    {tracks.map((track, i) => {
                        const Icon = track.icon;
                        return (
                            <motion.div
                                key={track.title}
                                onClick={() => navigate(`/register?track=${track.title}`)}
                                className="comic-card group relative hover:z-20 cursor-pointer"
                                initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -2 : 2 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                            >
                                <div className={`w-20 h-20 border-[4px] border-black ${track.color} flex items-center justify-center mb-6 shadow-[4px_4px_0px_#000] -rotate-3 group-hover:rotate-6 transition-transform`}>
                                    <Icon className="text-black" size={40} strokeWidth={2.5} />
                                </div>

                                <h3 className="text-3xl font-comic text-black mb-4 uppercase tracking-normal filter-none">
                                    {track.title}
                                </h3>

                                <p className="text-gray-900 font-bold leading-snug mb-8">
                                    {track.desc}
                                </p>

                                <div className="absolute -bottom-4 -right-4 bg-yellow-400 border-[3px] border-black px-4 py-1 font-display text-black shadow-[3px_3px_0px_#000] rotate-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    SELECT +
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
