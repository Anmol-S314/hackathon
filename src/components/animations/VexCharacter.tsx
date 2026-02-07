import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Text, RoundedBox, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// --- Types ---
type ActionType = 'idle' | 'hi' | 'dance' | 'thinking';

interface RobotColors {
    primary: string;
    secondary: string;
    accent: string;
    screen: string;
    eye: string;
}

/**
 * Comic Bubble Component for Robot feedback.
 */
function ComicPopup({ text, color = "#FACC15" }: { text: string; color?: string }): React.ReactElement {
    return (
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false} position={[0, 3.5, 0]}>
                {/* Bubble Tail */}
                <mesh position={[0, -0.65, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.25, 0.25, 0.01]} />
                    <meshBasicMaterial color="black" />
                </mesh>
                <mesh position={[0, -0.63, 0.005]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.22, 0.22, 0.01]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                {/* Bubble Shape */}
                <mesh position={[0, 0, 0]} scale={[1.4, 1, 1]}>
                    <circleGeometry args={[0.8, 32]} />
                    <meshBasicMaterial color="black" />
                </mesh>
                <mesh position={[0, 0, 0.01]} scale={[1.36, 0.96, 1]}>
                    <circleGeometry args={[0.8, 32]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                <Text
                    position={[0, 0, 0.02]}
                    fontSize={0.35}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                </Text>
            </Billboard>
        </Float>
    );
}

interface RobotCharacterProps {
    action: ActionType;
    setAction: React.Dispatch<React.SetStateAction<ActionType>>;
}

/**
 * Procedural 3D Robot Character.
 * Improved for mobile touch interaction and stability.
 */
function RobotCharacter({ action, setAction }: RobotCharacterProps): React.ReactElement {
    const headRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);

    const [blink, setBlink] = useState<boolean>(false);
    const globalMouse = useRef({ x: 0, y: 0 });

    const colors: RobotColors = useMemo(() => ({
        primary: '#e2e8f0',
        secondary: '#334155',
        accent: '#22d3ee',
        screen: '#0f172a',
        eye: '#ffffff'
    }), []);

    useEffect(function setupInputListeners() {
        function handleMouseMove(e: MouseEvent): void {
            globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        }

        // Touch tracking for mobile
        function handleTouchMove(e: TouchEvent): void {
            if (e.touches[0]) {
                globalMouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
                globalMouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        }

        function handleKeyDown(e: KeyboardEvent): void {
            const key = e.key.toLowerCase();
            if (key === 'w') handleActionTrigger('hi');
            if (key === 'a') setAction('dance');
            if (key === 'd') handleActionTrigger('thinking');
        }

        function handleKeyUp(e: KeyboardEvent): void {
            if (e.key.toLowerCase() === 'a') setAction('idle');
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return (): void => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setAction]);

    // Auto-reset action to idle
    useEffect(() => {
        if (action === 'idle') return;

        const duration = action === 'dance' ? 4000 : 2500;
        const timer = setTimeout(() => {
            setAction((prev) => (prev === action ? 'idle' : prev));
        }, duration);

        return () => clearTimeout(timer);
    }, [action, setAction]);

    useEffect(function handleBlinkLoop() {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleActionTrigger = (newAction: ActionType): void => {
        setAction(newAction);
    };

    useFrame(function animateRobot(state, delta) {
        if (!headRef.current || !rightArmRef.current || !leftArmRef.current || !bodyRef.current) return;

        const time = state.clock.elapsedTime;
        const dt = Math.min(delta, 0.1); // Clamp delta to 100ms max to prevent jumps after tab sleep

        // Head Tracking
        const targetX = (-globalMouse.current.y * Math.PI) / 10;
        const targetY = (globalMouse.current.x * Math.PI) / 8;

        if (action !== 'dance' && action !== 'thinking') {
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, dt * 5);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetX, dt * 5);
        } else {
            // Return head to center during special animations
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, dt * 2);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, dt * 2);
        }

        // Float motion
        bodyRef.current.position.y = 0.5 + Math.sin(time * 2) * 0.05;

        // Arm Rotations
        let lRot = [0, 0, 0.1];
        let rRot = [0, 0, -0.1];

        switch (action) {
            case 'hi':
                rRot = [0, 0, 2.5 + Math.sin(time * 15) * 0.4];
                break;
            case 'dance':
                bodyRef.current.position.y = 0.5 + Math.abs(Math.sin(time * 10)) * 0.2;
                bodyRef.current.rotation.y += dt * 5;
                lRot = [0, 0, -2.3 + Math.sin(time * 12) * 0.3];
                rRot = [0, 0, 2.3 - Math.sin(time * 12) * 0.3];
                break;
            case 'thinking':
                rRot = [-2.4, -0.5 + Math.sin(time * 8) * 0.1, -0.2];
                bodyRef.current.rotation.z = Math.sin(time) * 0.05;
                break;
            case 'idle':
                lRot = [Math.sin(time) * 0.1, 0, 0.1];
                rRot = [Math.sin(time + 1) * 0.1, 0, -0.1];
                break;
        }

        // Smooth Lerping
        leftArmRef.current.rotation.set(
            THREE.MathUtils.lerp(leftArmRef.current.rotation.x, lRot[0], 0.1),
            THREE.MathUtils.lerp(leftArmRef.current.rotation.y, lRot[1], 0.1),
            THREE.MathUtils.lerp(leftArmRef.current.rotation.z, lRot[2], 0.1)
        );
        rightArmRef.current.rotation.set(
            THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rRot[0], 0.1),
            THREE.MathUtils.lerp(rightArmRef.current.rotation.y, rRot[1], 0.1),
            THREE.MathUtils.lerp(rightArmRef.current.rotation.z, rRot[2], 0.1)
        );
    });

    return (
        <group position={[0, -2, 0]} scale={1.3}>
            <group ref={bodyRef}>
                {/* --- Torso --- */}
                <RoundedBox args={[0.7, 0.8, 0.5]} radius={0.1} smoothness={4} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color={colors.primary} roughness={0.3} metalness={0.1} />
                </RoundedBox>

                {/* Chest Buttons (RGB Indicators) */}
                <mesh position={[-0.15, 0.6, 0.26]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh position={[0, 0.6, 0.26]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
                </mesh>
                <mesh position={[0.15, 0.6, 0.26]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} toneMapped={false} />
                </mesh>

                {/* --- Head Group --- */}
                <group ref={headRef} position={[0, 1.0, 0]}>
                    {/* Main Head Shape */}
                    <RoundedBox args={[0.9, 0.8, 0.7]} radius={0.15} position={[0, 0.4, 0]}>
                        <meshStandardMaterial color={colors.primary} roughness={0.2} metalness={0.1} />
                    </RoundedBox>

                    {/* Face Screen Bezel (Glowing) */}
                    <RoundedBox args={[0.82, 0.72, 0.04]} radius={0.08} position={[0, 0.4, 0.35]}>
                        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.5} />
                    </RoundedBox>

                    {/* Face Screen */}
                    <RoundedBox args={[0.7, 0.6, 0.06]} radius={0.02} position={[0, 0.4, 0.37]}>
                        <meshStandardMaterial color={colors.screen} roughness={0.2} />
                    </RoundedBox>

                    {/* Eyes */}
                    <group position={[0, 0.4, 0.41]}>
                        <mesh position={[-0.18, 0.05, 0]} scale={[1, blink ? 0.1 : 1, 1]}>
                            <capsuleGeometry args={[0.08, 0.05, 4, 8]} />
                            <meshStandardMaterial color={colors.eye} emissive={colors.eye} emissiveIntensity={2} toneMapped={false} />
                        </mesh>
                        <mesh position={[0.18, 0.05, 0]} scale={[1, blink ? 0.1 : 1, 1]}>
                            <capsuleGeometry args={[0.08, 0.05, 4, 8]} />
                            <meshStandardMaterial color={colors.eye} emissive={colors.eye} emissiveIntensity={2} toneMapped={false} />
                        </mesh>
                    </group>

                    {/* Headphones/Ears */}
                    <mesh position={[0.5, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                        <meshStandardMaterial color={colors.secondary} />
                    </mesh>
                    <mesh position={[-0.5, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                        <meshStandardMaterial color={colors.secondary} />
                    </mesh>
                </group>

                {/* --- Arms --- */}
                <group ref={leftArmRef} position={[-0.43, 0.8, 0]}>
                    <mesh position={[0, -0.3, 0]}>
                        <RoundedBox args={[0.25, 0.6, 0.25]} radius={0.05}><meshStandardMaterial color={colors.primary} /></RoundedBox>
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color={colors.secondary} />
                    </mesh>
                </group>
                <group ref={rightArmRef} position={[0.43, 0.8, 0]}>
                    <mesh position={[0, -0.3, 0]}>
                        <RoundedBox args={[0.25, 0.6, 0.25]} radius={0.05}><meshStandardMaterial color={colors.primary} /></RoundedBox>
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color={colors.secondary} />
                    </mesh>
                </group>

                {/* --- Legs --- */}
                <group position={[-0.2, 0.1, 0]}>
                    <RoundedBox args={[0.25, 0.4, 0.25]} radius={0.05} smoothness={4}>
                        <meshStandardMaterial color={colors.primary} />
                    </RoundedBox>
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.2]} />
                        <meshStandardMaterial color={colors.secondary} />
                    </mesh>
                </group>
                <group position={[0.2, 0.1, 0]}>
                    <RoundedBox args={[0.25, 0.4, 0.25]} radius={0.05} smoothness={4}>
                        <meshStandardMaterial color={colors.primary} />
                    </RoundedBox>
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.2]} />
                        <meshStandardMaterial color={colors.secondary} />
                    </mesh>
                </group>
            </group>

            {/* Status Popups */}
            {action === 'hi' && <ComicPopup text="HI!" color="#FACC15" />}
            {action === 'dance' && <ComicPopup text="PARTAAAY!" color="#EC4899" />}
            {action === 'thinking' && <ComicPopup text="HMMM..." color="#22D3EE" />}
        </group>
    );
}

/**
 * Main Robot Interaction Wrapper.
 * Adds touch-to-interact logic for mobile users.
 */
export default function VexCharacter({
    action,
    setAction
}: {
    action: ActionType;
    setAction: (action: ActionType | ((prev: ActionType) => ActionType)) => void;
}): React.ReactElement {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    const actions: ActionType[] = ['hi', 'dance', 'thinking'];

    const dragStart = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    function handlePointerDown(e: React.PointerEvent): void {
        dragStart.current = { x: e.clientX, y: e.clientY };
    }

    function triggerRandomAction(e: React.MouseEvent): void {
        const dist = Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y);
        if (dist > 5) return; // Ignore drags (rotations)

        const randomIndex = Math.floor(Math.random() * actions.length);
        const newAction = actions[randomIndex];
        setAction(newAction);
    }

    return (
        <div
            className="w-full h-full lg:w-[400px] lg:h-[600px] lg:absolute lg:right-0 lg:bottom-0 relative pointer-events-auto cursor-grab active:cursor-grabbing"
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={handlePointerDown}
            onClick={triggerRandomAction}
        >
            <Canvas shadows gl={{ alpha: true, antialias: true }} camera={{ position: [0, 1, 9], fov: 40 }}>
                <ambientLight intensity={0.6} />
                <spotLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, 0, -10]} intensity={0.5} color="#22d3ee" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <RobotCharacter action={action} setAction={setAction} />
                </Float>

                <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.2} />
            </Canvas>

        </div>
    );
}

export type { ActionType };
