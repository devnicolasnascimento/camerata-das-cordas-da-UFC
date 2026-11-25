
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

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

    // Libera as URLs temporárias da prévia quando elas deixam de ser usadas.
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
            <main className="flex min-h-screen items-center justify-center bg-[#f4f0e7] px-6">
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
                        className="mb-8 h-10 w-10 rounded-full border-2 border-[#ded7c9] border-t-[#94794d]"
                    />

                    <span className="font-[raleway] text-xs font-semibold uppercase tracking-[0.25em] text-[#94794d]">
                        Ensino Coletivo de Cordas
                    </span>

                    <h1 className="mt-5 font-[Libre-Baskerville] text-2xl text-[#252c35]">
                        Preparando o painel
                    </h1>

                    <p className="mt-3 font-[raleway] text-sm text-[#77766f]">
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
            className="min-h-screen bg-[#f4f0e7] text-[#252c35]"
        >
            <header className="border-b border-[#ded7c9] bg-[#f8f5ee]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
                    <a
                        href="/admin"
                        className="group flex items-center gap-3"
                    >
                        <span className="font-[Libre-Baskerville] text-2xl font-bold tracking-tight text-[#252c35] transition-colors group-hover:text-[#94794d]">
                            C.
                        </span>

                        <span className="h-8 w-px bg-[#ded7c9]" />

                        <span className="flex flex-col">
                            <span className="font-[raleway] text-sm font-semibold tracking-wide text-[#252c35]">
                                Ensino Coletivo
                            </span>

                            <span className="mt-0.5 font-[raleway] text-[10px] uppercase tracking-[0.16em] text-[#94794d]">
                                Cordas · UFC
                            </span>
                        </span>
                    </a>

                    <div className="flex items-center gap-5">
                        <span className="hidden font-[raleway] text-xs text-[#99958c] sm:block">
                            Administração
                        </span>

                        <button
                            onClick={handleLogout}
                            className="border-l border-[#ded7c9] pl-5 font-[raleway] text-xs font-semibold uppercase tracking-wider text-[#77766f] transition-colors hover:text-[#94794d]"
                        >
                            Sair <span className="ml-1">↗</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
                <motion.section {...reveal} className="mb-14">
                    <p className="font-[raleway] text-sm uppercase tracking-[0.15em] text-[#94794d]">
                        Área de gerenciamento
                    </p>

                    <h2 className="mt-3 font-[Libre-Baskerville] text-3xl md:text-4xl">
                        Visão geral.
                    </h2>

                    <p className="mt-4 max-w-2xl font-[raleway] text-sm leading-relaxed text-[#77766f]">
                        Gerencie as publicações e atualize as novidades
                        do Ensino Coletivo de Cordas da UFC.
                    </p>
                </motion.section>

                <section className="mb-16">
                    <div className="mb-6">
                        <span className="font-[raleway] text-xs uppercase tracking-[0.18em] text-[#94794d]">
                            Resumo
                        </span>

                        <h3 className="mt-2 font-[Libre-Baskerville] text-xl">
                            Suas publicações em números
                        </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: "Total de publicações",
                                value: posts.length,
                                number: "01",
                            },
                            {
                                label: "Publicadas",
                                value: publishedCount,
                                number: "02",
                            },
                            {
                                label: "Rascunhos",
                                value: draftCount,
                                number: "03",
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
                                className="border border-[#ded7c9] bg-[#f8f5ee] p-6 transition-colors duration-300 hover:border-[#94794d]/60"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-[raleway] text-xs tracking-widest text-[#94794d]">
                                        {item.number}
                                    </span>

                                    <span className="h-2 w-2 rounded-full bg-[#94794d]" />
                                </div>

                                <strong className="mt-6 block font-[Libre-Baskerville] text-4xl font-normal">
                                    {item.value}
                                </strong>

                                <p className="mt-2 font-[raleway] text-sm text-[#77766f]">
                                    {item.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section>
                    <motion.div
                        {...reveal}
                        className="flex flex-col justify-between gap-5 border-b border-[#ded7c9] pb-6 sm:flex-row sm:items-end"
                    >
                        <div>
                            <span className="font-[raleway] text-xs uppercase tracking-[0.18em] text-[#94794d]">
                                Conteúdo do site
                            </span>

                            <h2 className="mt-2 font-[Libre-Baskerville] text-2xl md:text-3xl">
                                Suas publicações.
                            </h2>

                            <p className="mt-3 font-[raleway] text-sm text-[#77766f]">
                                Crie, edite e organize as notícias do projeto.
                            </p>
                        </div>

                        <button
                            onClick={openNewPost}
                            className="w-fit bg-[#252c35] px-5 py-3 font-[raleway] text-sm font-semibold text-white transition duration-300 hover:bg-[#39434f]"
                        >
                            + Nova publicação
                        </button>
                    </motion.div>

                    {error && (
                        <div className="mt-6 border-l-2 border-red-500 bg-red-50 p-4 font-[raleway] text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {posts.length === 0 ? (
                        <motion.div
                            {...reveal}
                            className="mt-8 border border-[#ded7c9] bg-[#f8f5ee] px-6 py-16 text-center"
                        >
                            <span className="font-[raleway] text-xs uppercase tracking-[0.2em] text-[#94794d]">
                                Ainda não há conteúdo
                            </span>

                            <h3 className="mt-4 font-[Libre-Baskerville] text-xl">
                                Nenhuma publicação por aqui.
                            </h3>

                            <p className="mt-3 font-[raleway] text-sm text-[#77766f]">
                                Comece criando sua primeira publicação.
                            </p>

                            <button
                                onClick={openNewPost}
                                className="mt-6 border border-[#252c35] px-5 py-3 font-[raleway] text-sm transition hover:bg-[#252c35] hover:text-white"
                            >
                                Criar publicação
                            </button>
                        </motion.div>
                    ) : (
                        <div className="mt-2 divide-y divide-[#ded7c9]">
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
                                            <span
                                                className={`font-[raleway] text-xs font-semibold uppercase tracking-wider ${post.published
                                                        ? "text-green-700"
                                                        : "text-[#94794d]"
                                                    }`}
                                            >
                                                {post.published
                                                    ? "Publicada"
                                                    : "Rascunho"}
                                            </span>

                                            <span className="text-[#ded7c9]">
                                                /
                                            </span>

                                            <span className="font-[raleway] text-xs text-[#99958c]">
                                                {post.eventDate
                                                    ? `Aconteceu em ${formatDate(post.eventDate)}`
                                                    : `Cadastrada em ${formatDate(post.createdAt)}`}
                                            </span>
                                        </div>

                                        <h3 className="font-[Libre-Baskerville] text-lg leading-snug">
                                            {post.title}
                                        </h3>

                                        <p className="mt-2 max-w-2xl font-[raleway] text-sm leading-relaxed text-[#77766f]">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={() => togglePublished(post)}
                                            className="font-[raleway] text-sm text-[#94794d] underline underline-offset-4 transition hover:text-[#252c35]"
                                        >
                                            {post.published
                                                ? "Despublicar"
                                                : "Publicar"}
                                        </button>

                                        <button
                                            onClick={() => openEditPost(post)}
                                            className="border border-[#ded7c9] px-4 py-2 font-[raleway] text-sm transition hover:border-[#252c35] hover:bg-[#f8f5ee]"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="font-[raleway] text-sm text-red-700 transition hover:text-red-900"
                                        >
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
                        className="fixed inset-0 z-50 overflow-y-auto bg-[#252c35]/60 px-4 py-8"
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
                            className="mx-auto w-full max-w-2xl border border-[#ded7c9] bg-[#f8f5ee] p-6 md:p-9"
                        >
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <span className="font-[raleway] text-xs uppercase tracking-[0.2em] text-[#94794d]">
                                        Gerenciamento de conteúdo
                                    </span>

                                    <h2 className="mt-3 font-[Libre-Baskerville] text-2xl">
                                        {editingId
                                            ? "Editar publicação"
                                            : "Nova publicação"}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="text-2xl text-[#77766f] transition hover:text-[#252c35]"
                                    aria-label="Fechar formulário"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-2 block font-[raleway] text-sm">
                                        Título
                                    </label>

                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-[#ded7c9] bg-white px-4 py-3 font-[raleway] text-sm outline-none transition focus:border-[#94794d]"
                                        placeholder="Título da publicação"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-[raleway] text-sm">
                                        Resumo
                                    </label>

                                    <textarea
                                        name="excerpt"
                                        value={form.excerpt}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full resize-y border border-[#ded7c9] bg-white px-4 py-3 font-[raleway] text-sm outline-none transition focus:border-[#94794d]"
                                        placeholder="Uma breve apresentação da publicação"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-[raleway] text-sm">
                                        Data do acontecimento
                                    </label>

                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={form.eventDate}
                                        onChange={handleChange}
                                        className="w-full border border-[#ded7c9] bg-white px-4 py-3 font-[raleway] text-sm text-[#252c35] outline-none transition focus:border-[#94794d]"
                                    />

                                    <p className="mt-2 font-[raleway] text-xs leading-relaxed text-[#99958c]">
                                        Informe quando a atividade ou acontecimento
                                        ocorreu. Essa data pode ser diferente da
                                        data de publicação.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block font-[raleway] text-sm">
                                        Conteúdo
                                    </label>

                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        required
                                        rows={8}
                                        className="w-full resize-y border border-[#ded7c9] bg-white px-4 py-3 font-[raleway] text-sm leading-relaxed outline-none transition focus:border-[#94794d]"
                                        placeholder="Escreva o conteúdo da publicação..."
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block font-[raleway] text-sm">
                                        Imagem de capa
                                    </label>

                                    <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#c9bda8] bg-white px-5 py-8 text-center transition hover:border-[#94794d]">
                                        <span className="text-3xl text-[#94794d]">
                                            ↑
                                        </span>

                                        <span className="mt-3 font-[raleway] text-sm font-semibold text-[#252c35]">
                                            Escolher imagem
                                        </span>

                                        <span className="mt-2 font-[raleway] text-xs text-[#99958c]">
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
                                        <div className="mt-4">
                                            <p className="mb-2 font-[raleway] text-xs uppercase tracking-wider text-[#94794d]">
                                                Prévia da imagem
                                            </p>

                                            <div className="relative overflow-hidden border border-[#ded7c9] bg-white">
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
                                                className="mt-3 font-[raleway] text-xs text-red-700 underline underline-offset-4 hover:text-red-900"
                                            >
                                                Remover imagem selecionada
                                            </button>
                                        </div>
                                    )}

                                    <p className="mt-2 font-[raleway] text-xs leading-relaxed text-[#99958c]">
                                        A mesma imagem será utilizada como capa
                                        da publicação e imagem principal.
                                    </p>
                                </div>

                                <label className="flex cursor-pointer items-center gap-3 font-[raleway] text-sm">
                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={form.published}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-[#94794d]"
                                    />
                                    Publicar imediatamente
                                </label>

                                <div className="flex flex-wrap justify-end gap-3 border-t border-[#ded7c9] pt-6">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="border border-[#ded7c9] px-5 py-3 font-[raleway] text-sm transition hover:bg-white"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#252c35] px-6 py-3 font-[raleway] text-sm font-semibold text-white transition hover:bg-[#39434f] disabled:opacity-50"
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
