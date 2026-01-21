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
        a: "Guaranteed internships for all podium winners (Top 3)! Additionally, approx. 15 chosen participants will be fast-tracked for recruitment interviews."
    },
    {
        q: "What is the team size?",
        a: "You can register as an individual or in a team of up to 3 members. Both individual and team projects are evaluated equally."
    },
    {
        q: "Is there a registration fee?",
        a: "Yes, there is a registration fee of ₹150 per team/individual to ensure committed participation and prize pool security."
    },
    {
        q: "Do I need to be an AI expert?",
        a: "Not at all! As long as you have a passion for building cool things and are willing to learn, you're welcome. We provide workshops and mentoring."
    },
    {
        q: "Is the finale onsite or remote?",
        a: "The final 2 days of pitching and evaluation will be held onsite at Skill Labs. Selected finalists will be invited."
    },
    {
        q: "Can I participate in multiple tracks?",
        a: "No, each team must select one primary track to focus their project on during the hackathon."
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
