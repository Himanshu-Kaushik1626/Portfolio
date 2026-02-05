import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BackgroundEffect = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear any existing bubbles to prevent duplicates on HMR
        container.innerHTML = '';

        const bubbleCount = 60;
        const bubbles = [];

        // Create bubbles
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');

            // Random properties
            const size = Math.random() * 60 + 20; // 20px - 80px
            const left = Math.random() * 100; // 0% - 100%
            const top = Math.random() * 100; // 0% - 100%
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            const hue = Math.random() * 60 + 120; // Greens to Blues (120 - 180) for Gen Z aesthetic

            // Style
            bubble.style.position = 'absolute';
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.top = `${top}%`;
            bubble.style.borderRadius = '50%';
            bubble.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 80%, 60%, 0.4), hsla(${hue}, 80%, 60%, 0))`;
            bubble.style.filter = 'blur(3px)';
            bubble.style.opacity = '0.6';
            bubble.style.zIndex = '-1';

            container.appendChild(bubble);
            bubbles.push(bubble);

            // 1. Float Animation (Continuous)
            gsap.to(bubble, {
                y: '-=100',
                x: '+=50',
                rotation: 360,
                duration: duration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: delay
            });

            // 2. Scroll Parallax (Opposite direction)
            // When scrolling DOWN (up in logic), they should move UP faster?
            // "Opposite direction of scrolling": 
            // Scroll down -> Page goes up. Bubbles go DOWN?
            // Let's interpret "Opposite" as: content moves up, these move down to create depth.
            // Or usually "Opposite" means they move AGAINST the scroll flow.
            // Let's set a distinct parallax speed.
            const speed = Math.random() * 0.5 + 0.2;

            gsap.to(bubble, {
                y: (i, target) => -ScrollTrigger.maxScroll(window) * speed, // Move UP significantly when scrolling
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.5 // Smooth scrubbing
                }
            });
        }

        return () => {
            // Cleanup GSAP instances
            ScrollTrigger.getAll().forEach(t => t.kill());
            gsap.killTweensOf(bubbles);
            if (container) container.innerHTML = '';
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-50"
            style={{ perspective: '1000px' }}
        />
    );
};

export default BackgroundEffect;
