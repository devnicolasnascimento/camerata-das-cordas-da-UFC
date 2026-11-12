export default function Participation() {
    return (
        <section
            id="participar"
            className="bg-navy py-14 text-white"
        >
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-gold">
                        Participe
                    </p>

                    <h2 className="mt-2 font-display text-4xl">
                        Faça parte do nosso projeto!
                    </h2>

                    <p className="mt-3 max-w-xl text-slate-200">
                        Consulte as informações sobre inscrições e descubra
                        como participar.
                    </p>
                </div>

                <a
                    href="#contato"
                    className="rounded-full bg-gold px-6 py-3 text-center text-sm font-bold text-navy"
                >
                    COMO PARTICIPAR
                </a>
            </div>
        </section>
    );
}