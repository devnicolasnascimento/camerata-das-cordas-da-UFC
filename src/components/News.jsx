
import { motion } from "motion/react";

const posts = [
    {
        category: "Lorem ipsum",
        title: "Lorem ipsum dolor sit amet",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        date: "00.00.2026",
    },
    {
        category: "Lorem ipsum",
        title: "Consectetur adipiscing elit",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        date: "00.00.2026",
    },
    {
        category: "Lorem ipsum",
        title: "Sed do eiusmod tempor",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
        date: "00.00.2026",
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

export default function News() {
    return (
        <section
            id="noticias"
            className="bg-navy px-6 py-24 text-white"
        >
            <div className="mx-auto max-w-6xl">

                <motion.div
                    {...reveal}
                    className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"
                >
                    <div>
                        <p className="mb-4 font-[raleway] text-sm font-semibold text-gold">
                            Lorem ipsum dolor
                        </p>

                        <h2 className="font-[Libre-Baskerville] text-4xl md:text-5xl">
                            Lorem ipsum dolor sit amet
                        </h2>
                    </div>

                    <a
                        href="#noticias"
                        className="font-[raleway] text-sm text-gold transition-colors hover:text-white"
                    >
                        Lorem ipsum →
                    </a>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.title}
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
                                ease: "easeOut",
                            }}
                            className="group overflow-hidden bg-cream text-navy"
                        >
                            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-200">
                                <span className="font-[raleway] text-sm text-slate-500">
                                    Lorem ipsum
                                </span>

                                <span className="absolute left-4 top-4 bg-navy px-3 py-1.5 font-[raleway] text-xs text-white">
                                    {post.category}
                                </span>
                            </div>

                            <div className="p-6">
                                <p className="font-[raleway] text-xs text-slate-500">
                                    {post.date}
                                </p>

                                <h3 className="mt-3 font-[Libre-Baskerville] text-xl leading-snug">
                                    {post.title}
                                </h3>

                                <p className="mt-3 font-[raleway] text-sm leading-7 text-slate-600">
                                    {post.description}
                                </p>

                                <a
                                    href="#noticias"
                                    className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-1 font-[raleway] text-sm font-semibold transition-all group-hover:gap-4"
                                >
                                    Lorem ipsum
                                    <span>→</span>
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>

            </div>
        </section>
    );
}
