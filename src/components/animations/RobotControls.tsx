import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { ActionType } from './VexCharacter';

/**
 * Shared styling for the comic-book style control buttons.
 */
const BUTTON_BASE_CLASS = "border-[3px] border-black p-2.5 shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer relative z-[130] group";

// Desktop adds hover effects that might not be needed on touch, but we can keep them consistent or split.
const DESKTOP_BUTTON_CLASS = `${BUTTON_BASE_CLASS} hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000]`;
const MOBILE_BUTTON_CLASS = `${BUTTON_BASE_CLASS} rounded-none`; // Mobile had rounded-none in Hero.tsx

interface ControlButtonProps {
    onClick: () => void;
    title: string;
    bgColor: string;
    icon: React.ReactNode;
    label?: string; // Desktop has tooltip-like labels
    isMobile?: boolean;
}

export function RobotControlButton({ onClick, title, bgColor, icon, label, isMobile = false }: ControlButtonProps): React.ReactElement {
    const className = isMobile ? MOBILE_BUTTON_CLASS : DESKTOP_BUTTON_CLASS;

    return (
        <button
            onClick={onClick}
            className={`${className} ${bgColor}`}
            title={title}
        >
            {icon}
            {label && !isMobile && (
                <span className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 ${bgColor} text-black text-[10px] font-display uppercase tracking-wider px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-black`}>
                    {label}
                </span>
            )}
        </button>
    );
}

interface VisibilityToggleProps {
    isVisible: boolean;
    onToggle: () => void;
    isMobile?: boolean;
}

export function VisibilityToggle({ isVisible, onToggle, isMobile = false }: VisibilityToggleProps): React.ReactElement {
    const className = isMobile
        ? `${MOBILE_BUTTON_CLASS} bg-white`
        : `${DESKTOP_BUTTON_CLASS} bg-white`;

    return (
        <button
            onClick={onToggle}
            className={className}
            title={isVisible ? "Hide Robot" : "Show Robot"}
        >
            {isVisible ? <EyeOff size={22} className="text-black" /> : <Eye size={22} className="text-purple-primary" />}
            {!isMobile && (
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-display uppercase tracking-wider px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/20">
                    {isVisible ? "Dismiss Vex" : "Summon Vex"}
                </span>
            )}
        </button>
    );
}

/**
 * Hook to handle robot action state with auto-reset.
 */
export function useRobotAction() {
    const [action, setAction] = React.useState<ActionType>('idle');

    const triggerAction = (newAction: ActionType) => {
        setAction(newAction);

        // Auto-reset logic moved here
        const duration = newAction === 'dance' ? 4000 : 2500;
        setTimeout(() => {
            setAction(prev => prev === newAction ? 'idle' : prev);
        }, duration);

        // Note: we don't return clear function here because this is a one-off trigger, 
        // but to be perfectly clean in React strict mode, we might want a useEffect. 
        // However, for this simple fire-and-forget, this is acceptable if we don't unmount immediately.
    };

    return { action, setAction, triggerAction };
}
