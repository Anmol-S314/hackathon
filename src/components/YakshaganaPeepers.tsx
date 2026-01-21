import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface PeeperColors {
    main: string;
    accent: string;
    secondary: string;
}

interface PeeperProps {
    side: 'left' | 'right';
    colors: PeeperColors;
}

/**
 * Interactive 3D Peeper component representing a stylized Yakshagana character.
 * Peeks from the corners and reacts to hover.
 */
function Peeper({ side, colors }: PeeperProps): React.ReactElement {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState<boolean>(false);

    const targetX = useMemo(function calculateTargetX() {
        if (side === 'left') {
            return hovered ? -6 : 1.5;
        }
        return hovered ? 6 : -1.5;
    }, [hovered, side]);

    useFrame(function updatePeeperAnimation(state, delta) {
        if (!meshRef.current) {
            return;
        }

        meshRef.current.position.x = THREE.MathUtils.lerp(
            meshRef.current.position.x,
            targetX,
            delta * 4
        );

        meshRef.current.position.y = -3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;

        const baseRotation = side === 'left' ? 0.4 : -0.4;
        const hideRotation = side === 'left' ? -0.8 : 0.8;

        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            hovered ? hideRotation : baseRotation,
            delta * 3
        );
    });

    return (
        <group>
            <group ref={meshRef} scale={2.5} position={[side === 'left' ? -4 : 4, -3, 0]}>
                <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
                    <Crown colors={colors} />
                    <ShoulderWings />
                    <ChestPlate />
                    <EarOrnaments />
                    <Face colors={colors} />
                    <FaceMask />
                    <Mustache colors={colors} />
                    <ChinDetail />
                </Float>
            </group>

            <HoverTrigger
                side={side}
                onHoverChange={setHovered}
            />
        </group>
    );
}

function Crown({ colors }: { colors: PeeperColors }): React.ReactElement {
    return (
        <group>
            <mesh position={[0, 0.7, -0.25]}>
                <torusGeometry args={[0.85, 0.08, 16, 100, Math.PI]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.7, -0.3]} scale={[1.1, 1.1, 1]}>
                <torusGeometry args={[0.85, 0.04, 16, 100, Math.PI]} />
                <meshStandardMaterial color="#FF4500" metalness={0.5} roughness={0.2} />
            </mesh>
            {[1.4, 1.1, 0.8, 0.55].map(function renderTier(y, i) {
                return (
                    <group key={y} position={[0, y, 0]}>
                        <mesh>
                            <cylinderGeometry args={[0.15 + i * 0.1, 0.2 + i * 0.15, 0.25, 32]} />
                            <meshStandardMaterial color={i % 2 === 0 ? colors.accent : "#FF0000"} metalness={0.9} roughness={0.1} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

function ShoulderWings(): React.ReactElement {
    return (
        <group position={[0, -0.3, -0.1]}>
            <mesh position={[-0.8, 0, 0]} rotation={[0, 0, 0.5]}>
                <boxGeometry args={[0.6, 0.8, 0.1]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[0.8, 0, 0]} rotation={[0, 0, -0.5]}>
                <boxGeometry args={[0.6, 0.8, 0.1]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>
        </group>
    );
}

function ChestPlate(): React.ReactElement {
    return (
        <group position={[0, -0.7, 0.2]} rotation={[0.2, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.4, 0.15, 6, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
            </mesh>
        </group>
    );
}

function EarOrnaments(): React.ReactElement {
    return (
        <>
            {[-0.55, 0.55].map(function renderEar(x) {
                return (
                    <group key={x} position={[x, 0.1, -0.1]} rotation={[0, Math.PI / 2, 0]}>
                        <mesh>
                            <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
                            <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                        </mesh>
                        <mesh position={[0, 0, 0.05]}>
                            <sphereGeometry args={[0.15]} />
                            <meshStandardMaterial color="#FF0000" />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
}

function Face({ colors }: { colors: PeeperColors }): React.ReactElement {
    return (
        <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1, 1.2, 0.7]} />
            <meshStandardMaterial color={colors.main} />
        </mesh>
    );
}

function FaceMask(): React.ReactElement {
    return (
        <>
            <mesh position={[0, 0.2, 0.36]}>
                <boxGeometry args={[0.85, 0.45, 0.05]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0.5, 0.36]}>
                <boxGeometry args={[0.15, 0.25, 0.06]} />
                <meshStandardMaterial color="#FF0000" />
            </mesh>
            {[-0.24, 0.24].map(function renderEye(x) {
                return (
                    <group key={x} position={[x, 0.2, 0.42]}>
                        <mesh>
                            <sphereGeometry args={[0.09, 16, 16]} />
                            <meshBasicMaterial color="black" />
                        </mesh>
                        <mesh position={[0, 0, 0.05]}>
                            <sphereGeometry args={[0.02]} />
                            <meshBasicMaterial color="white" />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
}

function Mustache({ colors }: { colors: PeeperColors }): React.ReactElement {
    return (
        <mesh position={[0, -0.15, 0.4]} rotation={[Math.PI, 0, 0]}>
            <torusGeometry args={[0.3, 0.1, 16, 32, Math.PI]} />
            <meshStandardMaterial color={colors.secondary} roughness={1} />
        </mesh>
    );
}

function ChinDetail(): React.ReactElement {
    return (
        <mesh position={[0, -0.4, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.4, 0.1, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
}

interface HoverTriggerProps {
    side: 'left' | 'right';
    onHoverChange: (hovered: boolean) => void;
}

function HoverTrigger({ side, onHoverChange }: HoverTriggerProps): React.ReactElement {
    return (
        <mesh
            position={[side === 'left' ? 1.5 : -1.5, -2, 0]}
            onPointerOver={() => onHoverChange(true)}
            onPointerOut={() => onHoverChange(false)}
            visible={false}
        >
            <boxGeometry args={[4, 12, 3]} />
        </mesh>
    );
}

function PeeperCanvas({ side, colors }: PeeperProps): React.ReactElement {
    return (
        <div
            className={`fixed bottom-0 ${side === 'left' ? 'left-0' : 'right-0'} z-[100] pointer-events-auto`}
            style={{ width: '450px', height: '90vh' }}
        >
            <Canvas shadows gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 12], fov: 40 }}>
                <ambientLight intensity={1.2} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <Peeper side={side} colors={colors} />
            </Canvas>
        </div>
    );
}

/**
 * Main component orchestrating both left and right peepers.
 */
export default function YakshaganaPeepers(): React.ReactElement {
    return (
        <>
            <PeeperCanvas
                side="left"
                colors={{ main: '#8B0000', accent: '#FFD700', secondary: '#000000' }}
            />
            <PeeperCanvas
                side="right"
                colors={{ main: '#FDBE15', accent: '#FFD700', secondary: '#FF69B4' }}
            />
        </>
    );
}
