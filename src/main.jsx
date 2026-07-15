import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Check,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import "./styles.css";

function hasAlphabeticalSequence(value, minimumLength = 5) {
  let previousCode = null;
  let runLength = 1;

  for (const character of value.toLowerCase()) {
    if (!/[a-z]/.test(character)) {
      previousCode = null;
      runLength = 1;
      continue;
    }

    const currentCode = character.charCodeAt(0);
    runLength = currentCode === previousCode + 1 ? runLength + 1 : 1;
    previousCode = currentCode;
    if (runLength >= minimumLength) return true;
  }

  return false;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const rules = [
  {
    text: "A senha deve ter pelo menos 8 caracteres.",
    test: (value) => value.length >= 8,
  },
  {
    text: "A senha deve conter letras e números.",
    test: (value) => /[a-zA-Z]/.test(value) && /\d/.test(value),
  },
  {
    text: "A senha deve ter pelo menos uma letra maiúscula.",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    text: "A senha deve iniciar com uma letra maiúscula.",
    test: (value) => /^[A-Z]/.test(value),
  },
  {
    text: "A senha deve possuir a palavra “carro”.",
    test: (value) => value.toLowerCase().includes("carro"),
  },
  {
    text: "A senha deve ter ao menos um número múltiplo de 7.",
    test: (value) =>
      value.includes("7") ||
      (value.match(/\d+/g) || []).some((number) => Number(number) % 7 === 0),
  },
  {
    text: "A senha deve conter o número 2.",
    test: (value) => value.includes("2"),
  },
  {
    text: "A senha deve ter ao menos um caractere especial.",
    test: (value) => /[^a-zA-Z0-9\s]/.test(value),
  },
  {
    text: "A senha deve iniciar com uma letra.",
    test: (value) => /^[a-zA-Z]/.test(value),
  },
  {
    text: "A senha deve terminar com um ponto de exclamação.",
    test: (value) => value.endsWith("!"),
  },
  {
    text: "A senha deve conter pelo menos 5 letras em sequência alfabética, como “abcde”.",
    test: (value) => hasAlphabeticalSequence(value),
  },
  {
    text: "O número 2 deve estar ao lado do ponto de exclamação.",
    test: (value) => value.includes("2!") || value.includes("!2"),
  },
  {
    text: "A soma dos números completos da senha deve ser 23.",
    test: (value) =>
      (value.match(/\d+/g) || []).reduce(
        (sum, number) => sum + Number(number),
        0,
      ) === 23,
  },
  {
    text: "A primeira letra da senha deve ser maiúscula.",
    test: (value) => /^[A-Z]/.test(value),
  },
  {
    text: "A senha não deve conter o caractere @.",
    test: (value) => !value.includes("@"),
  },
  {
    text: "A senha não deve conter ponto final (.).",
    test: (value) => !value.includes("."),
  },
  {
    text: "A senha não deve ter mais de 25 caracteres.",
    test: (value) => [...value].length <= 25,
  },
  {
    text: "A senha deve ter ao menos uma letra R maiúscula.",
    test: (value) => value.includes("R"),
  },
  {
    text: "A senha não deve ter mais de uma letra c.",
    test: (value) => (value.match(/c/g) || []).length <= 1,
  },
  {
    text: "O penúltimo caractere da senha não pode ser o número 2.",
    test: (value) => [...value].at(-2) !== "2",
  },
  {
    text: "O segundo caractere da senha não pode ser a letra C.",
    test: (value) => value[1] !== "C",
  },
  {
    text: "A senha deve conter a palavra OVO em inglês.",
    test: (value) => value.toLowerCase().includes("egg"),
  },
  {
    text: "A senha não deve ter mais de uma letra e.",
    test: (value) => (value.match(/e/g) || []).length <= 1,
  },
];

const COUNTDOWN_DURATION = 90;

function App() {
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState(0);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [result, setResult] = useState(null);
  const countdownMode = gameMode === "countdown";
  const progress = useMemo(() => (stage / rules.length) * 100, [stage]);

  useEffect(() => {
    if (!started || result) return undefined;
    const timer = window.setInterval(() => {
      if (countdownMode) setTimeLeft((time) => Math.max(time - 1, 0));
      else setElapsedTime((time) => time + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, result, countdownMode]);

  function finishGame(isWinner, value = password) {
    const satisfiedRules = rules.filter((rule) => rule.test(value)).length;
    const timeUsed = countdownMode ? COUNTDOWN_DURATION - timeLeft : elapsedTime;
    let score = satisfiedRules * 100;

    if (isWinner && countdownMode) score += timeLeft * 5;
    if (isWinner && !countdownMode)
      score = Math.max(100, score - Math.max(0, elapsedTime - 30));

    setResult({
      isWinner,
      satisfiedRules,
      timeUsed,
      score: Math.max(0, score),
    });
    setStarted(false);
  }

  useEffect(() => {
    if (started && countdownMode && timeLeft === 0 && !result)
      finishGame(false);
  }, [started, countdownMode, timeLeft, result]);

  function submit(event) {
    event.preventDefault();
    if (!started || result) return;
    if (!password) {
      setStatus("error");
      setMessage("Digite uma senha para tentar.");
      return;
    }
    // Todas as regras são verificadas em cada tentativa, mas mostramos somente
    // a primeira que ainda precisa ser corrigida para não sobrecarregar o jogador.
    const failedIndex = rules.findIndex((rule) => !rule.test(password));
    const failedRule = failedIndex === -1 ? undefined : rules[failedIndex];
    if (!failedRule) {
      setStage(rules.length);
      setStatus("success");
      setMessage("Incrível. Você desvendou a senha final!");
      finishGame(true);
    } else {
      setStage(failedIndex);
      setStatus("error");
      setMessage(
        `Ainda não: ${failedRule.text.replace("A senha deve", "sua senha deve").replace("A senha precisa", "sua senha precisa")}`,
      );
    }
  }

  function restart() {
    setPassword("");
    setStage(0);
    setStatus("idle");
    setMessage("");
    setTimeLeft(COUNTDOWN_DURATION);
    setElapsedTime(0);
    setStarted(false);
    setGameMode(null);
    setResult(null);
  }

  function startGame(mode) {
    setGameMode(mode);
    setStarted(true);
    setTimeLeft(COUNTDOWN_DURATION);
    setElapsedTime(0);
    setResult(null);
  }

  const displayedTime = countdownMode ? timeLeft : elapsedTime;

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b16] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(111,71,255,.18),transparent_26%),radial-gradient(circle_at_18%_80%,rgba(35,198,181,.10),transparent_23%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-7 sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-violet-500 shadow-lg shadow-violet-950/40">
              <KeyRound size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Pass<span className="text-violet-400">Quest</span>
            </span>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tabular-nums ${countdownMode && timeLeft <= 10 ? "border-rose-400/30 bg-rose-400/10 text-rose-300" : "border-white/10 bg-white/5 text-slate-300"}`}
          >
            <Timer size={14} /> {formatTime(displayedTime)}
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
              <Sparkles size={14} /> Nível {Math.min(stage + 1, rules.length)}{" "}
              de {rules.length}
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Qual é a senha?
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              A cada acerto, o desafio fica um pouco mais difícil.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121625]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Seu progresso</span>
                <span className="text-violet-300">
                  {stage}/{rules.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {result ? (
              <div className="py-4 text-center">
                <div
                  className={`mx-auto mb-5 grid size-20 place-items-center rounded-full ring-8 ${result.isWinner ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/5" : "bg-rose-400/15 text-rose-300 ring-rose-400/5"}`}
                >
                  {result.isWinner ? (
                    <ShieldCheck size={38} />
                  ) : (
                    <Timer size={38} />
                  )}
                </div>
                <h2 className="text-2xl font-bold">
                  {result.isWinner ? "Cofre desbloqueado!" : "Tempo esgotado!"}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  {result.isWinner
                    ? "Sua senha passou por todas as camadas de segurança."
                    : "Você não concluiu a senha antes do fim da contagem."}
                </p>
                <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3 text-left">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tempo usado
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {formatTime(result.timeUsed)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-violet-500/15 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                      Pontuação
                    </p>
                    <p className="mt-1 text-2xl font-black text-violet-200">
                      {result.score} pts
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  {result.satisfiedRules} de {rules.length} regras satisfeitas
                </p>
                <button
                  onClick={restart}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-100"
                >
                  <RefreshCw size={16} /> Jogar novamente
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                  <div className="flex gap-3">
                    <LockKeyhole
                      className="mt-0.5 shrink-0 text-violet-300"
                      size={19}
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-300">
                        Regra atual
                      </p>
                      <p className="mt-1 text-base font-semibold leading-6 text-white">
                        {rules[stage].text}
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={submit} className="mt-6">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Sua tentativa
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="password"
                      type="text"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (status !== "idle") setStatus("idle");
                      }}
                      onCopy={(event) => event.preventDefault()}
                      onPaste={(event) => event.preventDefault()}
                      onKeyDown={(event) => {
                        if (
                          (event.metaKey || event.ctrlKey) &&
                          ["c", "v"].includes(event.key.toLowerCase())
                        )
                          event.preventDefault();
                      }}
                      placeholder="Digite sua senha..."
                      autoComplete="off"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#090c17] px-4 py-3.5 text-base outline-none placeholder:text-slate-600 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-bold text-white active:scale-[.98]"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
                {status !== "idle" && (
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm ${status === "success" ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}
                  >
                    {status === "success" ? (
                      <Check size={17} />
                    ) : (
                      <X size={17} />
                    )}
                    {message}
                  </div>
                )}
              </>
            )}
          </div>
          <p className="mt-5 text-center text-base text-slate-200">
            Dica: mantenha a mesma senha e vá aprimorando-a a cada rodada.
          </p>
        </section>
        <footer className="text-center text-sm text-slate-200">
          Desafie sua lógica · Sem senhas reais
        </footer>
      </div>
      {!started && !result && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950/45 p-5 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#161a2d]/95 p-7 text-center shadow-2xl shadow-black/50 sm:p-9">
            <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-900/40">
              <KeyRound size={29} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">
              PassQuest
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Escolha seu desafio
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Cada modalidade tem sua própria forma de contar o tempo e calcular
              a pontuação.
            </p>
            <div className="mt-7 grid gap-3 text-left">
              <button
                onClick={() => startGame("countdown")}
                className="rounded-2xl border border-violet-400/30 bg-violet-500/15 p-4 transition hover:border-violet-300 hover:bg-violet-500/25 hover:cursor-pointer"
              >
                <span className="flex items-center gap-2 font-bold text-violet-200">
                  <Timer size={18} /> Contagem regressiva
                </span>
                <span className="mt-1 block text-left text-xs leading-5 text-slate-400">
                  Você tem 90 segundos para concluir o desafio. Seja rápido para ganhar mais pontos.
                </span>
              </button>
              <button
                onClick={() => startGame("free")}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10 hover:cursor-pointer"
              >
                <span className="flex items-center gap-2 font-bold text-white">
                  <Sparkles size={18} /> Tempo livre
                </span>
                <span className="mt-1 block text-left text-xs leading-5 text-slate-400">
                  Sem limite de tempo. Concentre-se em resolver o desafio no menor tempo possível para ganhar mais pontos.
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
