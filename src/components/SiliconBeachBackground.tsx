import React from "react";
import { motion } from "framer-motion";

const BUILDINGS = [
    { h: 45, w: "w-16" }, { h: 90, w: "w-20" }, { h: 65, w: "w-14" },
    { h: 30, w: "w-12" }, { h: 85, w: "w-24" }, { h: 55, w: "w-16" },
    { h: 75, w: "w-18" }, { h: 40, w: "w-12" }
];

const BACK_BUILDINGS = [50, 70, 40, 90, 60, 80, 50, 60];

const WAVE_LAYERS = [
    { color: "#1e40af", speed: 20, height: "h-64", opacity: 0.6 },
    { color: "#0369a1", speed: 15, height: "h-56", opacity: 0.8 },
    { color: "#22d3ee", speed: 10, height: "h-40", opacity: 1 },
];

/**
 * Animated background representing the "Silicon Beach" theme.
 * Uses parallax layers, infinite waves, and a comic-book aesthetic.
 */
function SiliconBeachBackground(): React.ReactElement {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <SkyGradient />
            <TechParticles />
            <DistantCityscape />
            <MainCityscape />
            <InfiniteOcean />
            <InkParticles />
            <VignetteOverlay />
        </div>
    );
}

function SkyGradient(): React.ReactElement {
    return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e1b4b]" />
    );
}

function TechParticles(): React.ReactElement {
    // Reduce particle count on mobile for better stability
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 15;

    return (
        <div className="absolute inset-0 z-0">
            {[...Array(particleCount)].map(function renderParticle(_, i) {
                return (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        initial={{
                            x: (Math.sin(i * 1.5) * 0.5 + 0.5) * 100 + "%",
                            y: (Math.cos(i * 2.1) * 0.5 + 0.5) * 100 + "%",
                            opacity: 0
                        }}
                        animate={{
                            y: [null, "-80px"],
                            opacity: [0, 1, 0],
                            scale: [0, 1.2, 0]
                        }}
                        transition={{
                            duration: 4 + (i % 4),
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                    />
                );
            })}
        </div>
    );
}

function DistantCityscape(): React.ReactElement {
    return (
        <div className="absolute bottom-0 w-full h-[60%] flex items-end justify-around px-4 opacity-20">
            {BACK_BUILDINGS.map(function renderBackBuilding(h, i) {
                return (
                    <motion.div
                        key={i}
                        className="w-10 bg-[#312e81] border-2 border-black"
                        style={{ height: `${h}%` }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                    />
                );
            })}
        </div>
    );
}

function MainCityscape(): React.ReactElement {
    return (
        <div className="absolute bottom-10 w-full h-[70%] flex items-end justify-around px-2">
            {BUILDINGS.map(function renderBuilding(b, i) {
                const windowCount = Math.min(Math.floor(b.h / 10), 8);
                return (
                    <motion.div
                        key={i}
                        initial={{ y: 200 }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.1,
                        }}
                        className={`${b.w} bg-[#7c3aed] border-[4px] border-black shadow-[10px_10px_0px_#000] relative`}
                        style={{ height: `${b.h}%` }}
                    >
                        <div className="grid grid-cols-2 gap-2 p-3">
                            {[...Array(windowCount)].map(function renderWindow(_, w) {
                                return (
                                    <motion.div
                                        key={w}
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 + (w % 3) }}
                                        className="h-3 bg-yellow-300 border-2 border-black"
                                    />
                                );
                            })}
                        </div>
                        {i % 3 === 0 && (
                            <div className="absolute -top-12 left-1/4 w-1 h-12 bg-black" />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

function InfiniteOcean(): React.ReactElement {
    return (
        <div className="absolute bottom-0 w-full h-64 pointer-events-none">
            {WAVE_LAYERS.map(function renderWave(wave, i) {
                return (
                    <div key={i} className={`absolute bottom-0 w-full ${wave.height} opacity-90`}>
                        <motion.div
                            className="flex w-[200%] h-full"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: wave.speed,
                                ease: "linear",
                            }}
                        >
                            <WavePattern color={wave.color} />
                            <WavePattern color={wave.color} />
                        </motion.div>
                        <motion.div
                            className="absolute inset-0"
                            animate={{ y: [0, 10, 0] }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                );
            })}
            <div className="absolute bottom-0 w-full h-8 bg-white/20 backdrop-blur-[2px] border-t-2 border-black opacity-30" />
        </div>
    );
}

function WavePattern({ color }: { color: string }): React.ReactElement {
    return (
        <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ fill: color }}
        >
            <path
                stroke="black"
                strokeWidth="8"
                d="M0,160 C320,300 420,0 720,160 C1020,320 1120,20 1440,160 V320 H0 Z"
            />
        </svg>
    );
}

function InkParticles(): React.ReactElement {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const inkCount = isMobile ? 8 : 18;

    return (
        <div className="absolute inset-0">
            {[...Array(inkCount)].map(function renderInkParticle(_, i) {
                return (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#fde047] border-2 border-black rounded-full"
                        style={{
                            top: `${(i * 13) % 100}%`,
                            left: `${(i * 19) % 100}%`,
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3 + (i % 2),
                            delay: i * 0.3,
                        }}
                    />
                );
            })}
        </div>
    );
}

function VignetteOverlay(): React.ReactElement {
    return (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    );
}

export default React.memo(SiliconBeachBackground);
