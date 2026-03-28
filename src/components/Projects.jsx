import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Github, ExternalLink, Clock } from 'lucide-react';
import { useRef, useCallback } from 'react';

const projects = [
    {
        title: "Real-Time Image Classifier",
        description: "Mobile-first web application performing real-time image classification directly in the browser. Utilizes the device's camera via getUserMedia API and TensorFlow.js with the MobileNet model to identify objects in live video feed.",
        tags: ["React", "TailwindCSS", "TensorFlow.js", "WebRTC"],
        github: null,
        demo: null,
    },
    {
        title: "AI Resume Analyser Bot",
        description: "Telegram bot that analyzes user resumes against job descriptions. Extracts text from PDF/DOCX files and uses the Groq API for AI-driven ATS compatibility scoring and detailed feedback.",
        tags: ["Node.js", "Telegram API", "Groq AI", "Bot"],
        github: null,
        demo: null,
    },
    {
        title: "Uber Analysis Dashboard",
        description: "Interactive Power BI dashboard analyzing 4M+ Uber rides across NYC, revealing peak demand hours, hotspot zones, trip patterns, and surge pricing insights using advanced DAX queries.",
        tags: ["PowerBI", "Excel", "DAX", "Data Analytics"],
        github: "https://github.com/Himanshu-Kaushik1626/Uber-Analysis-Dashboard",
        demo: "https://www.linkedin.com/posts/himanshusharmalpu_i-recently-completed-adata-analytics-project-activity-7408567126006960129-pvel?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEeVU-8Bdnv46A1RwshggNtKeafGY89nOl0"
    },
    {
        title: "Data Visualization",
        description: "Built rich visual stories from complex datasets using Python — choropleth maps, violin plots, heatmaps, and animated bar charts to surface hidden trends in multi-dimensional data.",
        tags: ["Python", "Matplotlib", "Seaborn", "Pandas"],
        github: "https://github.com/Himanshu-Kaushik1626/Data-Visualisation",
        demo: "https://www.linkedin.com/posts/himanshusharmalpu_datascience-python-pandas-activity-7316718382744064000-dVOw?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEeVU-8Bdnv46A1RwshggNtKeafGY89nOl0"
    },
    {
        title: "Stock Price Predictor",
        description: "Deep learning model using stacked LSTM networks to forecast stock market trends with rolling-window features, achieving competitive RMSE on historical S&P 500 data.",
        tags: ["TensorFlow", "Python", "LSTM", "Keras"],
        github: null,
        demo: null,
        comingSoon: true,
    },
    {
        title: "AayurMed",
        description: "AI-powered healthcare app that analyzes patient symptoms and recommends Ayurvedic remedies via Gemini AI. Features real-time symptom checker, remedy library, and user health history.",
        tags: ["MERN Stack", "Gemini AI", "Tailwind", "MongoDB"],
        github: null,
        demo: null,
        comingSoon: true,
    },
    {
        title: "Fasal Sarthi",
        description: "Comprehensive agri-tech platform for farmers: live weather via Tomorrow.io, AI leaf disease detection using Gemini Vision, market prices, multilingual support, and a digital books library.",
        tags: ["MERN Stack", "Gemini AI", "Supabase", "Tomorrow.io"],
        github: null,
        demo: null,
        comingSoon: true,
    },
    {
        title: "Rock Paper Scissors",
        description: "Real-time gesture recognition game using OpenCV and Mediapipe hand landmarks. The AI detects your hand gesture via webcam and plays against you — zero button clicks needed.",
        tags: ["Python", "OpenCV", "Mediapipe", "CV"],
        github: "https://github.com/Himanshu-Kaushik1626/Rock_paper_scissor",
        demo: "https://www.linkedin.com/posts/himanshusharmalpu_python-ai-computervision-activity-7349772891716014080-oNd6?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEeVU-8Bdnv46A1RwshggNtKeafGY89nOl0"
    },
    {
        title: "Om-Properties",
        description: "Full-stack real estate listing platform with property search, filters, image galleries, and a contact lead system. Deployed on Vercel with a MongoDB Atlas backend.",
        tags: ["MERN Stack", "Tailwind", "MongoDB Atlas", "Vercel"],
        github: "https://github.com/Himanshu-Kaushik1626/Om-Properties",
        demo: "https://om-properties.vercel.app/"
    },
    {
        title: "TechBot",
        description: "AI-powered technical support chatbot with Gemini API integration, context-aware conversation memory, and a React chat UI. Handles code debugging, tool recommendations, and tech FAQs.",
        tags: ["MERN Stack", "Tailwind", "Gemini AI", "GenAI"],
        github: "https://github.com/Himanshu-Kaushik1626/TechBot",
        demo: null,
    },
];

const ProjectCard = ({ project, index }) => {
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
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative rounded-2xl overflow-hidden border transition-all duration-300 h-full cursor-default glass-card neon-hover-cyan"
                style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease' }}
            >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(0,245,255,0.04), transparent, rgba(255,0,204,0.04))' }} />

                {/* Coming Soon badge */}
                {project.comingSoon && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
                        <Clock size={11} />
                        Coming Soon
                    </div>
                )}

                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white pr-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.95rem', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#00f5ff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'white'}
                        >
                            {project.title}
                        </h3>
                        <div className="flex gap-3 shrink-0">
                            {project.github && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                                    <Github size={20} />
                                </a>
                            )}
                            {project.demo && (
                                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Live demo">
                                    <ExternalLink size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-400 mb-6 flex-grow leading-relaxed text-sm">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map(tag => (
                            <span key={tag}
                                className="text-xs font-mono px-2 py-1 rounded"
                                style={{ color: '#00f5ff', background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="min-h-screen py-20 px-4 relative">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-16 text-center"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                    My{' '}<span style={{
                        background: 'linear-gradient(135deg, #00f5ff, #ff00cc)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>Projects</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} project={project} index={projects.indexOf(project)} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
