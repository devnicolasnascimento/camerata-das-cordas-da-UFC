
import { motion } from "motion/react";

const reveal = {
    initial: {
        opacity: 0,
        y: 25,
        filter: "blur(10px)",
    },
    whileInView: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
    viewport: {
        once: true,
        amount: 0.2,
    },
    transition: {
        duration: 0.9,
        ease: "easeOut",
    },
};

export default function Game() {
    return (
        <section
            id="jogo"
            className="bg-cream px-6 py-24"
        >
            <div className="mx-auto max-w-6xl">
                <div className="border-y border-navy/20 py-12">
                    <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">

                        <motion.div {...reveal}>
                            <p className="mb-4 font-[raleway] text-sm text-amber-800">
                                Aprendizado interativo
                            </p>

                            <h2 className="max-w-lg font-[Libre-Baskerville] text-4xl leading-tight text-navy md:text-5xl">
                                Você conhece os instrumentos de cordas?
                            </h2>
                        </motion.div>

                        <motion.div
                            {...reveal}
                            transition={{
                                ...reveal.transition,
                                delay: 0.2,
                            }}
                            className="md:pl-12"
                        >
                            <p className="font-[raleway] text-base leading-8 text-slate-600">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Explore os instrumentos,
                                reconheça seus sons e descubra mais sobre
                                o universo da música.
                            </p>

                            <a
                                href="/jogo"
                                className="mt-8 inline-flex items-center gap-3 font-[raleway] text-sm font-semibold text-navy transition-all hover:gap-5"
                            >
                                Conhecer o jogo
                                <span aria-hidden="true">→</span>
                            </a>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
