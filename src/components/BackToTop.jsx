import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/* ─────────────────────────────────────────────
   BackToTop — floating button that appears after
   scrolling 300px. Bounce-in animation.
───────────────────────────────────────────── */
const BackToTop = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY > 300);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    key="back-to-top"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.3, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Back to top"
                    style={{
                        position: 'fixed',
                        bottom: 28,
                        right: 28,
                        zIndex: 998,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4ade80, #3b82f6)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(74,222,128,0.5)',
                        color: '#000',
                    }}
                >
                    <ArrowUp size={20} strokeWidth={2.5} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
