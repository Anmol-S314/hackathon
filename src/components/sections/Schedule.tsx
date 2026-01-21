import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Coffee, Utensils, Users, Trophy, Play } from 'lucide-react';

interface Event {
    time: string;
    label: string;
    icon: any;
}

const day1: Event[] = [
    { time: "09:30 AM", label: "Inauguration & Phase 2 Intro", icon: Play },
    { time: "11:00 AM", label: "Hackathon Commencement", icon: Zap },
    { time: "12:30 PM", label: "Fuel Up: Lunch Break", icon: Utensils },
    { time: "05:00 PM", label: "Mentor Evaluation: Round 1", icon: Users },
    { time: "07:30 PM", label: "Night Ops: Dinner", icon: Utensils },
];

const day2: Event[] = [
    { time: "07:30 AM", label: "System Reboot: Breakfast", icon: Coffee },
    { time: "09:00 AM", label: "Mentor Evaluation: Round 2", icon: Users },
    { time: "11:00 AM", label: "Phase 2 Termination", icon: Clock },
    { time: "12:30 PM", label: "Fuel Up: Lunch Break", icon: Utensils },
    { time: "02:00 PM", label: "Top 15 Selection", icon: Trophy },
    { time: "02:15 PM", label: "Phase 3: The Pitch", icon: Play },
    { time: "04:30 PM", label: "Crowning & Distribution", icon: Trophy },
];

/**
 * Schedule section showing the detailed battle plan for the finale days.
 */
interface ScheduleColumnProps {
    title: string;
    events: Event[];
    color: string;
}

function ScheduleColumn({ title, events, color }: ScheduleColumnProps): React.ReactElement {
    return (
        <div className="flex flex-col h-full">
            <div className={`comic-card !p-3 mb-4 ${color} rotate-[-1deg]`}>
                <h3 className="text-3xl font-display text-black text-center uppercase tracking-tight">{title}</h3>
            </div>
            <div className="space-y-3">
                {events.map((event, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 group"
                    >
                        <div className="flex-shrink-0 w-20 text-right">
                            <span className="font-comic text-sm text-yellow-400">{event.time}</span>
                        </div>
                        <div className="relative flex-grow">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white group-hover:scale-150 transition-transform" />
                            <div className="ml-5 p-2 bg-white/5 border-l-2 border-white/20 hover:border-neon-green transition-colors">
                                <div className="flex items-center gap-2">
                                    <event.icon size={14} className="text-neon-green" />
                                    <span className="text-white font-bold text-sm uppercase tracking-wide leading-tight">{event.label}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/**
 * Schedule section showing the detailed battle plan for the finale days.
 */
export default function Schedule(): React.ReactElement {
    return (
        <section id="schedule" className="py-12 bg-[#05001a] relative overflow-hidden">
            {/* Background scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />

            <div className="section-container relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-6xl text-white font-display mb-2 comic-outline">BATTLE <span className="text-neon-green">PLAN</span></h2>
                    <p className="text-base text-gray-400 font-bold uppercase tracking-[0.2em]">Operational Schedule: Phase 2 & 3</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <ScheduleColumn title="DAY 01" events={day1} color="bg-cyan-400" />
                    <ScheduleColumn title="DAY 02" events={day2} color="bg-yellow-400" />
                </div>
            </div>
        </section>
    );
}
