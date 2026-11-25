
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

                <motion.div
                    {...reveal}
                    className="border-y border-navy/20 py-10 md:py-14"
                >
                    <div className="mb-10 flex items-center justify-between">
                        <p className="font-[raleway] text-sm text-amber-800">
                            Aprendizado interativo
                        </p>

                        <span className="font-[raleway] text-xs tracking-widest text-navy/40">
                            04 — ATIVIDADE
                        </span>
                    </div>

                    <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">

                        <div>
                            <h2 className="max-w-2xl font-[Libre-Baskerville] text-4xl leading-tight text-navy md:text-6xl">
                                Você gostaria de descontrair com um <span className="italic">jogo</span>?
                            </h2>

                            <p className="mt-6 max-w-xl font-[raleway] text-base leading-8 text-slate-600">
                                Que tal colocar seus conhecimentos musicais à prova? Explore uma atividade interativa sobre música e instrumentos de cordas, teste o que você sabe e descubra novos aspectos desse universo enquanto se diverte.
                            </p>
                        </div>

                        <a
                            href="/jogo"
                            className="inline-flex w-fit items-center gap-4 border-b border-navy pb-3 font-[raleway] text-sm font-semibold text-navy transition-all duration-300 hover:gap-6"
                        >
                            Acessar o jogo
                            <span aria-hidden="true">→</span>
                        </a>

                    </div>
                </motion.div>

            </div>
        </section>
    );
}
