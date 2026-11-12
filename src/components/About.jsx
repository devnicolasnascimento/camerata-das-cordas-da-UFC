
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

const instruments = [
    "Violino",
    "Viola",
    "Violoncelo",
    "Contrabaixo",
];

const team = [
    { name: "Nome do integrante", role: "Coordenação" },
    { name: "Nome do integrante", role: "Professor(a)" },
    { name: "Nome do integrante", role: "Professor(a)" },
];

export default function About() {
    return (
        <section
            id="projeto"
            className="bg-cream px-6 py-24 text-navy"
        >
            <div className="mx-auto max-w-6xl">

                {/* Introdução */}
                <motion.div {...reveal} className="max-w-3xl">
                    <p className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                        Conheça o projeto
                    </p>

                    <h2 className="mb-6 font-[Libre-Baskerville] text-4xl leading-tight md:text-5xl">
                        Sobre o projeto.
                    </h2>

                    <p className="font-[raleway] text-base leading-relaxed text-navy/75 md:text-lg">
                        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Conheça um pouco mais sobre
                        o Ensino Coletivo de Cordas da UFC, sua
                        proposta e as atividades desenvolvidas.
                    </p>
                </motion.div>

                {/* Apresentação */}
                <div className="mt-20 grid gap-12 md:grid-cols-2">

                    <motion.div {...reveal}>
                        <span className="mb-4 block font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            01 — Quem somos
                        </span>

                        <h3 className="mb-4 font-[Libre-Baskerville] text-2xl">
                            Nossa essência
                        </h3>

                        <p className="font-[raleway] leading-relaxed text-navy/75">
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                        </p>
                    </motion.div>

                    <motion.div
                        {...reveal}
                        transition={{ ...reveal.transition, delay: 0.15 }}
                    >
                        <span className="mb-4 block font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            02 — Nossa atuação
                        </span>

                        <h3 className="mb-4 font-[Libre-Baskerville] text-2xl">
                            Nossa proposta
                        </h3>

                        <p className="font-[raleway] leading-relaxed text-navy/75">
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                        </p>
                    </motion.div>

                </div>

                {/* Metodologia */}
                <div className="mt-24 grid gap-12 border-t border-navy/10 pt-12 md:grid-cols-2">

                    <motion.div {...reveal}>
                        <p className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            Como funciona
                        </p>

                        <h3 className="mb-6 font-[Libre-Baskerville] text-3xl">
                            O ensino coletivo
                        </h3>

                        <p className="font-[raleway] leading-relaxed text-navy/75">
                            Lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. A proposta envolve a
                            aprendizagem musical em grupo, promovendo
                            a troca de experiências e a prática conjunta.
                        </p>
                    </motion.div>

                    <motion.div
                        {...reveal}
                        transition={{ ...reveal.transition, delay: 0.15 }}
                    >
                        <p className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            Instrumentos
                        </p>

                        <div className="divide-y divide-navy/10">
                            {instruments.map((instrument, index) => (
                                <motion.div
                                    key={instrument}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                        filter: "blur(8px)",
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.12,
                                        ease: "easeOut",
                                    }}
                                    className="flex items-center gap-6 py-4"
                                >
                                    <span className="font-[raleway] text-sm text-navy/40">
                                        0{index + 1}
                                    </span>

                                    <span className="font-[Libre-Baskerville] text-xl">
                                        {instrument}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Equipe */}
                <div className="mt-24 border-t border-navy/10 pt-12">

                    <motion.div {...reveal} className="mb-10">
                        <p className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            Quem faz acontecer
                        </p>

                        <h3 className="font-[Libre-Baskerville] text-3xl">
                            Nossa equipe
                        </h3>
                    </motion.div>

                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                    filter: "blur(8px)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.15,
                                    ease: "easeOut",
                                }}
                            >
                                <div className="mb-4 flex aspect-[4/3] items-center justify-center bg-navy/10">
                                    <span className="font-[Libre-Baskerville] text-4xl text-navy/40">
                                        {member.name.charAt(0)}
                                    </span>
                                </div>

                                <h4 className="font-[Libre-Baskerville] text-lg">
                                    {member.name}
                                </h4>

                                <p className="mt-1 font-[raleway] text-sm text-navy/60">
                                    {member.role}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>

                {/* Encerramento */}
                <motion.div
                    {...reveal}
                    className="mt-24 border-t border-navy/10 pt-12"
                >
                    <p className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                        Nossa trajetória
                    </p>

                    <h3 className="mb-6 max-w-2xl font-[Libre-Baskerville] text-3xl leading-snug md:text-4xl">
                        A música também se constrói em conjunto.
                    </h3>

                    <a
                        href="#noticias"
                        className="inline-block border-b border-navy pb-1 font-[raleway] text-sm font-semibold transition-opacity hover:opacity-60"
                    >
                        Acompanhe nossas atividades
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
