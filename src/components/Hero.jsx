import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

/* ─── Particle canvas — floating stars/dots in hero ──────── */
const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.removeEventListener('resize', resize);
            return;
        }

        const PARTICLE_COUNT = 80;
        const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + 0.3,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.6 + 0.2,
            color: Math.random() > 0.5 ? '#4ade80' : Math.random() > 0.5 ? '#3b82f6' : '#a855f7',
        }));

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();

                // Drift
                p.x += p.dx;
                p.y += p.dy;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Twinkle
                p.alpha += (Math.random() - 0.5) * 0.02;
                p.alpha = Math.max(0.1, Math.min(0.8, p.alpha));
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

// Text Part Component with Directional Scroll Animation
const StyledNamePart = ({ text, direction }) => {
    const { scrollY } = useScroll();
    const targetX = direction === 'left' ? -800 : 800;
    const x = useTransform(scrollY, [0, 400], [0, targetX]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <motion.div style={{ x, opacity }} className="relative inline-block mx-2">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-white to-neon-blue font-black tracking-tight select-none filter drop-shadow-[0_0_15px_rgba(74,222,128,0.6)] animate-pulse">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-green blur-md opacity-50">
                {text}
            </span>
        </motion.div>
    );
};

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* ── Particle star background ── */}
            <ParticleCanvas />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/10 backdrop-blur-md">
                        <span className="text-neon-green font-mono text-sm">Open to Work</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight relative z-20 flex flex-col md:block gap-2">
                        <span className="text-4xl md:text-6xl text-gray-400 block mb-2">Hi, I'm</span>

                        {/* Himanshu → Moves LEFT */}
                        <StyledNamePart text="Himanshu" direction="left" />

                        {/* Sharma → Moves RIGHT */}
                        <StyledNamePart text="Sharma" direction="right" />
                    </h1>

                    <div className="text-xl md:text-2xl text-gray-400 mb-8 font-light h-20">
                        <p>B.Tech CSE Student @ LPU</p>
                        <p className="text-sm mt-2 font-mono text-neon-blue">
                            Data Science Enthusiast | CEO "ARENA" | President "TechGem Sphere"
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#projects"
                            className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                        >
                            View Projects
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="#contact"
                            className="px-8 py-3 border border-white/20 hover:border-white/50 rounded-lg backdrop-blur-sm transition-colors"
                        >
                            Contact Me
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
};

export default Hero;
