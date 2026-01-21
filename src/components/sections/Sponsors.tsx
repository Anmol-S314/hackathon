import React from 'react';

/**
 * Sponsors section to highlight partners.
 */
export default function Sponsors(): React.ReactElement {
    return (
        <section className="py-12 bg-[#1a0033] border-b-[4px] border-black">
            <div className="section-container text-center">
                <h2 className="text-4xl md:text-5xl font-display uppercase italic tracking-tighter mb-8 comic-outline text-white">
                    POWERED BY
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
                    {/* EdventureX Logo */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-yellow-400 rotate-3 border-[3px] border-black shadow-[6px_6px_0px_#000] -z-10 group-hover:rotate-6 transition-transform" />
                        <div className="bg-white border-[3px] border-black p-8">
                            <img
                                src="/assets/new/edventurex-Photoroom.png"
                                alt="EdventureX"
                                className="h-24 md:h-32 object-contain"
                            />
                        </div>
                    </div>

                    {/* Slogan */}
                    <div className="border-[3px] border-black p-6 bg-cyan-300 shadow-[6px_6px_0px_#000] rotate-[-2deg] max-w-sm">
                        <img
                            src="/assets/new/edventurex_slogan-Photoroom.png"
                            alt="EdventureX Motto"
                            className="w-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
