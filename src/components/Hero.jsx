import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, ChevronDown, Download } from 'lucide-react';

/* ─── Typing Animator ───────────────────────────────────── */
const ROLES = [
    'Data Science Enthusiast',
    'Full-Stack Developer',
    'CEO of ARENA',
    'AI / ML Builder',
    'Open to Work 🚀',
];

const TypingText = () => {
    const [roleIdx, setRoleIdx] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) {
            const t = setTimeout(() => setPaused(false), 1600);
            return () => clearTimeout(t);
        }

        const current = ROLES[roleIdx];
        if (!deleting && displayed === current) {
            setPaused(true);
            setTimeout(() => setDeleting(true), 1600);
            return;
        }

        const speed = deleting ? 35 : 60;
        const t = setTimeout(() => {
            if (deleting) {
                setDisplayed(prev => prev.slice(0, -1));
                if (displayed.length === 1) {
                    setDeleting(false);
                    setRoleIdx(i => (i + 1) % ROLES.length);
                }
            } else {
                setDisplayed(current.slice(0, displayed.length + 1));
            }
        }, speed);

        return () => clearTimeout(t);
    }, [displayed, deleting, roleIdx, paused]);

    return (
        <span className="text-neon-green font-mono">
            {displayed}
            <span className="animate-pulse">|</span>
        </span>
    );
};

/* ─── Particle canvas — floating stars/dots in hero ──────── */
const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.removeEventListener('resize', resize);
            return;
        }

        const PARTICLE_COUNT = 70;
        const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height,
            r:     Math.random() * 1.6 + 0.3,
            dx:    (Math.random() - 0.5) * 0.25,
            dy:    (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.5 + 0.15,
            color: Math.random() > 0.5
                ? '#4ade80'
                : Math.random() > 0.5 ? '#3b82f6' : '#a855f7',
        }));

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle  = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();

                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                p.alpha += (Math.random() - 0.5) * 0.015;
                p.alpha = Math.max(0.08, Math.min(0.7, p.alpha));
            }
            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

/* ─── Name part with parallax scroll ────────────────────── */
const StyledNamePart = ({ text, direction }) => {
    const { scrollY } = useScroll();
    const targetX = direction === 'left' ? -800 : 800;
    const x       = useTransform(scrollY, [0, 400], [0, targetX]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <motion.div style={{ x, opacity }} className="relative inline-block mx-2">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-white to-neon-blue font-black tracking-tight select-none filter drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-green blur-md opacity-40">
                {text}
            </span>
        </motion.div>
    );
};

/* ─── Hero ───────────────────────────────────────────────── */
const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <ParticleCanvas />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                >
                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-sm font-mono text-sm tracking-wide"
                        style={{ border: '1px solid rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.04)', color: '#00f5ff' }}
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 10px #00f5ff' }} />
                        SYS::AVAILABLE_FOR_OPPORTUNITIES
                    </motion.div>

                    {/* Main heading */}
                    <h1 className="text-6xl sm:text-7xl md:text-9xl font-black mb-4 tracking-tight relative z-20">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-semibold block mb-3 font-mono tracking-widest"
                            style={{ color: 'rgba(0,245,255,0.5)', letterSpacing: '0.3em' }}
                        >
                            &gt; HI.exe
                        </span>
                        <StyledNamePart text="Himanshu" direction="left" />
                        <StyledNamePart text="Sharma"   direction="right" />
                    </h1>

                    {/* Typing subtitle */}
                    <div className="text-lg md:text-2xl text-gray-400 mb-3 font-light min-h-[2.5rem] flex items-center justify-center">
                        <TypingText />
                    </div>

                    {/* Sub-subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-sm md:text-base text-gray-500 mb-10 font-mono tracking-wide"
                    >
                        B.Tech CSE @ LPU &nbsp;·&nbsp; Minor in Data Science &nbsp;·&nbsp; Phagwara, India
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
                    >
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            href="#projects"
                            className="px-8 py-3.5 font-bold rounded-sm text-black text-sm tracking-wide"
                            style={{
                                background: 'linear-gradient(135deg, #00f5ff, #8a2be2)',
                                boxShadow: '0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(138,43,226,0.2)',
                            }}
                        >
                            ▸ VIEW PROJECTS
                        </motion.a>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            href="/resume.pdf"
                            download
                            className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold tracking-wide rounded-sm"
                            style={{
                                border: '1px solid rgba(255,0,204,0.5)',
                                color: '#ff00cc',
                                background: 'rgba(255,0,204,0.06)',
                                boxShadow: '0 0 15px rgba(255,0,204,0.2)',
                            }}
                        >
                            <Download size={16} />
                            DOWNLOAD.CV
                        </motion.a>

                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            href="#contact"
                            className="px-8 py-3.5 text-sm font-semibold rounded-sm"
                            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                        >
                            CONTACT.ME
                        </motion.a>
                    </motion.div>

                    {/* Social pills */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <a
                            href="https://github.com/Himanshu-Kaushik1626"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-mono"
                            style={{ border: '1px solid rgba(0,255,255,0.2)', color: 'rgba(0,255,255,0.7)', borderRadius: '2px', background: 'rgba(0,255,255,0.04)' }}
                        >
                            <Github size={15} />
                            /GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/himanshusharmalpu"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-mono"
                            style={{ border: '1px solid rgba(255,0,255,0.2)', color: 'rgba(255,0,255,0.7)', borderRadius: '2px', background: 'rgba(255,0,255,0.04)' }}
                        >
                            <Linkedin size={15} />
                            /LinkedIn
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative glow blobs */}
            <div className="absolute top-1/4 left-1/4   w-72 h-72 bg-neon-green/8  rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/8 rounded-full blur-[120px] pointer-events-none" />

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
            >
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(0,255,255,0.4)' }}>SCROLL</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown size={22} style={{ color: '#00ffff', opacity: 0.6 }} />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
