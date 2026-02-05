import { motion } from 'framer-motion';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const ContactItem = ({ icon: Icon, label, value, href, color = "text-gray-400" }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
    >
        <div className={`p-3 rounded-lg bg-black/50 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-mono">{label}</p>
            <p className="text-white font-medium group-hover:text-neon-green transition-colors">{value}</p>
        </div>
    </a>
);

const Contact = () => {
    const formRef = useRef();
    const [formState, setFormState] = React.useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
        // Sign up at https://www.emailjs.com/
        const SERVICE_ID = 'service_rfp6typ';
        const TEMPLATE_ID = 'template_w0hf2lt';
        const PUBLIC_KEY = '6QJucCycUlxSD9WUJ';

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
                setIsSubmitting(false);
                setIsSubmitted(true);
                setFormState({ name: '', email: '', message: '' });
                setTimeout(() => setIsSubmitted(false), 5000);
            }, (error) => {
                console.log(error.text);
                setIsSubmitting(false);
                setError("Something went wrong. Please try again or email me directly.");
            });
    };

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section id="contact" className="min-h-screen py-20 px-4 flex items-center justify-center relative">
            <div className="max-w-6xl w-full mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="mb-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's <span className="text-neon-green">Connect</span></h2>
                            <p className="text-gray-400 text-lg">
                                Open for data analysis, data science, coding, and business roles. I'm always excited to discuss new projects and opportunities.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ContactItem
                                icon={Mail}
                                label="Email"
                                value="himanshukaushik1626..."
                                href="mailto:himanshukaushik1626@gmail.com"
                                color="text-neon-blue"
                            />
                            <ContactItem
                                icon={Phone}
                                label="Phone"
                                value="+91 7983350080"
                                href="tel:+917983350080"
                                color="text-neon-green"
                            />
                            <ContactItem
                                icon={Linkedin}
                                label="LinkedIn"
                                value="Himanshu-Sharma"
                                href="https://www.linkedin.com/in/himanshusharmalpu"
                            />
                            <ContactItem
                                icon={Twitter}
                                label="Twitter"
                                value="Himanshu Sharma"
                                href="https://x.com/Himansh24146742"
                            />
                            <ContactItem
                                icon={Instagram}
                                label="Instagram"
                                value="@lafzbykaushik_"
                                href="https://www.instagram.com/lafzbykaushik_/"
                                color="text-pink-500"
                            />
                            <ContactItem
                                icon={MessageCircle}
                                label="WhatsApp"
                                value="Chat on WhatsApp"
                                href="https://wa.me/917983350080"
                                color="text-green-500"
                            />
                        </div>

                        <div className="pt-4">
                            <p className="text-sm text-gray-500">
                                Based in Punjab, India (LPU)
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column: "How can I help you?" Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                        <h3 className="text-2xl font-bold mb-6 text-white">How can I <span className="text-neon-blue">help you?</span></h3>

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1 pl-1">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1 pl-1">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formState.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1 pl-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formState.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-neon-blue to-neon-green text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Send Message'}
                            </button>
                            {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
