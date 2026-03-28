import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Star } from 'lucide-react';

const journeyData = [
    {
        organization: "Untangle",
        role: "Member → Core Team",
        period: "2023 - 2024", // Adjust dates if needed
        description: "Started as a normal member, proved dedication, and got promoted to the Core Team.",
        achievements: [
            "Conducted more than 8 successful events",
            "Managed volunteer teams",
            "Active contribution to community growth"
        ],
        icon: Users,
        color: "text-neon-blue",
        borderColor: "group-hover:border-neon-blue/50",
        bgGradient: "from-blue-500/10 to-transparent"
    },
    {
        organization: "TechGem Sphere",
        role: "President",
        period: "2024 - 2025",
        description: "Joined to lead and organize technical events for the student community.",
        achievements: [
            "Led the organization of 30+ students as President",
            "Organized 3+ major Tech Events",
            "Spearheaded technical workshops",
            "Collaborated with industry experts"
        ],
        icon: Trophy,
        color: "text-purple-400",
        borderColor: "group-hover:border-purple-400/50",
        bgGradient: "from-purple-500/10 to-transparent"
    },
    {
        organization: "ARENA",
        role: "Chief Executive Officer (CEO)",
        period: "2025 - Present",
        description: "Leading the organization to new heights with strategic vision and event management.",
        achievements: [
            "Led the organization of 50+ students as CEO",
            "Organized 3+ high-impact events",
            "Leading a diverse team of students",
            "Setting strategic goals for the organization"
        ],
        icon: Star,
        color: "text-neon-green",
        borderColor: "group-hover:border-neon-green/50",
        bgGradient: "from-green-500/10 to-transparent"
    }
];

const JourneyCard = ({ data, index }) => {
    const isEven = index % 2 === 0;
    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative pl-8 md:pl-0`}
        >
            {/* Timeline Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 border-whit transition-colors duration-500 ${data.color.replace('text-', 'border-')}`} />
            </div>

            {/* Timeline Line (Mobile) */}
            <div className="md:hidden absolute left-2 top-0 bottom-0 w-1 bg-white/10">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-800 border-2 transition-colors duration-500 ${data.color.replace('text-', 'border-')}`} />
            </div>

            <div className={`md:flex items-center justify-between gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Empty Space for Timeline Alignment */}
                <div className="hidden md:block w-1/2" />

                {/* Content Card */}
                <div className="md:w-1/2 relative">
                    <div className={`group relative p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 ${data.borderColor}`}>
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`text-2xl font-bold ${data.color}`}>{data.organization}</h3>
                                <data.icon className={`${data.color} opacity-80`} size={24} />
                            </div>

                            <h4 className="text-xl text-white font-semibold mb-1">{data.role}</h4>

                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-mono">
                                <Calendar size={14} />
                                <span>{data.period}</span>
                            </div>

                            <p className="text-gray-300 mb-4 leading-relaxed">
                                {data.description}
                            </p>

                            <ul className="space-y-2">
                                {data.achievements.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${data.color.replace('text-', 'bg-')}`} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Connecting Dot for Desktop (Center) */}
                    <div className={`hidden md:block absolute top-6 ${index % 2 === 0 ? '-left-4 translate-x-1/2' : '-right-4 translate-x-1/2'} w-4 h-4 rounded-full bg-gray-900 border-2 ${data.color.replace('text-', 'border-')} z-10 shadow-[0_0_10px_currentColor] ${data.color}`} />
                </div>
            </div>
        </motion.div>
    );
};

const MyJourney = () => {
    return (
        <section id="my-journey" className="min-h-screen py-20 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">Journey</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        From a curious learner to a community leader. Here's how I evolved.
                    </p>
                </motion.div>

                <div className="relative space-y-12 md:space-y-24">
                    {/* Continuous Vertical Line Background */}
                    <div className="absolute left-2 md:left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 z-0" />

                    {journeyData.map((data, index) => (
                        <JourneyCard key={data.organization} data={data} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MyJourney;
