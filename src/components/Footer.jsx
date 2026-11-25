
export default function Footer() {
    const links = [
        ["Início", "#inicio"],
        ["O projeto", "#projeto"],
        ["Como participar", "#participar"],
        ["Notícias", "#noticias"],
        ["Jogo", "#jogo"],
    ];

    return (
        <footer
            id="contato"
            className="bg-slate-950 px-6 pt-16 text-white"
        >
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 pb-14 md:grid-cols-[1.5fr_1fr_1fr]">
                    <div>
                        <p className="font-[raleway] text-sm font-semibold uppercase tracking-wider text-gold">
                            Universidade Federal do Ceará
                        </p>

                        <h2 className="mt-4 max-w-sm font-[Libre-Baskerville] text-3xl leading-snug">
                            Ensino Coletivo de Cordas
                        </h2>

                        <p className="mt-4 max-w-sm font-[raleway] text-sm leading-7 text-slate-400">
                            Um espaço dedicado à prática musical,
                            ao aprendizado coletivo e à formação
                            através dos instrumentos de cordas.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-5 font-[raleway] text-sm font-bold text-gold">
                            Navegação
                        </h3>

                        <nav className="flex flex-col items-start gap-3">
                            {links.map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="font-[raleway] text-sm text-slate-400 transition-colors hover:text-white"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h3 className="mb-5 font-[raleway] text-sm font-bold text-gold">
                            Contato
                        </h3>

                        <div className="space-y-3 font-[raleway] text-sm text-slate-400">
                            <p>
                                E-mail institucional
                            </p>

                            <p>
                                Redes sociais oficiais
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                    <p>
                        Ensino Coletivo de Cordas — UFC
                    </p>

                    <p>
                        Universidade Federal do Ceará
                    </p>
                </div>
            </div>
        </footer>
    );
}
