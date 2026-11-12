
import { motion } from "motion/react";

const reveal = {
    hidden: {
        opacity: 0,
        y: 35,
        filter: "blur(12px)",
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
            className="relative z-10 bg-navy px-6 py-28 text-center text-white"
        >
            <div className="mx-auto flex max-w-4xl flex-col items-center">

                <motion.p
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-widest text-gold"
                >
                    Ensino Coletivo de Cordas da UFC
                </motion.p>

                <motion.h1
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 1.1, delay: 0.4 }}
                    className="font-[Libre-Baskerville] text-5xl leading-tight md:text-8xl"
                >
                    Lorem ipsum.
                </motion.h1>

                <motion.p
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-6 max-w-2xl font-[raleway] leading-7 text-slate-200"
                >
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quos ratione earum quidem adipisci voluptas! Nostrum
                    dignissimos et iusto accusamus, sapiente vitae qui,
                    repellat animi labore, quas sit! Quasi, dolor dolores?
                </motion.p>

                <motion.a
                    href="#projeto"
                    variants={reveal}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.9, delay: 0.8 }}
                    className="mt-8 inline-block bg-gold px-6 py-3 font-[raleway] text-sm font-bold text-navy transition-all duration-300 hover:bg-white"
                >
                    Lorem ipsum
                </motion.a>

            </div>
        </section>
    );
}
