import { useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import MyJourney from './components/MyJourney';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ThreeDCat from './components/ThreeDCat';
import BackgroundEffect from './components/BackgroundEffect';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import ScrollProgressBar from './components/ScrollProgressBar';
import Education from './components/Education';
import BackToTop from './components/BackToTop';
import Certifications from './components/Certifications';

function App() {
    const [loaded, setLoaded] = useState(false);
    const [backgroundMode, setBackgroundMode] = useState('cyberpunk');

    const backgroundModes = [
        { key: 'cyberpunk', label: 'Cyberpunk' },
        { key: 'night', label: 'Night' },
        { key: 'minimal', label: 'Minimal' },
    ];

    return (
        <>
            {/* ─── Loading Screen ─────────────────────────────── */}
            <LoadingScreen onComplete={() => setLoaded(true)} />

            {/* ─── Global overlays ────────────────────────────── */}
            <ScrollProgressBar />
            <CustomCursor />
            <BackToTop />

            {/* ─── Main content ───────────────────────────────── */}
            {loaded && (
                <>
                    <BackgroundEffect />
                    <ThreeDCat />
                    <Layout>
                        <Hero />
                        <About />
                        <Skills />       {/* New balloon skills section */}
                        <Education />
                        <MyJourney />
                        <Certifications />
                        <Projects />
                        <Contact />
                    </Layout>
                </>
            )}
        </>
    );
}

export default App;
