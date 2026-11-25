
import { useEffect, useState, useRef } from "react";
import { motion, animate } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo/logo.png";

let gameIntroAlreadyPlayed = false;

const MotionLink = motion.create(Link);

const links = [
    ["Início", "#inicio"],
    ["O projeto", "#projeto"],
    ["Como participar", "#participar"],
    ["Novidades", "#noticias"],
    ["Jogo", "#jogo"],
    ["Contato", "#contato"],
];

const hidden = {
    opacity: 0,
    y: -12,
    filter: "blur(8px)",
};

const visible = {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const [shouldAnimateGame] = useState(
        () => !gameIntroAlreadyPlayed
    );

    const scrollAnimation = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        gameIntroAlreadyPlayed = true;
    }, []);

    // Detecta o scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            scrollAnimation.current?.stop();
        };
    }, []);

    // Fecha o menu ao trocar de rota
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Quando chega à página inicial com uma âncora na URL
    useEffect(() => {
        if (location.pathname !== "/" || !location.hash) return;

        let frame;

        frame = requestAnimationFrame(() => {
            const target = document.querySelector(location.hash);

            if (!target) return;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                100;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [location.pathname, location.hash]);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Navegação entre seções e páginas
    const handleNavigation = (e, href) => {
        e.preventDefault();

        closeMenu();
        scrollAnimation.current?.stop();

        // Se estiver em outra página, volta para a página inicial
        if (location.pathname !== "/") {
            navigate(`/${href}`);
            return;
        }

        const target = document.querySelector(href);

        if (!target) return;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            100;

        scrollAnimation.current = animate(
            window.scrollY,
            targetPosition,
            {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                onUpdate: (value) => {
                    window.scrollTo(0, value);
                },
            }
        );
    };

    const renderLink = ([label, href], index, mobile = false) => {
        const isGame = href === "/jogo";

        const className = mobile
            ? `relative w-fit font-[raleway] text-sm
                transition-all duration-300 hover:text-gold
                ${
                    menuOpen
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-4 opacity-0"
                }`
            : `relative font-[raleway] text-sm hover:text-gold
                after:absolute after:-bottom-1 after:left-0
                after:h-[2px] after:w-0 after:bg-gold
                after:transition-all after:duration-300
                hover:after:w-full`;

        const animationProps = {
            initial: hidden,
            animate: visible,
            transition: {
                duration: 0.7,
                delay: 0.3 + index * 0.1,
                ease: "easeOut",
            },
        };

        // Link para a página do jogo
        if (isGame) {
            return (
                <MotionLink
                    key={label}
                    to={href}
                    onClick={closeMenu}
                    className={className}
                    initial={
                        mobile || !shouldAnimateGame
                            ? false
                            : hidden
                    }
                    animate={visible}
                    transition={{
                        duration: 0.7,
                        delay: 0.3 + index * 0.1,
                        ease: "easeOut",
                    }}
                >
                    {label}
                </MotionLink>
            );
        }

        // Links do menu mobile
        if (mobile) {
            return (
                <a
                    key={label}
                    href={href}
                    onClick={(e) => handleNavigation(e, href)}
                    className={className}
                    style={{
                        transitionDelay: menuOpen
                            ? `${index * 60}ms`
                            : "0ms",
                    }}
                >
                    {label}
                </a>
            );
        }

        // Links do desktop
        return (
            <motion.a
                key={label}
                href={href}
                onClick={(e) => handleNavigation(e, href)}
                className={className}
                {...animationProps}
            >
                {label}
            </motion.a>
        );
    };

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full text-white
                transition-all duration-300 ease-in-out
                ${
                    scrolled
                        ? "bg-[#101a30] shadow-md"
                        : "bg-navy"
                }`}
        >
            <nav className="mx-auto flex max-w-6xl flex-wrap
                items-center justify-between gap-4 px-6 py-4">

                {/* LOGO */}
                <motion.a
                    href="#inicio"
                    onClick={(e) => handleNavigation(e, "#inicio")}
                    initial={hidden}
                    animate={visible}
                    transition={{
                        duration: 1,
                        delay: 0.1,
                        ease: "easeOut",
                    }}
                    className="font-display text-2xl leading-none text-gold"
                >
                    <img
                        src={logo}
                        alt="Logo do projeto"
                        className="h-16"
                    />
                </motion.a>

                {/* LINKS DESKTOP */}
                <div className="hidden items-center gap-6 md:flex">
                    {links.map((link, index) =>
                        renderLink(link, index)
                    )}
                </div>

                {/* BOTÕES DESKTOP */}
                <div className="hidden items-center gap-3 md:flex">
                    <motion.a
                        href="#contato"
                        onClick={(e) => handleNavigation(e, "#contato")}
                        initial={hidden}
                        animate={visible}
                        transition={{
                            duration: 0.8,
                            delay: 1,
                            ease: "easeOut",
                        }}
                        className="border border-gold px-4 py-2
                            font-[raleway] text-sm text-gold
                            transition duration-300
                            hover:bg-gold hover:text-navy"
                    >
                        Fale conosco
                    </motion.a>

                    <motion.div
                        initial={hidden}
                        animate={visible}
                        transition={{
                            duration: 0.8,
                            delay: 1.1,
                            ease: "easeOut",
                        }}
                    >
                        <Link
                            to="/admin/login"
                            className="inline-flex items-center justify-center
                                bg-gold px-4 py-2 font-[raleway] text-sm
                                font-semibold text-navy transition duration-300
                                hover:bg-white"
                        >
                            Acessar painel
                        </Link>
                    </motion.div>
                </div>

                {/* BOTÃO MOBILE */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuOpen}
                    className="relative z-50 flex h-10 w-10
                        flex-col items-center justify-center
                        gap-[6px] md:hidden"
                >
                    <span
                        className={`h-[2px] w-7 rounded-full bg-gold
                            transition-all duration-300
                            ${
                                menuOpen
                                    ? "translate-y-[8px] rotate-45"
                                    : ""
                            }`}
                    />

                    <span
                        className={`h-[2px] w-7 rounded-full bg-gold
                            transition-all duration-300
                            ${
                                menuOpen
                                    ? "scale-x-0 opacity-0"
                                    : ""
                            }`}
                    />

                    <span
                        className={`h-[2px] w-7 rounded-full bg-gold
                            transition-all duration-300
                            ${
                                menuOpen
                                    ? "-translate-y-[8px] -rotate-45"
                                    : ""
                            }`}
                    />
                </button>

                {/* MENU MOBILE */}
                <div
                    className={`w-full overflow-hidden md:hidden
                        transition-all duration-500 ease-in-out
                        ${
                            menuOpen
                                ? "max-h-[500px] opacity-100"
                                : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                >
                    <div className="flex flex-col gap-5
                        border-t border-white/10 pt-6 pb-5">

                        {links.map((link, index) =>
                            renderLink(link, index, true)
                        )}

                        <a
                            href="#contato"
                            onClick={(e) => handleNavigation(e, "#contato")}
                            className="mt-2 w-fit border border-gold
                                px-5 py-2 font-[raleway] text-sm
                                text-gold transition duration-300
                                hover:bg-gold hover:text-navy"
                        >
                            Fale conosco
                        </a>

                        <Link
                            to="/admin/login"
                            onClick={closeMenu}
                            className="mt-2 inline-flex w-fit items-center
                                justify-center bg-gold px-5 py-2
                                font-[raleway] text-sm font-semibold
                                text-navy transition duration-300
                                hover:bg-white"
                        >
                            Acessar painel
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
