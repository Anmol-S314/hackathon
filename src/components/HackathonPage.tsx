import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hand, Music, Brain } from 'lucide-react';
import Hero from './sections/Hero';
import Tracks from './sections/Tracks';
import Prizes from './sections/Prizes';
import Timeline from './sections/Timeline';
import Schedule from './sections/Schedule';
import SubmissionRules from './sections/SubmissionRules';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import YakshaganaPeepersFrames from './YakshaganaPeepersFrames';
import VexCharacter from './animations/VexCharacter';
import type { ActionType } from './animations/VexCharacter';
import { RobotControlButton, VisibilityToggle } from './animations/RobotControls';
import AnnouncementPost from './AnnouncementPost';


/**
 * Main landing page for the VexStorm 26 Hackathon.
 * Follows a high-impact comic-book aesthetic with the "Silicon Beach" backdrop.
 */
export default function HackathonPage(): React.ReactElement {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);


    useEffect(function setupScrollListener(): () => void {
        function handleScroll(): void {
            setIsScrolled(window.scrollY > 50);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        return (): void => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-purple-dark min-h-screen relative overflow-x-hidden">
            <AnnouncementPost />


            {/* Global Hackathon Page Animations */}
            <YakshaganaPeepersFrames />
            {/* <DesktopRobotContainer /> */}


            <Navbar isScrolled={isScrolled} />

            <main className="relative z-[30] md:pt-0">
                <Hero />
                <Tracks />
                <SubmissionRules />
                <Prizes />
                <Timeline />
                <Schedule />
                <FAQ />
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}



interface NavbarProps {
    isScrolled: boolean;
}

function Navbar({ isScrolled }: NavbarProps): React.ReactElement {
    const navClasses = isScrolled
        ? 'bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] py-3'
        : 'bg-transparent py-6';

    return (
        <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${navClasses}`}>
            <div className="px-6 flex justify-between items-center">
                <Logo isScrolled={isScrolled} />
                <NavLinks isScrolled={isScrolled} />
                <MobileJoinButton />
            </div>
        </nav>
    );
}

function Logo({ isScrolled }: { isScrolled: boolean }): React.ReactElement {
    const logoColor = isScrolled ? 'text-black' : 'text-white';
    const yearColor = isScrolled ? 'text-purple-primary' : 'text-yellow-400';

    return (
        <Link to="/" className={`font-display text-3xl tracking-tighter transition-all ${logoColor}`}>
            <span className="text-pop">VEXSTORM'</span><span className={yearColor}>26</span>
        </Link>
    );
}

// Isolated component to handle conditional rendering of the heavy 3D robot on desktop
function DesktopRobotContainer(): React.ReactElement | null {
    const [isDesktop, setIsDesktop] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [action, setAction] = useState<ActionType>('idle');

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const triggerAction = (newAction: ActionType) => {
        setAction(newAction);
    };

    if (!isDesktop) return null;

    return (
        <div className="hidden lg:block fixed right-6 bottom-6 z-[120]">
            {/* Control Stack */}
            <div className="flex flex-col gap-3 items-center">
                <VisibilityToggle
                    isVisible={isVisible}
                    onToggle={() => setIsVisible(!isVisible)}
                    isMobile={false}
                />

                {isVisible && (
                    <>
                        <RobotControlButton
                            onClick={() => triggerAction('hi')}
                            title="Wave"
                            bgColor="bg-yellow-400"
                            icon={<Hand size={22} className="text-black" />}
                            label="Wave!"
                            isMobile={false}
                        />

                        <RobotControlButton
                            onClick={() => triggerAction('dance')}
                            title="Party"
                            bgColor="bg-pink-primary"
                            icon={<Music size={22} className="text-white" />}
                            label="Party!"
                            isMobile={false}
                        />

                        <RobotControlButton
                            onClick={() => triggerAction('thinking')}
                            title="Think"
                            bgColor="bg-cyan-400"
                            icon={<Brain size={22} className="text-black" />}
                            label="Think?"
                            isMobile={false}
                        />
                    </>
                )}
            </div>

            {/* Robot Container */}
            <div className={`fixed -right-16 xl:-right-8 2xl:-right-4 -bottom-32 z-[40] 
                lg:w-[320px] lg:h-[420px] 
                xl:w-[420px] xl:h-[520px] 
                2xl:w-[520px] 2xl:h-[620px] 
                pointer-events-none transition-all duration-700 ease-in-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}>
                <div className="w-full h-full">
                    <VexCharacter action={action} setAction={setAction} />
                </div>
            </div>
        </div>
    );
}
function NavLinks({ isScrolled }: { isScrolled: boolean }): React.ReactElement {
    const textColor = isScrolled ? 'text-black' : 'text-white';
    const btnClass = isScrolled
        ? 'btn-comic !py-2 !px-4 text-xs bg-purple-primary text-white'
        : 'btn-comic !py-2 !px-4 text-xs';

    return (
        <div className={`hidden md:flex items-center gap-4 lg:gap-8 text-base lg:text-md font-display uppercase italic ${textColor}`}>
            <a href="#tracks" className="hover:text-purple-primary transition-colors">Tracks</a>
            <a href="#submission" className="hover:text-purple-primary transition-colors">Rules</a>
            <a href="#prizes" className="hover:text-purple-primary transition-colors">Prizes</a>
            <a href="#timeline" className="hover:text-purple-primary transition-colors">Log</a>
            <a href="#schedule" className="hover:text-purple-primary transition-colors">Plan</a>
            <a href="#faq" className="hover:text-purple-primary transition-colors">FAQ</a>
            <Link to="/register" className={btnClass}>
                JOIN NOW
            </Link>
        </div>
    );
}

function MobileJoinButton(): React.ReactElement {
    return (
        <Link to="/register" className="md:hidden">
            <button className="btn-comic-primary !py-2 !px-4 text-xs">
                JOIN!
            </button>
        </Link>
    );
}