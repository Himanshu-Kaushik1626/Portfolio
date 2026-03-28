import { useEffect, useRef, useState } from 'react';

/*  ──────────────────────────────────────────────────────
    CustomCursor — Neon Crosshair (UV Space theme)

    Design:
    • Outer ring: thin circle with a 4-point gap (crosshair) in cyan
    • Inner dot: tiny hot-magenta dot that pulses
    • On hover: ring turns magenta + grows, dot turns cyan
    • Trails slowly with lerp for the ring; dot is instant
    ────────────────────────────────────────────────────── */
const CustomCursor = () => {
    const dotRef  = useRef(null);
    const ringRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible,  setIsVisible]  = useState(false);
    const pos     = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const rafRef  = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(hover: none)').matches) return;
        const dot  = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
            setIsVisible(true);
            // Instant dot
            dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
        };

        const onLeave = () => setIsVisible(false);
        const onEnter = () => setIsVisible(true);
        const onOver  = (e) => {
            const el = e.target;
            const isInteractive =
                el.tagName === 'A' || el.tagName === 'BUTTON' ||
                el.closest('a') || el.closest('button') ||
                el.getAttribute('role') === 'button' ||
                window.getComputedStyle(el).cursor === 'pointer';
            setIsHovering(!!isInteractive);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseover', onOver);

        const lerp = (a, b, t) => a + (b - a) * t;
        const animateRing = () => {
            ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.1);
            ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.1);
            const size = isHovering ? 44 : 34;
            ring.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`;
            rafRef.current = requestAnimationFrame(animateRing);
        };
        rafRef.current = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseover', onOver);
            cancelAnimationFrame(rafRef.current);
        };
    }, [isHovering]);

    const CYAN    = '#00f5ff';
    const MAGENTA = '#ff00cc';
    const ringSize = isHovering ? 44 : 34;

    return (
        <>
            {/* Inner dot (magenta → cyan on hover) */}
            <div
                ref={dotRef}
                aria-hidden="true"
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background:  isHovering ? CYAN : MAGENTA,
                    boxShadow:   isHovering
                        ? `0 0 10px 3px ${CYAN}cc`
                        : `0 0 10px 3px ${MAGENTA}cc`,
                    pointerEvents: 'none',
                    zIndex: 99999,
                    opacity: isVisible ? 1 : 0,
                    transition: 'background 0.15s, box-shadow 0.15s, opacity 0.2s',
                    willChange: 'transform',
                }}
            />

            {/* Outer crosshair ring */}
            <div
                ref={ringRef}
                aria-hidden="true"
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width:  ringSize,
                    height: ringSize,
                    pointerEvents: 'none',
                    zIndex: 99998,
                    opacity: isVisible ? 1 : 0,
                    willChange: 'transform',
                    transition: 'width 0.2s, height 0.2s, opacity 0.2s',

                    /* Crosshair via SVG background */
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Ccircle cx='17' cy='17' r='14' fill='none' stroke='${isHovering ? '%23ff00cc' : '%2300f5ff'}' stroke-width='1.5' stroke-dasharray='4 4' stroke-dashoffset='2'/%3E%3Cline x1='17' y1='4' x2='17' y2='11' stroke='${isHovering ? '%23ff00cc' : '%2300f5ff'}' stroke-width='1.5'/%3E%3Cline x1='17' y1='23' x2='17' y2='30' stroke='${isHovering ? '%23ff00cc' : '%2300f5ff'}' stroke-width='1.5'/%3E%3Cline x1='4' y1='17' x2='11' y2='17' stroke='${isHovering ? '%23ff00cc' : '%2300f5ff'}' stroke-width='1.5'/%3E%3Cline x1='23' y1='17' x2='30' y2='17' stroke='${isHovering ? '%23ff00cc' : '%2300f5ff'}' stroke-width='1.5'/%3E%3C/svg%3E")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    filter: `drop-shadow(0 0 4px ${isHovering ? MAGENTA : CYAN})`,
                }}
            />
        </>
    );
};

export default CustomCursor;
