import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   Skills Section — Physics Bubble Canvas 🫧
   
   Pure canvas 2-D physics:
   • Gravity pulls bubbles down, they pile naturally
   • Elastic bubble-bubble collision
   • Cursor repulsion (move cursor in → bubbles scatter)
   • Glossy canvas rendering: glow rim + highlight oval +
     devicon image + name label
   • Bubbles drop in staggered from above on first resize
   
   Production-safe: uses ResizeObserver so canvas dimensions
   are guaranteed non-zero before the physics loop starts.
═══════════════════════════════════════════════════════════ */

const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const SKILLS = [
    { name: 'JavaScript', icon: `${DI}/javascript/javascript-original.svg`, color: '#f7df1e', glow: 'rgba(247,223,30,0.55)' },
    { name: 'React',      icon: `${DI}/react/react-original.svg`,           color: '#61dafb', glow: 'rgba(97,218,251,0.5)'  },
    { name: 'Node.js',    icon: `${DI}/nodejs/nodejs-original.svg`,         color: '#4ade80', glow: 'rgba(74,222,128,0.5)'  },
    { name: 'Python',     icon: `${DI}/python/python-original.svg`,         color: '#3b82f6', glow: 'rgba(59,130,246,0.5)'  },
    { name: 'MongoDB',    icon: `${DI}/mongodb/mongodb-original.svg`,       color: '#4ade80', glow: 'rgba(74,222,128,0.4)'  },
    { name: 'Express',    icon: `${DI}/express/express-original.svg`,       color: '#a8a8a8', glow: 'rgba(168,168,168,0.35)'},
    { name: 'SQL',        icon: `${DI}/mysql/mysql-original.svg`,           color: '#3b82f6', glow: 'rgba(59,130,246,0.5)'  },
    { name: 'HTML/CSS',   icon: `${DI}/html5/html5-original.svg`,           color: '#ef4444', glow: 'rgba(239,68,68,0.45)'  },
    { name: 'Tailwind',   icon: `${DI}/tailwindcss/tailwindcss-original.svg`,color:'#38bdf8', glow: 'rgba(56,189,248,0.5)'  },
    { name: 'Git',        icon: `${DI}/git/git-original.svg`,               color: '#f97316', glow: 'rgba(249,115,22,0.5)'  },
    { name: 'Linux',      icon: `${DI}/linux/linux-original.svg`,           color: '#f59e0b', glow: 'rgba(245,158,11,0.45)' },
    { name: 'C/C++',      icon: `${DI}/cplusplus/cplusplus-original.svg`,   color: '#a855f7', glow: 'rgba(168,85,247,0.5)'  },
    { name: 'Java',       icon: `${DI}/java/java-original.svg`,             color: '#ef4444', glow: 'rgba(239,68,68,0.45)'  },
    { name: 'Figma',      icon: `${DI}/figma/figma-original.svg`,           color: '#a855f7', glow: 'rgba(168,85,247,0.5)'  },
    { name: 'Data Sci.',  icon: `${DI}/pandas/pandas-original.svg`,         color: '#3b82f6', glow: 'rgba(59,130,246,0.45)' },
    { name: 'PowerBI',    icon: null,                                        color: '#f59e0b', glow: 'rgba(245,158,11,0.4)'  },
    { name: 'Canva',      icon: `${DI}/canva/canva-original.svg`,           color: '#38bdf8', glow: 'rgba(56,189,248,0.45)' },
    { name: 'Excel',      icon: null,                                        color: '#4ade80', glow: 'rgba(74,222,128,0.4)'  },
];

/* ── Physics constants ─────────────────────────────────── */
const GRAVITY        = 0.20;
const DAMPING_WALL   = 0.60;
const DAMPING_FLOOR  = 0.50;
const FRICTION       = 0.990;
const REPEL_RADIUS   = 120;
const REPEL_FORCE    = 8;
const MIN_R          = 42;
const MAX_R          = 58;
const CANVAS_H       = 480;

/* ── Preload devicon images ────────────────────────────── */
function preloadIcons() {
    return SKILLS.map(s => {
        if (!s.icon) return null;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = s.icon;
        img.onerror = () => { img._failed = true; };
        return img;
    });
}

/* ── Build bubble state (called after we know canvas dims) */
function initBubbles(W, H) {
    return SKILLS.map((s, i) => {
        const r   = MIN_R + Math.min(s.name.length * 1.6, MAX_R - MIN_R);
        const x   = r + Math.random() * Math.max(1, W - r * 2);
        const y   = -r - i * 40;          // start above canvas; fall in
        return { ...s, x, y, r, vx: (Math.random() - 0.5) * 1.2, vy: 0 };
    });
}

/* ── Draw one glossy bubble ────────────────────────────── */
function drawBubble(ctx, b, img) {
    const { x, y, r, color, glow, name } = b;
    ctx.save();

    // Outer glow
    ctx.shadowColor = glow;
    ctx.shadowBlur  = 20;

    // Fill: dark gradient to look like a lit sphere
    const fill = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
    fill.addColorStop(0,   'rgba(28,30,40,0.95)');
    fill.addColorStop(0.65,'rgba(10,11,18,0.97)');
    fill.addColorStop(1,   'rgba(4,4,8,0.99)');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();

    // Colored rim
    ctx.shadowBlur   = 0;
    ctx.strokeStyle  = color;
    ctx.lineWidth    = 1.8;
    ctx.globalAlpha  = 0.78;
    ctx.stroke();
    ctx.globalAlpha  = 1;

    // Glossy highlight oval (upper-left)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x - r * 0.28, y - r * 0.30, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2);
    const hi = ctx.createRadialGradient(x - r * 0.28, y - r * 0.30, 0, x - r * 0.28, y - r * 0.30, r * 0.30);
    hi.addColorStop(0, 'rgba(255,255,255,0.5)');
    hi.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hi;
    ctx.fill();
    ctx.restore();

    // Icon image (or first-letter fallback)
    const iconSize = r * 0.70;
    const iconY    = y - r * 0.10;
    if (img && img.complete && !img._failed && img.naturalWidth > 0) {
        ctx.globalAlpha = 0.90;
        ctx.drawImage(img, x - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
        ctx.globalAlpha = 1;
    } else {
        ctx.font         = `bold ${Math.round(r * 0.54)}px Inter,sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = color;
        ctx.shadowColor  = glow;
        ctx.shadowBlur   = 6;
        ctx.fillText(name[0], x, iconY);
        ctx.shadowBlur   = 0;
    }

    // Skill name label
    const fs = Math.max(9, Math.round(r * 0.21));
    ctx.font         = `600 ${fs}px Inter,sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = 'rgba(255,255,255,0.88)';
    ctx.shadowBlur   = 0;
    ctx.fillText(name, x, y + r * 0.54);

    ctx.restore();
}

/* ── Elastic collision between two circles ─────────────── */
function resolveCollision(a, b) {
    const dx   = b.x - a.x;
    const dy   = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    const minD = a.r + b.r;
    if (dist >= minD) return;
    const ov = (minD - dist) / 2;
    const nx = dx / dist, ny = dy / dist;
    a.x -= nx * ov; a.y -= ny * ov;
    b.x += nx * ov; b.y += ny * ov;
    const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
    if (dot <= 0) return;
    const imp = dot * 0.75;
    a.vx -= imp * nx; a.vy -= imp * ny;
    b.vx += imp * nx; b.vy += imp * ny;
}

/* ════════════════════════════════════════════════════════
   Component
════════════════════════════════════════════════════════ */
export default function Skills() {
    const canvasRef  = useRef(null);
    const wrapRef    = useRef(null);
    const mouseRef   = useRef({ x: -9999, y: -9999 });
    const stateRef   = useRef({
        bubbles: [],
        icons:   [],
        W: 0, H: CANVAS_H,
        frame: null,
        running: false,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap   = wrapRef.current;
        if (!canvas || !wrap) return;

        const s = stateRef.current;

        /* Preload icons once */
        s.icons = preloadIcons();

        /* ── Physics + render tick ────────────────────────── */
        const tick = () => {
            const ctx = canvas.getContext('2d');
            const { bubbles, W, H } = s;
            ctx.clearRect(0, 0, W, H);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            for (let i = 0; i < bubbles.length; i++) {
                const b = bubbles[i];
                b.vy += GRAVITY;

                // Cursor repulsion
                const mdx = b.x - mx, mdy = b.y - my;
                const md  = Math.hypot(mdx, mdy) || 1;
                if (md < REPEL_RADIUS) {
                    const f = (1 - md / REPEL_RADIUS) * REPEL_FORCE;
                    b.vx += (mdx / md) * f;
                    b.vy += (mdy / md) * f;
                }

                b.x += b.vx;
                b.y += b.vy;
                b.vx *= FRICTION;

                // Walls
                if (b.x - b.r < 0)  { b.x = b.r;    b.vx =  Math.abs(b.vx) * DAMPING_WALL; }
                if (b.x + b.r > W)  { b.x = W - b.r; b.vx = -Math.abs(b.vx) * DAMPING_WALL; }
                // Floor
                if (b.y + b.r > H)  { b.y = H - b.r; b.vy = -Math.abs(b.vy) * DAMPING_FLOOR; b.vx *= 0.92; }
                // Ceiling guard
                if (b.y - b.r < -b.r * 2) b.y = -b.r * 2;
            }

            // Bubble-bubble collisions
            for (let i = 0; i < bubbles.length; i++)
                for (let j = i + 1; j < bubbles.length; j++)
                    resolveCollision(bubbles[i], bubbles[j]);

            // Draw
            for (let i = 0; i < bubbles.length; i++)
                drawBubble(ctx, bubbles[i], s.icons[i]);

            s.frame = requestAnimationFrame(tick);
        };

        /* ── Start / restart on resize via ResizeObserver ─── */
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const W = Math.floor(entry.contentRect.width);
                if (W === 0) continue;          // skip zero-width frames

                canvas.width  = W;
                canvas.height = CANVAS_H;
                s.W = W;
                s.H = CANVAS_H;

                // (Re)init bubbles whenever width changes significantly
                s.bubbles = initBubbles(W, CANVAS_H);

                if (!s.running) {
                    s.running = true;
                    s.frame   = requestAnimationFrame(tick);
                }
            }
        });

        ro.observe(wrap);

        // Mouse tracking relative to canvas
        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseleave', onLeave);

        return () => {
            cancelAnimationFrame(s.frame);
            s.running = false;
            ro.disconnect();
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <section id="skills" className="py-20 px-4 relative overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-10 right-10 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-neon-green/5 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="max-w-5xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        My{' '}
                        <span className="relative inline-block">
                            <span style={{
                                background: 'linear-gradient(135deg, #00f5ff, #ff00cc)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>
                                Skills
                            </span>
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full"
                                style={{ background: 'linear-gradient(90deg, #00f5ff, #ff00cc)', boxShadow: '0 0 10px rgba(0,245,255,0.6)' }}
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-base mt-6">
                        Move your cursor in to scatter them 🫧
                    </p>
                </motion.div>

                {/* Canvas wrapper — ResizeObserver watches this div */}
                <motion.div
                    ref={wrapRef}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full rounded-2xl overflow-hidden"
                    style={{
                        height: CANVAS_H,
                        background: 'rgba(13, 0, 32, 0.45)', // UV glass card
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0, 245, 255, 0.12)',
                        boxShadow: '0 4px 32px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.04)'
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
