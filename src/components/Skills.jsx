import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   Skills Section — Physics Bubble Canvas 🫧
   
   Pure canvas physics simulation:
   • Gravity pulls bubbles downward (they pile at the bottom)
   • Bubbles bounce off all 4 walls with damping
   • Bubble-bubble collision detection & elastic response
   • Cursor REPULSION: cursor moving near a bubble pushes it away
   • Each bubble: glossy circle with skill name + devicon icon
   • Staggered intro: bubbles drop in from above one by one
═══════════════════════════════════════════════════════════ */

/* ── Skill data ───────────────────────────────────────────── */
const SKILLS = [
    { name: 'JavaScript', icon: 'js',       color: '#f7df1e', glow: 'rgba(247,223,30,0.55)' },
    { name: 'React',      icon: 'react',    color: '#61dafb', glow: 'rgba(97,218,251,0.5)'  },
    { name: 'Node.js',    icon: 'nodejs',   color: '#4ade80', glow: 'rgba(74,222,128,0.5)'  },
    { name: 'Python',     icon: 'python',   color: '#3b82f6', glow: 'rgba(59,130,246,0.5)'  },
    { name: 'MongoDB',    icon: 'mongodb',  color: '#4ade80', glow: 'rgba(74,222,128,0.4)'  },
    { name: 'Express',    icon: 'express',  color: '#a8a8a8', glow: 'rgba(168,168,168,0.35)'},
    { name: 'SQL',        icon: 'mysql',    color: '#3b82f6', glow: 'rgba(59,130,246,0.5)'  },
    { name: 'HTML/CSS',   icon: 'html5',    color: '#ef4444', glow: 'rgba(239,68,68,0.45)'  },
    { name: 'Tailwind',   icon: 'tailwindcss', color: '#38bdf8', glow: 'rgba(56,189,248,0.5)'},
    { name: 'Git',        icon: 'git',      color: '#f97316', glow: 'rgba(249,115,22,0.5)'  },
    { name: 'Linux',      icon: 'linux',    color: '#f59e0b', glow: 'rgba(245,158,11,0.45)' },
    { name: 'C/C++',      icon: 'cplusplus',color: '#a855f7', glow: 'rgba(168,85,247,0.5)'  },
    { name: 'Java',       icon: 'java',     color: '#ef4444', glow: 'rgba(239,68,68,0.45)'  },
    { name: 'Figma',      icon: 'figma',    color: '#a855f7', glow: 'rgba(168,85,247,0.5)'  },
    { name: 'Data Sci.',  icon: 'pandas',   color: '#3b82f6', glow: 'rgba(59,130,246,0.45)' },
    { name: 'PowerBI',    icon: null,       color: '#f59e0b', glow: 'rgba(245,158,11,0.4)'  },
    { name: 'Canva',      icon: 'canva',    color: '#38bdf8', glow: 'rgba(56,189,248,0.45)' },
    { name: 'Excel',      icon: null,       color: '#4ade80', glow: 'rgba(74,222,128,0.4)'  },
];

/* Devicons CDN base */
const DI = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

/* ── Physics constants ─────────────────────────────────────── */
const GRAVITY        = 0.18;   // downward acceleration per frame
const DAMPING_WALL   = 0.62;   // bounce energy kept on wall hit
const DAMPING_GROUND = 0.52;   // extra damping on floor (settle faster)
const FRICTION       = 0.991;  // horizontal friction per frame
const REPEL_RADIUS   = 110;    // px — cursor influence radius
const REPEL_FORCE    = 7.5;    // push strength
const MIN_R          = 44;     // minimum bubble radius
const MAX_R          = 60;     // maximum bubble radius

/* ── Pre-load skill icons into Image objects ──────────────── */
function preloadIcons(skills) {
    return skills.map(s => {
        if (!s.icon) return null;
        const img = new Image();
        img.src = `${DI}/${s.icon}/${s.icon}-original.svg`;
        img.onerror = () => { img._failed = true; };
        return img;
    });
}

/* ── Draw one glossy bubble ──────────────────────────────────
   Layers (back → front):
   1. Outer glow (shadow)
   2. Fill gradient (dark center → slightly lighter ring)
   3. Colored rim stroke
   4. Glossy reflection highlight (top-left oval)
   5. Icon image (or first-letter text fallback)
   6. Skill name label below icon
──────────────────────────────────────────────────────────── */
function drawBubble(ctx, b, img) {
    const { x, y, r, color, glow, name } = b;

    ctx.save();

    /* 1 — Outer glow */
    ctx.shadowColor  = glow;
    ctx.shadowBlur   = 22;

    /* 2 — Fill: radial gradient — dark bg matching portfolio */
    const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.05, x, y, r);
    grad.addColorStop(0,   'rgba(30,32,40,0.92)');
    grad.addColorStop(0.7, 'rgba(10,12,18,0.96)');
    grad.addColorStop(1,   'rgba(5,5,5,0.98)');

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    /* 3 — Colored rim */
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.6;
    ctx.globalAlpha = 0.75;
    ctx.stroke();
    ctx.globalAlpha = 1;

    /* 4 — Glossy highlight (white oval, top-left) */
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x - r * 0.28, y - r * 0.32, r * 0.30, r * 0.18, -Math.PI / 5, 0, Math.PI * 2);
    const hGrad = ctx.createRadialGradient(
        x - r * 0.28, y - r * 0.32, 0,
        x - r * 0.28, y - r * 0.32, r * 0.32
    );
    hGrad.addColorStop(0,   'rgba(255,255,255,0.52)');
    hGrad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = hGrad;
    ctx.fill();
    ctx.restore();

    /* 5 — Icon or letter */
    const iconSize = r * 0.72;
    const iconY    = y - r * 0.12;  // slightly above center
    if (img && img.complete && !img._failed) {
        ctx.globalAlpha = 0.92;
        ctx.drawImage(img, x - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
        ctx.globalAlpha = 1;
    } else {
        /* Text fallback: first letter of skill, colored */
        ctx.font          = `bold ${Math.round(r * 0.58)}px Inter, sans-serif`;
        ctx.textAlign     = 'center';
        ctx.textBaseline  = 'middle';
        ctx.fillStyle     = color;
        ctx.shadowColor   = glow;
        ctx.shadowBlur    = 6;
        ctx.fillText(name[0], x, iconY);
        ctx.shadowBlur    = 0;
    }

    /* 6 — Skill name label */
    const labelFontSize = Math.max(9, Math.round(r * 0.22));
    ctx.font         = `600 ${labelFontSize}px Inter, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = 'rgba(255,255,255,0.88)';
    ctx.fillText(name, x, y + r * 0.55);

    ctx.restore();
}

/* ── Build initial bubble state ─────────────────────────────── */
function initBubbles(skills, W, H) {
    // Assign radii based on name length for variety
    return skills.map((s, i) => {
        const r   = MIN_R + Math.min(s.name.length * 1.8, MAX_R - MIN_R);
        // Start above the canvas, staggered, so they fall in
        const x   = r + Math.random() * (W - r * 2);
        const y   = -r - i * 35;
        return {
            ...s,
            x, y, r,
            vx: (Math.random() - 0.5) * 1.5,   // tiny initial horizontal drift
            vy: 0,
        };
    });
}

/* ── Elastic circle-circle collision response ──────────────── */
function resolveCollision(a, b) {
    const dx   = b.x - a.x;
    const dy   = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    const minD = a.r + b.r;
    if (dist >= minD) return;

    // Push apart (positional correction)
    const overlap = (minD - dist) / 2;
    const nx = dx / dist;
    const ny = dy / dist;
    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;

    // Velocity exchange along normal (equal mass)
    const dvx = a.vx - b.vx;
    const dvy = a.vy - b.vy;
    const dot  = dvx * nx + dvy * ny;
    if (dot <= 0) return;  // already separating
    const imp  = dot * 0.75;  // restitution
    a.vx -= imp * nx;
    a.vy -= imp * ny;
    b.vx += imp * nx;
    b.vy += imp * ny;
}

/* ══════════════════════════════════════════════════════════════
   PhysicsBubbles — the canvas component
══════════════════════════════════════════════════════════════ */
export default function Skills() {
    const canvasRef   = useRef(null);
    const bubblesRef  = useRef([]);
    const mouseRef    = useRef({ x: -999, y: -999 });
    const iconsRef    = useRef([]);
    const frameRef    = useRef(null);
    const sizeRef     = useRef({ W: 0, H: 0 });

    /* Canvas height: enough to comfortably contain all bubbles settled */
    const CANVAS_H = 480;

    /* ── Preload icons once ───────────────────────────────────── */
    useEffect(() => {
        iconsRef.current = preloadIcons(SKILLS);
    }, []);

    /* ── Resize handler ─────────────────────────────────────── */
    const resize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = canvas.offsetWidth;
        const H = CANVAS_H;
        canvas.width  = W;
        canvas.height = H;
        sizeRef.current = { W, H };
        // Reinitialise bubbles on resize
        bubblesRef.current = initBubbles(SKILLS, W, H);
    };

    /* ── Physics + render loop ──────────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        resize();
        window.addEventListener('resize', resize);

        const tick = () => {
            const { W, H } = sizeRef.current;
            const bubbles   = bubblesRef.current;
            const mouse     = mouseRef.current;

            /* Clear */
            ctx.clearRect(0, 0, W, H);

            /* Update physics per bubble */
            for (let i = 0; i < bubbles.length; i++) {
                const b = bubbles[i];

                /* Gravity */
                b.vy += GRAVITY;

                /* Cursor repulsion */
                const mdx  = b.x - mouse.x;
                const mdy  = b.y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
                if (mdist < REPEL_RADIUS) {
                    const force = (1 - mdist / REPEL_RADIUS) * REPEL_FORCE;
                    b.vx += (mdx / mdist) * force;
                    b.vy += (mdy / mdist) * force;
                }

                /* Integrate */
                b.x += b.vx;
                b.y += b.vy;

                /* Friction */
                b.vx *= FRICTION;

                /* Wall collisions */
                if (b.x - b.r < 0) {
                    b.x  = b.r;
                    b.vx = Math.abs(b.vx) * DAMPING_WALL;
                } else if (b.x + b.r > W) {
                    b.x  = W - b.r;
                    b.vx = -Math.abs(b.vx) * DAMPING_WALL;
                }

                /* Floor */
                if (b.y + b.r > H) {
                    b.y  = H - b.r;
                    b.vy = -Math.abs(b.vy) * DAMPING_GROUND;
                    b.vx *= 0.93;   // extra floor friction
                }

                /* Ceiling (so bubbles entering from top aren't stuck) */
                if (b.y - b.r < 0 && b.vy < 0) {
                    b.vy = Math.abs(b.vy) * DAMPING_WALL;
                }
            }

            /* Bubble-bubble collisions (O(n²) — fine for ~18 bubbles) */
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    resolveCollision(bubbles[i], bubbles[j]);
                }
            }

            /* Draw */
            for (let i = 0; i < bubbles.length; i++) {
                drawBubble(ctx, bubbles[i], iconsRef.current[i]);
            }

            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Track mouse over canvas ─────────────────────────────── */
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };
    const handleMouseLeave = () => {
        mouseRef.current = { x: -999, y: -999 };
    };

    return (
        <section id="skills" className="py-20 px-4 relative overflow-hidden">
            {/* Ambient background orbs */}
            <div className="absolute top-10 right-10 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-neon-green/5 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="max-w-5xl mx-auto">

                {/* Section heading — same style as other sections */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        My{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
                                Skills
                            </span>
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #4ade80, #3b82f6)',
                                    boxShadow: '0 0 10px rgba(74,222,128,0.6)',
                                }}
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

                {/* Physics canvas */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full rounded-2xl overflow-hidden relative"
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        height: CANVAS_H,
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
                </motion.div>
            </div>
        </section>
    );
}
