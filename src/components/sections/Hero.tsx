import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';
import VexCharacter from '../animations/VexCharacter';

export default function Hero(): React.ReactElement {
    return (
        <section className="relative w-full max-w-[100vw] min-h-[100dvh] flex items-center justify-center pt-24 md:pt-8 overflow-hidden bg-[#0a001a] -mt-1">
            <ComicFlairOverlay />


            <DesktopFloatingBadges />

            <div className="section-container z-10 text-center">
                <HeroContent />
                <MobileFloatingBadges />
            </div>
        </section>
    );
}

function ComicFlairOverlay(): React.ReactElement {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            <svg className="absolute inset-0 w-full h-full opacity-30">
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="0.5" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="0.5" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.5" />
            </svg>
        </div>
    );
}



function HeroContent(): React.ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <div className="w-full relative">
                <div className="w-full max-w-4xl mx-auto text-center px-4 relative z-10">
                    <div className="mb-6 relative group inline-block">
                        <img
                            src="/assets/new/vex_logo-Photoroom.png"
                            alt="VexStorm 26"
                            className="w-full max-w-[500px] md:max-w-[550px] mx-auto transform -rotate-2 drop-shadow-[5px_5px_0px_rgba(0,0,0,0.5)]"
                        />
                    </div>

                    <h2 className="text-3xl md:text-5xl text-yellow-500 font-stencil drop-shadow-[5px_5px_0px_#000] -rotate-1 mb-8">
                        Code the future!
                    </h2>

                    <SponsorsBlock />

                    <div className="mb-12 w-full flex justify-center">
                        <CountdownTimer />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link to="/register" className="btn-comic-primary text-xl md:text-2xl px-8 md:px-12 py-4 md:py-5 w-full sm:w-auto text-center">
                            Register Now!
                        </Link>
                    </div>

                    {/* Optimized Mobile Robot: Only mount if mobile to save WebGL context */}
                    <div className="lg:hidden w-full h-[350px] relative z-0 mt-8 pointer-events-auto">
                        <MobileRobotContainer />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SponsorsBlock(): React.ReactElement {
    return (
        <div className="flex flex-col items-center mb-10">
            <h3 className="text-xl md:text-2xl font-display text-white mb-4 uppercase tracking-widest comic-outline transform -rotate-1">
                Powered By
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-yellow-400 border-[3px] border-black shadow-[4px_4px_0px_#000] translate-x-1 translate-y-1 -z-10" />
                    <div className="bg-white border-[3px] border-black p-3 md:p-4 flex flex-col items-center">
                        <img
                            src="/assets/new/edventurex-Photoroom.png"
                            alt="EdventureX"
                            className="h-12 md:h-16 object-contain"
                        />
                    </div>
                </div>

                <div className="bg-cyan-300 border-[3px] border-black p-3 md:p-4 shadow-[4px_4px_0px_#000] rotate-2 max-w-[200px]">
                    <img
                        src="/assets/new/edventurex_slogan-Photoroom.png"
                        alt="Slogan"
                        className="w-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
}

function DesktopFloatingBadges(): React.ReactElement {
    return (
        <div className="hidden lg:block pointer-events-none">
            <DesktopInternshipBadge />
            <DesktopMerchBadge />
        </div>
    );
}

function MobileFloatingBadges(): React.ReactElement {
    const [isMobileMerchFlipped, setIsMobileMerchFlipped] = useState(false);

    return (
        <div className="flex flex-col items-center gap-8 mt-12 lg:hidden w-full px-4 relative z-20">
            <InternshipBadgeContent
                rotateClass="-rotate-2"
                containerClass="w-full max-w-sm mx-auto"
            />

            <MobileMerchBadge
                isFlipped={isMobileMerchFlipped}
                onToggle={() => setIsMobileMerchFlipped(!isMobileMerchFlipped)}
            />
        </div>
    );
}

function DesktopInternshipBadge(): React.ReactElement {
    return (
        <motion.div
            animate={{ y: [0, 20, 0], rotate: [-2, -4, -2] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute top-40 right-40 z-20 pointer-events-auto"
        >
            <InternshipBadgeContent
                rotateClass="-rotate-3"
                scaleClass="scale-110"
                originClass="origin-bottom-right"
            />
        </motion.div>
    );
}

function DesktopMerchBadge(): React.ReactElement {
    return (
        <motion.div
            animate={{ y: [0, -20, 0], rotate: [2, 4, 2] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-40 left-40 z-20 pointer-events-auto"
        >
            <div className="bg-pink-primary border-[4px] border-black p-4 shadow-[10px_10px_0px_#000] rotate-2 relative group cursor-pointer">
                <span className="absolute -top-6 -right-6 bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-bold rotate-12 z-20">MERCH!</span>
                <div className="relative w-32 h-32 md:w-64 md:h-64">
                    <img
                        src="/assets/new/tshirt_front-Photoroom.png"
                        alt="T-Shirt Front"
                        className="absolute inset-0 w-full h-full object-contain group-hover:opacity-0 transition-opacity duration-300"
                    />
                    <img
                        src="/assets/new/tshirt_back-Photoroom.png"
                        alt="T-Shirt Back"
                        className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                </div>
            </div>
        </motion.div>
    );
}

interface InternshipBadgeContentProps {
    rotateClass?: string;
    scaleClass?: string;
    originClass?: string;
    containerClass?: string;
}

function InternshipBadgeContent({
    rotateClass = '',
    scaleClass = '',
    originClass = '',
    containerClass = ''
}: InternshipBadgeContentProps): React.ReactElement {
    return (
        <div className={`bg-cyan-500 border-[4px] border-black p-6 shadow-[6px_6px_0px_#000] lg:shadow-[10px_10px_0px_#000] ${rotateClass} ${scaleClass} ${originClass} ${containerClass}`}>
            <span className="text-black font-display text-xl lg:text-2xl block leading-none">GUARANTEED</span>
            <span className="text-white font-display text-3xl lg:text-4xl block leading-tight">INTERNSHIPS!</span>
            <span className="text-black font-bold text-xs block mt-1 uppercase">FOR ALL WINNING TEAMS</span>
        </div>
    );
}

interface MobileMerchBadgeProps {
    isFlipped: boolean;
    onToggle: () => void;
}

function MobileMerchBadge({ isFlipped, onToggle }: MobileMerchBadgeProps): React.ReactElement {
    return (
        <div
            className="bg-pink-primary border-[4px] border-black p-4 shadow-[6px_6px_0px_#000] rotate-1 relative w-full max-w-sm mx-auto cursor-pointer transition-transform active:scale-95"
            onClick={onToggle}
        >
            <span className="absolute -top-4 -right-4 bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-bold rotate-12 z-20">MERCH!</span>
            <div className="flex items-center justify-center gap-4">
                <div className="w-24 h-24 relative">
                    <img
                        src="/assets/new/tshirt_front-Photoroom.png"
                        alt="T-Shirt Front"
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                        src="/assets/new/tshirt_back-Photoroom.png"
                        alt="T-Shirt Back"
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
                <div className="text-white font-display text-2xl uppercase leading-none text-left">
                    Swag<br />
                    <span className="text-sm font-sans font-bold text-black opacity-70 flex items-center gap-1 mt-1">
                        {isFlipped ? "(Tap for Front)" : "(Tap for Back)"} <RotateCw size={14} className="animate-pulse" />
                    </span>
                </div>
            </div>
        </div>
    );
}

function MobileRobotContainer(): React.ReactElement | null {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!isMobile) return null;

    return <VexCharacter />;
}
