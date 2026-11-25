
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import LikeButton from "../components/LikeButton";

const API_URL = "https://cordas-ufc-api.onrender.com/api/posts";

export default function NewsDetail() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(`${API_URL}/${slug}`);

                if (!response.ok) {
                    throw new Error("Novidade não encontrada.");
                }

                const data = await response.json();
                setPost(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [slug]);

    function formatDate(date) {
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f4f0e7] px-6 py-32">
                <p className="text-center font-[raleway] text-[#252c35]/60">
                    Carregando novidade...
                </p>
            </main>
        );
    }

    if (error || !post) {
        return (
            <main className="min-h-screen bg-[#f4f0e7] px-6 py-32 text-center">
                <h1 className="font-[Libre-Baskerville] text-3xl text-[#252c35]">
                    Novidade não encontrada
                </h1>

                <Link
                    to="/#noticias"
                    className="mt-6 inline-block font-[raleway] text-[#94794d] hover:underline"
                >
                    ← Voltar para novidades
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f4f0e7] px-6 pb-24 pt-32">
            <article className="mx-auto max-w-4xl">

                <Link
                    to="/#noticias"
                    className="font-[raleway] text-sm text-[#94794d] transition hover:text-[#252c35]"
                >
                    ← Voltar para novidades
                </Link>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <p className="mt-12 font-[raleway] text-sm uppercase tracking-widest text-[#94794d]">
                        {formatDate(post.createdAt)}
                    </p>

                    <h1 className="mt-5 font-[Libre-Baskerville] text-3xl leading-tight text-[#252c35] md:text-5xl">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="mt-7 font-[raleway] text-lg leading-relaxed text-[#252c35]/65">
                            {post.excerpt}
                        </p>
                    )}

                    {post.coverImage && (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="mt-12 aspect-[16/9] w-full object-cover"
                        />
                    )}

                    <div className="mt-12 whitespace-pre-wrap font-[raleway] text-base leading-loose text-[#252c35]">
                        {post.content}
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-[#252c35]/15 pt-6">
                        <span className="font-[raleway] text-sm text-[#252c35]/60">
                            Gostou desta novidade?
                        </span>

                        <LikeButton slug={post.slug} />
                    </div>
                </motion.div>
            </article>
        </main>
    );
}
