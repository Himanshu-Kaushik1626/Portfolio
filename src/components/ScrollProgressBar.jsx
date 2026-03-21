import { useEffect, useState } from 'react';

/* ─────────────────────────────────────────────
   ScrollProgressBar — thin gradient bar at top
   that fills as user scrolls down the page.
───────────────────────────────────────────── */
const ScrollProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(pct);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: 3,
                zIndex: 100000,
                background: 'transparent',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #4ade80, #3b82f6, #a855f7)',
                    boxShadow: '0 0 10px rgba(74,222,128,0.8)',
                    transition: 'width 0.05s linear',
                }}
            />
        </div>
    );
};

export default ScrollProgressBar;
