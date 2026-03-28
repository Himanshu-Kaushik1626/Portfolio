import { useEffect, useRef } from 'react';

/*
  ══════════════════════════════════════════════════════════
  CYBERPUNK ROBOTIC DARK THEME

  Layers (back → front):
   -70  Pure black base (#03000a)
   -68  Tron perspective floor grid (vanishing point, magenta/cyan)
   -66  Digital hex rain columns (falling glyphs, neon green/cyan)
   -64  Angular robot-geometry corner frames (SVG, magenta)
   -62  Scanlines + chromatic shift overlay
   -60  Pulsing neon HUD rings (center)
   -50  Edge vignette
  ══════════════════════════════════════════════════════════
*/

/* ══════════════════════════════════════════════════════════
   1. TRON PERSPECTIVE GRID FLOOR
   ══════════════════════════════════════════════════════════ */
const TronGrid = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, animId, t = 0;

        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        resize(); window.addEventListener('resize', resize);

        // Horizon sits at 62% down
        const HORIZON_Y = () => H * 0.62;
        const VP_X      = () => W * 0.50;   // vanishing point X

        const LINE_COUNT = 28;  // vertical lines each side
        const HORIZ_COUNT = 18; // horizontal lines

        const draw = (ts) => {
            t = ts * 0.0003;
            ctx.clearRect(0, 0, W, H);

            const hY  = HORIZON_Y();
            const vpX = VP_X();

            // ── Horizontal lines (moving toward viewer) ──────────
            for (let i = 0; i < HORIZ_COUNT; i++) {
                // scroll fraction within [0,1), loops
                const scroll = (i / HORIZ_COUNT + t * 0.22) % 1;
                // perspective: y=0 at horizon, y=1 at bottom
                const p  = scroll * scroll; // ease to bottom
                const y  = hY + (H - hY) * p;
                const alpha = 0.06 + 0.24 * p;
                ctx.beginPath();
                ctx.moveTo(0, y); ctx.lineTo(W, y);
                ctx.strokeStyle = `rgba(0,240,255,${alpha})`;
                ctx.lineWidth = 0.7 + p * 1.2;
                ctx.stroke();
            }

            // ── Vertical convergent lines ─────────────────────────
            for (let i = -LINE_COUNT; i <= LINE_COUNT; i++) {
                const spread = W * 0.55;
                const bx = vpX + (i / LINE_COUNT) * spread;
                const alpha = 0.04 + 0.18 * Math.abs(i / LINE_COUNT);
                ctx.beginPath();
                ctx.moveTo(vpX, hY);
                ctx.lineTo(bx, H + 20);
                ctx.strokeStyle = i % 4 === 0
                    ? `rgba(255,0,180,${alpha + 0.08})`  // magenta accent every 4th
                    : `rgba(0,200,255,${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }

            // ── Horizon glow line ─────────────────────────────────
            const grd = ctx.createLinearGradient(0, hY, W, hY);
            grd.addColorStop(0,   'rgba(255,0,180,0)');
            grd.addColorStop(0.3, 'rgba(255,0,180,0.55)');
            grd.addColorStop(0.5, 'rgba(0,240,255,0.70)');
            grd.addColorStop(0.7, 'rgba(255,0,180,0.55)');
            grd.addColorStop(1,   'rgba(255,0,180,0)');
            ctx.beginPath();
            ctx.moveTo(0, hY); ctx.lineTo(W, hY);
            ctx.strokeStyle = grd; ctx.lineWidth = 1.5; ctx.stroke();

            // glow halo above horizon
            const vg = ctx.createLinearGradient(0, hY - 60, 0, hY + 10);
            vg.addColorStop(0, 'rgba(0,220,255,0)');
            vg.addColorStop(1, 'rgba(0,220,255,0.10)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, hY - 60, W, 70);

            animId = requestAnimationFrame(draw);
        };
        animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={ref} aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: -68, pointerEvents: 'none' }} />;
};

/* ══════════════════════════════════════════════════════════
   2. STARLIGHT OVERLAY (Twinkling + Falling Stars)
   ══════════════════════════════════════════════════════════ */
const StarlightOverlay = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, animId;
        let fallingStars = [];
        let twinklingStars = [];
        let mouseX = -2000, mouseY = -2000;

        const handleMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
        window.addEventListener('mousemove', handleMouseMove);

        const initParticles = () => {
            const numFalling = Math.floor((W * H) / 25000);
            const numTwinkling = Math.floor((W * H) / 6000);
            fallingStars = Array.from({ length: numFalling }, () => createFallingStar());
            twinklingStars = Array.from({ length: numTwinkling }, () => createTwinklingStar());
        };

        const createFallingStar = (resetY = false) => {
            return {
                x: Math.random() * W,
                y: resetY ? -50 : Math.random() * H,
                size: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 2 + 0.5, // drift sideways
                vy: Math.random() * 3 + 2, // fall fast
                baseVx: (Math.random() - 0.5) * 2 + 0.5,
                baseVy: Math.random() * 3 + 2,
                color: Math.random() > 0.5 ? '#ffffff' : (Math.random() > 0.5 ? '#00f0ff' : '#ff00b3'),
                length: Math.random() * 60 + 20
            };
        };

        const createTwinklingStar = () => {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 1.5 + 0.5,
                color: Math.random() > 0.7 ? '#00f0ff' : (Math.random() > 0.5 ? '#ff00b3' : '#ffffff'),
                blinkSpeed: Math.random() * 0.05 + 0.01,
                t: Math.random() * Math.PI * 2
            };
        };

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            initParticles();
        };
        resize(); window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // 1. Draw Twinkling Stars
            for (let i = 0; i < twinklingStars.length; i++) {
                const p = twinklingStars[i];
                p.t += p.blinkSpeed;
                const alpha = (Math.sin(p.t) + 1) * 0.4 + 0.1; // 0.1 to 0.9

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.fill();
                
                // occasional glow
                if (alpha > 0.7) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // 2. Draw Falling Stars (Deflect from cursor)
            for (let i = 0; i < fallingStars.length; i++) {
                const p = fallingStars[i];

                // Mouse deflection
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 180) {
                    const force = (180 - dist) / 180;
                    p.vx += (dx / dist) * force * 1.5;
                    p.vy += (dy / dist) * force * 1.5;
                }

                // Smoothly return to base velocity
                p.vx += (p.baseVx - p.vx) * 0.05;
                p.vy += (p.baseVy - p.vy) * 0.05;

                p.x += p.vx;
                p.y += p.vy;

                // Wrap or reset
                if (p.y > H + p.length || p.x < -p.length || p.x > W + p.length) {
                    fallingStars[i] = createFallingStar(true);
                    if (Math.random() > 0.5) {
                        fallingStars[i].x = Math.random() * W; // top
                    } else {
                        // Come from side
                        fallingStars[i].y = Math.random() * H;
                        fallingStars[i].x = p.vx > 0 ? -p.length : W + p.length;
                    }
                }

                // Draw Falling Star
                ctx.save();
                ctx.globalAlpha = 0.9;
                
                // Trail
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                const tailX = p.x - p.vx * (p.length / 5);
                const tailY = p.y - p.vy * (p.length / 5);
                ctx.lineTo(tailX, tailY);
                
                const grad = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
                grad.addColorStop(0, p.color);
                grad.addColorStop(1, 'transparent');
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = p.size;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Star core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size + 0.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                
                // Glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
                ctx.fill();

                ctx.restore();
            }

            animId = requestAnimationFrame(draw);
        };
        animId = requestAnimationFrame(draw);
        return () => { 
            cancelAnimationFrame(animId); 
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    return <canvas ref={ref} aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: -66, pointerEvents: 'none', opacity: 0.85 }} />;
};

/* ══════════════════════════════════════════════════════════
   3. ROBOT / MECH CORNER FRAMES  (SVG)
   ══════════════════════════════════════════════════════════ */
const MechCorners = () => {
    const size = 110;
    const stroke = '#ff00b3';
    const stroke2 = '#00f0ff';
    const sw = 1.5;

    // One corner piece (top-left), rotated for each corner
    const Corner = ({ style }) => (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
            style={{ position: 'fixed', pointerEvents: 'none', zIndex: -64, ...style }}>
            {/* Outer bracket */}
            <polyline points={`${size},18 18,18 18,${size}`} fill="none" stroke={stroke} strokeWidth={sw} />
            {/* Inner bracket */}
            <polyline points={`${size},32 32,32 32,${size}`} fill="none" stroke={stroke2} strokeWidth="0.8" strokeDasharray="4 3" />
            {/* Tick marks */}
            <line x1="18" y1="40"  x2="26" y2="40" stroke={stroke}  strokeWidth={sw} />
            <line x1="18" y1="58"  x2="22" y2="58" stroke={stroke2} strokeWidth="0.8" />
            <line x1="40" y1="18"  x2="40" y2="26" stroke={stroke}  strokeWidth={sw} />
            <line x1="58" y1="18"  x2="58" y2="22" stroke={stroke2} strokeWidth="0.8" />
            {/* Corner node dot */}
            <rect x="14" y="14" width="8" height="8" fill="none" stroke={stroke} strokeWidth={sw} />
            <rect x="16" y="16" width="4" height="4" fill={stroke} opacity="0.8" />
            {/* Diagonal accent */}
            <line x1="28" y1="28" x2="38" y2="38" stroke={stroke2} strokeWidth="0.7" opacity="0.6" />
        </svg>
    );

    return (
        <>
            {/* TL */} <Corner style={{ top: 0, left: 0 }} />
            {/* TR */} <Corner style={{ top: 0, right: 0, transform: 'scaleX(-1)' }} />
            {/* BL */} <Corner style={{ bottom: 0, left: 0, transform: 'scaleY(-1)' }} />
            {/* BR */} <Corner style={{ bottom: 0, right: 0, transform: 'scale(-1,-1)' }} />
        </>
    );
};

/* ══════════════════════════════════════════════════════════
   4. SCANLINES + CHROMATIC NOISE
   ══════════════════════════════════════════════════════════ */
const Scanlines = () => (
    <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: -62, pointerEvents: 'none',
        background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.13) 2px,
            rgba(0,0,0,0.13) 4px
        )`,
    }} />
);

const CyberpunkBeams = () => (
    <>
        <div aria-hidden="true" style={{
            position: 'fixed', inset: 0, zIndex: -61, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(110deg, rgba(255,0,200,0.24) 0%, rgba(0,255,255,0.18) 35%, rgba(0,0,0,0) 40%), linear-gradient(70deg, rgba(150,0,255,0.22) 0%, rgba(0,255,187,0.16) 35%, rgba(0,0,0,0) 43%)',
            opacity: 0.54,
            mixBlendMode: 'screen',
            transform: 'translateX(-15%) scaleX(1.35)',
            animation: 'cyberBeamShift 18s linear infinite'
        }} />
        <style>{`
            @keyframes cyberBeamShift {
                0% { transform: translateX(-15%) scaleX(1.35); }
                50% { transform: translateX(10%) scaleX(1.35); }
                100% { transform: translateX(-15%) scaleX(1.35); }
            }
        `}</style>
    </>
);

/* ══════════════════════════════════════════════════════════
   5. HUD PULSE RINGS — center of canvas
   ══════════════════════════════════════════════════════════ */
const HUDRings = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, animId, t = 0;

        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        resize(); window.addEventListener('resize', resize);

        // Rings that pulse outward from a center HUD point (upper half)
        const rings = [
            { r: 0, maxR: 220, spd: 0.28, color: '255,0,180',   baseAlpha: 0.18, lw: 1.0 },
            { r: 60, maxR: 220, spd: 0.28, color: '0,240,255',  baseAlpha: 0.12, lw: 0.7 },
            { r: 120, maxR: 220, spd: 0.28, color: '255,0,180', baseAlpha: 0.08, lw: 0.5 },
        ];

        const cx = () => W * 0.5;
        const cy = () => H * 0.34;

        // Static concentric reference circles
        const SRC = [80, 140, 200, 260, 320];

        const draw = (ts) => {
            t = ts * 0.001;
            ctx.clearRect(0, 0, W, H);

            const x = cx(), y = cy();

            // Static thin rings
            for (const r of SRC) {
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0,200,255,0.05)`; ctx.lineWidth = 0.6; ctx.stroke();

                // Tick marks
                for (let a = 0; a < 360; a += 30) {
                    const rad = a * Math.PI / 180;
                    const inner = r - 4, outer = r + 4;
                    ctx.beginPath();
                    ctx.moveTo(x + Math.cos(rad) * inner, y + Math.sin(rad) * inner);
                    ctx.lineTo(x + Math.cos(rad) * outer, y + Math.sin(rad) * outer);
                    ctx.strokeStyle = `rgba(255,0,180,0.12)`; ctx.lineWidth = 0.8; ctx.stroke();
                }
            }

            // Rotating crosshair arms
            const rot = t * 0.25;
            for (let arm = 0; arm < 4; arm++) {
                const a = rot + arm * Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30);
                ctx.lineTo(x + Math.cos(a) * 310, y + Math.sin(a) * 310);
                ctx.strokeStyle = 'rgba(0,240,255,0.07)'; ctx.lineWidth = 0.8; ctx.stroke();
            }

            // Pulsing animated rings
            for (const ring of rings) {
                ring.r += ring.spd;
                if (ring.r > ring.maxR) ring.r = 0;
                const alpha = ring.baseAlpha * (1 - ring.r / ring.maxR);
                ctx.beginPath(); ctx.arc(x, y, ring.r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${ring.color},${alpha})`;
                ctx.lineWidth = ring.lw; ctx.stroke();
            }

            // Center dot
            const dg = ctx.createRadialGradient(x, y, 0, x, y, 14);
            dg.addColorStop(0, 'rgba(255,0,180,0.80)');
            dg.addColorStop(0.5,'rgba(0,240,255,0.35)');
            dg.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2);
            ctx.fillStyle = dg; ctx.fill();
            ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; ctx.fill();

            animId = requestAnimationFrame(draw);
        };
        animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={ref} aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: -60, pointerEvents: 'none', opacity: 0.7 }} />;
};

/* ══════════════════════════════════════════════════════════
   6. PLANETS
   ══════════════════════════════════════════════════════════ */
const Planets = () => (
    <>
        {/* Giant Cyberpunk Planet */}
        <div style={{
            position: 'fixed',
            top: '5%',
            right: '8%',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 240, 255, 0.4) 0%, rgba(255, 0, 180, 0.2) 50%, rgba(3, 0, 10, 0.9) 80%)',
            boxShadow: '0 0 80px rgba(0, 240, 255, 0.15), inset -30px -30px 60px rgba(0,0,0,0.9), inset 10px 10px 30px rgba(0, 240, 255, 0.2)',
            zIndex: -67,
            opacity: 0.9,
            pointerEvents: 'none',
        }}>
            {/* Crater details */}
            <div style={{
                position: 'absolute', top: '30%', left: '40%', width: '40px', height: '30px', borderRadius: '50%',
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)', opacity: 0.3
            }} />
            <div style={{
                position: 'absolute', top: '60%', left: '20%', width: '60px', height: '45px', borderRadius: '50%',
                boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.6)', opacity: 0.2
            }} />
        </div>

        {/* Ringed Magenta Planet */}
        <div style={{
            position: 'fixed',
            bottom: '15%',
            left: '8%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(255, 0, 180, 0.5) 0%, rgba(150, 0, 255, 0.3) 60%, rgba(3, 0, 10, 0.9) 90%)',
            boxShadow: '0 0 50px rgba(255, 0, 180, 0.2), inset -15px -15px 30px rgba(0,0,0,0.9)',
            zIndex: -67,
            pointerEvents: 'none',
        }}>
            {/* Planetary Ring */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '240px',
                height: '70px',
                border: '4px solid rgba(0, 240, 255, 0.3)',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid rgba(255, 0, 180, 0.4)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%) rotate(20deg)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.2), inset 0 0 15px rgba(255, 0, 180, 0.2)',
            }} />
        </div>

        {/* Small Distant Moon */}
        <div style={{
            position: 'fixed',
            top: '20%',
            right: '32%',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.6) 0%, rgba(0, 240, 255, 0.4) 40%, rgba(3, 0, 10, 0.9) 100%)',
            boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.8), 0 0 15px rgba(0, 240, 255, 0.3)',
            zIndex: -68,
            pointerEvents: 'none',
        }} />
    </>
);

/* ══════════════════════════════════════════════════════════
   7. SPACESHIP
   ══════════════════════════════════════════════════════════ */
const SpaceShip = () => (
    <>
        <div style={{
            position: 'fixed',
            top: '35%',
            left: '-10%',
            zIndex: -65,
            pointerEvents: 'none',
            animation: 'spaceshipFly 45s linear infinite',
            filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.6))',
        }}>
            <svg width="180" height="90" viewBox="0 0 180 90">
                {/* Engine Plume */}
                <path d="M 25 45 Q 0 35 15 45 Q 0 55 25 45 Z" fill="url(#engineGlow)" className="engine-flicker" />
                {/* Main Hull */}
                <path d="M 30 45 Q 80 15 150 45 Q 80 75 30 45 Z" fill="#0d1117" stroke="#00f0ff" strokeWidth="2" />
                {/* Cockpit Canopy */}
                <path d="M 90 45 Q 115 25 135 45 Z" fill="url(#canopyGradient)" />
                {/* Wings */}
                <path d="M 45 35 L 20 10 L 70 35 Z" fill="#0d1117" stroke="#ff00b3" strokeWidth="1.5" />
                <path d="M 45 55 L 20 80 L 70 55 Z" fill="#0d1117" stroke="#ff00b3" strokeWidth="1.5" />
                {/* Hull lines */}
                <line x1="60" y1="45" x2="120" y2="45" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
                
                <defs>
                    <radialGradient id="engineGlow">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ff00b3" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="canopyGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <style>{`
            @keyframes spaceshipFly {
                0% { transform: translate(0vw, 0px) rotate(2deg) scale(0.8); }
                25% { transform: translate(35vw, -40px) rotate(-1deg) scale(0.9); }
                50% { transform: translate(70vw, 20px) rotate(3deg) scale(1); }
                75% { transform: translate(105vw, -10px) rotate(0deg) scale(0.9); }
                100% { transform: translate(140vw, 0px) rotate(2deg) scale(0.8); }
            }
            .engine-flicker {
                transform-origin: 25px 45px;
                animation: flicker 0.1s infinite alternate;
            }
            @keyframes flicker {
                from { transform: scaleX(1); opacity: 0.8; }
                to { transform: scaleX(1.3); opacity: 1; }
            }
        `}</style>
    </>
);

/* ══════════════════════════════════════════════════════════
   ROOT
   ══════════════════════════════════════════════════════════ */
const BackgroundEffect = () => (
    <>
        {/* ── Cyberpunk neon city base ─────────────────────────── */}
        <div aria-hidden="true" style={{
            position: 'fixed', inset: 0, zIndex: -70, pointerEvents: 'none',
            background: 'linear-gradient(180deg, #0d0316 0%, #18032f 35%, #090e2a 70%, #02030d 100%)',
        }} />

        {/* ── Neon light haze layer ────────────────────────────── */}
        <div aria-hidden="true" style={{
            position: 'fixed', inset: 0, zIndex: -69, pointerEvents: 'none',
            background: `
                radial-gradient(circle at 20% 30%, rgba(235, 0, 255, 0.22) 0%, transparent 45%),
                radial-gradient(circle at 60% 20%, rgba(0, 255, 241, 0.16) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 97, 165, 0.18) 0%, transparent 45%),
                radial-gradient(circle at 45% 75%, rgba(123, 78, 255, 0.14) 0%, transparent 40%)
            `,
            mixBlendMode: 'screen',
        }} />
        <CyberpunkBeams />
        <TronGrid />
        <Planets />
        <SpaceShip />
        <StarlightOverlay />
        <HUDRings />
        <MechCorners />
        <Scanlines />

        {/* ── Content readable center void ──────────────────────── */}
        <div aria-hidden="true" style={{
            position: 'fixed', inset: 0, zIndex: -58, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 62% 52% at 50% 44%, rgba(3,0,10,0.80) 0%, rgba(3,0,10,0.38) 50%, transparent 78%)',
        }} />

        {/* ── Hard corner vignette ──────────────────────────────── */}
        <div aria-hidden="true" style={{
            position: 'fixed', inset: 0, zIndex: -50, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 95% 90% at 50% 50%, transparent 42%, rgba(3,0,10,0.95) 100%)',
        }} />

        {/* Inline keyframes for scanline flicker */}
        <style>{`
            @keyframes scanFlicker {
                0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.88} 95%{opacity:1} 97%{opacity:0.92} 98%{opacity:1}
            }
        `}</style>
    </>
);

export default BackgroundEffect;
