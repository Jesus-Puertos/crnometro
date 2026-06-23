/* ------------------------------------------------------------------ */
/*  Store del torneo en el CLIENTE (localStorage) — modelo FLEXIBLE.    */
/*                                                                      */
/*  No hay llave fija: el operador crea PARTIDOS libres (mesa + 2       */
/*  equipos + marcador + fase) desde /gestionar. De ahí se calcula      */
/*  quién sigue vivo / quién quedó eliminado (eliminación directa) y    */
/*  la llave chica de la fase final (semifinal + gran final).           */
/*  El roster de equipos también vive aquí (editable).                  */
/* ------------------------------------------------------------------ */
import { EQUIPOS, ESTADIOS, type Equipo, type Estado } from "../data/torneo";

const KEY = "mundialito-zongolica:v1";

export type Fase = "clasificatorio" | "semifinal" | "final";

export interface PartidoLibre {
  id: string;
  mesaId: string; // id de estadio (mesa), o ""
  teamA: string | null; // id de equipo
  teamB: string | null;
  marcadorA: number;
  marcadorB: number;
  estado: Estado; // proximo | jugando | finalizado
  ganador?: "A" | "B"; // override manual; si no, se deduce por marcador
  fase: Fase;
}

export interface TorneoState {
  equipos?: Equipo[]; // roster editado (si no, EQUIPOS base)
  partidos: PartidoLibre[];
}

const vacio = (): TorneoState => ({ partidos: [] });

export function loadState(): TorneoState {
  if (typeof localStorage === "undefined") return vacio();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return vacio();
    const s = JSON.parse(raw);
    return { equipos: s.equipos, partidos: Array.isArray(s.partidos) ? s.partidos : [] };
  } catch {
    return vacio();
  }
}

export function saveState(s: TorneoState): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetAll(): void {
  localStorage.removeItem(KEY);
}

const uid = () =>
  "p" + (globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 9));

/* ------------------------------- Partidos ------------------------------- */

export function getPartidos(state: TorneoState = loadState()): PartidoLibre[] {
  return state.partidos ?? [];
}

function guardarPartidos(list: PartidoLibre[]): PartidoLibre[] {
  const s = loadState();
  s.partidos = list;
  saveState(s);
  return list;
}

export function addPartido(fase: Fase = "clasificatorio"): PartidoLibre[] {
  const nuevo: PartidoLibre = {
    id: uid(),
    mesaId: ESTADIOS[0]?.id ?? "",
    teamA: null,
    teamB: null,
    marcadorA: 0,
    marcadorB: 0,
    estado: "proximo",
    fase,
  };
  return guardarPartidos([...getPartidos(), nuevo]);
}

export function updatePartido(id: string, patch: Partial<PartidoLibre>): PartidoLibre[] {
  return guardarPartidos(getPartidos().map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function deletePartido(id: string): PartidoLibre[] {
  return guardarPartidos(getPartidos().filter((p) => p.id !== id));
}

/* ------------------------------- Equipos -------------------------------- */

export function getEquipos(state: TorneoState = loadState()): Equipo[] {
  return state.equipos ?? EQUIPOS;
}

function guardarEquipos(list: Equipo[]): Equipo[] {
  const s = loadState();
  s.equipos = list;
  saveState(s);
  return list;
}

export function updateEquipo(id: string, patch: Partial<Equipo>): Equipo[] {
  return guardarEquipos(getEquipos().map((e) => (e.id === id ? { ...e, ...patch } : e)));
}

export function addEquipo(): Equipo[] {
  const list = getEquipos();
  const id =
    "x" + (globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 9));
  const nuevo: Equipo = {
    id,
    nombre: "Nuevo equipo",
    jugadores: ["", ""],
    color: "#64748b",
    seed: list.length + 1,
  };
  return guardarEquipos([...list, nuevo]);
}

export function deleteEquipo(id: string): Equipo[] {
  return guardarEquipos(getEquipos().filter((e) => e.id !== id));
}

/* --------------------------- Helpers de torneo -------------------------- */

/** Goles para ganar según la fase (final = 10, resto = 5). */
export const golObjetivo = (fase: Fase): number => (fase === "final" ? 10 : 5);

/** Lado ganador efectivo de un partido finalizado (manual o por marcador). */
export function ladoGanador(p: PartidoLibre): "A" | "B" | undefined {
  if (p.estado !== "finalizado") return undefined;
  return p.ganador ?? (p.marcadorA >= p.marcadorB ? "A" : "B");
}

/** Id del equipo ganador de un partido finalizado, o null. */
export function equipoGanador(p: PartidoLibre): string | null {
  const l = ladoGanador(p);
  return l === "A" ? p.teamA : l === "B" ? p.teamB : null;
}

/** Un equipo está eliminado si perdió al menos un partido finalizado. */
export function estaEliminado(teamId: string, partidos: PartidoLibre[]): boolean {
  return partidos.some((p) => {
    if (p.estado !== "finalizado") return false;
    const jugo = p.teamA === teamId || p.teamB === teamId;
    return jugo && equipoGanador(p) !== teamId;
  });
}

/** Partido más relevante de una mesa: el que está en juego, si no el último. */
export function partidoDeMesa(mesaId: string, partidos: PartidoLibre[]): PartidoLibre | undefined {
  const enMesa = partidos.filter((p) => p.mesaId === mesaId);
  return enMesa.find((p) => p.estado === "jugando") ?? enMesa[enMesa.length - 1];
}
