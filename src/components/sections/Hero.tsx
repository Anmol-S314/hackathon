import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCw, ExternalLink, Hand, Music, Brain } from 'lucide-react';
import { HACKATHON_CONFIG } from '../../config';
import CountdownTimer from '../CountdownTimer';
import VexCharacter from '../animations/VexCharacter';
import type { ActionType } from '../animations/VexCharacter';
import { RobotControlButton, VisibilityToggle } from '../animations/RobotControls';

export default function Hero(): React.ReactElement {
    return (
        <section className="relative w-full max-w-[100vw] min-h-[100dvh] flex items-center justify-center pt-24 md:pt-8 overflow-hidden bg-[#0a001a] -mt-1">
            <ComicFlairOverlay />
            <div className="section-container z-10 text-center pb-4 md:pb-32">
                <HeroContent />
                <HeroBadgesSection />
            </div>

            {/* Desktop Only Bottom Sponsors Bar */}
            <div className="hidden md:flex absolute bottom-0 left-0 w-full h-16 items-end justify-center pb-2 z-30 pointer-events-none">
                {/* Solid Background (No Gradient) */}
                <div className="absolute inset-0 bg-[#0a001a] z-0" />

                {/* Comic Dots Pattern Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: 'bottom center'
                    }}
                />

                <div className="flex items-center gap-6 relative z-10 pointer-events-auto">
                    <span className="text-white font-display text-sm uppercase tracking-widest comic-outline transform -rotate-1 mr-2">
                        Powered By
                    </span>

                    {HACKATHON_CONFIG.SPONSORS.map((sponsor, index) => (
                        sponsor.isSlogan ? (
                            <div key={index} className="bg-cyan-300 border-[2px] border-black p-2 rotate-1 max-w-[140px]">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className={`${sponsor.className || 'w-full'} object-contain`}
                                />
                            </div>
                        ) : (
                            <div key={index} className="bg-white border-[2px] border-white/20 p-2 rounded-sm flex flex-col items-center hover:scale-105 transition-transform">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className={`${sponsor.className || 'h-8'} object-contain`}
                                />
                            </div>
                        )
                    ))}
                </div>
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

                    <h2 className="text-3xl md:text-3xl lg:text-4xl text-yellow-500 font-stencil drop-shadow-[5px_5px_0px_#000] -rotate-1 mb-6 md:mb-6">
                        Code the future!
                    </h2>

                    <SponsorsBlock />

                    <div className="mb-8 w-full flex justify-center">
                        <CountdownTimer />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        {HACKATHON_CONFIG.HACKATHON_PHASE === 'PHASE_1' ? (
                            <Link to="/register" className="btn-comic-primary text-xl md:text-2xl px-8 md:px-12 py-4 md:py-5 w-full sm:w-auto text-center">
                                Register Now!
                            </Link>
                        ) : HACKATHON_CONFIG.HACKATHON_PHASE === 'SELECTION' ? (
                            <div className="bg-yellow-400 border-[3px] border-black px-8 py-4 shadow-[4px_4px_0px_#000] -rotate-1">
                                <span className="text-black font-display text-xl md:text-2xl uppercase italic">Selection in Progress!</span>
                            </div>
                        ) : (
                            <div className="bg-neon-green border-[3px] border-black px-8 py-4 shadow-[4px_4px_0px_#000] rotate-1">
                                <span className="text-black font-display text-xl md:text-2xl uppercase italic">Phase 2 Active!</span>
                            </div>
                        )}

                        {HACKATHON_CONFIG.SHOW_PHASE_2_RESULTS && HACKATHON_CONFIG.PHASE_2_TEAMS_LINK && (
                            <a
                                href={HACKATHON_CONFIG.PHASE_2_TEAMS_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-comic text-xl md:text-2xl px-8 md:px-12 py-4 md:py-5 w-full sm:w-auto text-center flex items-center justify-center gap-2 bg-purple-primary text-white"
                            >
                                <ExternalLink size={24} /> Selected Teams
                            </a>
                        )}
                    </div>

                    {/* Mobile Only Robot */}
                    <div className="lg:hidden w-full relative z-20 mt-8 pointer-events-auto">
                        <MobileRobotContainer />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SponsorsBlock(): React.ReactElement {
    return (
        <div className="flex flex-col items-center mb-8 md:hidden">
            <h3 className="text-xl md:text-lg font-display text-white mb-3 md:mb-2 uppercase tracking-widest comic-outline transform -rotate-1">
                Powered By
            </h3>
            <div className="flex flex-col items-center justify-center gap-6">
                {HACKATHON_CONFIG.SPONSORS.map((sponsor: any, index: number) => (
                    sponsor.isSlogan ? (
                        <div key={index} className="bg-cyan-300 border-[3px] border-black p-3 md:p-2 shadow-[4px_4px_0px_#000] rotate-2 max-w-[200px] md:max-w-[150px]">
                            <img
                                src={sponsor.logo}
                                alt={sponsor.name}
                                className={`${sponsor.className || 'w-full'} object-contain`}
                            />
                        </div>
                    ) : (
                        <div key={index} className="relative group">
                            <div className="absolute inset-0 bg-yellow-400 border-[3px] border-black shadow-[4px_4px_0px_#000] translate-x-1 translate-y-1 -z-10" />
                            <div className="bg-white border-[3px] border-black p-3 md:p-3 flex flex-col items-center">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className={`${sponsor.className?.replace('h-8', 'h-10') || 'h-10'} object-contain`}
                                />
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

function HeroBadgesSection(): React.ReactElement {
    const [isMobileMerchFlipped, setIsMobileMerchFlipped] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 mt-2 lg:mt-16 w-full px-4 relative z-20 max-w-6xl mx-auto">
            {/* Internship Highlight */}
            <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="w-full max-w-[340px] lg:max-w-sm"
            >
                <InternshipBadgeContent
                    rotateClass="-rotate-2"
                    containerClass="w-full"
                />
            </motion.div>

            {/* Merch Highlight */}
            <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="w-full max-w-[340px] lg:max-w-sm"
            >
                <div
                    className="bg-pink-primary border-[4px] border-black p-5 shadow-[8px_8px_0px_#000] rotate-2 relative group cursor-pointer w-full"
                    onClick={() => setIsMobileMerchFlipped(!isMobileMerchFlipped)}
                >
                    <span className="absolute -top-4 -right-4 bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-bold rotate-12 z-20">MERCH!</span>
                    <div className="flex items-center justify-center gap-6">
                        <div className="relative w-28 h-28 lg:w-36 lg:h-36 shrink-0">
                            <img
                                src="/assets/new/tshirt_front-Photoroom.png"
                                alt="T-Shirt Front"
                                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isMobileMerchFlipped ? 'lg:group-hover:opacity-0 opacity-0' : 'opacity-100'}`}
                            />
                            <img
                                src="/assets/new/tshirt_back-Photoroom.png"
                                alt="T-Shirt Back"
                                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isMobileMerchFlipped ? 'opacity-100' : 'lg:group-hover:opacity-100 opacity-0'}`}
                            />
                        </div>
                        <div className="text-left">
                            <h4 className="text-white font-display text-3xl lg:text-4xl uppercase leading-none mb-1">OFFICIAL<br />MERCH</h4>
                            <p className="text-black font-bold text-[10px] uppercase opacity-80 md:hidden">
                                <span className="flex items-center gap-1 mt-1 text-purple-900">
                                    <RotateCw size={12} className="animate-spin-slow" /> Tap to Flip
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Keep the internal content helper clean and compact
function InternshipBadgeContent({
    rotateClass = '',
    containerClass = ''
}: any): React.ReactElement {
    return (
        <div className={`bg-cyan-500 border-[4px] border-black p-6 lg:p-8 shadow-[8px_8px_0px_#000] ${rotateClass} ${containerClass}`}>
            <span className="text-black font-display text-2xl lg:text-3xl block leading-none lowercase">guaranteed</span>
            <span className="text-white font-display text-3xl lg:text-4xl block leading-tight">INTERNSHIPS!</span>
            <span className="text-black font-bold text-xs lg:text-sm block mt-2 uppercase tracking-tight">FOR 15 best performers</span>
        </div>
    );
}

function MobileRobotContainer(): React.ReactElement | null {
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [action, setAction] = useState<ActionType>('idle');

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const triggerAction = (newAction: ActionType) => {
        setAction(newAction);
    };

    if (!isMobile) return null;

    return (
        <div className="w-full relative flex flex-col items-center">
            {/* Mobile Control Stack */}
            <div className="flex gap-4 mb-4 z-20">
                <VisibilityToggle
                    isVisible={isVisible}
                    onToggle={() => setIsVisible(!isVisible)}
                    isMobile={true}
                />

                {isVisible && (
                    <>
                        <RobotControlButton
                            onClick={() => triggerAction('hi')}
                            title="Wave"
                            bgColor="bg-yellow-400"
                            icon={<Hand size={22} className="text-black" />}
                            isMobile={true}
                        />

                        <RobotControlButton
                            onClick={() => triggerAction('dance')}
                            title="Party"
                            bgColor="bg-pink-primary"
                            icon={<Music size={22} className="text-white" />}
                            isMobile={true}
                        />

                        <RobotControlButton
                            onClick={() => triggerAction('thinking')}
                            title="Think"
                            bgColor="bg-cyan-400"
                            icon={<Brain size={22} className="text-black" />}
                            isMobile={true}
                        />
                    </>
                )}
            </div>

            {/* Mobile Robot Container */}
            <div className={`w-full transition-all duration-700 ease-in-out relative z-30
                ${isVisible
                    ? 'opacity-100 translate-y-0 scale-100 h-[320px] md:h-[380px] visible'
                    : 'opacity-0 translate-y-10 scale-90 h-0 invisible pointer-events-none'}`}>
                <VexCharacter action={action} setAction={setAction} />
            </div>
        </div>
    );
}
