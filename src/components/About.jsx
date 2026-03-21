import { motion } from 'framer-motion';
import profilePic from '../../img/imgg1.jpg.jpeg';

/* ─────────────────────────────────────────────────────────
   About Section — profile image + bio + role cards
   Skills have been moved to the dedicated Skills section.
   Image: scale(1.08) to fill frame, hover → scale(1.13)
───────────────────────────────────────────────────────── */
const About = () => {
    return (
        <section id="about" className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                {/* ── Image Column ── */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="relative w-full aspect-[3/4] max-w-sm mx-auto md:max-w-md">
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 overflow-hidden flex items-center justify-center relative group">
                            {/* Image with zoom fill — scale(1.08) baseline, scale(1.13) on hover */}
                            <img
                                src={profilePic}
                                alt="Himanshu Sharma"
                                className="w-full h-full rounded-2xl"
                                style={{
                                    objectFit: 'cover',
                                    transform: 'scale(1.08)',
                                    transition: 'transform 0.4s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.13)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                            />
                            {/* Decorative offset frame */}
                            <div className="absolute inset-0 border-2 border-neon-green/30 rounded-2xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 bg-neon-green/5 blur-xl group-hover:bg-neon-green/10 transition-colors duration-300 pointer-events-none" />
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
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        About <span className="text-neon-green">Me</span>
                    </h2>

                    <div className="space-y-4 text-gray-300 text-lg leading-relaxed mb-8">
                        <p>
                            I'm a 3rd-year{' '}
                            <span className="text-white font-semibold">Computer Science Engineering</span>{' '}
                            student at Lovely Professional University (LPU), minoring in{' '}
                            <span className="text-white font-semibold">Data Science</span>.
                        </p>

                        <p>
                            I am passionate about solving real-world problems using{' '}
                            <span className="text-white font-semibold">Data Structures &amp; Algorithms</span>{' '}
                            and building scalable applications. I enjoy working on{' '}
                            <span className="text-white font-semibold">AI-based systems, web development,</span>{' '}
                            and automation projects.
                        </p>

                        <p>
                            Leadership runs in my code. I currently serve as the{' '}
                            <span className="text-neon-blue font-mono">CEO of Student Organisation ARENA</span>{' '}
                            and previously led as the{' '}
                            <span className="text-neon-blue font-mono">President of TechGem Sphere</span>,
                            where I developed strong skills in management, teamwork, and community building.
                        </p>
                    </div>

                    {/* Role cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-green/50 transition-colors">
                            <h3 className="text-neon-green font-bold text-xl mb-1">ARENA</h3>
                            <p className="text-sm text-gray-400">Chief Executive Officer</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-blue/50 transition-colors">
                            <h3 className="text-neon-blue font-bold text-xl mb-1">TechGem</h3>
                            <p className="text-sm text-gray-400">Former President</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
