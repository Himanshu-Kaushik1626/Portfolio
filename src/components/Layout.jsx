import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter, Instagram, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   Navbar — with dark/light mode toggle
   Mode is saved to localStorage.
───────────────────────────────────────────── */
const Navbar = ({ theme, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'About',    href: '#about' },
        { name: 'Skills',   href: '#skills' },
        { name: 'Education',href: '#education' },
        { name: 'Journey',  href: '#my-journey' },
        { name: 'Certs',    href: '#certifications' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact',  href: '#contact' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b"
            style={{ background: 'rgba(6,0,15,0.7)', borderColor: 'rgba(0,245,255,0.1)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span
                            style={{
                                fontFamily: "'Orbitron', monospace",
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                letterSpacing: '0.1em',
                                background: 'linear-gradient(135deg, #00f5ff, #ff00cc)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 8px rgba(0,245,255,0.5))',
                                cursor: 'pointer',
                            }}
                        >
                            HS//
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-400 hover:text-[#00f5ff] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 font-mono tracking-wide"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                        {/* Dark/Light toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="ml-4 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-200 text-gray-300 hover:text-neon-green"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                    <div className="-mr-2 flex md:hidden items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-300"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
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
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
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
            </AnimatePresence>
        </nav>
    );
};

/* ─────────────────────────────────────────────
   Footer — Enhanced with wave divider, socials,
   animated links, and "Made with ❤️" line.
───────────────────────────────────────────── */
const Footer = () => {
    return (
        <footer className="relative mt-20 overflow-hidden">
            {/* Wave SVG divider */}
            <div className="w-full overflow-hidden leading-none" aria-hidden="true">
                <svg
                    viewBox="0 0 1440 80"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    className="w-full h-16 md:h-20"
                >
                    <path
                        d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z"
                        fill="rgba(255,255,255,0.03)"
                    />
                    <path
                        d="M0,55 C300,10 600,70 900,45 C1100,25 1300,55 1440,35 L1440,80 L0,80 Z"
                        fill="rgba(74,222,128,0.04)"
                    />
                </svg>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border-t border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top row */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                        {/* Brand */}
                        <div className="text-center md:text-left">
                            <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-blue">
                                HIMANSHU SHARMA
                            </span>
                            <p className="text-gray-500 text-sm mt-1">
                                B.Tech CSE · Data Science Enthusiast · Builder
                            </p>
                        </div>

                        {/* Social links */}
                        <div className="flex items-center gap-5">
                            <SocialIcon Icon={Github} href="https://github.com/Himanshu-Kaushik1626" label="GitHub" />
                            <SocialIcon Icon={Linkedin} href="https://www.linkedin.com/in/himanshusharmalpu" label="LinkedIn" />
                            <SocialIcon Icon={Twitter} href="https://x.com/Himansh24146742" label="Twitter / X" />
                            <SocialIcon Icon={Instagram} href="https://www.instagram.com/lafzbykaushik_/" label="Instagram" />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    {/* Bottom row */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
                        <p>© 2026 Himanshu Sharma. All rights reserved.</p>
                        <p className="flex items-center gap-1">
                            Made with{' '}
                            <motion.span
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                                className="inline-block text-red-400 text-base"
                            >
                                ❤️
                            </motion.span>{' '}
                            by{' '}
                            <span className="text-neon-green font-medium ml-1">Himanshu Sharma</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ Icon, href, label }) => {
    if (!href || href === '#') return null;
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-neon-green transition-colors duration-200"
        >
            <Icon size={20} />
        </motion.a>
    );
};

/* Layout wraps nav + children + footer, and manages theme state. */
export default function Layout({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('portfolio-theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    return (
        <div className="min-h-screen flex flex-col" data-theme={theme}>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
        </div>
    );
}
