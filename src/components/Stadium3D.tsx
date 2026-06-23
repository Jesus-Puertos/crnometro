import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { getPartidos, partidoDeMesa, getEquipos } from "../scripts/torneoStore";
import { getEquipo } from "../data/torneo";

const MODEL_URL = "/models/foosball_table.glb";

export interface MatchVM {
  teamA: string;
  teamB: string;
  marcadorA: number;
  marcadorB: number;
  estado: "proximo" | "jugando" | "finalizado";
}

export interface NegocioVM {
  nombre: string;
  logo?: string;
  iniciales?: string;
  color?: string;
}
export interface EstadioVM {
  id: string;
  numero: number;
  nombre: string; // "Estadio Oficial {negocios}"
  negocios: NegocioVM[]; // uno o más co-patrocinadores
  acento: string;
  estelar?: boolean;
}

function FoosballTable() {
  const { scene } = useGLTF(MODEL_URL);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}
useGLTF.preload(MODEL_URL);

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-white/80">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-mundo-green-neon" />
        <span className="text-xs font-bold uppercase tracking-[.2em]">Cargando mesa…</span>
      </div>
    </Html>
  );
}

function Scene({ acento }: { acento: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow />
      <spotLight position={[-6, 7, -4]} angle={0.5} penumbra={0.8} intensity={120} color={acento} />
      <spotLight position={[6, 5, 4]} angle={0.6} penumbra={1} intensity={80} color="#ff8200" />

      <Suspense fallback={<Loader />}>
        <Bounds fit clip observe margin={1.15}>
          <FoosballTable />
        </Bounds>
        <Environment preset="city" />
      </Suspense>

      <ContactShadows position={[0, -1.35, 0]} opacity={0.55} scale={14} blur={2.6} far={4} color="#000000" />

      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.9}
        enablePan={false}
        enableZoom={true}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={3}
        maxDistance={12}
      />
    </>
  );
}

const estadoMeta = {
  jugando: { label: "EN JUEGO", color: "#39ff95" },
  finalizado: { label: "FINALIZADO", color: "#94a3b8" },
  proximo: { label: "PRÓXIMO", color: "#ff9e2c" },
} as const;

export default function Stadium3D({ estadios }: { estadios: EstadioVM[] }) {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [matches, setMatches] = useState<Record<string, MatchVM | undefined>>({});
  const est = estadios[idx];
  const match = matches[est.id];

  // Partido en vivo de cada mesa (desde localStorage; se actualiza al gestionar).
  useEffect(() => {
    function recompute() {
      const partidos = getPartidos();
      const equipos = getEquipos();
      const nom = (id: string | null) =>
        id ? getEquipo(id, equipos)?.nombre ?? "Por definir" : "Por definir";
      const next: Record<string, MatchVM | undefined> = {};
      for (const e of estadios) {
        const p = partidoDeMesa(e.id, partidos);
        if (!p) continue;
        next[e.id] = {
          teamA: nom(p.teamA),
          teamB: nom(p.teamB),
          marcadorA: p.marcadorA,
          marcadorB: p.marcadorB,
          estado: p.estado,
        };
      }
      setMatches(next);
    }
    recompute();
    window.addEventListener("storage", recompute);
    return () => window.removeEventListener("storage", recompute);
  }, [estadios]);

  // Rotación automática del estadio destacado
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % estadios.length), 9000);
    return () => clearInterval(id);
  }, [auto, estadios.length]);

  return (
    <div className="relative h-[calc(100vh-76px)] w-full overflow-hidden">
      {/* Lienzo 3D */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [6, 4, 7], fov: 42 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#050a08"]} />
        <Scene acento={est.acento} />
      </Canvas>

      {/* Halo de color del estadio */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50 transition-colors duration-700"
        style={{ background: `radial-gradient(70% 60% at 50% 30%, ${est.acento}26, transparent 70%)` }}
      />

      {/* Tarjeta de info del estadio (arriba-izquierda) */}
      <div key={est.id} className="animate-rise pointer-events-none absolute left-6 top-6 max-w-2xl sm:left-10 sm:top-10">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-black uppercase tracking-[.2em] text-black"
            style={{ background: est.acento }}
          >
            Mesa {est.numero}
          </span>
          {est.estelar && (
            <span className="rounded-full bg-mundo-orange px-3 py-1 text-xs font-black uppercase tracking-[.18em] text-black">
              ★ Gran Final
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {est.negocios.map((n, i) =>
            n.logo ? (
              <span
                key={i}
                className="inline-flex w-fit items-center justify-center rounded-4xl bg-white/95 px-5 py-4 shadow-2xl"
              >
                <img
                  src={n.logo}
                  alt={n.nombre}
                  className="h-24 w-auto max-w-[min(60vw,360px)] object-contain sm:h-32"
                />
              </span>
            ) : (
              <span
                key={i}
                className="grid h-24 w-44 place-items-center rounded-4xl text-4xl font-black text-white shadow-2xl sm:h-32"
                style={{ background: n.color ?? est.acento }}
              >
                {n.iniciales ?? est.numero}
              </span>
            ),
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-black uppercase tracking-[.3em] text-mundo-orange">
            Estadio Oficial
          </p>
          <h1 className="mt-1 text-3xl font-black leading-[0.95] text-white text-glow-green sm:text-5xl">
            {est.negocios.map((n) => n.nombre).join(" y ")}
          </h1>
        </div>
      </div>

      {/* Partido en esta mesa (arriba-derecha) */}
      {match && (
        <div key={`m-${est.id}`} className="animate-rise pointer-events-none absolute right-6 top-6 w-72 sm:right-10 sm:top-10">
          <div className="rounded-3xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-white/45">Partido en mesa</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black"
                style={{ background: `${estadoMeta[match.estado].color}22`, color: estadoMeta[match.estado].color }}
              >
                {estadoMeta[match.estado].label}
              </span>
            </div>
            <Row nombre={match.teamA} score={match.marcadorA} />
            <div className="my-2 h-px bg-white/10" />
            <Row nombre={match.teamB} score={match.marcadorB} />
          </div>
        </div>
      )}

      {/* Selector de estadios (abajo) */}
      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2.5 px-4">
        <button
          onClick={() => setAuto((v) => !v)}
          className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60 backdrop-blur transition hover:text-white"
        >
          {auto ? "⏸ Pausar recorrido" : "▶ Recorrido automático"}
        </button>
        <div className="no-scrollbar pointer-events-auto flex max-w-full gap-2 overflow-x-auto pb-1">
          {estadios.map((e, i) => (
            <button
              key={e.id}
              onClick={() => { setIdx(i); setAuto(false); }}
              className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-bold transition ${
                i === idx ? "text-black" : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/10"
              }`}
              style={i === idx ? { background: e.acento, borderColor: e.acento } : undefined}
            >
              {e.negocios.some((n) => n.logo) ? (
                <span className="flex h-8 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white/95 px-1.5">
                  {e.negocios.map((n, j) =>
                    n.logo ? (
                      <img key={j} src={n.logo} alt={n.nombre} className="h-6 w-auto max-w-18 object-contain" />
                    ) : null,
                  )}
                </span>
              ) : (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-black/20 text-[11px] font-black">
                  {e.numero}
                </span>
              )}
              <span className="hidden sm:inline">{e.negocios.map((n) => n.nombre).join(" y ")}</span>
              <span className="sm:hidden">M{e.numero}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pista de interacción */}
      <span className="pointer-events-none absolute bottom-5 right-6 hidden text-[10px] font-semibold uppercase tracking-wider text-white/30 lg:block">
        Arrastra para girar · rueda para acercar
      </span>
    </div>
  );
}

function Row({ nombre, score }: { nombre: string; score: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="truncate text-base font-extrabold text-white">{nombre}</span>
      <span className="tabular text-2xl font-black text-white">{score}</span>
    </div>
  );
}
