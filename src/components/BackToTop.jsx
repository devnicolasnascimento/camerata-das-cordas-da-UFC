
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Voltar ao início"
                    initial={{
                        opacity: 0,
                        y: 20,
                        filter: "blur(10px)",
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                    }}
                    exit={{
                        opacity: 0,
                        y: 20,
                        filter: "blur(10px)",
                    }}
                    transition={{
                        duration: 0.9,
                        ease: "easeOut",
                    }}
                    className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center border border-gold/60 bg-navy text-gold transition-colors duration-300 hover:bg-gold hover:text-navy"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m18 15-6-6-6 6" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
