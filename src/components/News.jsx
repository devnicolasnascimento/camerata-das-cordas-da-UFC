
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";

const API_URL = "http://localhost:3000/api/posts";

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

function formatDate(date) {
    if (!date) return "";

    const dateString = String(date).slice(0, 10);
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(
        Date.UTC(year, month - 1, day, 12)
    ).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}

export default function News() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Erro ao buscar novidades.");
                }

                const data = await response.json();
                setPosts(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <section
            id="noticias"
            className="bg-navy px-6 py-24 text-white"
        >
            <div className="mx-auto max-w-6xl">

                <motion.div {...reveal} className="mb-14">
                    <p className="mb-4 font-[raleway] text-sm font-bold uppercase tracking-[0.12em] text-white/60">
                        Acompanhe o projeto
                    </p>

                    <h2 className="font-[Libre-Baskerville] text-4xl leading-tight md:text-5xl">
                        Novidades.
                    </h2>

                    <p className="mt-5 max-w-2xl font-[raleway] text-base leading-relaxed text-white/65 md:text-lg">
                        Acompanhe as atividades, apresentações e acontecimentos
                        do Ensino Coletivo de Cordas da UFC.
                    </p>
                </motion.div>

                {loading && (
                    <p className="font-[raleway] text-white/60">
                        Carregando novidades...
                    </p>
                )}

                {error && (
                    <p className="font-[raleway] text-white/60">
                        Não foi possível carregar as novidades. Tente novamente.
                    </p>
                )}

                {!loading && !error && posts.length === 0 && (
                    <p className="font-[raleway] text-white/60">
                        Ainda não há novidades publicadas.
                    </p>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={reveal.initial}
                                whileInView={reveal.whileInView}
                                viewport={reveal.viewport}
                                transition={{
                                    ...reveal.transition,
                                    delay: index * 0.12,
                                }}
                                className="overflow-hidden bg-[#303945] transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#e8e2d6]">
                                    {post.coverImage ? (
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-[Libre-Baskerville] text-2xl text-[#252c35]/30">
                                            Ensino Coletivo de Cordas
                                        </span>
                                    )}
                                </div>

                                <div className="p-6">
                                    <p className="font-[raleway] text-xs uppercase tracking-wider text-gold">
                                        {formatDate(
                                            post.eventDate || post.createdAt
                                        )}
                                    </p>

                                    <h3 className="mt-4 font-[Libre-Baskerville] text-xl leading-snug">
                                        {post.title}
                                    </h3>

                                    <p className="mt-4 line-clamp-3 font-[raleway] text-sm leading-relaxed text-white/65">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                                        <Link
                                            to={`/novidade/${post.slug}`}
                                            className="font-[raleway] text-sm font-semibold text-gold transition-colors hover:text-white"
                                        >
                                            Ler novidade <span>→</span>
                                        </Link>

                                        <LikeButton slug={post.slug} />
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
