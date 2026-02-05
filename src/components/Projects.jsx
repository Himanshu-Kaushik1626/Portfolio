import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
    {
        title: "Uber Analysis Dashboard",
        description: "A data visualization dashboard for real-time analytics.",
        tags: ["PowerBI", "Excel"],
        github: "https://github.com/Himanshu-Kaushik1626/Uber-Analysis-Dashboard",
        demo: "https://www.linkedin.com/posts/himanshusharmalpu_i-recently-completed-adata-analytics-project-activity-7408567126006960129-pvel?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEeVU-8Bdnv46A1RwshggNtKeafGY89nOl0"
    },
    {
        title: "Data Visualization ",
        description: "Visualizing complex datasets using Python libraries.",
        tags: ["Python", "Matplotlib", "Seaborn"],
        github: "https://github.com/Himanshu-Kaushik1626/Data-Visualisation",
        demo: "https://www.linkedin.com/posts/himanshusharmalpu_datascience-python-pandas-activity-7316718382744064000-dVOw?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEeVU-8Bdnv46A1RwshggNtKeafGY89nOl0"
    },
    {
        title: "Stock Price Predictor",
        description: "Predictive model for stock market trends using LSTM.",
        tags: ["TensorFlow", "Python"],
        github: "#",
        demo: "#"
    },
    {
        title: "AayurMed",
        description: "AI based healthcare app for symptom analysis and remedy suggestions by Aayurveda.",
        tags: ["MERN Stack", "AI/ML", "Tailwind","HTML/CSS"],
        github: "#",
        demo: "#"
    },
    {
        title: "Fasal Sarthi",
        description: "A comprehensive platform for farmers to access agricultural resources and market information.",
        tags: ["MERN Stack", "AI/ML", "Tailwind","HTML/CSS"],
        github: "#",
        demo: "#"
    },
    {
        title: "Rock Paper Scissors Game",
        description: "A classic Rock Paper Scissors game by Hand Gesture Recognition using OpenCV and Mediapipe.",
        tags: ["Python", "OpenCV", "Mediapipe"],
        github: "https://github.com/Himanshu-Kaushik1626/Rock_paper_scissor",
        demo: "https://www.linkedin.com/posts/himanshusharmalpu_python-ai-computervision-activity-7349772891716014080-oNd6?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEeVU-8Bdnv46A1RwshggNtKeafGY89nOl0"
    },
    {
        title: "Om-Properties",
        description: "Real estate listing platform for selling, and contact purposes.",
        tags: ["MERN Stack",  "Tailwind","HTML/CSS"],
        github: "https://github.com/Himanshu-Kaushik1626/Om-Properties",
        demo: "https://om-properties.vercel.app/"
    },
    {
        title: "TechBot",
        description: "AI-powered chatbot for technical support and user assistance.",
        tags: ["MERN Stack",  "Tailwind","HTML/CSS",'AI/ML','Python','GenAI'],
        github: "https://github.com/Himanshu-Kaushik1626/TechBot",
        demo: ""
    },

];

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-neon-blue/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
                        {project.title}
                    </h3>
                    <div className="flex gap-3">
                        <a href={project.github} className="text-gray-400 hover:text-white transition-colors">
                            <Github size={20} />
                        </a>
                        <a href={project.demo} className="text-gray-400 hover:text-white transition-colors">
                            <ExternalLink size={20} />
                        </a>
                    </div>
                </div>

                <p className="text-gray-400 mb-6 flex-grow">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

const Projects = () => {
    return (
        <section id="projects" className="min-h-screen py-20 px-4 relative">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-16 text-center"
                >
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">Projects</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
