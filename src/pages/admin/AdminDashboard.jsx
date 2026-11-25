
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import logo from "../../assets/logo/logo.png";

const API_URL = "https://cordas-ufc-api.onrender.com/api";

const emptyForm = {
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    eventDate: "",
    published: false,
};

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

function Icon({ name, size = 18, className = "" }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        "aria-hidden": true,
    };

    const paths = {
        file: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M8 13h8M8 17h8" />
            </>
        ),
        check: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16 9" />
            </>
        ),
        draft: (
            <>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
            </>
        ),
        plus: <path d="M12 5v14M5 12h14" />,
        edit: (
            <>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
            </>
        ),
        trash: (
            <>
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
            </>
        ),
        upload: (
            <>
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 16v4h16v-4" />
            </>
        ),
        logout: (
            <>
                <path d="M10 17l5-5-5-5M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </>
        ),
    };

    return <svg {...common}>{paths[name]}</svg>;
}

function CornerOrnament({ position = "top-right" }) {
    const positions = {
        "top-right": "right-0 top-0",
        "bottom-right": "bottom-0 right-0 rotate-180",
        "bottom-left": "bottom-0 left-0 -rotate-90",
        "top-left": "left-0 top-0 rotate-90",
    };

    return (
        <svg
            viewBox="0 0 160 160"
            fill="none"
            className={`pointer-events-none absolute ${positions[position]} h-36 w-36 text-[#C6A15B] opacity-35 md:h-44 md:w-44`}
            aria-hidden="true"
        >
            <path
                d="M158 5C125 5 133 39 105 45C78 51 72 20 47 27C25 32 29 62 5 68"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
            <path
                d="M158 25C135 25 137 52 115 59C94 65 85 43 66 48C48 53 50 76 29 82"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
            />
            <path
                d="M158 46C143 46 145 67 128 72C112 77 104 63 91 66"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
            />
            <path
                d="M139 5C139 25 151 34 158 40"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
            />
            <circle cx="47" cy="27" r="2" fill="currentColor" />
            <circle cx="91" cy="66" r="1.5" fill="currentColor" />
        </svg>
    );
}

function MusicalNote({ className = "" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M15 18V5l5-1v12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <ellipse
                cx="12"
                cy="18"
                rx="3"
                ry="2"
                transform="rotate(-15 12 18)"
                fill="currentColor"
            />
            <ellipse
                cx="17"
                cy="16"
                rx="3"
                ry="2"
                transform="rotate(-15 17 16)"
                fill="currentColor"
            />
        </svg>
    );
}

function formatDate(date) {
    if (!date) return "";

    const dateString = String(date).slice(0, 10);
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        }
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        return () => {
            if (coverPreview.startsWith("blob:")) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, [coverPreview]);

    async function apiRequest(endpoint, options = {}) {
        const isFormData = options.body instanceof FormData;

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...(isFormData
                    ? {}
                    : { "Content-Type": "application/json" }),
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
            throw new Error("Sua sessão expirou. Entre novamente.");
        }

        if (!response.ok) {
            throw new Error(
                data.error || "Ocorreu um erro na solicitação."
            );
        }

        return data;
    }

    async function loadPosts() {
        setLoading(true);
        setError("");

        try {
            const data = await apiRequest("/posts/admin");
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate("/admin/login");
            return;
        }

        loadPosts();
    }, []);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleCoverChange(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Formato inválido. Escolha PNG, JPG, JPEG ou WEBP.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 5 MB.");
            event.target.value = "";
            return;
        }

        setError("");
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }

    function resetImage() {
        setCoverFile(null);
        setCoverPreview("");
    }

    function openNewPost() {
        setForm(emptyForm);
        setEditingId(null);
        resetImage();
        setShowForm(true);
        setError("");
    }

    function openEditPost(post) {
        setForm({
            title: post.title || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            coverImage: post.coverImage || "",
            eventDate: post.eventDate
                ? String(post.eventDate).slice(0, 10)
                : "",
            published: post.published,
        });

        setCoverFile(null);
        setCoverPreview(post.coverImage || "");

        setEditingId(post.id);
        setShowForm(true);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");

        try {
            const endpoint = editingId
                ? `/posts/${editingId}`
                : "/posts";

            const postData = new FormData();

            postData.append("title", form.title);
            postData.append("excerpt", form.excerpt);
            postData.append("content", form.content);
            postData.append("eventDate", form.eventDate || "");
            postData.append("published", String(form.published));

            if (coverFile) {
                postData.append("coverImage", coverFile);
            }

            const updatedPost = await apiRequest(endpoint, {
                method: editingId ? "PUT" : "POST",
                body: postData,
            });

            setPosts((previous) => {
                if (editingId) {
                    return previous.map((post) =>
                        post.id === editingId ? updatedPost : post
                    );
                }

                return [updatedPost, ...previous];
            });

            setShowForm(false);
            setForm(emptyForm);
            setEditingId(null);
            resetImage();

            await loadPosts();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Tem certeza de que deseja excluir esta publicação?"
        );

        if (!confirmed) return;

        try {
            await apiRequest(`/posts/${id}`, {
                method: "DELETE",
            });

            setPosts((previous) =>
                previous.filter((post) => post.id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    }

    async function togglePublished(post) {
        try {
            await apiRequest(`/posts/${post.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    published: !post.published,
                }),
            });

            await loadPosts();
        } catch (err) {
            setError(err.message);
        }
    }

    function closeForm() {
        setShowForm(false);
        setForm(emptyForm);
        setEditingId(null);
        resetImage();
        setError("");
    }

    function handleLogout() {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    }

    const publishedCount = posts.filter(
        (post) => post.published
    ).length;

    const draftCount = posts.length - publishedCount;

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#14213D] px-6">
                <motion.div
                    initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="flex flex-col items-center text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="mb-8 h-10 w-10 rounded-full border-2 border-white/20 border-t-[#C6A15B]"
                    />

                    <span className="font-[raleway] text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
                        Ensino Coletivo de Cordas
                    </span>

                    <h1 className="mt-5 font-[Libre-Baskerville] text-2xl text-white">
                        Preparando o painel
                    </h1>

                    <p className="mt-3 font-[raleway] text-sm text-white/60">
                        Carregando suas publicações...
                    </p>
                </motion.div>
            </main>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="min-h-screen bg-[#14213D] text-white"
        >
            <header className="relative overflow-hidden border-b border-white/15 bg-[#14213D]">
                <CornerOrnament position="top-right" />

                <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
                    <a
                        href="/admin"
                        className="group flex items-center gap-3"
                    >
                        <img
                            src={logo}
                            alt="Logo do Ensino Coletivo de Cordas da UFC"
                            className="h-12 w-12 object-contain"
                        />

                        <span className="h-8 w-px bg-white/30" />

                        <span className="flex flex-col">
                            <span className="font-[raleway] text-sm font-semibold tracking-wide text-white">
                                Ensino Coletivo
                            </span>

                            <span className="mt-0.5 font-[raleway] text-[10px] uppercase tracking-[0.16em] text-[#C6A15B]">
                                Cordas · UFC
                            </span>
                        </span>
                    </a>

                    <div className="flex items-center gap-5">
                        <span className="hidden font-[raleway] text-xs text-white/60 sm:block">
                            Administração
                        </span>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 border-l border-white/20 pl-5 font-[raleway] text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:text-[#C6A15B]"
                        >
                            Sair
                            <Icon name="logout" size={15} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
                <motion.section
                    {...reveal}
                    className="relative mb-14 overflow-hidden"
                >
                    <CornerOrnament position="top-right" />

                    <div className="relative z-10">
                        <p className="flex items-center gap-2 font-[raleway] text-sm uppercase tracking-[0.15em] text-[#C6A15B]">
                            Área de gerenciamento
                            <MusicalNote className="h-4 w-4 opacity-60" />
                        </p>

                        <h2 className="mt-3 font-[Libre-Baskerville] text-3xl text-white md:text-4xl">
                            Visão geral.
                        </h2>

                        <p className="mt-4 max-w-2xl font-[raleway] text-sm leading-relaxed text-white/70">
                            Gerencie as publicações e atualize as novidades
                            do Ensino Coletivo de Cordas da UFC.
                        </p>
                    </div>
                </motion.section>

                <section className="relative mb-16">
                    <CornerOrnament position="bottom-right" />

                    <div className="relative z-10">
                        <div className="mb-6">
                            <span className="font-[raleway] text-xs uppercase tracking-[0.18em] text-[#C6A15B]">
                                Resumo
                            </span>

                            <h3 className="mt-2 font-[Libre-Baskerville] text-xl text-white">
                                Suas publicações em números
                            </h3>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: "Total de publicações",
                                    value: posts.length,
                                    number: "01",
                                    icon: "file",
                                },
                                {
                                    label: "Publicadas",
                                    value: publishedCount,
                                    number: "02",
                                    icon: "check",
                                },
                                {
                                    label: "Rascunhos",
                                    value: draftCount,
                                    number: "03",
                                    icon: "draft",
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.number}
                                    initial={reveal.initial}
                                    whileInView={reveal.whileInView}
                                    viewport={reveal.viewport}
                                    transition={{
                                        ...reveal.transition,
                                        delay: index * 0.12,
                                    }}
                                    className="border border-white/20 bg-white/5 p-6 transition-colors duration-300 hover:border-[#C6A15B]"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-[raleway] text-xs tracking-widest text-[#C6A15B]">
                                            {item.number}
                                        </span>

                                        <Icon
                                            name={item.icon}
                                            size={19}
                                            className="text-[#C6A15B]"
                                        />
                                    </div>

                                    <strong className="mt-6 block font-[Libre-Baskerville] text-4xl font-normal text-white">
                                        {item.value}
                                    </strong>

                                    <p className="mt-2 font-[raleway] text-sm text-white/70">
                                        {item.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative">
                    <CornerOrnament position="bottom-left" />

                    <motion.div
                        {...reveal}
                        className="relative z-10 flex flex-col justify-between gap-5 border-b border-white/20 pb-6 sm:flex-row sm:items-end"
                    >
                        <div>
                            <span className="flex items-center gap-2 font-[raleway] text-xs uppercase tracking-[0.18em] text-[#C6A15B]">
                                <Icon name="file" size={15} />
                                Conteúdo do site
                            </span>

                            <h2 className="mt-2 font-[Libre-Baskerville] text-2xl text-white md:text-3xl">
                                Suas publicações.
                            </h2>

                            <p className="mt-3 font-[raleway] text-sm text-white/70">
                                Crie, edite e organize as notícias do projeto.
                            </p>
                        </div>

                        <button
                            onClick={openNewPost}
                            className="flex w-fit items-center gap-2 bg-[#C6A15B] px-5 py-3 font-[raleway] text-sm font-semibold text-[#14213D] transition duration-300 hover:bg-white"
                        >
                            <Icon name="plus" size={17} />
                            Nova publicação
                        </button>
                    </motion.div>

                    {error && (
                        <div className="mt-6 border border-[#C6A15B] bg-white/5 p-4 font-[raleway] text-sm text-white">
                            {error}
                        </div>
                    )}

                    {posts.length === 0 ? (
                        <motion.div
                            {...reveal}
                            className="relative z-10 mt-8 border border-white/20 bg-white/5 px-6 py-16 text-center"
                        >
                            <Icon
                                name="file"
                                size={28}
                                className="mx-auto text-[#C6A15B]"
                            />

                            <span className="mt-4 block font-[raleway] text-xs uppercase tracking-[0.2em] text-[#C6A15B]">
                                Ainda não há conteúdo
                            </span>

                            <h3 className="mt-4 font-[Libre-Baskerville] text-xl text-white">
                                Nenhuma publicação por aqui.
                            </h3>

                            <p className="mt-3 font-[raleway] text-sm text-white/70">
                                Comece criando sua primeira publicação.
                            </p>

                            <button
                                onClick={openNewPost}
                                className="mt-6 inline-flex items-center gap-2 border border-[#C6A15B] px-5 py-3 font-[raleway] text-sm text-white transition hover:bg-[#C6A15B] hover:text-[#14213D]"
                            >
                                <Icon name="plus" size={16} />
                                Criar publicação
                            </button>
                        </motion.div>
                    ) : (
                        <div className="relative z-10 mt-2 divide-y divide-white/15">
                            {posts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={reveal.initial}
                                    whileInView={reveal.whileInView}
                                    viewport={reveal.viewport}
                                    transition={{
                                        ...reveal.transition,
                                        delay: index * 0.08,
                                    }}
                                    className="flex flex-col justify-between gap-5 py-7 md:flex-row md:items-center"
                                >
                                    <div className="min-w-0">
                                        <div className="mb-3 flex flex-wrap items-center gap-3">
                                            <span className="flex items-center gap-1.5 font-[raleway] text-xs font-semibold uppercase tracking-wider text-[#C6A15B]">
                                                <Icon
                                                    name={post.published ? "check" : "draft"}
                                                    size={14}
                                                />
                                                {post.published
                                                    ? "Publicada"
                                                    : "Rascunho"}
                                            </span>

                                            <span className="text-white/40">
                                                /
                                            </span>

                                            <span className="font-[raleway] text-xs text-white/60">
                                                {post.eventDate
                                                    ? `Aconteceu em ${formatDate(post.eventDate)}`
                                                    : `Cadastrada em ${formatDate(post.createdAt)}`}
                                            </span>
                                        </div>

                                        <h3 className="font-[Libre-Baskerville] text-lg leading-snug text-white">
                                            {post.title}
                                        </h3>

                                        <p className="mt-2 max-w-2xl font-[raleway] text-sm leading-relaxed text-white/70">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={() => togglePublished(post)}
                                            className="flex items-center gap-1.5 font-[raleway] text-sm text-[#C6A15B] underline underline-offset-4 transition hover:text-white"
                                        >
                                            <Icon name="check" size={15} />
                                            {post.published
                                                ? "Despublicar"
                                                : "Publicar"}
                                        </button>

                                        <button
                                            onClick={() => openEditPost(post)}
                                            className="flex items-center gap-2 border border-white/30 px-4 py-2 font-[raleway] text-sm text-white transition hover:border-[#C6A15B] hover:bg-white/5"
                                        >
                                            <Icon name="edit" size={15} />
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="flex items-center gap-1.5 font-[raleway] text-sm text-white underline underline-offset-4 transition hover:text-[#C6A15B]"
                                        >
                                            <Icon name="trash" size={15} />
                                            Excluir
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 overflow-y-auto bg-[#14213D]/90 px-4 py-8"
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                y: 15,
                                filter: "blur(8px)",
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative mx-auto w-full max-w-2xl min-w-0 overflow-hidden border border-white/20 bg-[#14213D] p-6 text-white md:p-9"
                        >
                            <CornerOrnament position="top-right" />

                            <div className="relative z-10 mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <span className="font-[raleway] text-xs uppercase tracking-[0.2em] text-[#C6A15B]">
                                        Gerenciamento de conteúdo
                                    </span>

                                    <h2 className="mt-3 font-[Libre-Baskerville] text-2xl text-white">
                                        {editingId
                                            ? "Editar publicação"
                                            : "Nova publicação"}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="text-2xl text-white transition hover:text-[#C6A15B]"
                                    aria-label="Fechar formulário"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="relative z-10 w-full min-w-0 space-y-5"
                            >
                                <div className="min-w-0">
                                    <label className="mb-2 block font-[raleway] text-sm text-white">
                                        Título
                                    </label>

                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                        className="block w-full min-w-0 max-w-full box-border border border-white/30 bg-white px-4 py-3 font-[raleway] text-sm text-[#14213D] outline-none transition placeholder:text-[#14213D]/50 focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                                        placeholder="Título da publicação"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <label className="mb-2 block font-[raleway] text-sm text-white">
                                        Resumo
                                    </label>

                                    <textarea
                                        name="excerpt"
                                        value={form.excerpt}
                                        onChange={handleChange}
                                        rows={2}
                                        className="block w-full min-w-0 max-w-full box-border resize-y border border-white/30 bg-white px-4 py-3 font-[raleway] text-sm text-[#14213D] outline-none transition placeholder:text-[#14213D]/50 focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                                        placeholder="Uma breve apresentação da publicação"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <label className="mb-2 block font-[raleway] text-sm text-white">
                                        Data do acontecimento
                                    </label>

                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={form.eventDate}
                                        onChange={handleChange}
                                        className="block w-full min-w-0 max-w-full box-border appearance-none border border-white/30 bg-white px-3 py-3 font-[raleway] text-sm text-[#14213D] outline-none transition focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                                    />

                                    <p className="mt-2 font-[raleway] text-xs leading-relaxed text-white/70">
                                        Informe quando a atividade ou acontecimento
                                        ocorreu. Essa data pode ser diferente da
                                        data de publicação.
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <label className="mb-2 block font-[raleway] text-sm text-white">
                                        Conteúdo
                                    </label>

                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        required
                                        rows={8}
                                        className="block w-full min-w-0 max-w-full box-border resize-y border border-white/30 bg-white px-4 py-3 font-[raleway] text-sm leading-relaxed text-[#14213D] outline-none placeholder:text-[#14213D]/50 focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]"
                                        placeholder="Escreva o conteúdo da publicação..."
                                    />
                                </div>

                                <div className="min-w-0">
                                    <label className="mb-2 block font-[raleway] text-sm text-white">
                                        Imagem de capa
                                    </label>

                                    <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-white/50 bg-white/5 px-5 py-8 text-center transition hover:border-[#C6A15B] hover:bg-white/10">
                                        <Icon
                                            name="upload"
                                            size={25}
                                            className="text-[#C6A15B]"
                                        />

                                        <span className="mt-3 font-[raleway] text-sm font-semibold text-white">
                                            Escolher imagem
                                        </span>

                                        <span className="mt-2 font-[raleway] text-xs text-white/70">
                                            PNG, JPG, JPEG ou WEBP · Máximo 5 MB
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleCoverChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {coverPreview && (
                                        <div className="mt-4 min-w-0">
                                            <p className="mb-2 font-[raleway] text-xs uppercase tracking-wider text-[#C6A15B]">
                                                Prévia da imagem
                                            </p>

                                            <div className="relative overflow-hidden border border-white/20 bg-white/5">
                                                <img
                                                    src={coverPreview}
                                                    alt="Prévia da imagem de capa"
                                                    className="max-h-64 w-full object-cover"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    resetImage();
                                                    setForm((previous) => ({
                                                        ...previous,
                                                        coverImage: "",
                                                    }));
                                                }}
                                                className="mt-3 font-[raleway] text-xs text-[#C6A15B] underline underline-offset-4 hover:text-white"
                                            >
                                                Remover imagem selecionada
                                            </button>
                                        </div>
                                    )}

                                    <p className="mt-2 font-[raleway] text-xs leading-relaxed text-white/70">
                                        A mesma imagem será utilizada como capa
                                        da publicação e imagem principal.
                                    </p>
                                </div>

                                <label className="flex cursor-pointer items-center gap-3 font-[raleway] text-sm text-white">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={form.published}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-[#C6A15B]"
                                    />
                                    Publicar imediatamente
                                </label>

                                <div className="flex flex-wrap justify-end gap-3 border-t border-white/20 pt-6">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="border border-white/40 px-5 py-3 font-[raleway] text-sm text-white transition hover:bg-white hover:text-[#14213D]"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#C6A15B] px-6 py-3 font-[raleway] text-sm font-semibold text-[#14213D] transition hover:bg-white disabled:opacity-50"
                                    >
                                        {saving
                                            ? "Enviando imagem..."
                                            : editingId
                                                ? "Salvar alterações"
                                                : "Criar publicação"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
}
