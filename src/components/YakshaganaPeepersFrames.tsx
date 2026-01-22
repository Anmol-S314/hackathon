import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FRAMES = [
    '/yaks_frames/new/frame_0f-Photoroom.png',
    '/yaks_frames/new/frame_19f-Photoroom.png',
    '/yaks_frames/new/frame_30f-Photoroom.png',
    '/yaks_frames/new/frame_40f-Photoroom.png',
    '/yaks_frames/new/frame_54f-Photoroom.png',
    '/yaks_frames/new/frame_58f-Photoroom.png',
    '/yaks_frames/new/frame_61f-Photoroom.png',
    '/yaks_frames/new/frame_66f-Photoroom.png',
    '/yaks_frames/new/frame_72f-Photoroom.png',
    '/yaks_frames/new/frame_76f-Photoroom.png',
];

const FRAME_RATE = 48; // ms per frame

/**
 * YakshaganaPeepersFrames component.
 * Displays a sequence of images that play forward on hover and reverse on exit.
 * Fixed to the left side of the screen.
 */
export default function YakshaganaPeepersFrames(): React.ReactElement {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Sync animation with visibility state OR hover state
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setCurrentFrame((prev) => {
                // Play forward if hiding (!isVisible) OR hovering
                if (!isVisible || isHovered) {
                    return prev < FRAMES.length - 1 ? prev + 1 : prev;
                }
                // Otherwise play reverse (End -> 0)
                return prev > 0 ? prev - 1 : prev;
            });
        }, FRAME_RATE);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isVisible, isHovered]);

    // Preload images once on mount
    useEffect(() => {
        FRAMES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    return (
        <div className="fixed left-0 bottom-0 z-[100] w-40 md:w-56 pointer-events-none select-none">
            <motion.div
                className="pointer-events-auto cursor-pointer relative"
                onMouseEnter={() => {
                    // Only enable hover effect on devices that support it to prevent sticky hover on mobile
                    if (window.matchMedia('(hover: hover)').matches) {
                        setIsHovered(true);
                    }
                }}
                onMouseLeave={() => setIsHovered(false)}
                onTap={() => {
                    if (!window.matchMedia('(hover: hover)').matches) {
                        setIsVisible(!isVisible);
                    }
                }}
                initial={{ x: -100, opacity: 0 }}
                animate={{
                    x: isVisible ? 0 : '-75%',
                    opacity: isVisible ? 1 : 0.8,
                    filter: isVisible ? 'grayscale(0%)' : 'grayscale(0%)'
                }}
                whileHover={{ opacity: 1, x: isVisible ? 0 : '-75%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className="relative w-full">
                    {/* Spacer to maintain aspect ratio and layout */}
                    <img
                        src={FRAMES[0]}
                        alt=""
                        className="w-full h-auto opacity-0 pointer-events-none"
                        aria-hidden="true"
                    />

                    {/* All frames pre-rendered and stacked */}
                    {FRAMES.map((src, index) => (
                        <img
                            key={src}
                            src={src}
                            alt={index === currentFrame ? "Yakshagana Character" : ""}
                            className={`absolute top-0 left-0 w-full h-full object-contain drop-shadow-[0_0_12px_rgba(0,0,0,0.4)] ${index === currentFrame ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                            draggable={false}
                            loading="eager"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
