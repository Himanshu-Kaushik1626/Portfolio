import { motion } from 'framer-motion';
import profilePic from '../../img/20260106_114154.jpg.jpeg';

const About = () => {
    return (
        <section id="about" className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Image / Stats Column */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="relative w-full aspect-square max-w-sm mx-auto md:max-w-md">
                        {/* Profile Pic */}
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 overflow-hidden flex items-center justify-center relative group">
                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border-2 border-neon-green/30 rounded-2xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-neon-green/5 blur-xl group-hover:bg-neon-green/10 transition-colors duration-300" />
                        </div>
                    </div>
                </motion.div>

                {/* Content Column */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        About <span className="text-neon-green">Me</span>
                    </h2>

                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                        <p>
                            I'm a 3rd-year <span className="text-white font-semibold">Computer Science Engineering</span> student at Lovely Professional University (LPU), minoring in <span className="text-white font-semibold">Data Science</span>.
                        </p>

                        <p>
                            Leadership runs in my code. I serve as the <span className="text-neon-blue font-mono">CEO of Student Organisation ARENA</span> and previously led as the <span className="text-neon-blue font-mono">President of TechGem Sphere</span>, honing my skills in management and community building.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-green/50 transition-colors">
                                <h3 className="text-neon-green font-bold text-xl mb-1">ARENA</h3>
                                <p className="text-sm text-gray-400">Chief Executive Officer</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-blue/50 transition-colors">
                                <h3 className="text-neon-blue font-bold text-xl mb-1">TechGem</h3>
                                <p className="text-sm text-gray-400">Former President</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <h3 className="text-xl font-semibold mb-4 text-white">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {[ 'MERN Stack', 'HTML/CSS','JavaScript', 'Tailwind CSS', 'Git-Github', 'Excel','PowerBI', 'SQL','Python', 'Linux','C','C++','Java', 'Canva','Figma'].map((skill) => (
                                    <span key={skill} className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
