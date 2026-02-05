import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Environment, Float, Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

// Mecha-Cat (Robotic Style)
function MechaCat({ mouse, action, setRef, onPointerOver }) {
    const group = useRef();
    const headRef = useRef();
    const rightArmRef = useRef();

    useEffect(() => {
        if (setRef) setRef(group);
    }, [setRef]);

    // Memoize materials
    const materials = useMemo(() => ({
        body: <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.8} />, // Light Silver / Chrome
        joint: <meshStandardMaterial color="#1f1f1f" roughness={0.7} />,
        glow: <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
    }), []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Head Tracking
        if (headRef.current && action !== 'backflip' && action !== 'frontflip' && action !== 'jumping') {
            const targetX = (mouse.current[0] * Math.PI) / 6;
            const targetY = (mouse.current[1] * Math.PI) / 6;
            let lerpFactor = 0.1;

            if (action === 'irritated') {
                headRef.current.rotation.y = Math.sin(time * 20) * 0.5;
                headRef.current.rotation.x = 0;
            } else {
                headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, lerpFactor);
                headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetY, lerpFactor);
            }
        }

        // Waving
        if (action === 'waving' && rightArmRef.current) {
            // User requested to STOP leg movement during generic greeting.
            // Leaving block empty or simple reset to ensure no unwanted movement.
            rightArmRef.current.rotation.z = 0;
        }
    });

    return (
        <group ref={group} rotation={[0, -0.5, 0]} onPointerOver={onPointerOver}>
            {/* === HEAD GROUP === */}
            <group ref={headRef} position={[0, 0.8, 0.3]}>
                {/* Head Shape */}
                <Box args={[0.7, 0.6, 0.6]}>
                    {materials.body}
                </Box>

                {/* Eyes */}
                <mesh position={[-0.2, 0.1, 0.31]}>
                    <planeGeometry args={[0.15, 0.1]} />
                    {materials.glow}
                </mesh>
                <mesh position={[0.2, 0.1, 0.31]}>
                    <planeGeometry args={[0.15, 0.1]} />
                    {materials.glow}
                </mesh>

                {/* Ears */}
                <mesh position={[-0.25, 0.4, 0]} rotation={[0, 0, 0.3]}>
                    <coneGeometry args={[0.15, 0.4, 4]} />
                    {materials.body}
                </mesh>
                <mesh position={[0.25, 0.4, 0]} rotation={[0, 0, -0.3]}>
                    <coneGeometry args={[0.15, 0.4, 4]} />
                    {materials.body}
                </mesh>

                {/* Whiskers */}
                <mesh position={[0, -0.1, 0.35]}>
                    <boxGeometry args={[0.8, 0.02, 0.02]} />
                    {materials.glow}
                </mesh>
            </group>

            {/* === BODY === */}
            <group position={[0, 0, 0]}>
                {/* Main Torso */}
                <Cylinder args={[0.3, 0.4, 1, 8]} rotation={[Math.PI / 2, 0, 0]}>
                    {materials.body}
                </Cylinder>

                {/* Neck Connection */}
                <Cylinder args={[0.15, 0.15, 0.4]} position={[0, 0.4, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
                    {materials.joint}
                </Cylinder>
            </group>

            {/* === LEGS === */}
            {/* Front Left */}
            <group position={[-0.25, -0.4, 0.4]}>
                <Cylinder args={[0.08, 0.08, 0.6]} >{materials.body}</Cylinder>
                <Sphere args={[0.12]} position={[0, -0.3, 0.1]} >{materials.body}</Sphere>
            </group>

            {/* Front Right (Waving Arm Pivot) */}
            <group ref={rightArmRef} position={[0.25, -0.2, 0.4]}>
                <group position={[0, -0.2, 0]}> {/* Offset mesh to align with pivot */}
                    <Cylinder args={[0.08, 0.08, 0.6]} >{materials.body}</Cylinder>
                    <Sphere args={[0.12]} position={[0, -0.3, 0.1]} >{materials.body}</Sphere>
                </group>
            </group>

            {/* Back Legs (Updated to Cylinder Style) */}
            <group position={[-0.35, -0.4, -0.3]}>
                <Cylinder args={[0.08, 0.08, 0.6]} >{materials.body}</Cylinder>
                <Sphere args={[0.12]} position={[0, -0.3, 0.1]} >{materials.body}</Sphere>
            </group>
            <group position={[0.35, -0.4, -0.3]}>
                <Cylinder args={[0.08, 0.08, 0.6]} >{materials.body}</Cylinder>
                <Sphere args={[0.12]} position={[0, -0.3, 0.1]} >{materials.body}</Sphere>
            </group>

            {/* Tail */}
            <group position={[0, -0.2, -0.6]}>
                <mesh rotation={[0.5, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.02, 0.8]} />
                    {materials.body}
                </mesh>
                <mesh position={[0, 0.4, 0.1]}>
                    <sphereGeometry args={[0.08]} />
                    {materials.glow}
                </mesh>
            </group>
        </group>
    );
}

function CatAnimator({ action, children, catRef }) {
    useFrame((state) => {
        if (!catRef?.current) return;
        const time = state.clock.elapsedTime;

        if (action === 'idle') {
            catRef.current.rotation.x = THREE.MathUtils.lerp(catRef.current.rotation.x, 0, 0.05);
            catRef.current.position.y = THREE.MathUtils.lerp(catRef.current.position.y, 0, 0.05);
        }
        if (action === 'backflip') catRef.current.rotation.x -= 0.05;
        if (action === 'frontflip') catRef.current.rotation.x += 0.05;
        if (action === 'jumping') catRef.current.position.y = Math.sin(time * 10) * 0.5;
    });
    return <>{children}</>;
}

function EventListenerHandler({ mouse }) {
    useEffect(() => {
        const handleMouse = (e) => {
            mouse.current = [
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            ];
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);
    return null;
}

export default function ThreeDCat() {
    const mouse = useRef([0, 0]);
    const catRef = useRef();

    const [action, setAction] = useState('waving');
    const [message, setMessage] = useState('');

    const setCatRef = useCallback((ref) => {
        catRef.current = ref.current;
    }, []);

    useEffect(() => {
        let timers = [];
        const schedule = (fn, delay) => {
            const t = setTimeout(fn, delay);
            timers.push(t);
            return t;
        };

        setMessage("Hi, meow meow 🐱");
        setAction('waving');

        schedule(() => { setMessage(''); setAction('idle'); }, 3000);
        schedule(() => setAction('backflip'), 7000);
        schedule(() => setAction('idle'), 8500);
        schedule(() => setAction('frontflip'), 10500);
        schedule(() => setAction('idle'), 12000);
        schedule(() => setAction('jumping'), 14000);
        schedule(() => { setAction('idle'); startIdleLoop(); }, 15500);

        return () => timers.forEach(clearTimeout);
    }, []);

    const [idleLoopStarted, setIdleLoopStarted] = useState(false);
    const startIdleLoop = () => setIdleLoopStarted(true);

    useEffect(() => {
        if (!idleLoopStarted) return;
        const idleInterval = setInterval(() => {
            if (action === 'irritated' || action === 'waving') return;

            if (Math.random() > 0.5) {
                const moves = ['backflip', 'frontflip', 'jumping', 'waving'];
                const nextMove = moves[Math.floor(Math.random() * moves.length)];
                setAction(prev => (prev === 'idle' ? nextMove : prev));
                setTimeout(() => {
                    setAction(prev => (prev === 'irritated' ? 'irritated' : 'idle'));
                }, 2000);
            }
        }, 5000);
        return () => clearInterval(idleInterval);
    }, [idleLoopStarted, action]);

    const handlePointerOver = (e) => {
        e.stopPropagation();
        if (action !== 'irritated') {
            setAction('irritated');
            const irritations = ["Don't touch!", "Hiss!", "Meow!"];
            setMessage(irritations[Math.floor(Math.random() * irritations.length)]);
            setTimeout(() => {
                setAction('idle');
                setMessage('');
            }, 1000);
        }
    };

    const handleMouseMove = (event) => {
        mouse.current = [
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        ];
    };

    return (
        <div
            className="fixed bottom-0 right-0 w-80 h-80 md:w-96 md:h-96 z-[100] pointer-events-auto"
            onMouseMove={handleMouseMove}
        >
            {message && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-neon-green/50 text-white px-4 py-2 rounded-xl text-lg font-bold font-mono whitespace-nowrap pointer-events-none select-none shadow-[0_0_20px_rgba(74,222,128,0.3)] animate-pulse z-[60]">
                    {message}
                </div>
            )}

            <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={5} color="#ffffff" />
                <pointLight position={[-5, 5, 5]} intensity={1} color="#3b82f6" />

                <CatAnimator action={action} catRef={catRef}>
                    <MechaCat mouse={mouse} action={action} setRef={setCatRef} onPointerOver={handlePointerOver} />
                </CatAnimator>

                <Environment preset="city" />
            </Canvas>
            <EventListenerHandler mouse={mouse} />
        </div>
    );
}
