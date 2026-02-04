import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { HACKATHON_CONFIG } from '../config';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetLabel, setTargetLabel] = useState('COUNTDOWN');

  useEffect(() => {
    const now = new Date();
    const deadlineDate = new Date(HACKATHON_CONFIG.REGISTRATION_DEADLINE);
    const hackathonDate = new Date(HACKATHON_CONFIG.HACKATHON_DATE);

    // Determine target: if registration is still open, countdown to deadline
    // otherwise, countdown to the hackathon itself
    let target;
    if (now < deadlineDate) {
      target = deadlineDate.getTime();
      setTargetLabel('PHASE 1 CLOSES IN');
    } else {
      target = hackathonDate.getTime();
      setTargetLabel('HACKATHON STARTS IN');
    }

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = target - currentTime;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_#84CC16]" />
        <span className="text-white font-display text-xs tracking-widest uppercase">{targetLabel}</span>
      </div>

      <div className="flex gap-3">
        {timeBlocks.map((block, i) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white border-[3px] border-black px-3 py-2 shadow-[3px_3px_0px_#000] min-w-[65px] flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-stencil text-black leading-none">
                {block.value < 10 ? `0${block.value}` : block.value}
              </span>
            </div>
            <span className="text-[10px] font-bold text-yellow-400 mt-1 tracking-tighter uppercase">{block.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;