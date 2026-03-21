import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   CursorDog — "Bruno" the cursor-following dog 🐕
   
   States: walking (cursor moving), sitting/idle (stopped 2s+), running (fast cursor)
   Features:
   - Lerp-based smooth following (physics-based lag)
   - Faces left/right based on movement direction
   - Walking/trotting leg animations via CSS keyframes
   - Sitting animation after 2s idle
   - Tail wagging while sitting
   - "Bruno" collar nametag
   - pointer-events: none (doesn't block clicks)
   - Hidden on mobile / touch devices
   - paw-print trail on touch devices
   - prefers-reduced-motion respected
────────────────────────────────────────────────────────────────────────────── */

// ----- SVG Dog Parts (CSS-animated, illustrated style) -----

const DogSVG = ({ state, flipX }) => {
    // state: 'walk' | 'run' | 'sit'
    const isWalk = state === 'walk';
    const isRun = state === 'run';
    const isSit = state === 'sit';

    return (
        <svg
            viewBox="0 0 80 70"
            width="80"
            height="70"
            style={{
                transform: flipX ? 'scaleX(-1)' : 'scaleX(1)',
                overflow: 'visible',
            }}
            aria-hidden="true"
        >
            {/* ── Tail ── */}
            <g
                style={{
                    transformOrigin: '18px 28px',
                    animation: isSit
                        ? 'dogTailWag 0.5s ease-in-out infinite alternate'
                        : isWalk
                        ? 'dogTailBob 0.5s ease-in-out infinite alternate'
                        : 'dogTailWag 0.3s ease-in-out infinite alternate',
                }}
            >
                <ellipse cx="12" cy="24" rx="8" ry="4" fill="#8B6914" transform="rotate(-30 12 24)" />
                <ellipse cx="6" cy="18" rx="5" ry="3" fill="#a07820" transform="rotate(-20 6 18)" />
            </g>

            {/* ── Body ── */}
            <ellipse cx="42" cy="38" rx="22" ry="14" fill="#c9943a" />
            {/* Body shading */}
            <ellipse cx="42" cy="44" rx="18" ry="6" fill="#b5832e" opacity="0.5" />

            {/* ── Back legs ── */}
            <g
                style={{
                    transformOrigin: '32px 48px',
                    animation: isSit
                        ? 'none'
                        : isRun
                        ? 'dogLegsRun 0.25s ease-in-out infinite alternate'
                        : 'dogLegsWalk 0.4s ease-in-out infinite alternate',
                }}
            >
                {isSit ? (
                    <>
                        {/* Sitting back legs */}
                        <rect x="25" y="48" width="7" height="12" rx="3" fill="#b5832e" />
                        <ellipse cx="28" cy="61" rx="6" ry="3" fill="#8B6914" />
                    </>
                ) : (
                    <>
                        <rect x="25" y="48" width="6" height="14" rx="3" fill="#b5832e" />
                        <ellipse cx="28" cy="63" rx="5" ry="2.5" fill="#8B6914" />
                    </>
                )}
            </g>
            <g
                style={{
                    transformOrigin: '38px 48px',
                    animation: isSit
                        ? 'none'
                        : isRun
                        ? 'dogLegsRun 0.25s ease-in-out infinite alternate-reverse'
                        : 'dogLegsWalk 0.4s ease-in-out infinite alternate-reverse',
                }}
            >
                {isSit ? (
                    <>
                        <rect x="32" y="48" width="7" height="12" rx="3" fill="#c9943a" />
                        <ellipse cx="36" cy="61" rx="6" ry="3" fill="#a07820" />
                    </>
                ) : (
                    <>
                        <rect x="33" y="48" width="6" height="14" rx="3" fill="#c9943a" />
                        <ellipse cx="36" cy="63" rx="5" ry="2.5" fill="#a07820" />
                    </>
                )}
            </g>

            {/* ── Front legs ── */}
            <g
                style={{
                    transformOrigin: '52px 46px',
                    animation:
                        isSit
                            ? 'none'
                            : isRun
                            ? 'dogLegsRun 0.25s ease-in-out infinite alternate-reverse'
                            : 'dogLegsWalk 0.4s ease-in-out infinite alternate',
                }}
            >
                <rect x="50" y="46" width="6" height="15" rx="3" fill="#b5832e" />
                <ellipse cx="53" cy="62" rx="5" ry="2.5" fill="#8B6914" />
            </g>
            <g
                style={{
                    transformOrigin: '58px 46px',
                    animation:
                        isSit
                            ? 'none'
                            : isRun
                            ? 'dogLegsRun 0.25s ease-in-out infinite alternate'
                            : 'dogLegsWalk 0.4s ease-in-out infinite alternate',
                }}
            >
                <rect x="57" y="46" width="6" height="15" rx="3" fill="#c9943a" />
                <ellipse cx="60" cy="62" rx="5" ry="2.5" fill="#a07820" />
            </g>

            {/* ── Neck ── */}
            <ellipse cx="60" cy="32" rx="10" ry="8" fill="#c9943a" />

            {/* ── Collar (Bruno's collar) ── */}
            <rect x="52" y="28" rx="3" ry="3" width="16" height="5" fill="#4ade80" opacity="0.9" />
            <text
                x="60"
                y="32.5"
                textAnchor="middle"
                fontSize="3.5"
                fontFamily="monospace"
                fill="#000"
                fontWeight="bold"
                aria-label="Bruno collar tag"
            >
                Bruno
            </text>
            {/* Collar tag */}
            <circle cx="60" cy="34" r="2" fill="#3b82f6" />

            {/* ── Head ── */}
            <ellipse cx="66" cy="24" rx="13" ry="12" fill="#d9a44a" />

            {/* ── Ears ── */}
            <ellipse cx="56" cy="16" rx="6" ry="9" fill="#8B6914" transform="rotate(-20 56 16)" />
            <ellipse cx="76" cy="16" rx="5" ry="7" fill="#8B6914" transform="rotate(15 76 16)" />
            {/* Inner ear */}
            <ellipse cx="57" cy="17" rx="3" ry="5.5" fill="#c07a2a" transform="rotate(-20 57 17)" />

            {/* ── Eye ── */}
            <circle cx="72" cy="22" r="3.5" fill="white" />
            <circle cx="72.8" cy="22.5" r="2" fill="#1a1a1a" />
            <circle cx="73.5" cy="21.8" r="0.7" fill="white" />

            {/* ── Nose ── */}
            <ellipse cx="77" cy="28" rx="3" ry="2" fill="#1a1a1a" />
            <ellipse cx="76" cy="27.5" rx="1" ry="0.6" fill="white" opacity="0.7" />

            {/* ── Mouth ── */}
            <path d="M 75 30 Q 77 33 79 30" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* ── Spots / markings ── */}
            <ellipse cx="40" cy="36" rx="7" ry="5" fill="#a07820" opacity="0.35" />
            <ellipse cx="50" cy="40" rx="4" ry="3" fill="#8B6914" opacity="0.25" />

            {/* ── Shadow ── */}
            <ellipse cx="44" cy="66" rx="20" ry="4" fill="rgba(0,0,0,0.2)" />
        </svg>
    );
};

// Paw print for touch trail (mobile)
const PawPrint = ({ x, y, opacity }) => (
    <div
        aria-hidden="true"
        style={{
            position: 'fixed',
            left: x - 12,
            top: y - 12,
            opacity,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: 24,
            transition: 'opacity 0.5s ease',
            userSelect: 'none',
        }}
    >
        🐾
    </div>
);

const CursorDog = () => {
    const dogPos = useRef({ x: -200, y: -200 });
    const targetPos = useRef({ x: -200, y: -200 });
    const lastPos = useRef({ x: -200, y: -200 });
    const velocityRef = useRef(0);
    const rafRef = useRef(null);
    const idleTimerRef = useRef(null);
    const dogRef = useRef(null);

    const [state, setState] = useState('sit'); // 'walk' | 'run' | 'sit'
    const [flipX, setFlipX] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [paws, setPaws] = useState([]);

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        setIsMobile(isTouchDevice);
        if (isTouchDevice) return; // Don't run on mobile

        const lerp = (a, b, t) => a + (b - a) * t;

        const onMouseMove = (e) => {
            targetPos.current = { x: e.clientX, y: e.clientY };

            // Direction for facing
            const dx = e.clientX - lastPos.current.x;
            if (Math.abs(dx) > 2) {
                setFlipX(dx < 0); // if moving left, face left (flipX=true)
            }

            // Velocity = distance moved
            const dist = Math.hypot(dx, e.clientY - lastPos.current.y);
            velocityRef.current = dist;

            // Reset idle timer
            clearTimeout(idleTimerRef.current);
            if (dist > 14) {
                setState(dist > 30 ? 'run' : 'walk');
            }

            idleTimerRef.current = setTimeout(() => {
                setState('sit');
            }, 2000);

            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        document.addEventListener('mousemove', onMouseMove, { passive: true });

        const animate = () => {
            const lerpSpeed = prefersReduced ? 1 : 0.1;
            dogPos.current.x = lerp(dogPos.current.x, targetPos.current.x, lerpSpeed);
            dogPos.current.y = lerp(dogPos.current.y, targetPos.current.y, lerpSpeed);

            if (dogRef.current) {
                // Position dog so it follows slightly below and behind cursor
                dogRef.current.style.transform = `translate(${dogPos.current.x - 70}px, ${dogPos.current.y - 40}px)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafRef.current);
            clearTimeout(idleTimerRef.current);
        };
    }, [prefersReduced]);

    // Mobile: paw print trail on touch
    const handleTouch = useCallback((e) => {
        const touch = e.touches[0];
        const id = Date.now();
        setPaws((prev) => [...prev.slice(-6), { id, x: touch.clientX, y: touch.clientY, opacity: 1 }]);
        setTimeout(() => {
            setPaws((prev) => prev.filter((p) => p.id !== id));
        }, 700);
    }, []);

    useEffect(() => {
        if (!isMobile) return;
        window.addEventListener('touchmove', handleTouch, { passive: true });
        return () => window.removeEventListener('touchmove', handleTouch);
    }, [isMobile, handleTouch]);

    if (isMobile) {
        return (
            <>
                {paws.map((p) => (
                    <PawPrint key={p.id} x={p.x} y={p.y} opacity={p.opacity} />
                ))}
            </>
        );
    }

    return (
        <div
            ref={dogRef}
            aria-label="Bruno the dog"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                pointerEvents: 'none',
                willChange: 'transform',
                userSelect: 'none',
            }}
        >
            <DogSVG state={state} flipX={flipX} />
        </div>
    );
};

export default CursorDog;
