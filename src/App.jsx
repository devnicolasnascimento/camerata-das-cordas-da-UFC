
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import News from "./components/News";
import Game from "./components/Game";
import Participation from "./components/Participation";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll.jsx";

export default function App() {
    return (
        <>
            <SmoothScroll />
            <Navbar />

            <main className="pt-24">
                <Hero />
                <About />
                <News />
                <Game />
                <Participation />
            </main>

            <Footer />
        </>
    );
}
