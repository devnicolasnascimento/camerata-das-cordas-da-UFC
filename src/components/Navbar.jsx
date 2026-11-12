
import { useEffect, useState, useRef } from "react";
import { motion, animate } from "motion/react";
import logo from "../assets/logo/logo.png";

const links = [
    ["Início", "#inicio"],
    ["O projeto", "#projeto"],
    ["Como participar", "#participar"],
    ["Notícias", "#noticias"],
    ["Jogo", "#jogo"],
    ["Contato", "#contato"],
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollAnimation = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            scrollAnimation.current?.stop();
        };
    }, []);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleNavigation = (e, href) => {
        e.preventDefault();

        const target = document.querySelector(href);

        if (!target) return;

        scrollAnimation.current?.stop();

        const headerHeight = 100;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

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

        closeMenu();
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
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">

                {/* LOGO */}
                <motion.a
                    href="#inicio"
                    onClick={(e) => handleNavigation(e, "#inicio")}
                    initial={{
                        opacity: 0,
                        x: -20,
                        filter: "blur(10px)",
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                    }}
                    transition={{ duration: 1, delay: 0.1 }}
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
                    {links.map(([label, href], index) => (
                        <motion.a
                            key={label}
                            href={href}
                            onClick={(e) => handleNavigation(e, href)}
                            initial={{
                                opacity: 0,
                                y: -12,
                                filter: "blur(8px)",
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 0.7,
                                delay: 0.3 + index * 0.1,
                            }}
                            className="relative font-[raleway] text-sm hover:text-gold
                            after:absolute after:-bottom-1 after:left-0
                            after:h-[2px] after:w-0 after:bg-gold
                            after:transition-all after:duration-300
                            hover:after:w-full"
                        >
                            {label}
                        </motion.a>
                    ))}
                </div>

                {/* BOTÃO DESKTOP */}
                <motion.a
                    href="#contato"
                    onClick={(e) => handleNavigation(e, "#contato")}
                    initial={{
                        opacity: 0,
                        filter: "blur(8px)",
                    }}
                    animate={{
                        opacity: 1,
                        filter: "blur(0px)",
                    }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="hidden border border-gold px-4 py-2
                    font-[raleway] text-sm text-gold
                    transition duration-300
                    hover:bg-gold hover:text-navy md:block"
                >
                    Fale conosco
                </motion.a>

                {/* BOTÃO MENU MOBILE */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuOpen}
                    className="relative z-50 flex h-10 w-10 flex-col
                    items-center justify-center gap-[6px] md:hidden"
                >
                    <span
                        className={`h-[2px] w-7 rounded-full bg-gold
                        transition-all duration-300 ease-in-out
                        ${menuOpen ? "translate-y-[8px] rotate-45" : ""}`}
                    />

                    <span
                        className={`h-[2px] w-7 rounded-full bg-gold
                        transition-all duration-300 ease-in-out
                        ${menuOpen ? "scale-x-0 opacity-0" : ""}`}
                    />

                    <span
                        className={`h-[2px] w-7 rounded-full bg-gold
                        transition-all duration-300 ease-in-out
                        ${menuOpen ? "-translate-y-[8px] -rotate-45" : ""}`}
                    />
                </button>

                {/* MENU MOBILE */}
                <div
                    className={`w-full overflow-hidden md:hidden
                    transition-all duration-500 ease-in-out
                    ${
                        menuOpen
                            ? "max-h-[450px] opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="flex flex-col gap-5 border-t border-white/10 pt-6 pb-5">

                        {links.map(([label, href], index) => (
                            <a
                                key={label}
                                href={href}
                                onClick={(e) => handleNavigation(e, href)}
                                style={{
                                    transitionDelay: menuOpen
                                        ? `${index * 60}ms`
                                        : "0ms",
                                }}
                                className={`relative w-fit font-[raleway] text-sm
                                transition-all duration-300
                                hover:text-gold
                                ${
                                    menuOpen
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-4 opacity-0"
                                }`}
                            >
                                {label}
                            </a>
                        ))}

                        <a
                            href="#contato"
                            onClick={(e) => handleNavigation(e, "#contato")}
                            className="mt-2 w-fit border border-gold
                            px-5 py-2 font-[raleway] text-sm text-gold
                            transition duration-300
                            hover:bg-gold hover:text-navy"
                        >
                            Fale conosco
                        </a>

                    </div>
                </div>

            </nav>
        </header>
    );
}
