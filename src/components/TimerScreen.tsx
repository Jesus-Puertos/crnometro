import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface TimerScreenProps {
  initialMinutes: number;
  golesObjetivo: number;
  ronda: string;
}

type Fase = "listo" | "corriendo" | "pausa" | "tiempo" | "penales";

const KEY = "mundialito-timer-v1";

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Pitido / bocina con Web Audio (sin assets). */
function useBeeper() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensure = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    return ctxRef.current;
  };
  return useCallback((freq: number, dur: number, gain = 0.18) => {
    const ctx = ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }, []);
}

export default function TimerScreen({ initialMinutes, golesObjetivo, ronda }: TimerScreenProps) {
  const totalSeconds = initialMinutes * 60;
  const [secs, setSecs] = useState(totalSeconds);
  const [fase, setFase] = useState<Fase>("listo");
  const [sound, setSound] = useState(true);
  const [ready, setReady] = useState(false);
  const targetRef = useRef<number>(0);
  const beep = useBeeper();
  const corriendo = fase === "corriendo";

  const save = useCallback(
    (data: { fase: Fase; secs: number; target: number }) => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ ...data, minutes: initialMinutes }));
      } catch {}
    },
    [initialMinutes],
  );

  // ---- Restaurar estado al montar (sobrevive a cambios de página) ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.minutes === initialMinutes) {
          if (s.fase === "corriendo") {
            const rem = Math.max(0, Math.round((s.target - Date.now()) / 1000));
            if (rem > 0) {
              targetRef.current = s.target;
              setSecs(rem);
              setFase("corriendo");
            } else {
              setSecs(0);
              setFase("tiempo");
            }
          } else {
            setSecs(typeof s.secs === "number" ? s.secs : totalSeconds);
            setFase(s.fase ?? "listo");
          }
        }
      }
    } catch {}
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Motor del cronómetro (timestamp objetivo de alta precisión) ----
  useEffect(() => {
    if (!corriendo) return;
    // Si no hay objetivo vigente (arranque normal), lo fijamos desde secs.
    if (!targetRef.current || targetRef.current < Date.now()) {
      targetRef.current = Date.now() + secs * 1000;
    }
    save({ fase: "corriendo", secs, target: targetRef.current });
    const id = setInterval(() => {
      const rem = Math.max(0, Math.round((targetRef.current - Date.now()) / 1000));
      setSecs((prev) => (rem !== prev ? rem : prev));
      save({ fase: "corriendo", secs: rem, target: targetRef.current });
      if (rem <= 0) {
        clearInterval(id);
        setFase("tiempo");
        save({ fase: "tiempo", secs: 0, target: 0 });
        if (sound) {
          beep(180, 1.2, 0.25);
          setTimeout(() => beep(140, 1.4, 0.25), 250);
        }
      }
    }, 120);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corriendo]);

  // Pitidos en la cuenta final
  useEffect(() => {
    if (corriendo && sound && secs <= 10 && secs > 0) beep(secs <= 3 ? 880 : 620, 0.12, 0.16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs]);

  const start = useCallback(() => {
    if (secs <= 0) return;
    targetRef.current = Date.now() + secs * 1000;
    setFase("corriendo");
  }, [secs]);

  const pausa = useCallback(() => {
    setFase("pausa");
    targetRef.current = 0;
    save({ fase: "pausa", secs, target: 0 });
  }, [secs, save]);

  const toggle = useCallback(() => (corriendo ? pausa() : start()), [corriendo, pausa, start]);

  const reset = useCallback(() => {
    targetRef.current = 0;
    setSecs(totalSeconds);
    setFase("listo");
    save({ fase: "listo", secs: totalSeconds, target: 0 });
  }, [totalSeconds, save]);

  const penales = useCallback(() => {
    setFase((f) => {
      const nf = f === "penales" ? "pausa" : "penales";
      save({ fase: nf, secs, target: 0 });
      return nf;
    });
    targetRef.current = 0;
  }, [secs, save]);

  // ---- Atajos de teclado ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (k === "r") reset();
      else if (k === "p") penales();
      else if (k === "s") setSound((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, reset, penales]);

  const frac = secs / totalSeconds;

  const tone = useMemo(() => {
    if (fase === "tiempo") return { color: "#ff4d4d", glow: "", label: "¡TIEMPO! · Penales" };
    if (fase === "penales") return { color: "#ff8200", glow: "text-glow-orange", label: "TANDA DE PENALES" };
    if (secs <= 30) return { color: "#ff4d4d", glow: "text-glow-orange", label: "ÚLTIMOS SEGUNDOS" };
    if (secs <= 60) return { color: "#ff9e2c", glow: "text-glow-orange", label: corriendo ? "EN JUEGO" : "EN PAUSA" };
    return { color: "#ffffff", glow: "", label: fase === "listo" ? "LISTO" : corriendo ? "EN JUEGO" : "EN PAUSA" };
  }, [fase, secs, corriendo]);

  return (
    <div className="flex w-full max-w-[760px] flex-col items-center">
      {/* Contexto */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-mundo-orange px-4 py-1.5 text-xs font-black uppercase tracking-[.18em] text-black sm:text-sm">
          {ronda}
        </span>
        <span className="rounded-full border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-bold text-white/85 backdrop-blur sm:text-sm">
          Primero a {golesObjetivo} goles · Máx {initialMinutes} min · Empate → penales
        </span>
      </div>

      {/* Cronómetro dentro del marco neón */}
      <div className="relative flex w-full flex-col items-center justify-center rounded-[2rem] px-6 py-7">
        <span
          className="mb-1 text-sm font-black uppercase tracking-[.34em]"
          style={{ color: tone.color }}
        >
          {tone.label}
        </span>

        <div
          className={`tabular font-black leading-none ${tone.glow} ${secs <= 30 && corriendo ? "animate-pulse-glow" : ""}`}
          style={{ color: tone.color, fontSize: "clamp(6rem, 22vh, 18rem)", opacity: ready ? 1 : 0.4 }}
        >
          {fmt(secs)}
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 h-3 w-[78%] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-linear"
            style={{ width: `${frac * 100}%`, background: `linear-gradient(90deg, ${tone.color}, #ff8200)` }}
          />
        </div>

        {/* Controles */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-mundo-orange to-mundo-orange-bright px-7 py-3.5 text-lg font-black text-black shadow-lg shadow-orange-900/40 transition hover:brightness-105"
          >
            {corriendo ? "❚❚ Pausar" : "▶ Iniciar"}
          </button>
          <button
            onClick={reset}
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-base font-bold text-white/85 backdrop-blur transition hover:bg-white/10"
          >
            ⟲ Reiniciar
          </button>
          <button
            onClick={penales}
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-base font-bold text-white/85 backdrop-blur transition hover:bg-white/10"
          >
            ⚽ Penales
          </button>
          <button
            onClick={() => setSound((s) => !s)}
            title="Sonido (S)"
            className="grid h-13 w-13 place-items-center rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3.5 text-lg backdrop-blur transition hover:bg-white/10"
          >
            {sound ? "🔊" : "🔇"}
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Espacio: iniciar/pausar · R: reiniciar · P: penales · S: sonido
        </p>
      </div>
    </div>
  );
}
