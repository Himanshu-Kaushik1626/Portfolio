import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   LoadingScreen — shown for ~2s on first visit
   then fades out to reveal the portfolio.
───────────────────────────────────────────── */
const LoadingScreen = ({ onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            // Give the exit animation time to finish before notifying parent
            setTimeout(onComplete, 600);
        }, 1800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505]"
                    aria-label="Loading portfolio"
                >
                    {/* Outer glow ring */}
                    <motion.div
                        className="absolute w-56 h-56 rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, #4ade80, #3b82f6, #a855f7, #4ade80)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                    />
                    <div className="absolute w-52 h-52 rounded-full bg-[#050505]" />

                    {/* HS initials */}
                    <motion.div
                        className="relative z-10 text-center select-none"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'backOut' }}
                    >
                        <span
                            className="text-7xl font-black tracking-tight"
                            style={{
                                background: 'linear-gradient(135deg, #4ade80, #3b82f6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 20px rgba(74,222,128,0.6))',
                            }}
                        >
                            HS
                        </span>
                    </motion.div>

                    {/* Loading dots */}
                    <motion.div
                        className="absolute bottom-16 flex gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-2 h-2 rounded-full bg-neon-green"
                                animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.15,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
