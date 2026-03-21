import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Environment, Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════
   ThreeDCat — Interactive Pet Cat System 🐱
   
   Keyboard controls:
     E → Feed 🐟     P → Pet ❤️      T → Yarn toy 🧶
     Z → Sleep 😴    M → Meow 💬
     W → Wave 👋     J → Jump 🦘
     B → Backflip 🤸 F → Front flip 🔄
     D → Dance 🕺
   
   Mouse: hover shows keybind guide popup, tail sways,
          click to pet, double-click for spin.
   
   Mood: Happy 😸 / Neutral 🐱 / Hungry 😿 (every 30s)
═══════════════════════════════════════════════════════════ */

// ── Keybind guide data for hover popup ───────────────────
const KEYBINDS = [
    { key: 'E', label: 'Feed the cat 🐟' },
    { key: 'P', label: 'Pet the cat ❤️' },
    { key: 'T', label: 'Throw yarn toy 🧶' },
    { key: 'Z', label: 'Sleep / Wake up 😴' },
    { key: 'M', label: 'Meow (random) 💬' },
    { key: 'W', label: 'Wave paw 👋' },
    { key: 'J', label: 'Jump 🦘' },
    { key: 'B', label: 'Backflip 🤸' },
    { key: 'F', label: 'Front flip 🔄' },
    { key: 'D', label: 'Dance 🕺' },
];

// ── 3D Cat Mesh ──────────────────────────────────────────
function MechaCat({ mouse, action, setRef, onPointerOver, onPointerOut, onPointerDown, onDoubleClick, isBlinking }) {
    const group    = useRef();
    const headRef  = useRef();
    const rightArmRef = useRef();
    const tailRef  = useRef();

    useEffect(() => {
        if (setRef) setRef(group);
    }, [setRef]);

    const materials = useMemo(() => ({
        body:       <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.8} />,
        joint:      <meshStandardMaterial color="#1f1f1f" roughness={0.7} />,
        glow:       <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />,
        eyeClosed:  <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.5} toneMapped={false} />,
    }), []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Head tracking
        if (headRef.current && !['backflip','frontflip','jumping','spin','dance'].includes(action)) {
            if (action === 'irritated') {
                headRef.current.rotation.y = Math.sin(time * 20) * 0.5;
                headRef.current.rotation.x = 0;
            } else if (action === 'eating') {
                headRef.current.rotation.x = Math.sin(time * 8) * 0.3;
            } else if (action === 'waving') {
                headRef.current.rotation.y = Math.sin(time * 3) * 0.2;
            } else {
                const tx = (mouse.current[0] * Math.PI) / 6;
                const ty = (mouse.current[1] * Math.PI) / 6;
                headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, tx, 0.1);
                headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -ty, 0.1);
            }
        }

        // Tail: always sways gently; faster when happy/hover
        if (tailRef.current) {
            const speed  = (action === 'happy' || action === 'hover') ? 6 : 2.5;
            const amount = (action === 'happy' || action === 'hover') ? 0.6 : 0.25;
            tailRef.current.rotation.z = Math.sin(time * speed) * amount;
        }

        // Waving arm — raise and wave L/R
        if (action === 'waving' && rightArmRef.current) {
            rightArmRef.current.rotation.z = Math.sin(time * 8) * 0.6 - 1.2;
        } else if (rightArmRef.current && action !== 'waving') {
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.1);
        }

        // Dance: shimmy left-right
        if (action === 'dance' && group.current) {
            group.current.rotation.y = Math.sin(time * 8) * 0.4;
        }

        // Spin (double-click)
        if (action === 'spin' && group.current) {
            group.current.rotation.y += 0.12;
        }
    });

    // Eye geometry — slim when blinking, happy, or sleeping
    const eyeClose = isBlinking || action === 'happy' || action === 'sleeping';
    const eyeArgs  = eyeClose ? [0.15, 0.02] : [0.15, 0.1];

    return (
        <group
            ref={group}
            rotation={[0, -0.5, 0]}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onPointerDown={onPointerDown}
            onDoubleClick={onDoubleClick}
        >
            {/* HEAD */}
            <group ref={headRef} position={[0, 0.8, 0.3]}>
                <Box args={[0.7, 0.6, 0.6]}>{materials.body}</Box>
                <mesh position={[-0.2, 0.1, 0.31]}>
                    <planeGeometry args={eyeArgs} />
                    {materials.glow}
                </mesh>
                <mesh position={[0.2, 0.1, 0.31]}>
                    <planeGeometry args={eyeArgs} />
                    {materials.glow}
                </mesh>
                <mesh position={[-0.25, 0.4, 0]} rotation={[0, 0, 0.3]}>
                    <coneGeometry args={[0.15, 0.4, 4]} />{materials.body}
                </mesh>
                <mesh position={[0.25, 0.4, 0]} rotation={[0, 0, -0.3]}>
                    <coneGeometry args={[0.15, 0.4, 4]} />{materials.body}
                </mesh>
                <mesh position={[0, -0.1, 0.35]}>
                    <boxGeometry args={[0.8, 0.02, 0.02]} />{materials.glow}
                </mesh>
            </group>

            {/* BODY */}
            <group position={[0, 0, 0]}>
                <Cylinder args={[0.3, 0.4, 1, 8]} rotation={[Math.PI / 2, 0, 0]}>{materials.body}</Cylinder>
                <Cylinder args={[0.15, 0.15, 0.4]} position={[0, 0.4, 0.2]} rotation={[Math.PI / 4, 0, 0]}>{materials.joint}</Cylinder>
            </group>

            {/* LEGS */}
            <group position={[-0.25, -0.4, 0.4]}>
                <Cylinder args={[0.08, 0.08, 0.6]}>{materials.body}</Cylinder>
                <Sphere args={[0.12]} position={[0, -0.3, 0.1]}>{materials.body}</Sphere>
            </group>
            <group ref={rightArmRef} position={[0.25, -0.2, 0.4]}>
                <group position={[0, -0.2, 0]}>
                    <Cylinder args={[0.08, 0.08, 0.6]}>{materials.body}</Cylinder>
                    <Sphere args={[0.12]} position={[0, -0.3, 0.1]}>{materials.body}</Sphere>
                </group>
            </group>
            <group position={[-0.35, -0.4, -0.3]}>
                <Cylinder args={[0.08, 0.08, 0.6]}>{materials.body}</Cylinder>
                <Sphere args={[0.12]} position={[0, -0.3, 0.1]}>{materials.body}</Sphere>
            </group>
            <group position={[0.35, -0.4, -0.3]}>
                <Cylinder args={[0.08, 0.08, 0.6]}>{materials.body}</Cylinder>
                <Sphere args={[0.12]} position={[0, -0.3, 0.1]}>{materials.body}</Sphere>
            </group>

            {/* TAIL — always present, animated via ref in useFrame */}
            <group ref={tailRef} position={[0, -0.2, -0.6]}>
                <mesh rotation={[0.5, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.02, 0.8]} />{materials.body}
                </mesh>
                <mesh position={[0, 0.4, 0.1]}>
                    <sphereGeometry args={[0.08]} />{materials.glow}
                </mesh>
            </group>
        </group>
    );
}

// ── Cat body / position animator ────────────────────────
function CatAnimator({ action, children, catRef }) {
    useFrame((state) => {
        if (!catRef?.current) return;
        const time = state.clock.elapsedTime;

        if (['idle','happy','hover','waving','eating','dance'].includes(action)) {
            catRef.current.rotation.x = THREE.MathUtils.lerp(catRef.current.rotation.x, 0, 0.05);
            catRef.current.position.y = THREE.MathUtils.lerp(catRef.current.position.y, 0, 0.05);
        }
        if (action === 'backflip')  catRef.current.rotation.x -= 0.05;
        if (action === 'frontflip') catRef.current.rotation.x += 0.05;
        // Jump: quick up then back down
        if (action === 'jumping')   catRef.current.position.y = Math.sin(time * 10) * 0.5;
        if (action === 'sleeping')  catRef.current.rotation.z = THREE.MathUtils.lerp(catRef.current.rotation.z, 0.18, 0.05);
        if (action !== 'sleeping')  catRef.current.rotation.z = THREE.MathUtils.lerp(catRef.current.rotation.z, 0, 0.05);
    });
    return <>{children}</>;
}

// ── Mouse/keyboard global listener inside Canvas ─────────
function EventListenerHandler({ mouse }) {
    useEffect(() => {
        const h = (e) => {
            mouse.current = [
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
            ];
        };
        window.addEventListener('mousemove', h);
        return () => window.removeEventListener('mousemove', h);
    }, []);
    return null;
}

// ── Floating label ("+1 Fed", "+1 Petted", "Hi!", etc.) ─
const FloatingText = ({ id, text, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 1800);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div
            className="absolute left-1/2 pointer-events-none select-none font-bold text-sm z-50"
            style={{
                transform: 'translateX(-50%)',
                top: '18%',
                animation: 'floatUp 1.8s ease-out forwards',
                color: '#4ade80',
                textShadow: '0 0 10px rgba(74,222,128,0.8)',
            }}
        >
            {text}
        </div>
    );
};

// ── Enhanced burst heart — varied sizes/colors/arcs ─────
const HEART_COLORS  = ['#ff4d6d', '#ff85a1', '#ff3cac', '#ff6b6b', '#ff9f9f'];
const BurstHeart = ({ id, onDone }) => {
    // Random arc direction: angle in degrees, distance
    const angle  = Math.random() * 360;
    const dist   = 55 + Math.random() * 55;   // px
    const size   = 28 + Math.random() * 20;   // 28-48px font size
    const color  = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    const startX = 35 + Math.random() * 30;   // 35-65% horizontal start
    const startY = 35 + Math.random() * 25;   // 35-60% vertical start

    useEffect(() => {
        const t = setTimeout(onDone, 1600);
        return () => clearTimeout(t);
    }, [onDone]);

    const dx = Math.cos((angle * Math.PI) / 180) * dist;
    const dy = Math.sin((angle * Math.PI) / 180) * dist;

    return (
        <div
            className="absolute pointer-events-none select-none z-50"
            style={{
                left: `${startX}%`,
                top: `${startY}%`,
                fontSize: `${size}px`,
                color,
                animation: `heartBurst 1.5s ease-out forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
            }}
        >
            ❤️
        </div>
    );
};

// ── Zzz during sleep ─────────────────────────────────────
const Zzz = ({ id, onDone }) => {
    const left = 55 + Math.random() * 20;
    useEffect(() => {
        const t = setTimeout(onDone, 2200);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div
            className="absolute pointer-events-none select-none font-bold text-neon-green z-50"
            style={{
                left: `${left}%`, top: '10%',
                fontSize: `${12 + Math.random() * 8}px`,
                animation: 'floatUp 2.2s ease-out forwards',
                opacity: 0.9,
            }}
        >
            z
        </div>
    );
};

// ── Music note during dance ──────────────────────────────
const MusicNote = ({ id, onDone }) => {
    const left  = 15 + Math.random() * 70;
    const note  = Math.random() > 0.5 ? '🎵' : '🎶';
    useEffect(() => {
        const t = setTimeout(onDone, 1600);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div
            className="absolute pointer-events-none select-none z-50 text-xl"
            style={{
                left: `${left}%`, bottom: '55%',
                animation: 'floatUp 1.6s ease-out forwards',
            }}
        >
            {note}
        </div>
    );
};

// ── Yarn ball toy ────────────────────────────────────────
const YarnBall = ({ visible, onDone }) => {
    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(onDone, 2600);
        return () => clearTimeout(t);
    }, [visible, onDone]);
    if (!visible) return null;
    return (
        <div
            className="absolute pointer-events-none select-none text-3xl z-40"
            style={{ bottom: '15%', right: '5%', animation: 'yarnRoll 2.6s ease-in-out forwards' }}
        >
            🧶
        </div>
    );
};

// ── Extra-subtle screen flash on feed ───────────────────
const FeedFlash = ({ visible }) => (
    <div
        className="fixed inset-0 pointer-events-none z-[200]"
        style={{
            background: 'rgba(255,180,200,0.08)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.1s ease',
        }}
        aria-hidden="true"
    />
);

// ── Mood emoji ───────────────────────────────────────────
const MOODS = { happy: '😸', neutral: '🐱', hungry: '😿' };
const MoodDot = ({ mood }) => (
    <div
        className="absolute left-1/2 -translate-x-1/2 top-2 text-base pointer-events-none select-none z-50"
        style={{ animation: mood === 'hungry' ? 'moodBounce 0.6s ease-in-out infinite alternate' : 'none' }}
    >
        {MOODS[mood]}
    </div>
);

// ── Hover keybind popup ──────────────────────────────────
const KeybindPopup = ({ visible }) => (
    <div
        className="absolute right-full top-1/2 -translate-y-1/2 mr-3 pointer-events-none select-none z-[110]"
        style={{
            opacity: visible ? 1 : 0,
            transform: `translateY(-50%) translateX(${visible ? 0 : 12}px)`,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
    >
        <div
            className="bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[220px] shadow-2xl"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)' }}
        >
            <p className="text-white font-bold text-sm mb-3 border-b border-white/10 pb-2">
                🐾 Cat Controls
            </p>
            <div className="space-y-1.5">
                {KEYBINDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-xs text-gray-300">
                        {/* Keyboard key badge */}
                        <kbd
                            className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md font-bold text-xs"
                            style={{
                                background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)',
                                border: '1px solid #555',
                                borderBottomWidth: '2px',
                                color: '#4ade80',
                                fontFamily: 'monospace',
                                boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
                            }}
                        >
                            {key}
                        </kbd>
                        <span className="text-gray-400">→</span>
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Meow phrases ─────────────────────────────────────────
const MEOW_PHRASES = [
    'meow~', 'hire my human!', 'purrr...', 'pet me pls 🥺',
    '*stares at your code*', 'meow? 🐾',
];
let phraseIdx = 0;

// ══════════════════════════════════════════════════════════
//  Main Component
// ══════════════════════════════════════════════════════════
export default function ThreeDCat() {
    const mouse      = useRef([0, 0]);
    const catRef     = useRef();
    const zzzTimer   = useRef(null);
    const notesTimer = useRef(null);
    const blinkTimer = useRef(null);
    const busyTimer  = useRef(null);   // prevents input conflict for 0.5s

    const [action,     setAction]      = useState('waving');
    const [message,    setMessage]     = useState('Hi, meow meow 🐱');
    const [mood,       setMood]        = useState('neutral');
    const [sleeping,   setSleeping]    = useState(false);
    const [isBusy,     setIsBusy]      = useState(false);
    const [isBlinking, setIsBlinking]  = useState(false);
    const [isHover,    setIsHover]     = useState(false);
    const [flashFeed,  setFlashFeed]   = useState(false);

    const [floats,     setFloats]      = useState([]);  // [{id, text}]
    const [bursts,     setBursts]      = useState([]);  // [{id}] – big hearts
    const [zzzs,       setZzzs]        = useState([]);  // [{id}]
    const [notes,      setNotes]       = useState([]);  // [{id}] – music notes
    const [yarnVisible, setYarnVisible] = useState(false);
    const [showHint,   setShowHint]    = useState(false);

    const setCatRef = useCallback((ref) => { catRef.current = ref.current; }, []);

    // ── Helper: add floating particles ──────────────────
    const addFloat  = useCallback((text) => setFloats(p => [...p, { id: Date.now() + Math.random(), text }]), []);
    const addBurst  = useCallback(() => setBursts(p => [...p, { id: Date.now() + Math.random() }]), []);
    const addZzz    = useCallback(() => setZzzs(p => [...p, { id: Date.now() + Math.random() }]), []);
    const addNote   = useCallback(() => setNotes(p => [...p, { id: Date.now() + Math.random() }]), []);

    // ── Helper: lock inputs briefly to prevent conflicts ─
    const lockBusy = useCallback((ms = 500) => {
        setIsBusy(true);
        clearTimeout(busyTimer.current);
        busyTimer.current = setTimeout(() => setIsBusy(false), ms);
    }, []);

    // ── Happy mood ───────────────────────────────────────
    const goHappy = useCallback(() => {
        setMood('happy');
        setTimeout(() => setMood(m => m === 'happy' ? 'neutral' : m), 20000);
    }, []);

    // ── Zzz emitter while sleeping ───────────────────────
    useEffect(() => {
        if (sleeping) {
            zzzTimer.current = setInterval(addZzz, 900);
        } else {
            clearInterval(zzzTimer.current);
        }
        return () => clearInterval(zzzTimer.current);
    }, [sleeping, addZzz]);

    // ── Hunger timer ─────────────────────────────────────
    useEffect(() => {
        const iv = setInterval(() => setMood(m => m !== 'happy' ? 'hungry' : m), 30000);
        return () => clearInterval(iv);
    }, []);

    // ── Random blink every 4–8 seconds ───────────────────
    useEffect(() => {
        const scheduleBlink = () => {
            const delay = 4000 + Math.random() * 4000;
            blinkTimer.current = setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => { setIsBlinking(false); scheduleBlink(); }, 200);
            }, delay);
        };
        scheduleBlink();
        return () => clearTimeout(blinkTimer.current);
    }, []);

    // ── Initial greeting sequence ─────────────────────────
    useEffect(() => {
        const timers = [];
        const s = (fn, d) => { const t = setTimeout(fn, d); timers.push(t); };
        s(() => { setMessage(''); setAction('idle'); }, 3000);
        s(() => setAction('backflip'),  7000);
        s(() => setAction('idle'),      8500);
        s(() => setAction('frontflip'), 10500);
        s(() => setAction('idle'),      12000);
        s(() => setAction('jumping'),   14000);
        s(() => { setAction('idle'); setLoopStarted(true); }, 15500);
        return () => timers.forEach(clearTimeout);
    }, []);

    const [loopStarted, setLoopStarted] = useState(false);

    useEffect(() => {
        if (!loopStarted) return;
        const iv = setInterval(() => {
            if (sleeping || isBusy) return;
            if (['irritated','waving','dance'].includes(action)) return;
            if (Math.random() > 0.5) {
                const moves = ['backflip', 'frontflip', 'jumping', 'waving'];
                const next  = moves[Math.floor(Math.random() * moves.length)];
                setAction(prev => prev === 'idle' ? next : prev);
                setTimeout(() => setAction(prev => prev === 'irritated' ? 'irritated' : 'idle'), 2000);
            }
        }, 5000);
        return () => clearInterval(iv);
    }, [loopStarted, action, sleeping, isBusy]);

    // ── Hint tooltip (shown once) ─────────────────────────
    useEffect(() => {
        if (!localStorage.getItem('cat-hint-seen')) {
            setShowHint(true);
            setTimeout(() => {
                setShowHint(false);
                localStorage.setItem('cat-hint-seen', '1');
            }, 4000);
        }
    }, []);

    // ── Pet action ────────────────────────────────────────
    const petCat = useCallback(() => {
        if (sleeping || isBusy) return;
        lockBusy();
        setAction('happy');
        goHappy();
        // 3 quick bursts of hearts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => { for (let j = 0; j < 3; j++) addBurst(); }, i * 150);
        }
        addFloat('+1 Petted 💕');
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(60, ctx.currentTime);
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
            osc.start(); osc.stop(ctx.currentTime + 0.8);
        } catch (_) {}
        setTimeout(() => setAction('idle'), 2000);
    }, [sleeping, isBusy, lockBusy, goHappy, addBurst, addFloat]);

    // ── Feed action ───────────────────────────────────────
    const feedCat = useCallback(() => {
        if (sleeping || isBusy) return;
        lockBusy(2600);
        setAction('eating');
        addFloat('+1 Fed 🐟');
        goHappy();
        // Burst 10–12 hearts outward
        const count = 10 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            setTimeout(() => addBurst(), i * 80);
        }
        // Subtle screen flash
        setFlashFeed(true);
        setTimeout(() => setFlashFeed(false), 120);
        setTimeout(() => setAction('idle'), 2500);
    }, [sleeping, isBusy, lockBusy, goHappy, addBurst, addFloat]);

    // ── Keyboard handler ─────────────────────────────────
    useEffect(() => {
        const onKey = (e) => {
            // Any key wakes sleeping cat (except Z toggle)
            if (sleeping && e.key.toLowerCase() !== 'z') {
                setSleeping(false);
                setAction('idle');
                return;
            }
            if (isBusy) return;

            switch (e.key.toLowerCase()) {
                case 'e': feedCat(); break;

                case 'p': petCat(); break;

                case 't': { // Yarn toy
                    lockBusy(2700);
                    setYarnVisible(true);
                    setAction('jumping');
                    setTimeout(() => setAction('idle'), 2700);
                    break;
                }

                case 'z': { // Sleep toggle
                    setSleeping(prev => {
                        if (prev) { setAction('idle'); return false; }
                        setAction('sleeping');
                        return true;
                    });
                    break;
                }

                case 'm': { // Meow
                    if (sleeping) return;
                    const phrase = MEOW_PHRASES[phraseIdx % MEOW_PHRASES.length];
                    phraseIdx++;
                    setMessage(phrase);
                    setTimeout(() => setMessage(''), 2500);
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain); gain.connect(ctx.destination);
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(80, ctx.currentTime);
                        osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.1);
                        gain.gain.setValueAtTime(0.05, ctx.currentTime);
                        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
                        osc.start(); osc.stop(ctx.currentTime + 0.5);
                    } catch (_) {}
                    break;
                }

                case 'w': { // Wave
                    lockBusy(2500);
                    setAction('waving');
                    setMessage('Hi! 👋');
                    setTimeout(() => { setMessage(''); setAction('idle'); }, 2000);
                    break;
                }

                case 'j': { // Jump
                    lockBusy(2000);
                    setAction('jumping');
                    setTimeout(() => setAction('idle'), 1800);
                    break;
                }

                case 'b': { // Backflip
                    lockBusy(2200);
                    setAction('backflip');
                    addFloat('Woah! 😲');
                    setTimeout(() => setAction('idle'), 2000);
                    break;
                }

                case 'f': { // Front flip
                    lockBusy(2200);
                    setAction('frontflip');
                    addFloat('Wheee! 🌀');
                    setTimeout(() => setAction('idle'), 2000);
                    break;
                }

                case 'd': { // Dance for 3s with music notes every 400ms
                    lockBusy(3200);
                    setAction('dance');
                    clearInterval(notesTimer.current);
                    notesTimer.current = setInterval(addNote, 400);
                    setTimeout(() => {
                        clearInterval(notesTimer.current);
                        setAction('idle');
                    }, 3000);
                    break;
                }

                default: break;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [sleeping, isBusy, feedCat, petCat, lockBusy, addBurst, addFloat, addNote]);

    // ── Pointer events ────────────────────────────────────
    const handlePointerOver = useCallback((e) => {
        e.stopPropagation();
        setIsHover(true);
        if (!sleeping && !['irritated','eating','dance'].includes(action)) {
            setAction('hover');
        }
    }, [sleeping, action]);

    const handlePointerOut = useCallback(() => {
        setIsHover(false);
        if (action === 'hover') setAction('idle');
    }, [action]);

    const handlePointerDown = useCallback((e) => {
        e.stopPropagation();
        if (!sleeping && action !== 'irritated') {
            petCat();
        } else if (!sleeping) {
            const irritations = ["Don't touch!", "Hiss!", "Meow!"];
            setMessage(irritations[Math.floor(Math.random() * irritations.length)]);
            setTimeout(() => setMessage(''), 1000);
        }
    }, [sleeping, action, petCat]);

    const handleDoubleClick = useCallback((e) => {
        e.stopPropagation();
        if (sleeping || isBusy) return;
        lockBusy(1300);
        setAction('spin');
        setTimeout(() => setAction('idle'), 1200);
    }, [sleeping, isBusy, lockBusy]);

    const handleMouseMove = (e) => {
        mouse.current = [
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
        ];
    };

    return (
        <>
            {/* Screen flash on feed */}
            <FeedFlash visible={flashFeed} />

            <div
                className="fixed bottom-0 right-0 w-80 h-80 md:w-96 md:h-96 z-[100] pointer-events-auto"
                onMouseMove={handleMouseMove}
            >
                {/* Mood indicator */}
                <MoodDot mood={mood} />

                {/* Hover keybind popup — shows on cat hover */}
                <KeybindPopup visible={isHover} />

                {/* Speech bubble / message */}
                {message && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-neon-green/50 text-white px-4 py-2 rounded-xl text-base font-bold font-mono whitespace-nowrap pointer-events-none select-none shadow-[0_0_20px_rgba(74,222,128,0.3)] animate-pulse z-[60]">
                        {message}
                    </div>
                )}

                {/* Floating text labels */}
                {floats.map(f => (
                    <FloatingText key={f.id} id={f.id} text={f.text}
                        onDone={() => setFloats(p => p.filter(x => x.id !== f.id))} />
                ))}

                {/* Burst hearts */}
                {bursts.map(h => (
                    <BurstHeart key={h.id} id={h.id}
                        onDone={() => setBursts(p => p.filter(x => x.id !== h.id))} />
                ))}

                {/* Zzz during sleep */}
                {zzzs.map(z => (
                    <Zzz key={z.id} id={z.id}
                        onDone={() => setZzzs(p => p.filter(x => x.id !== z.id))} />
                ))}

                {/* Music notes during dance */}
                {notes.map(n => (
                    <MusicNote key={n.id} id={n.id}
                        onDone={() => setNotes(p => p.filter(x => x.id !== n.id))} />
                ))}

                {/* Yarn ball toy */}
                <YarnBall visible={yarnVisible} onDone={() => setYarnVisible(false)} />

                {/* First-load hint tooltip */}
                {showHint && (
                    <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-neon-green/40 text-white text-xs px-3 py-2 rounded-xl pointer-events-none select-none whitespace-nowrap z-[70] font-mono"
                        style={{ animation: 'fadeInOut 4s ease forwards' }}
                    >
                        Psst! Press E, P, T, Z, or M to interact 🐾
                    </div>
                )}

                {/* Three.js Canvas */}
                <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
                    <ambientLight intensity={0.7} />
                    <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={5} color="#ffffff" />
                    <pointLight position={[-5, 5, 5]} intensity={1} color="#3b82f6" />

                    <CatAnimator action={action} catRef={catRef}>
                        <MechaCat
                            mouse={mouse}
                            action={action}
                            setRef={setCatRef}
                            onPointerOver={handlePointerOver}
                            onPointerOut={handlePointerOut}
                            onPointerDown={handlePointerDown}
                            onDoubleClick={handleDoubleClick}
                            isBlinking={isBlinking}
                        />
                    </CatAnimator>

                    <Environment preset="city" />
                </Canvas>
                <EventListenerHandler mouse={mouse} />
            </div>
        </>
    );
}
