import { motion } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-blue cursor-pointer font-mono">
                            HIMANSHU SHARMA
                        </span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-300 hover:text-neon-green px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-black/95 backdrop-blur-xl"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:text-neon-green block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

const Footer = () => {
    return (
        <footer className="bg-black/50 backdrop-blur-sm border-t border-white/5 py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <p className="text-gray-400 text-sm">© 2026 Himanshu Sharma. All rights reserved.</p>
                </div>
                <div className="flex space-x-6">
                    <SocialIcon Icon={Github} href="https://github.com/Himanshu-Kaushik1626" label="GitHub" />
                    <SocialIcon Icon={Linkedin} href="https://www.linkedin.com/in/himanshusharmalpu" label="LinkedIn" />
                    <SocialIcon Icon={Twitter} href="#" label="Twitter (not set)" />
                    <SocialIcon Icon={Instagram} href="https://www.instagram.com/lafzbykaushik_/" label="Instagram" />
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ Icon, href, label }) => {
    if (!href || href === '#') return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="text-gray-400 hover:text-neon-green transition-colors duration-200"
        >
            <Icon size={20} />
        </a>
    );
};

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}
