import React from 'react';
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { HACKATHON_CONFIG } from '../../config';

/**
 * Footer component with comic book styling.
 */
export default function Footer(): React.ReactElement {
    return (
        <footer className="py-12 bg-[#1a0033]">
            <div className="section-container">
                <div className="comic-card bg-white grid grid-cols-1 md:grid-cols-4 gap-8 !p-8">
                    <div className="md:col-span-2">
                        <h2 className="text-4xl font-display text-black mb-4 uppercase italic tracking-tighter">
                            VEXSTORM <span className="text-purple-primary text-pop">26</span>
                        </h2>
                        <p className="text-gray-900 font-bold max-w-sm mb-6 leading-tight text-sm">
                            Empowering the next generation of AI developers. VexStorm 26 is the premier arena for building agentic AI solutions.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href={HACKATHON_CONFIG.SOCIAL_LINKS.LINKEDIN}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border-[2px] border-black bg-yellow-400 flex items-center justify-center hover:bg-neon-green transition-colors shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <Linkedin size={20} className="text-black" strokeWidth={2.5} />
                            </a>
                            <a
                                href={`mailto:${HACKATHON_CONFIG.CONTACT_EMAIL}`}
                                className="w-10 h-10 border-[2px] border-black bg-yellow-400 flex items-center justify-center hover:bg-neon-green transition-colors shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <Mail size={20} className="text-black" strokeWidth={2.5} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-display text-black mb-4 uppercase italic">Quick Links</h4>
                        <ul className="space-y-2 text-gray-900 font-bold text-xs">
                            <li><a href="#tracks" className="hover:text-purple-primary transition-colors hover:underline">TRACKS</a></li>
                            <li><a href="#submission" className="hover:text-purple-primary transition-colors hover:underline">RULES</a></li>
                            <li><a href="#prizes" className="hover:text-purple-primary transition-colors hover:underline">PRIZES</a></li>
                            <li><a href="#timeline" className="hover:text-purple-primary transition-colors hover:underline">LOG</a></li>
                            <li><a href="#schedule" className="hover:text-purple-primary transition-colors hover:underline">PLAN</a></li>
                            <li><a href="#faq" className="hover:text-purple-primary transition-colors hover:underline">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-display text-black mb-4 uppercase italic">Location</h4>
                        <ul className="space-y-4 text-gray-900 font-bold text-xs">
                            <li className="flex gap-3">
                                <MapPin size={20} className="text-purple-primary shrink-0" strokeWidth={2.5} />
                                <span>{HACKATHON_CONFIG.LOCATION.NAME}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white font-bold text-sm uppercase tracking-widest bg-black px-4 py-1">
                        © 2026 {HACKATHON_CONFIG.COMPANY_NAME}. Organized by Team Challengers.
                    </p>
                    <div className="flex items-center gap-3 bg-black px-6 py-2 border-[2px] border-white/20">
                        <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_#84CC16]" />
                        <span className="text-xs text-white font-mono uppercase tracking-[0.2em]">System Status: Optimal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
