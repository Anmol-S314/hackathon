import React from 'react';
import { motion } from 'framer-motion';

/**
 * Prizes section showcasing rewards for the hackathon.
 * Highlights the main cash prize and internship opportunities.
 */
export default function Prizes(): React.ReactElement {
    return (
        <section id="prizes" className="py-12 bg-transparent relative overflow-hidden">
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
            <h2 className="text-4xl md:text-6xl text-white font-display uppercase tracking-tight comic-outline mb-2">
                THE <span className="text-yellow-400">PRIZES</span>
            </h2>
            <p className="text-base text-white font-bold uppercase mt-2">
                The ultimate battle for the top spot. Secure your place in history and claim your rewards.
            </p>
        </div>
    );
}

function PrizeGrid(): React.ReactElement {
    return (
        <div className="flex flex-col border-[4px] border-black shadow-[12px_12px_0px_#000] md:shadow-[20px_20px_0px_#000] overflow-hidden rounded-[2rem] bg-black">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2">
                    <GrandPrize />
                </div>
                <div className="lg:w-1/2">
                    <SidePrizes />
                </div>
            </div>
            {/* <ConsolationBanner /> */}
        </div>
    );
}



function GrandPrize(): React.ReactElement {
    return (
        <div className="bg-[#8B5CF6] p-6 relative flex flex-col items-center justify-center min-h-[250px] border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black overflow-hidden text-center z-10 w-full h-full">
            {/* 1st Place Tag */}
            <motion.div
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{ scale: 1, rotate: 6 }}
                className="absolute top-3 left-3 lg:top-6 lg:left-6 bg-orange-500 border-[3px] lg:border-[4px] border-black px-3 py-1 lg:px-4 lg:py-2 rotate-6 shadow-[3px_3px_0px_#000] lg:shadow-[4px_4px_0px_#000] z-20"
            >
                <span className="text-white font-display text-2xl lg:text-4xl">1 ST</span>
            </motion.div>

            <div>
                <h3 className="text-5xl md:text-7xl text-white font-display leading-[0.8] tracking-tighter mb-4">
                    <span className="block text-pop">GRAND</span>
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
        <div className="bg-[#7c3aed] flex flex-col font-display h-full">
            <div className="flex border-b-[4px] border-black">
                <div className="w-[61.8%] border-r-[4px] border-black">
                    <SecondPlace />
                </div>
                <div className="w-[38.2%]">
                    <ThirdPlace />
                </div>
            </div>
            <div className="flex-grow flex flex-col">
                <InternshipSlot />
            </div>
        </div>
    );
}

function SecondPlace(): React.ReactElement {
    return (
        <div className="p-4 md:p-6 flex flex-col items-center justify-center gap-2 hover:bg-black/10 transition-colors group h-full">
            <div className="w-12 h-12 rounded-full bg-cyan-400 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000] rotate-3 group-hover:rotate-12 transition-transform shrink-0">
                <span className="text-black text-xl">2</span>
            </div>
            <div className="text-center">
                <div className="text-2xl md:text-3xl text-cyan-400 [text-shadow:2px_2px_0px_#000]">₹20,000</div>
                <div className="text-white text-xs md:text-sm font-medium uppercase italic leading-none">RUNNER UP</div>
            </div>
        </div>
    );
}

function ThirdPlace(): React.ReactElement {
    return (
        <div className="p-4 md:p-6 flex flex-col items-center justify-center gap-2 hover:bg-black/10 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-yellow-400 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000] -rotate-3 group-hover:rotate-12 transition-transform shrink-0">
                <span className="text-black text-xl">3</span>
            </div>
            <div className="text-center">
                <div className="text-2xl md:text-3xl text-yellow-400 [text-shadow:2px_2px_0px_#000]">₹10,000</div>
                <div className="text-white text-xs md:text-sm font-medium uppercase italic leading-none">THIRD PLACE</div>
            </div>
        </div>
    );
}

function InternshipSlot(): React.ReactElement {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex-grow p-6 md:p-8 bg-pink-primary flex flex-col items-center justify-center gap-2 group relative cursor-default transition-all shadow-inner overflow-hidden"
        >
            {/* Background Graphic */}
            <div className="absolute -bottom-4 -right-4 opacity-10 transform rotate-12">
                <span className="text-white text-9xl font-display">★</span>
            </div>

            <div className="flex flex-col items-center z-10 text-center px-4">
                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white [text-shadow:3px_3px_0px_#000] font-display uppercase italic leading-none mb-4">
                    15 <span className="text-yellow-400">Internships</span>
                </h4>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white text-sm md:text-lg font-normal uppercase tracking-wider">
                        6-Month Duration
                    </p>
                    <div className="bg-black text-white px-4 py-1.5 rounded-sm rotate-1 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                        <span className="text-xs md:text-sm font-medium uppercase tracking-widest">Stipend-Based</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
