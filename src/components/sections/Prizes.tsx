import React from 'react';
import { motion } from 'framer-motion';

/**
 * Prizes section showcasing rewards for the hackathon.
 * Highlights the main cash prize and internship opportunities.
 */
export default function Prizes(): React.ReactElement {
    return (
        <section id="prizes" className="py-12 bg-[#1a0033] relative overflow-hidden">
            <div className="section-container">
                <PrizeHeader />
                <PrizeGrid />
            </div>
        </section>
    );
}

function PrizeHeader(): React.ReactElement {
    return (
        <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-6xl md:text-7xl text-white font-display uppercase italic tracking-tighter comic-outline">
                PRIZES
            </h2>
            <p className="text-base text-white font-bold max-w-2xl mt-2">
                The ultimate battle for the top spot. Secure your place in history and claim your rewards.
            </p>
        </div>
    );
}

function PrizeGrid(): React.ReactElement {
    return (
        <div className="flex flex-col border-[4px] border-black shadow-[12px_12px_0px_#000] md:shadow-[20px_20px_0px_#000] overflow-hidden rounded-[2rem] bg-black">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <GrandPrize />
                <SidePrizes />
            </div>
            {/* <ConsolationBanner /> */}
        </div>
    );
}



function GrandPrize(): React.ReactElement {
    return (
        <div className="lg:col-span-6 bg-[#8B5CF6] p-6 relative flex flex-col items-center justify-center min-h-[350px] border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black overflow-hidden text-center z-10">
            {/* 1st Place Tag */}
            <motion.div
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{ scale: 1.2, rotate: 6 }}
                className="absolute top-6 left-6 bg-orange-500 border-[4px] border-black px-4 py-2 rotate-6 shadow-[4px_4px_0px_#000]"
            >
                <span className="text-white font-display text-4xl">1 ST</span>
            </motion.div>

            <div>
                <h3 className="text-5xl md:text-7xl text-white font-display leading-[0.8] tracking-tighter mb-4">
                    <span className="block opacity-60 text-comic-stroke tracking-widest">GRAND</span>
                    <span className="block text-pop">CHAMPION</span>
                </h3>
                <div className="text-5xl md:text-8xl font-display text-neon-green [text-shadow:4px_4px_0px_#000]">
                    ₹30,000
                </div>
                <p className="text-white font-bold mt-6 max-w-sm mx-auto text-sm md:text-base leading-relaxed uppercase px-4 opacity-90">
                    + CHAMPION TITLE & HALL OF FAME
                </p>
            </div>
        </div>
    );
}

function SidePrizes(): React.ReactElement {
    return (
        <div className="lg:col-span-6 bg-[#7c3aed] flex flex-col font-display">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 flex-grow">
                <SecondPlace />
                <ThirdPlace />
            </div>
            <InternshipSlot />
        </div>
    );
}

function SecondPlace(): React.ReactElement {
    return (
        <div className="p-6 border-b-[4px] border-black flex items-center gap-4 hover:bg-black/10 transition-colors group">
            <div className="w-16 h-16 rounded-full bg-cyan-400 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000] rotate-3 group-hover:rotate-12 transition-transform shrink-0">
                <span className="text-black text-2xl">2</span>
            </div>
            <div>
                <div className="text-3xl text-cyan-400 [text-shadow:2px_2px_0px_#000]">₹20,000</div>
                <div className="text-white text-lg uppercase italic leading-none">RUNNER UP</div>
            </div>
        </div>
    );
}

function ThirdPlace(): React.ReactElement {
    return (
        <div className="p-6 border-b-[4px] border-black flex items-center gap-4 hover:bg-black/10 transition-colors group">
            <div className="w-16 h-16 rounded-full bg-yellow-400 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000] -rotate-3 group-hover:rotate-12 transition-transform shrink-0">
                <span className="text-black text-2xl">3</span>
            </div>
            <div>
                <div className="text-3xl text-yellow-400 [text-shadow:2px_2px_0px_#000]">₹10,000</div>
                <div className="text-white text-lg uppercase italic leading-none">THIRD PLACE</div>
            </div>
        </div>
    );
}

function InternshipSlot(): React.ReactElement {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-6 md:p-8 bg-pink-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group relative cursor-default transition-all shadow-inner"
        >
            <div className="flex items-center gap-6 z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000] rotate-6 group-hover:rotate-12 transition-transform shrink-0">
                    <span className="text-pink-primary text-2xl md:text-3xl font-bold">★</span>
                </div>
                <div className="flex flex-col items-start text-left">
                    <h4 className="text-xl md:text-2xl lg:text-3xl text-white [text-shadow:2px_2px_0px_#000] font-display uppercase italic leading-[0.9] mb-1">
                        Internships
                    </h4>
                    <p className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-wide">
                        6-Month Stipend-Based
                    </p>
                </div>
            </div>

            {/* Floating "Sticker" Badge - Made slightly smaller */}
            <div className="absolute -top-8 -right-0 md:-right-5 z-20 bg-yellow-400 border-[3px] border-black px-4 py-3 rotate-12 shadow-[8px_8px_0px_#000] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 pointer-events-none">
                <div className="text-black font-display text-3xl md:text-5xl leading-none text-center">15+</div>
                <div className="text-black text-[10px] md:text-sm font-black uppercase leading-none text-center tracking-tighter mt-1">DIRECT OFFERS</div>
                <div className="text-black/60 text-[7px] md:text-[8px] font-bold uppercase leading-none text-center mt-2 border-t border-black/20 pt-1">FOR TOP CANDIDATES</div>
            </div>

        </motion.div>
    );
}
