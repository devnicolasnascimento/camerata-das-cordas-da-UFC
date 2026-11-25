
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/posts";

function getVisitorId() {
    let id = localStorage.getItem("cordasVisitorId");

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("cordasVisitorId", id);
    }

    return id;
}

export default function LikeButton({ slug }) {
    const [visitorId] = useState(getVisitorId);
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadLikes() {
            try {
                const response = await fetch(
                    `${API_URL}/${encodeURIComponent(slug)}/likes?visitorId=${encodeURIComponent(visitorId)}`
                );

                if (!response.ok) {
                    throw new Error("Não foi possível carregar as curtidas.");
                }

                const data = await response.json();

                if (active) {
                    setCount(data.count);
                    setLiked(data.liked);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadLikes();

        return () => {
            active = false;
        };
    }, [slug, visitorId]);

    async function handleLike() {
        if (saving || loading) return;

        const previousLiked = liked;
        const previousCount = count;
        const nextLiked = !previousLiked;

        // Atualização imediata da interface
        setLiked(nextLiked);
        setCount(previousCount + (nextLiked ? 1 : -1));
        setSaving(true);

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(slug)}/likes`,
                {
                    method: nextLiked ? "POST" : "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ visitorId }),
                }
            );

            if (!response.ok) {
                throw new Error("Não foi possível atualizar a curtida.");
            }

            const data = await response.json();

            setCount(data.count);
            setLiked(data.liked);
        } catch (error) {
            console.error(error);

            // Reverte caso o servidor não confirme
            setLiked(previousLiked);
            setCount(previousCount);
        } finally {
            setSaving(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleLike}
            disabled={loading || saving}
            aria-label={liked ? "Remover curtida" : "Curtir novidade"}
            aria-pressed={liked}
            className="inline-flex items-center gap-2 text-sm transition disabled:opacity-50"
        >
            <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 transition-transform duration-200 ${
                    liked
                        ? "scale-110 fill-red-500 stroke-red-500"
                        : "fill-none stroke-current"
                }`}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>

            <span>{loading ? "—" : count}</span>
        </button>
    );
}
