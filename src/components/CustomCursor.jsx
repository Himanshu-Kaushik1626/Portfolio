import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   CustomCursor — replaces default browser cursor
   Small glowing dot + trailing ring effect.
   Scales up on interactive element hover.
   Hidden on touch/mobile devices.
───────────────────────────────────────────── */
const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const pos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);

    useEffect(() => {
        // Don't show on touch devices
        if (window.matchMedia('(hover: none)').matches) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        const onMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
            // Dot follows instantly
            dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        };

        const onEnter = () => setIsVisible(true);
        const onLeave = () => setIsVisible(false);

        // Detect hovering over interactive elements
        const onMouseOver = (e) => {
            const el = e.target;
            const interactive =
                el.tagName === 'A' ||
                el.tagName === 'BUTTON' ||
                el.closest('a') ||
                el.closest('button') ||
                el.getAttribute('role') === 'button' ||
                el.style.cursor === 'pointer' ||
                window.getComputedStyle(el).cursor === 'pointer';
            setIsHovering(!!interactive);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseover', onMouseOver);

        // Ring lerp animation loop
        const lerp = (a, b, t) => a + (b - a) * t;
        const animateRing = () => {
            ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
            ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
            ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
            rafRef.current = requestAnimationFrame(animateRing);
        };
        rafRef.current = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isHovering
                        ? 'linear-gradient(135deg,#4ade80,#3b82f6)'
                        : '#4ade80',
                    boxShadow: isHovering
                        ? '0 0 16px 4px rgba(74,222,128,0.8)'
                        : '0 0 8px 2px rgba(74,222,128,0.6)',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    opacity: isVisible ? 1 : 0,
                    transition: 'background 0.2s, box-shadow 0.2s, opacity 0.2s',
                    willChange: 'transform',
                }}
            />
            {/* Trailing ring */}
            <div
                ref={ringRef}
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? 48 : 40,
                    height: isHovering ? 48 : 40,
                    borderRadius: '50%',
                    border: isHovering
                        ? '2px solid rgba(59,130,246,0.8)'
                        : '1.5px solid rgba(74,222,128,0.5)',
                    pointerEvents: 'none',
                    zIndex: 99997,
                    opacity: isVisible ? 1 : 0,
                    transition:
                        'width 0.25s, height 0.25s, border-color 0.25s, opacity 0.2s, margin 0.25s',
                    marginLeft: isHovering ? -4 : 0,
                    marginTop: isHovering ? -4 : 0,
                    willChange: 'transform',
                }}
            />
        </>
    );
};

export default CustomCursor;
