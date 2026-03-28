import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

/* ─── Certifications from resume ─────────────────────────── */
const CERTS = [
    {
        title: 'Data With Python',
        issuer: 'LPU / Internal',
        date: '2024',
        color: '#3b82f6',
        link: null,
    },
    {
        title: 'Java Programming',
        issuer: 'NeoCollab',
        date: '2024',
        color: '#f59e0b',
        link: null,
    },
    {
        title: 'CS Engineering (CSE101)',
        issuer: 'NeoCollab',
        date: '2023',
        color: '#00ffff',
        link: null,
    },
    {
        title: 'CSE205 — Data Structures',
        issuer: 'NeoCollab',
        date: '2024',
        color: '#ff00ff',
        link: null,
    },
    {
        title: 'CSE202 — Algorithm Design',
        issuer: 'NeoCollab',
        date: '2024',
        color: '#4ade80',
        link: null,
    },
    {
        title: 'C Programming',
        issuer: 'Coursera',
        date: '2023',
        color: '#a855f7',
        link: null,
    },
    {
        title: 'Data Analytics / PowerBI',
        issuer: 'LPU — INT374',
        date: '2024',
        color: '#f97316',
        link: null,
    },
    {
        title: 'Coursera — Data Science',
        issuer: 'Coursera',
        date: '2024',
        color: '#38bdf8',
        link: null,
    },
];

const Certifications = () => {
    return (
        <section id="certifications" className="py-20 px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full blur-3xl -z-10 animate-pulse"
                style={{ background: 'rgba(0,255,255,0.04)' }} />
            <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full blur-3xl -z-10 animate-pulse"
                style={{ background: 'rgba(255,0,255,0.04)' }} />

            <div className="max-w-6xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    {/* HUD label */}
                    <div className="inline-block mb-3 px-3 py-1 font-mono text-xs tracking-widest uppercase"
                        style={{ border: '1px solid rgba(0,255,255,0.25)', color: 'rgba(0,255,255,0.6)', background: 'rgba(0,255,255,0.04)' }}>
                        // CREDENTIALS.DB
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        Certifications &{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #00f5ff, #ff00cc)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Achievements
                        </span>
                    </h2>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">
                        Verified credentials from Coursera, NeoCollab, and LPU coursework.
                    </p>
                </motion.div>

                {/* Cert grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CERTS.map((cert, i) => (
                        <motion.div
                            key={cert.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.5 }}
                            className="relative group p-5 rounded-xl border transition-all duration-300 cursor-default glass-card"
                            style={{
                                borderColor: cert.color + '25',
                                background: cert.color + '06',
                            }}
                            whileHover={{ borderColor: cert.color + '55', background: cert.color + '12' }}
                        >
                            {/* Glow dot */}
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full"
                                style={{ backgroundColor: cert.color, boxShadow: `0 0 8px ${cert.color}` }} />

                            {/* Icon */}
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                                style={{ background: cert.color + '15', border: `1px solid ${cert.color}30` }}>
                                <Award size={20} style={{ color: cert.color }} />
                            </div>

                            {/* Content */}
                            <h3 className="font-bold text-white text-sm mb-1 leading-tight">{cert.title}</h3>
                            <p className="text-xs font-mono mb-2" style={{ color: cert.color }}>{cert.issuer}</p>
                            <p className="text-xs text-gray-600 font-mono">{cert.date}</p>

                            {cert.link && (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer"
                                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ color: cert.color }}>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Achievement bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 p-5 rounded-xl border flex flex-wrap items-center justify-around gap-6 glass-card"
                    style={{ borderColor: 'rgba(0,245,255,0.15)' }}
                >
                    {[
                        { val: '8.12', label: 'CGPA at LPU', color: '#00ffff' },
                        { val: '100+',  label: 'Students Led', color: '#ff00ff' },
                        { val: '15+',  label: 'Events Organized', color: '#4ade80' },
                        { val: '5+',   label: 'Hackathons', color: '#f59e0b' },
                        { val: '10+',   label: 'Projects Built', color: '#a855f7' },
                    ].map(a => (
                        <div key={a.label} className="text-center">
                            <p className="text-3xl font-black font-mono" style={{ color: a.color, textShadow: `0 0 20px ${a.color}40` }}>
                                {a.val}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-widest">{a.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Certifications;
