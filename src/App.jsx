
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import News from "./components/News";
import Game from "./components/Game";
import Participation from "./components/Participation";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll.jsx";
import BackToTop from "./components/BackToTop.jsx";

import GamePage from "./pages/GamePage";
import NewsDetail from "./pages/NewsDetail";

function HomePage() {
    return (
        <>
            <SmoothScroll />

            <main className="pt-24">
                <Hero />
                <About />
                <News />
                <Game />
                <Participation />
            </main>
        </>
    );
}

function GameRoute() {
    return (
        <main className="pt-24">
            <GamePage />
        </main>
    );
}

function PublicLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <BackToTop />
        </>
    );
}

function PrivateRoute({ children }) {
    const token = localStorage.getItem("adminToken");

    return token ? children : <Navigate to="/admin/login" replace />;
}

function AdminLayout({ children }) {
    return (
        <PrivateRoute>
            {children}
        </PrivateRoute>
    );
}

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicLayout>
                        <HomePage />
                    </PublicLayout>
                }
            />

            <Route
                path="/jogo"
                element={
                    <PublicLayout>
                        <GameRoute />
                    </PublicLayout>
                }
            />

            <Route
                path="/novidade/:slug"
                element={
                    <PublicLayout>
                        <NewsDetail />
                    </PublicLayout>
                }
            />

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route
                path="/admin"
                element={
                    <AdminLayout>
                        <AdminDashboard />
                    </AdminLayout>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}
