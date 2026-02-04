import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
    q: string;
    a: string;
}

const FAQS: FAQItem[] = [
    {
        q: "Who gets internships?",
        a: "The top 15 best participants win an opportunity for a paid internship."
    },
    {
        q: "What is the team size?",
        a: "You must participate in a team of exactly 3 members."
    },
    {
        q: "Is there a registration fee?",
        a: "Yes, a fee of ₹350 per person applies ONLY if your team is selected for Phase-2."
    },
    {
        q: "Do I need to be an AI expert?",
        a: "No! Basic coding skills are required, but you don't need to be an AI expert. We welcome anyone willing to learn and build."
    },
    {
        q: "Is the finale online or offline?",
        a: "The Phase-2 and Grand Finale will be an offline event held at Skill Labs. Selected finalists will be invited"
    },
    {
        q: "Can I participate in multiple tracks?",
        a: "No, each team must select one primary track to focus their project on during the hackathon."
    },
    {
        q: "What about the problem statements?",
        a: "Exact problem statements will be revealed onsite during Phase-2. Note that these may differ from the broad tracks mentioned in Phase-1."
    },
    {
        q: "Are the track ideas fixed?",
        a: "No! The ideas mentioned are just examples to spark your creativity. You can build anything that fits the broad theme of the track."
    }
];

/**
 * FAQ section with interactive accordion.
 * Features a comic-book card aesthetic.
 */
export default function FAQ(): React.ReactElement {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-10 bg-[#1a0033]">
            <div className="section-container max-w-3xl">
                <FAQHeader />
                <div className="space-y-4">
                    {FAQS.map(function renderFAQItem(faq, i) {
                        return (
                            <FAQCard
                                key={i}
                                faq={faq}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function FAQHeader(): React.ReactElement {
    return (
        <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl text-white font-display uppercase tracking-widest comic-outline">
                THE <span className="text-yellow-400">FAQS</span>
            </h2>
            <p className="text-base text-white font-bold uppercase mt-2">Intelligence Briefing & Protocols</p>
        </div>
    );
}

interface FAQCardProps {
    faq: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}

function FAQCard({ faq, isOpen, onToggle }: FAQCardProps): React.ReactElement {
    return (
        <div className="comic-card !p-0 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full p-4 md:px-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors duration-200"
            >
                <span className="text-xl md:text-2xl font-display text-black uppercase italic">{faq.q}</span>
                <ToggleButton isOpen={isOpen} />
            </button>

            <AnimatePresence>
                {isOpen && <FAQAnswer answer={faq.a} />}
            </AnimatePresence>
        </div>
    );
}

function ToggleButton({ isOpen }: { isOpen: boolean }): React.ReactElement {
    return (
        <div className={`w-10 h-10 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_#000] rotate-3 transition-colors ${isOpen ? 'bg-pink-primary' : 'bg-neon-green'}`}>
            {isOpen ? (
                <Minus size={24} className="text-black" strokeWidth={3} />
            ) : (
                <Plus size={24} className="text-black" strokeWidth={3} />
            )}
        </div>
    );
}

function FAQAnswer({ answer }: { answer: string }): React.ReactElement {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="px-8 pb-8 text-gray-900 font-bold leading-relaxed border-t-[3px] border-black pt-6 bg-yellow-50">
                {answer}
            </div>
        </motion.div>
    );
}
