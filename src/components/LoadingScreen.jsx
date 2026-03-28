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
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
                    style={{ background: '#020510' }}
                    aria-label="Loading portfolio"
                >
                    {/* Outer glow ring — cyberpunk cyan/magenta */}
                    <motion.div
                        className="absolute w-56 h-56 rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, #00ffff, #ff00ff, #4ade80, #00ffff)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
                    />
                    <div className="absolute w-52 h-52 rounded-full" style={{ background: '#020510' }} />

                    <motion.div
                        className="relative z-10 text-center select-none"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'backOut' }}
                    >
                        <span
                            className="text-7xl font-black tracking-tight font-mono"
                            style={{
                                background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.7))',
                            }}
                        >
                            HS//
                        </span>
                        <p className="text-xs font-mono mt-2 tracking-widest" style={{ color: 'rgba(0,255,255,0.4)' }}>BOOT.exe</p>
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
                                className="w-2 h-2 rounded-full"
                                style={{ background: i % 2 === 0 ? '#00ffff' : '#ff00ff' }}
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
