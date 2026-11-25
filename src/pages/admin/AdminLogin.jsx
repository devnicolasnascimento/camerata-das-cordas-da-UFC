
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const reveal = {
    initial: {
        opacity: 0,
        y: 25,
        filter: "blur(10px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    },
    transition: {
        duration: 0.9,
        ease: "easeOut",
    },
};

export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Não foi possível entrar.");
            }

            localStorage.setItem("adminToken", data.token);

            navigate("/admin");
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.main
                    key="loading"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex min-h-screen items-center justify-center bg-[#f4f0e7] px-6"
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="mb-8 h-10 w-10 rounded-full border-2 border-[#ded7c9] border-t-[#94794d]"
                        />

                        <motion.span
                            {...reveal}
                            className="font-[raleway] text-xs font-semibold uppercase tracking-[0.25em] text-[#94794d]"
                        >
                            Ensino Coletivo de Cordas
                        </motion.span>

                        <h1 className="mt-5 font-[Libre-Baskerville] text-2xl text-[#252c35]">
                            Preparando seu acesso
                        </h1>

                        <p className="mt-3 font-[raleway] text-sm text-[#77766f]">
                            Verificando suas credenciais...
                        </p>
                    </div>
                </motion.main>
            ) : (
                <motion.main
                    key="login"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex min-h-screen items-center justify-center bg-[#f4f0e7] px-6 py-12"
                >
                    <div className="w-full max-w-md">
                        <motion.div {...reveal}>
                            <Link
                                to="/"
                                className="mb-6 inline-flex items-center gap-2 font-[raleway] text-sm text-[#252c35]/60 transition-colors hover:text-[#94794d]"
                            >
                                <span>←</span>
                                Voltar ao site
                            </Link>
                        </motion.div>

                        <motion.form
                            onSubmit={handleLogin}
                            initial={reveal.initial}
                            animate={reveal.animate}
                            transition={reveal.transition}
                            className="w-full border border-[#ded7c9] bg-[#f8f5ee] p-8 shadow-sm md:p-10"
                        >
                            <span className="font-[raleway] text-sm uppercase tracking-[0.25em] text-[#94794d]">
                                Ensino Coletivo de Cordas
                            </span>

                            <h1 className="mt-5 font-[Libre-Baskerville] text-4xl leading-tight text-[#252c35]">
                                Área administrativa
                            </h1>

                            <p className="mb-8 mt-3 font-[raleway] text-sm leading-relaxed text-[#77766f]">
                                Área restrita aos administradores do Ensino
                                Coletivo de Cordas. Utilize o e-mail e a senha
                                informados para acessar o painel.
                            </p>

                            <label className="mb-2 block font-[raleway] text-sm text-[#252c35]">
                                E-mail
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                className="mb-5 w-full border border-[#ded7c9] bg-white px-4 py-3 font-[raleway] text-sm outline-none transition focus:border-[#94794d]"
                                placeholder="Seu e-mail"
                            />

                            <label className="mb-2 block font-[raleway] text-sm text-[#252c35]">
                                Senha
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full border border-[#ded7c9] bg-white px-4 py-3 pr-12 font-[raleway] text-sm outline-none transition focus:border-[#94794d]"
                                    placeholder="Sua senha"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    aria-pressed={showPassword}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[#77766f] transition-colors hover:text-[#94794d]"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.3-2.6 3.5" />
                                            <path d="M6.2 6.2C3.8 7.7 2.5 10 2.5 12c1 2.5 4.5 7 9.5 7 1.3 0 2.5-.3 3.5-.8" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            className="h-5 w-5"
                                        >
                                            <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <p className="mt-4 border-l-2 border-red-500 bg-red-50 px-3 py-2 font-[raleway] text-sm text-red-700">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-7 w-full bg-[#252c35] py-3 font-[raleway] text-sm font-semibold text-white transition duration-300 hover:bg-[#39434f] disabled:opacity-50"
                            >
                                Entrar
                            </button>
                        </motion.form>
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    );
}
