
import { motion } from "motion/react";

const steps = [
    {
        number: "01",
        title: "Conheça o projeto",
        description:
            "Descubra a proposta do Ensino Coletivo de Cordas e conheça as atividades desenvolvidas.",
    },
    {
        number: "02",
        title: "Consulte as inscrições",
        description:
            "Acompanhe as informações sobre períodos de inscrição, disponibilidade de vagas e orientações.",
    },
    {
        number: "03",
        title: "Entre em contato",
        description:
            "Entre em contato com a equipe do projeto para esclarecer dúvidas e receber orientações.",
    },
];

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

export default function Participation() {
    return (
        <section
            id="participar"
            className="bg-navy px-6 py-24 text-white"
        >
            <div className="mx-auto max-w-6xl">
                <motion.div {...reveal}>
                    <p className="mb-4 font-[raleway] text-sm font-semibold text-gold">
                        Como participar
                    </p>

                    <h2 className="font-[Libre-Baskerville] text-4xl leading-tight md:text-5xl">
                        Faça parte do projeto.
                    </h2>

                    <p className="mt-5 max-w-2xl font-[raleway] text-base leading-8 text-slate-300">
                        Quer participar do Ensino Coletivo de Cordas da UFC?
                        Confira as etapas e saiba por onde começar.
                    </p>
                </motion.div>

                <div className="mt-14 grid gap-10 pt-10 md:grid-cols-3 md:gap-8 ">
                    {steps.map((step, index) => (
                        <motion.article
                            key={step.number}
                            initial={{
                                opacity: 0,
                                y: 25,
                                filter: "blur(10px)",
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.9,
                                delay: index * 0.15,
                            }}
                            className="border-b border-white/15 pb-8 md:border-b-0"
                        >
                            <span className="font-[raleway] text-sm font-semibold text-gold">
                                {step.number}
                            </span>

                            <h3 className="mt-5 font-[Libre-Baskerville] text-2xl">
                                {step.title}
                            </h3>

                            <p className="mt-4 font-[raleway] text-sm leading-7 text-slate-300">
                                {step.description}
                            </p>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    {...reveal}
                    className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between"
                >
                    <p className="font-[raleway] text-sm text-slate-300">
                        Ficou com alguma dúvida sobre a participação?
                    </p>

                    <a
                        href="#contato"
                        className="inline-flex w-fit items-center gap-3 border-b border-gold pb-2 font-[raleway] text-sm font-semibold text-gold transition-all duration-300 hover:gap-5 hover:text-white"
                    >
                        FALE CONOSCO
                        <span aria-hidden="true">→</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
