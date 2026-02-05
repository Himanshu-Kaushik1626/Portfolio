import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import MyJourney from './components/MyJourney';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ThreeDCat from './components/ThreeDCat';
import BackgroundEffect from './components/BackgroundEffect';

function App() {
  return (
    <>
      <BackgroundEffect />
      <ThreeDCat />
      <Layout>
        <Hero />
        <About />
        <MyJourney />
        <Projects />
        <Contact />
      </Layout>
    </>
  );
}

export default App;
