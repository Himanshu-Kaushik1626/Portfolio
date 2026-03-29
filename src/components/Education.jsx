import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────
   Education Section — vertical timeline cards
   Sized to match MyJourney section cards exactly:
   same padding (p-6), same rounded-2xl, same
   border style, same font sizes.
───────────────────────────────────────────── */
const educationData = [
    {
        institution: 'Lovely Professional University',
        degree: 'B.Tech in Computer Science Engineering',
        minor: 'Minor in Data Science',
        years: '2023 – Present',
        location: 'Phagwara, Punjab, India',
        grade: 'CGPA: 8.12',
        gradeColor: 'text-neon-green',
        description:
            'Pursuing a comprehensive engineering degree with a focus on data science and software development. Active in tech leadership roles: CEO of ARENA and former President of TechGem Sphere.',
        color: 'neon-green',
        borderColor: 'group-hover:border-neon-green/50',
        glowColor: 'rgba(74,222,128,0.25)',
        dotColor: '#4ade80',
        bgGradient: 'from-green-500/10 to-transparent',
    },
    {
        institution: 'S D R V Convent School',
        degree: 'Class XII – Science (PCM)',
        minor: null,
        years: '2022 – 2023',
        location: 'Gr. Noida, Uttar Pradesh, India',
        grade: '82.4%',
        gradeColor: 'text-neon-blue',
        description:
            'Completed higher secondary education with Physics, Chemistry, Mathematics. Developed a strong foundation in logical reasoning and programming fundamentals.',
        color: 'neon-blue',
        borderColor: 'group-hover:border-neon-blue/50',
        glowColor: 'rgba(59,130,246,0.25)',
        dotColor: '#3b82f6',
        bgGradient: 'from-blue-500/10 to-transparent',
    },
    {
        institution: 'S D R V Convent School',
        degree: 'Class X – Secondary Education',
        minor: null,
        years: '2020 – 2021',
        location: 'Gr. Noida, Uttar Pradesh, India',
        grade: '91.4%',
        gradeColor: 'text-purple-400',
        description:
            'Completed secondary education with distinction. Developed a passion for technology and problem-solving. Participated in various science exhibitions and coding competitions.',
        color: 'purple-400',
        borderColor: 'group-hover:border-purple-400/50',
        glowColor: 'rgba(168,85,247,0.25)',
        dotColor: '#a855f7',
        bgGradient: 'from-purple-500/10 to-transparent',
    },
];

/* ─── Card content — mirrors MyJourney card structure exactly ─── */
const EducationCardContent = ({ data }) => {
    const cardRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x  = e.clientX - rect.left;
        const y  = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (card) card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    }, []);

    return (
    /* Mirrors: group relative p-6 bg-white/5 rounded-2xl border border-white/10
       hover:bg-white/10 transition-all duration-300 — same as JourneyCard */
    <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 glass-card transition-all duration-300 ${data.borderColor}`}
        style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease' }}
    >
        {/* Background gradient on hover — same pattern as MyJourney */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        <div className="relative z-10">
            {/* Institution name — text-2xl font-bold, same as org name in Journey */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold" style={{ color: data.dotColor }}>
                    {data.institution}
                </h3>
                <GraduationCap size={24} style={{ color: data.dotColor }} className="opacity-80" />
            </div>

            {/* Degree — text-xl text-white font-semibold, same as role in Journey */}
            <h4 className="text-xl text-white font-semibold mb-1">{data.degree}</h4>
            {data.minor && (
                <p className="text-sm text-gray-400 font-mono mb-1">{data.minor}</p>
            )}

            {/* Years + Location — same font-mono text-sm text-gray-400 as Journey */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-4 font-mono">
                <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {data.years}
                </span>
                <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {data.location}
                </span>
            </div>

            {/* Description — same text-gray-300 leading-relaxed as Journey */}
            <p className="text-gray-300 mb-4 leading-relaxed">{data.description}</p>

            {/* Grade badge — styled as a subtle "achievement" chip, same spacing as Journey achievement list */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border ${data.gradeColor}`}
                    style={{ borderColor: `${data.dotColor}44`, background: `${data.dotColor}15` }}
                >
                    <Award size={13} />
                    {data.grade}
                </span>
            </div>
        </div>
    </div>
    );
};

/* ─── EducationCard wrapper — same alternating layout as JourneyCard ─── */
const EducationCard = ({ data, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="relative pl-8 md:pl-0"
        >
            {/* Timeline Line (Desktop) — matches MyJourney exactly */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 transition-colors duration-500"
                    style={{ borderColor: data.dotColor }}
                />
            </div>

            {/* Timeline Line (Mobile) — matches MyJourney exactly */}
            <div className="md:hidden absolute left-2 top-0 bottom-0 w-1 bg-white/10">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-800 border-2 transition-colors duration-500"
                    style={{ borderColor: data.dotColor }}
                />
            </div>

            <div className={`md:flex items-center justify-between gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                {/* Empty space for alternating alignment — same as MyJourney */}
                <div className="hidden md:block w-1/2" />

                {/* Content card — w-1/2 same as MyJourney */}
                <div className="md:w-1/2 relative" style={{ perspective: '1000px' }}>
                    <EducationCardContent data={data} />

                    {/* Connecting dot (Desktop center) — same as MyJourney */}
                    <div
                        className={`hidden md:block absolute top-6 ${isEven ? '-left-4 translate-x-1/2' : '-right-4 translate-x-1/2'} w-4 h-4 rounded-full bg-gray-900 border-2 z-10`}
                        style={{
                            borderColor: data.dotColor,
                            boxShadow: `0 0 10px ${data.dotColor}`,
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const Education = () => {
    return (
        <section id="education" className="min-h-screen py-20 px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="max-w-6xl mx-auto">
                {/* Section heading — mirrors MyJourney heading style */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        My{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
                                Education
                            </span>
                            {/* Animated underline */}
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-0.5 rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #4ade80, #3b82f6)',
                                    boxShadow: '0 0 10px rgba(74,222,128,0.6)',
                                }}
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            />
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        The academic journey that shaped my thinking and fueled my passion for technology.
                    </p>
                </motion.div>

                {/* Timeline — same space-y-12 md:space-y-24 as MyJourney */}
                <div className="relative space-y-12 md:space-y-24">
                    {/* Continuous vertical line — matches MyJourney exactly */}
                    <div className="absolute left-2 md:left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 z-0" />

                    {educationData.map((data, index) => (
                        <EducationCard key={data.institution + data.years} data={data} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
