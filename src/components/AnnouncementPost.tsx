import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Radio } from 'lucide-react';
import { HACKATHON_CONFIG } from '../config';

// Global variable to track dismissal state across component unmounts (SPA navigation)
let isDismissed = false;

export default function AnnouncementPost(): React.ReactElement | null {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a small delay ONLY if not previously dismissed
        if (HACKATHON_CONFIG.ANNOUNCEMENT_BANNER && !isDismissed) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        isDismissed = true;
    };

    if (!HACKATHON_CONFIG.ANNOUNCEMENT_BANNER) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, rotate: 5, x: "-50%" }}
                    animate={{ y: 0, opacity: 1, rotate: -2, x: "-50%" }}
                    exit={{ y: 100, opacity: 0, scale: 0.9, x: "-50%" }}
                    className="fixed bottom-6 left-1/2 z-[100] max-w-[320px] w-full pointer-events-auto"
                >
                    <div className="bg-white border-[4px] border-black p-5 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative">
                        {/* Pin style */}
                        {/* Pin style removed - cleaner look */}

                        {/* Close Button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute -top-4 -right-4 bg-black text-white border-2 border-white p-1 hover:scale-110 transition-transform z-20 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>

                        {/* Header Label */}
                        <div className="bg-yellow-300 border-2 border-black py-0.5 px-3 inline-block absolute -top-3 left-4 -rotate-3 z-10 transform -translate-y-1">
                            <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-1 text-red-600">
                                <Radio size={10} className="animate-pulse" /> LIVE UPDATE
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex gap-4 items-start mt-2">
                            <div className="shrink-0 bg-black text-white w-10 h-10 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#ccc]">
                                <Megaphone size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-display text-lg uppercase leading-none mb-1 text-black">
                                    HQ BROADCAST
                                </h4>
                                <p className="font-bold text-xs leading-snug text-gray-800 uppercase">
                                    {HACKATHON_CONFIG.ANNOUNCEMENT_BANNER}
                                </p>
                            </div>
                        </div>

                        {/* Sticker */}
                        <div className="absolute -bottom-2 -right-2 w-12 h-4 bg-black/10 -rotate-3 blur-[2px] -z-10" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
