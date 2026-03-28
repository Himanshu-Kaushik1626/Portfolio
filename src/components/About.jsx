import { motion } from 'framer-motion';
import profilePic from '../../img/imgg1.jpg.jpeg';

/* ─── Stats data from resume ─────────────────────────────── */
const STATS = [
    { label: 'CGPA',         value: '8.12',  accent: '#00ffff' },
    { label: 'Projects',     value: '10+',   accent: '#ff00ff' },
    { label: 'Events Led',   value: '15+',   accent: '#4ade80' },
    { label: 'Team Members', value: '100+',  accent: '#f59e0b' },
];

/* ─── Role cards ─────────────────────────────────────────── */
const ROLES = [
    { org: 'ARENA',       title: 'Chief Executive Officer',   accent: '#00ffff', period: '2025 – Present' },
    { org: 'TechGem',     title: 'President',                 accent: '#ff00ff', period: '2024 – 2025'   },
    { org: 'Untangle',    title: 'Core Team Member',          accent: '#4ade80', period: '2023 – 2024'   },
];

const About = () => {
    return (
        <section id="about" className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* ── Image Column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-[3/4] max-w-sm mx-auto md:max-w-md">
                            {/* Cyberpunk frame glow */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-fuchsia-500/20 to-green-400/30 blur-sm -z-10" />
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 overflow-hidden flex items-center justify-center relative group">
                                <img
                                    src={profilePic}
                                    alt="Himanshu Sharma"
                                    loading="lazy"
                                    className="w-full h-full rounded-2xl"
                                    style={{
                                        objectFit: 'cover',
                                        transform: 'scale(1.08)',
                                        transition: 'transform 0.4s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.13)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                                />
                                {/* Cyberpunk scan line overlay */}
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
                                    }}
                                />
                                {/* Corner brackets */}
                                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400/60" />
                                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400/60" />
                                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-fuchsia-400/60" />
                                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-fuchsia-400/60" />
                                {/* Status label */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-cyan-400/40 bg-black/60 backdrop-blur-sm">
                                    <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                                        ONLINE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Content Column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* HUD tag */}
                        <div className="inline-block mb-3 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/5 font-mono text-cyan-400 text-xs tracking-widest uppercase">
                            // SYSTEM.PROFILE
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-5"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                            About <span style={{ color: '#00f5ff', textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>Me</span>
                        </h2>

                        <div className="space-y-3 text-gray-300 leading-relaxed mb-6">
                            <p>
                                I'm a 3rd-year{' '}
                                <span className="text-white font-semibold">Computer Science Engineering</span>{' '}
                                student at Lovely Professional University, minoring in{' '}
                                <span className="text-white font-semibold">Data Science</span>.
                            </p>
                            <p>
                                Passionate about building{' '}
                                <span className="font-semibold" style={{ color: '#00ffff' }}>AI-powered applications</span>,{' '}
                                full-stack systems, and data pipelines that solve real problems at scale. I love the intersection of data science and software engineering.
                            </p>
                            <p>
                                Leading as{' '}
                                <span className="font-mono" style={{ color: '#ff00ff' }}>CEO of ARENA</span>{' '}
                                — a 100+ member student org — and ex-President of{' '}
                                <span className="font-mono" style={{ color: '#ff00ff' }}>TechGem Sphere</span>,
                                I've organized 15+ major tech events and built a thriving community.
                            </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {STATS.map(s => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="p-3 rounded-xl border text-center"
                                    style={{ borderColor: s.accent + '30', background: s.accent + '08' }}
                                >
                                    <p className="text-2xl font-black font-mono" style={{ color: s.accent }}>{s.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 font-mono uppercase tracking-wide">{s.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Role cards */}
                        <div className="flex flex-col gap-2">
                            {ROLES.map((r, i) => (
                                <motion.div
                                    key={r.org}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group"
                                    style={{ borderColor: r.accent + '25', background: r.accent + '05' }}
                                    whileHover={{ borderColor: r.accent + '50', background: r.accent + '10' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.accent, boxShadow: `0 0 8px ${r.accent}` }} />
                                        <div>
                                            <span className="font-bold text-white text-sm">{r.org}</span>
                                            <span className="text-gray-400 text-xs ml-2">{r.title}</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs" style={{ color: r.accent }}>{r.period}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
