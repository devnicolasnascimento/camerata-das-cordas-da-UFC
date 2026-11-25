
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const instruments = [
  {
    id: "violin",
    name: "Violino",
    number: "01",
    offset: 0,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Violin_front.jpg",
    description: "O som mais agudo da família.",
  },
  {
    id: "viola",
    name: "Viola",
    number: "02",
    offset: 0.84,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Viola.JPG",
    description: "Uma voz entre o grave e o agudo.",
  },
  {
    id: "cello",
    name: "Violoncelo",
    number: "03",
    offset: 1.68,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cello_front_side.jpg",
    description: "Um som profundo e expressivo.",
  },
  {
    id: "bass",
    name: "Contrabaixo",
    number: "04",
    offset: 2.52,
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/AGK_bass1_full.jpg",
    description: "A base grave da família.",
  },
];

const SOUND_DURATION = 0.68;
const GAP_DURATION = 300;

const blurReveal = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function GamePage() {
  const [audioReady, setAudioReady] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const [sequence, setSequence] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);

  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [message, setMessage] = useState(
    "Pronto para testar seus ouvidos?"
  );

  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const sourceRef = useRef(null);

  const runRef = useRef(0);
  const inputRef = useRef(0);
  const successTimerRef = useRef(null);

  // Carregamento do áudio
  useEffect(() => {
    let cancelled = false;

    async function loadAudio() {
      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        const context = new AudioContextClass();
        audioContextRef.current = context;

        const response = await fetch("/audio/cordas-sprite.wav");

        if (!response.ok) {
          throw new Error("Não foi possível carregar o áudio.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer =
          await context.decodeAudioData(arrayBuffer);

        if (cancelled) return;

        audioBufferRef.current = decodedBuffer;
        setAudioReady(true);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setAudioError(true);
        }
      }
    }

    loadAudio();

    return () => {
      cancelled = true;
      runRef.current++;

      clearTimeout(successTimerRef.current);

      try {
        sourceRef.current?.stop();
      } catch {
        // O áudio pode já ter terminado.
      }

      audioContextRef.current?.close();
    };
  }, []);

  // Som da contagem regressiva
  async function playCountdownSound(number) {
    const context = audioContextRef.current;

    if (!context) return;

    if (context.state === "suspended") {
      await context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const frequencies = {
      3: 180,
      2: 220,
      1: 280,
    };

    const now = context.currentTime;

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      frequencies[number],
      now
    );

    gain.gain.setValueAtTime(0.0001, now);

    gain.gain.exponentialRampToValueAtTime(
      number === 1 ? 0.22 : 0.15,
      now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.2
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.21);
  }

  // Reprodução de um instrumento
  async function playInstrument(index) {
    const context = audioContextRef.current;
    const buffer = audioBufferRef.current;

    if (!context || !buffer) return;

    if (context.state === "suspended") {
      await context.resume();
    }

    const instrument = instruments[index];

    return new Promise((resolve) => {
      const source = context.createBufferSource();

      source.buffer = buffer;
      source.connect(context.destination);

      sourceRef.current = source;
      setActive(index);

      source.onended = () => {
        setActive((current) =>
          current === index ? null : current
        );

        resolve();
      };

      source.start(0, instrument.offset, SOUND_DURATION);
    });
  }

  // Reprodução da sequência
  async function playSequence(list) {
    const currentRun = ++runRef.current;

    setPlaying(true);
    setActive(null);
    setMessage("Escute com atenção...");

    await wait(450);

    for (const index of list) {
      if (currentRun !== runRef.current) return;

      await playInstrument(index);

      if (currentRun !== runRef.current) return;

      await wait(GAP_DURATION);
    }

    if (currentRun !== runRef.current) return;

    setPlaying(false);
    setActive(null);
    setMessage("Agora é sua vez!");
  }

  // Início do jogo e contagem regressiva
  async function startGame() {
    if (!audioReady) return;

    runRef.current++;
    const currentRun = runRef.current;

    try {
      sourceRef.current?.stop();
    } catch {
      // O áudio pode já ter terminado.
    }

    clearTimeout(successTimerRef.current);

    const first = Math.floor(
      Math.random() * instruments.length
    );

    setShowModal(false);
    setShowSuccess(false);

    setStarted(true);
    setGameOver(false);

    setScore(0);
    setRound(1);

    setActive(null);
    setSequence([first]);

    setPlaying(true);
    setCountdown(null);

    setMessage("Prepare-se...");

    inputRef.current = 0;

    for (let number = 3; number >= 1; number--) {
      if (currentRun !== runRef.current) return;

      setCountdown(number);

      await playCountdownSound(number);

      await wait(850);
    }

    if (currentRun !== runRef.current) return;

    setCountdown(null);
    playSequence([first]);
  }

  // Resposta do jogador
  async function handleInstrument(index) {
    if (
      !started ||
      playing ||
      gameOver ||
      showModal ||
      countdown !== null
    ) {
      return;
    }

    const currentRun = runRef.current;

    setActive(index);
    playInstrument(index);

    const expected = sequence[inputRef.current];

    // Resposta incorreta
    if (index !== expected) {
      runRef.current++;

      setGameOver(true);
      setPlaying(false);
      setActive(null);
      setShowSuccess(false);
      setMessage("Sequência interrompida.");
      setShowModal(true);

      return;
    }

    setScore((current) => current + 10);
    inputRef.current++;

    // Sequência concluída
    if (inputRef.current === sequence.length) {
      setShowSuccess(true);
      setMessage("Sequência correta!");

      clearTimeout(successTimerRef.current);

      successTimerRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, 1400);

      setPlaying(true);

      await wait(1400);

      if (currentRun !== runRef.current) return;

      const nextInstrument = Math.floor(
        Math.random() * instruments.length
      );

      const nextSequence = [
        ...sequence,
        nextInstrument,
      ];

      setSequence(nextSequence);
      setRound((current) => current + 1);

      inputRef.current = 0;

      playSequence(nextSequence);
    }
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0e6] text-[#252b2b]">
      {/* Cabeçalho */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 md:px-12">
        <Link
          to="/"
          className="group flex items-center gap-3 text-sm text-[#77766d] transition-colors hover:text-[#9b6d45]"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Voltar ao início
        </Link>

        <span className="font-serif text-sm tracking-wide text-[#9b6d45]">
          Ensino Coletivo de Cordas
        </span>
      </header>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-10 md:px-12 md:pt-16">
        {/* Apresentação */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <motion.span
            variants={blurReveal}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-5 block text-[10px] uppercase tracking-[0.3em] text-[#9b6d45]"
          >
            Um exercício de escuta
          </motion.span>

          <motion.h1
            variants={blurReveal}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.9,
              delay: 0.12,
              ease: "easeOut",
            }}
            className="font-serif text-4xl leading-tight md:text-6xl"
          >
            Ouvido atento,
            <br />
            <span className="italic text-[#9b6d45]">
              memória afiada.
            </span>
          </motion.h1>

          <motion.p
            variants={blurReveal}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.9,
              delay: 0.24,
              ease: "easeOut",
            }}
            className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#77766d] md:text-base"
          >
            Escute a sequência de instrumentos e tente
            reproduzi-la na ordem correta. A cada rodada,
            um novo som será acrescentado.
          </motion.p>
        </div>

        {/* Pontuação e status */}
        <motion.div
          variants={blurReveal}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.8,
            delay: 0.35,
            ease: "easeOut",
          }}
          className="mt-16 flex flex-wrap items-center justify-between gap-5 border-y border-[#d6cebd] py-5"
        >
          <div className="flex items-center gap-8">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#888477]">
                Rodada
              </span>

              <span className="font-serif text-3xl">
                {String(round).padStart(2, "0")}
              </span>
            </div>

            <div className="h-10 w-px bg-[#d6cebd]" />

            <div>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#888477]">
                Pontos
              </span>

              <span className="font-serif text-3xl">
                {String(score).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* Contador */}
          <div className="flex min-w-[190px] items-center justify-center">
            {countdown !== null ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{
                    opacity: 0,
                    y: 8,
                    filter: "blur(12px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    filter: "blur(12px)",
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="font-serif text-4xl leading-none text-[#9b6d45]">
                    {countdown}
                  </span>

                  <span className="text-left text-[10px] uppercase tracking-[0.16em] text-[#77766d]">
                    Prepare seus ouvidos
                  </span>
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={message}
                  initial={{
                    opacity: 0,
                    y: 6,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(8px)",
                  }}
                  transition={{ duration: 0.35 }}
                  className="text-sm text-[#77766d]"
                >
                  {audioError
                    ? "Não foi possível carregar o áudio."
                    : !audioReady
                      ? "Carregando os instrumentos..."
                      : message}
                </motion.p>
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Instrumentos */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {instruments.map((instrument, index) => {
            const isActive = active === index;

            return (
              <motion.button
                key={instrument.id}
                type="button"
                disabled={
                  !audioReady ||
                  playing ||
                  gameOver ||
                  showModal ||
                  countdown !== null
                }
                onClick={() => handleInstrument(index)}
                initial={{
                  opacity: 0,
                  y: 24,
                  filter: "blur(12px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.45 + index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={
                  !playing && !gameOver && audioReady
                    ? { y: -5 }
                    : {}
                }
                whileTap={{ scale: 0.97 }}
                className={`group relative flex min-h-[270px] flex-col items-center justify-between overflow-hidden border p-4 text-center transition-colors duration-300 md:min-h-[330px] md:p-5 ${
                  isActive
                    ? "border-[#9b6d45] bg-[#e9dfce]"
                    : "border-[#ded6c7] bg-[#eee9dd] hover:border-[#b69b79] hover:bg-[#ece5d8]"
                } ${
                  !audioReady || playing || gameOver || showModal
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] text-[#a39a89]">
                    {instrument.number}
                  </span>

                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      isActive
                        ? "bg-[#9b6d45]"
                        : "bg-[#d3cbbb]"
                    }`}
                  />
                </div>

                <motion.div
                  animate={
                    isActive
                      ? {
                          scale: 1.06,
                          y: -4,
                          filter: "blur(0px)",
                        }
                      : {
                          scale: 1,
                          y: 0,
                          filter: "blur(0px)",
                        }
                  }
                  transition={{ duration: 0.25 }}
                  className="flex h-36 w-full items-center justify-center md:h-44"
                >
                  <img
                    src={instrument.image}
                    alt={instrument.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </motion.div>

                <div>
                  <h2 className="font-serif text-lg md:text-xl">
                    {instrument.name}
                  </h2>

                  <p className="mt-1 text-[10px] leading-5 text-[#8b877b] md:text-xs">
                    {instrument.description}
                  </p>
                </div>

                {isActive && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                    }}
                    className="absolute inset-x-0 bottom-0 h-1 bg-[#9b6d45]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Botão */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
            filter: "blur(12px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.8,
            delay: 0.9,
            ease: "easeOut",
          }}
          className="mt-12 flex flex-col items-center"
        >
          <motion.button
            type="button"
            whileHover={audioReady ? { scale: 1.03 } : {}}
            whileTap={audioReady ? { scale: 0.97 } : {}}
            onClick={startGame}
            disabled={!audioReady}
            className="min-w-56 bg-[#292e2b] px-10 py-4 text-xs uppercase tracking-[0.2em] text-[#f4f0e6] transition-colors hover:bg-[#9b6d45] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {!audioReady
              ? "Carregando..."
              : !started
                ? "Começar jogo"
                : "Tentar novamente"}
          </motion.button>

          <p className="mt-4 text-center text-[11px] text-[#999386]">
            {audioError
              ? "Verifique o arquivo de áudio."
              : "Escute, memorize e reproduza a sequência."}
          </p>
        </motion.div>
      </section>

      {/* Feedback de acerto */}
      <AnimatePresence>
        {showSuccess && (
          <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-4">
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
                filter: "blur(12px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: 10,
                filter: "blur(10px)",
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="border border-[#d6cebd] bg-[#f4f0e6] px-7 py-4 text-center shadow-lg"
            >
              <span className="font-serif text-lg text-[#9b6d45]">
                Muito bem!
              </span>

              <p className="mt-1 text-xs text-[#77766d]">
                Você acertou a sequência.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de erro */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(4px)",
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#252b2b]/50 px-5 py-8"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
                filter: "blur(12px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.97,
                filter: "blur(10px)",
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="w-full max-w-md border border-[#ded6c7] bg-[#f4f0e6] p-8 text-center md:p-10"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9b6d45]">
                Fim de rodada
              </span>

              <h2 className="mt-5 font-serif text-4xl text-[#292e2b]">
                Quase lá!
              </h2>

              <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#77766d]">
                Dessa vez a sequência escapou. Que tal
                tentar novamente e ver até onde você consegue chegar?
              </p>

              <div className="my-8 border-y border-[#d6cebd] py-5">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#888477]">
                  Pontuação final
                </span>

                <span className="mt-2 block font-serif text-4xl text-[#9b6d45]">
                  {String(score).padStart(3, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={startGame}
                  className="bg-[#292e2b] px-6 py-4 text-xs uppercase tracking-[0.18em] text-[#f4f0e6] transition-colors hover:bg-[#9b6d45]"
                >
                  Jogar novamente
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-xs uppercase tracking-[0.18em] text-[#77766d] transition-colors hover:text-[#292e2b]"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
