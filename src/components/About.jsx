
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
    { name: "Profa Dra. Liu Man Ying", role: "Professora de violino e viola" },
    { name: "Profa Dra. Dora Utermohl de Queiroz", role: "Professora de violoncelo e contrabaixo" },
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
                        O Ensino Coletivo de Violino e Viola da UFC é um projeto de extensão que promove o acesso gratuito ao ensino desses instrumentos por meio de aulas em grupo e da aprendizagem compartilhada.
                    </p>
                </motion.div>

                {/* Apresentação */}
                <div className="mt-20 grid gap-12 md:grid-cols-2">

                    <motion.div {...reveal}>
                        <span className="mb-4 block font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            01 — QUEM SOMOS
                        </span>

                        <h3 className="mb-4 font-[Libre-Baskerville] text-2xl">
                            Ensino de violino e viola
                        </h3>

                        <p className="font-[raleway] leading-relaxed text-navy/75">
                            O Ensino Coletivo de Cordas da UFC é um projeto de extensão que oferece formação musical em violino e viola, utilizando aulas em grupo e a aprendizagem compartilhada. A proposta contempla diferentes níveis de desenvolvimento, desde pessoas sem experiência musical até participantes que desejam aprimorar seus conhecimentos.
                        </p>
                    </motion.div>

                    <motion.div
                        {...reveal}
                        transition={{ ...reveal.transition, delay: 0.15 }}
                    >
                        <span className="mb-4 block font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-navy/60">
                            02 — NOSSA ATUAÇÃO
                        </span>

                        <h3 className="mb-4 font-[Libre-Baskerville] text-2xl">
                            Formação musical
                        </h3>

                        <p className="font-[raleway] leading-relaxed text-navy/75">
                            O projeto oferece aulas de violino e viola organizadas em níveis de aprendizagem. Além do desenvolvimento técnico dos instrumentos, os participantes têm contato com a prática coletiva por meio de repertório camerístico.
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
                            O ensino acontece por meio de aulas em grupo, utilizando a aprendizagem compartilhada como metodologia. Os participantes estudam os instrumentos, desenvolvem suas habilidades técnicas e também realizam práticas musicais em conjunto.
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
                                <div className="mb-4 flex aspect-[4/3] items-center justify-center bg-[#E5E0D5]">
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
                </motion.div>

            </div>
        </section>
    );
}
