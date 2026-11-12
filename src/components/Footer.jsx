export default function Footer() {
    return (
        <footer
            id="contato"
            className="bg-slate-950 py-8 text-white"
        >
            <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
                <div className="font-display text-xl text-gold">
                    Ensino Coletivo
                    <span className="block text-sm text-white">
                        de Cordas UFC
                    </span>
                </div>

                <div className="text-sm text-slate-300">
                    <p>
                        Contato: adicionar e-mail institucional
                    </p>

                    <p className="mt-1">
                        Redes sociais: adicionar links oficiais
                    </p>
                </div>

                <p className="text-sm text-slate-400">
                    Universidade Federal do Ceará
                </p>
            </div>
        </footer>
    );
}