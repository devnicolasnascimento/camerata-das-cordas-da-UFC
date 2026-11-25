
import { motion } from "motion/react";

const reveal = {
    hidden: {
        opacity: 0,
        y: 25,
        filter: "blur(10px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
};

export default function Hero() {
    return (
        <section
            id="inicio"
            className="relative flex min-h-[calc(100dvh-6rem)] items-center justify-center overflow-hidden bg-navy px-6 py-16 text-center text-white"
        >
            <div className="relative mx-auto flex max-w-4xl flex-col items-center">

                <motion.p
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="mb-5 font-[raleway] text-xs font-bold uppercase tracking-[0.2em] text-gold md:text-sm"
                >
                    Ensino Coletivo de Cordas da UFC
                </motion.p>

                <motion.h1
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 1, delay: 0.35 }}
                    className="max-w-4xl font-[Libre-Baskerville] text-5xl leading-[1.12] tracking-tight md:text-7xl"
                >
                    Ensino e prática musical
                    <span className="block text-gold">coletiva.</span>
                </motion.h1>

                <motion.p
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.9, delay: 0.55 }}
                    className="mt-5 max-w-xl font-[raleway] text-sm leading-7 text-slate-300 md:text-base"
                >
                    Conheça o projeto, suas atividades e as oportunidades de
                    participação no ensino coletivo de instrumentos de cordas.
                </motion.p>

                <motion.a
                    href="#projeto"
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.9, delay: 0.7 }}
                    className="mt-7 inline-flex items-center gap-3 bg-gold px-6 py-3 font-[raleway] text-sm font-bold text-navy transition-colors duration-300 hover:bg-white"
                >
                    Conheça o projeto
                    <span aria-hidden="true">→</span>
                </motion.a>

            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full border border-gold/10 md:h-80 md:w-80"
            />
        </section>
    );
}
