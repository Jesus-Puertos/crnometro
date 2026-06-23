/* ------------------------------------------------------------------ */
/*  Zongolica ¡Vive el Mundial! — Torneo de Futbolito de Mesa 2026      */
/*                                                                      */
/*  Esta es la ÚNICA fuente de datos del torneo. Edita aquí los         */
/*  equipos, marcadores, patrocinadores y el partido en pantalla.       */
/* ------------------------------------------------------------------ */

export interface EventoMeta {
  titulo: string;
  subtitulo: string;
  sede: string;
  municipio: string;
  fecha: string;
}

export const EVENTO: EventoMeta = {
  titulo: "Zongolica ¡Vive el Mundial!",
  subtitulo: "Torneo de Futbolito de Mesa 2026",
  sede: "Domo Municipal",
  municipio: "Zongolica, Veracruz",
  fecha: "2026",
};

/* Reglas oficiales (del esquema del torneo) */
export const REGLAS = {
  clasificatorio: { goles: 5, minutos: 7 }, // primero a 5 goles · máx 7 min
  final: { goles: 10, minutos: null }, // primero a 10 goles · sin límite
  inscripcion: 200, // MXN por pareja
  premios: { primero: "50%", segundo: "30%", goleador: "20%" },
} as const;

/* ------------------------------------------------------------------ */
/*  Patrocinadores                                                      */
/*  Oro → logos en /public/estadios_logos · Plata/Bronce → en           */
/*  /public/patrocinadores. El `logo` se muestra en lugar del           */
/*  monograma de color; sin `logo` se usa el color + iniciales.         */
/* ------------------------------------------------------------------ */
export type Tier = "oro" | "plata" | "bronce";

export interface Patrocinador {
  id: string;
  nombre: string;
  tier: Tier;
  color: string; // color de marca (placeholder mientras no hay logo)
  iniciales: string;
  logo?: string;
}

export const PATROCINADORES: Patrocinador[] = [
  /* --- Organizador --- */
  { id: "turismo-zon", nombre: "Turismo Zongolica", tier: "oro", color: "#ff8200", iniciales: "TZ", logo: "/brand/logo_turismo.png" },

  /* --- Patrocinadores ORO · uno por cada mesa/estadio (logos en /estadios_logos) --- */
  { id: "carlos-alfredo-tello", nombre: "Carlos Alfredo Tello", tier: "oro", color: "#1f9d55", iniciales: "CT", logo: "/estadios_logos/carlos_alfredo_tello.png" },
  { id: "el-gran-jefe", nombre: "El Gran Jefe", tier: "oro", color: "#c0392b", iniciales: "GJ", logo: "/estadios_logos/el_gran_jefe.png" },
  { id: "farmacia-luz-de-dios", nombre: "Farmacia Centro Médico Luz de Dios", tier: "oro", color: "#16a085", iniciales: "LD", logo: "/estadios_logos/farmacia_centro_medico_luz_de_dios.png" },
  { id: "finca-la-esperanza", nombre: "Finca La Esperanza", tier: "oro", color: "#6f4e37", iniciales: "FE", logo: "/estadios_logos/finca_la_esperanza.png" },
  { id: "finca-san-jose", nombre: "Finca San José", tier: "oro", color: "#b45309", iniciales: "SJ", logo: "/estadios_logos/finca_san_jose.png" },
  { id: "la-compania-de-jesus", nombre: "La Compañía de Jesús", tier: "oro", color: "#7c3aed", iniciales: "CJ", logo: "/estadios_logos/la_compania_de_jesus.png" },
  { id: "mobichuy", nombre: "Mobichuy", tier: "oro", color: "#2563eb", iniciales: "MO", logo: "/estadios_logos/mobichuy.png" },
  { id: "padriniux", nombre: "Padriniux", tier: "oro", color: "#e67e22", iniciales: "PA", logo: "/estadios_logos/padriniux.png" },
  { id: "ximopanolti", nombre: "Ximopanolti", tier: "oro", color: "#ff8200", iniciales: "XI", logo: "/estadios_logos/ximopanolti.png" },

  /* --- Prestadores de servicios · Plata/Bronce (logos en /patrocinadores) --- */
  { id: "cristhy-photos", nombre: "Cristhy Photos", tier: "plata", color: "#db2777", iniciales: "CP", logo: "/patrocinadores/cristhy_photos.png" },
  { id: "el-portalito", nombre: "El Portalito", tier: "plata", color: "#0ea5e9", iniciales: "EP", logo: "/patrocinadores/el_portalito.png" },
  { id: "farmapronto", nombre: "Farmapronto", tier: "plata", color: "#1f9d55", iniciales: "FP", logo: "/patrocinadores/farmapronto.png" },
  { id: "pacman", nombre: "Pac-Man", tier: "plata", color: "#eab308", iniciales: "PM", logo: "/patrocinadores/pacman.png" },
  { id: "panaderia-hermanos-pale", nombre: "Panadería Hermanos Pale", tier: "plata", color: "#d4a017", iniciales: "HP", logo: "/patrocinadores/panaderia_hermanos_pale.png" },
  { id: "sou-zou", nombre: "Sou Zou", tier: "plata", color: "#475569", iniciales: "SZ", logo: "/patrocinadores/sou_zou.png" },
  { id: "tortilleria-popocatepetl", nombre: "Tortillería Popocatépetl", tier: "plata", color: "#f59e0b", iniciales: "TP", logo: "/patrocinadores/tortilleria_popocatepetl.png" },
  { id: "villa-zongolica", nombre: "Villa Zongolica", tier: "plata", color: "#0f766e", iniciales: "VZ", logo: "/patrocinadores/villa_zongolica.png" },
  { id: "xaloj-cafe", nombre: "Xaloj Café", tier: "plata", color: "#6f4e37", iniciales: "XC", logo: "/patrocinadores/xalojcafe.png" },
  { id: "xipatlani", nombre: "Xipatlani", tier: "plata", color: "#9b59b6", iniciales: "XP", logo: "/patrocinadores/xipatlani.png" },
];

/* ------------------------------------------------------------------ */
/*  Estadios = Mesas de futbolito (9 en total, orden real del Domo).     */
/*  Cada mesa ES su(s) negocio(s) patrocinador(es) y se muestra como    */
/*  "Estadio Oficial {negocio}" con su logo (ver `nombreEstadio`).      */
/*  La Mesa 7 la comparten La Compañía de Jesús y Carlos Alfredo Tello  */
/*  ("Peruco") → muestra ambos logos.                                   */
/*  El `id` es solo una clave interna usada por los PARTIDOS            */
/*  (`estadioId`); no se muestra.                                       */
/* ------------------------------------------------------------------ */
export interface Estadio {
  id: string;
  numero: number;
  acento: string;
  /** Negocio(s) que nombran la mesa. Puede haber co-patrocinadores (varios logos). */
  patrocinadores: string[];
  estelar?: boolean; // mesa de la gran final
}

export const ESTADIOS: Estadio[] = [
  { id: "luz-de-dios", numero: 1, acento: "#16a085", patrocinadores: ["farmacia-luz-de-dios"] },
  { id: "san-jose", numero: 2, acento: "#b45309", patrocinadores: ["finca-san-jose"] },
  { id: "mobichuy", numero: 3, acento: "#2563eb", patrocinadores: ["mobichuy"] },
  { id: "gran-jefe", numero: 4, acento: "#c0392b", patrocinadores: ["el-gran-jefe"] },
  { id: "turismo", numero: 5, acento: "#ff8200", patrocinadores: ["turismo-zon"] },
  { id: "esperanza", numero: 6, acento: "#0ea5e9", patrocinadores: ["finca-la-esperanza"] },
  { id: "compania", numero: 7, acento: "#7c3aed", patrocinadores: ["la-compania-de-jesus", "carlos-alfredo-tello"] },
  { id: "padriniux", numero: 8, acento: "#e67e22", patrocinadores: ["padriniux"] },
  { id: "ximopanolti", numero: 9, acento: "#eab308", patrocinadores: ["ximopanolti"], estelar: true },
];

/* ------------------------------------------------------------------ */
/*  Equipos (parejas) — vienen del registro. Edita libremente.          */
/* ------------------------------------------------------------------ */
export interface Equipo {
  id: string;
  nombre: string;
  jugadores: [string, string];
  color: string;
  seed: number;
}

export const EQUIPOS: Equipo[] = [
  { id: "t1", nombre: "Deportivo Moctezuma", jugadores: ["Mateo Barrera Contreras", "Ismael Barrera Arroyo"], color: "#c0392b", seed: 1 },
  { id: "t2", nombre: "Los Dos Carnales", jugadores: ["Luis Raúl López Sandoval", "Flavio González de Jesús"], color: "#2563eb", seed: 2 },
  { id: "t3", nombre: "Azueta", jugadores: ["Adán Acatzihua Atlahua", "Freddy Tellez Sanchez"], color: "#16a085", seed: 3 },
  { id: "t4", nombre: "Real Puebla", jugadores: ["Tlahuel", "Messi"], color: "#1e3a8a", seed: 4 },
  { id: "t5", nombre: "Siren", jugadores: ["Irving Orlando Hdz. Tezoco", "Jesús O. Hernández Trujillo"], color: "#0ea5e9", seed: 5 },
  { id: "t6", nombre: "Comercio", jugadores: ["Efrén Macuixtle", "Mayte Cuatoche Reyes"], color: "#f59e0b", seed: 6 },
  { id: "t7", nombre: "Napoli", jugadores: ["Aldair García Jiménez", "Cristian Alfaro"], color: "#38bdf8", seed: 7 },
  { id: "t8", nombre: "Indeco", jugadores: ["Miguel Cano", "Salomón Cano"], color: "#db2777", seed: 8 },
  { id: "t9", nombre: "Dinamita", jugadores: ["Marco A. Ortega Mezhua", "Ma. Elena Castillo González"], color: "#ff8200", seed: 9 },
  { id: "t10", nombre: "Los Guerra", jugadores: ["Malcom Gámez Torres", "Arturo Zavaleta García"], color: "#475569", seed: 10 },
  { id: "t11", nombre: "Los Halcones", jugadores: ["Jesús Jerónimo", "Alex Yael Castro"], color: "#b45309", seed: 11 },
  { id: "t12", nombre: "Dubulinos", jugadores: ["Donaldo Damar Méndez Cancino", "Ma. Isabel Linares C."], color: "#eab308", seed: 12 },
  { id: "t13", nombre: "Chivas", jugadores: ["Kavin Gael Quechulpa", "Angel Yaniel Quechulpa"], color: "#dc2626", seed: 13 },
  { id: "t14", nombre: "Manecos FC", jugadores: ["Fernando U. Arrillaga", ""], color: "#0f766e", seed: 14 },
  { id: "t15", nombre: "LIN-VER", jugadores: ["Maximino Linares A.", "Kevin A. Linares"], color: "#9b59b6", seed: 15 },
  { id: "t16", nombre: "Los 2 Negros", jugadores: ["Mario De la Cruz Flores", ""], color: "#1f2937", seed: 16 },
  { id: "t17", nombre: "osTornados", jugadores: ["Leonardo Pérez", "Oscar Linares"], color: "#7c3aed", seed: 17 },
  { id: "t18", nombre: "Escoltas VIPS", jugadores: ["Erick Uriel Mendoza A.", "Michael Mendoza S."], color: "#0891b2", seed: 18 },
  { id: "t19", nombre: "Real del Monte", jugadores: ["Guadalupe Vera Torres", "Moises Cervantes Garcia"], color: "#65a30d", seed: 19 },
  { id: "t20", nombre: "Sin nombre", jugadores: ["Angel O. Tlehuatle", "Angel G. Corona"], color: "#64748b", seed: 20 },
];

/* ------------------------------------------------------------------ */
/*  Llave eliminatoria (eliminación directa)                            */
/*  Octavos → Cuartos → Semifinal → Final                               */
/* ------------------------------------------------------------------ */
export type Estado = "proximo" | "jugando" | "finalizado";

export interface Partido {
  id: string;
  ronda: string;
  rondaIdx: number;
  estadioId?: string;
  /* Una ranura es un equipo (id) o el ganador de otro partido (fuente). */
  teamA: string | null;
  teamB: string | null;
  fuenteA?: string;
  fuenteB?: string;
  marcadorA: number;
  marcadorB: number;
  estado: Estado;
  ganador?: "A" | "B";
}

export const RONDAS = ["Octavos de final", "Cuartos de final", "Semifinal", "Gran Final"] as const;

export const PARTIDOS: Partido[] = [
  // ---- Octavos ----
  { id: "P1", ronda: "Octavos de final", rondaIdx: 0, estadioId: "luz-de-dios", teamA: "t1", teamB: "t16", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P2", ronda: "Octavos de final", rondaIdx: 0, estadioId: "san-jose", teamA: "t8", teamB: "t9", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P3", ronda: "Octavos de final", rondaIdx: 0, estadioId: "mobichuy", teamA: "t5", teamB: "t12", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P4", ronda: "Octavos de final", rondaIdx: 0, estadioId: "gran-jefe", teamA: "t4", teamB: "t13", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P5", ronda: "Octavos de final", rondaIdx: 0, estadioId: "turismo", teamA: "t3", teamB: "t14", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P6", ronda: "Octavos de final", rondaIdx: 0, estadioId: "san-jose", teamA: "t6", teamB: "t11", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P7", ronda: "Octavos de final", rondaIdx: 0, estadioId: "esperanza", teamA: "t7", teamB: "t10", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "P8", ronda: "Octavos de final", rondaIdx: 0, estadioId: "padriniux", teamA: "t2", teamB: "t15", marcadorA: 0, marcadorB: 0, estado: "proximo" },

  // ---- Cuartos ----
  { id: "C1", ronda: "Cuartos de final", rondaIdx: 1, estadioId: "luz-de-dios", teamA: null, teamB: null, fuenteA: "P1", fuenteB: "P2", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "C2", ronda: "Cuartos de final", rondaIdx: 1, estadioId: "mobichuy", teamA: null, teamB: null, fuenteA: "P3", fuenteB: "P4", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "C3", ronda: "Cuartos de final", rondaIdx: 1, estadioId: "turismo", teamA: null, teamB: null, fuenteA: "P5", fuenteB: "P6", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "C4", ronda: "Cuartos de final", rondaIdx: 1, estadioId: "esperanza", teamA: null, teamB: null, fuenteA: "P7", fuenteB: "P8", marcadorA: 0, marcadorB: 0, estado: "proximo" },

  // ---- Semifinal ----
  { id: "S1", ronda: "Semifinal", rondaIdx: 2, estadioId: "san-jose", teamA: null, teamB: null, fuenteA: "C1", fuenteB: "C2", marcadorA: 0, marcadorB: 0, estado: "proximo" },
  { id: "S2", ronda: "Semifinal", rondaIdx: 2, estadioId: "gran-jefe", teamA: null, teamB: null, fuenteA: "C3", fuenteB: "C4", marcadorA: 0, marcadorB: 0, estado: "proximo" },

  // ---- Gran Final ----
  { id: "F1", ronda: "Gran Final", rondaIdx: 3, estadioId: "ximopanolti", teamA: null, teamB: null, fuenteA: "S1", fuenteB: "S2", marcadorA: 0, marcadorB: 0, estado: "proximo" },
];

/* Partido que se muestra en la pantalla del cronómetro (editable). */
export const PARTIDO_EN_PANTALLA = "P1";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
export const getEquipo = (
  id: string | null | undefined,
  equipos: Equipo[] = EQUIPOS,
): Equipo | undefined => (id ? equipos.find((e) => e.id === id) : undefined);

export const getEstadio = (id: string | null | undefined): Estadio | undefined =>
  id ? ESTADIOS.find((e) => e.id === id) : undefined;

export const getPatrocinador = (id: string | null | undefined): Patrocinador | undefined =>
  id ? PATROCINADORES.find((p) => p.id === id) : undefined;

/** Negocio(s) (nombre + logo) que dan identidad a una mesa. */
export const negociosDe = (e: Estadio): Patrocinador[] =>
  e.patrocinadores
    .map((id) => getPatrocinador(id))
    .filter((p): p is Patrocinador => !!p);

/** Nombre visible de la mesa: "Estadio Oficial {negocio}" (une co-patrocinadores con "y"). */
export const nombreEstadio = (e: Estadio): string => {
  const nombres = negociosDe(e).map((p) => p.nombre);
  return `Estadio Oficial ${nombres.length ? nombres.join(" y ") : `Mesa ${e.numero}`}`;
};

export const getPartido = (
  id: string,
  partidos: Partido[] = PARTIDOS,
): Partido | undefined => partidos.find((p) => p.id === id);

/** Equipo ganador de un partido, o undefined si aún no termina. */
export function ganadorDe(
  partidoId: string,
  partidos: Partido[] = PARTIDOS,
  equipos: Equipo[] = EQUIPOS,
): Equipo | undefined {
  const p = getPartido(partidoId, partidos);
  if (!p || p.estado !== "finalizado" || !p.ganador) return undefined;
  return getEquipo(p.ganador === "A" ? p.teamA : p.teamB, equipos);
}

/** Resuelve qué equipo va en una ranura (directo o ganador de la fuente). */
export function resolverRanura(
  team: string | null,
  fuente: string | undefined,
  partidos: Partido[] = PARTIDOS,
  equipos: Equipo[] = EQUIPOS,
): { equipo?: Equipo; etiqueta: string } {
  if (team) {
    const eq = getEquipo(team, equipos);
    return { equipo: eq, etiqueta: eq?.nombre ?? "Por definir" };
  }
  if (fuente) {
    const g = ganadorDe(fuente, partidos, equipos);
    if (g) return { equipo: g, etiqueta: g.nombre };
    return { etiqueta: `Ganador ${fuente}` };
  }
  return { etiqueta: "Por definir" };
}

/** Partidos agrupados por ronda, en orden. */
export function partidosPorRonda(
  partidos: Partido[] = PARTIDOS,
): { ronda: string; partidos: Partido[] }[] {
  return RONDAS.map((ronda) => ({
    ronda,
    partidos: partidos.filter((p) => p.ronda === ronda),
  }));
}

/** Marcador objetivo según la ronda (final = 10, resto = 5). */
export const golesObjetivo = (p: Partido): number =>
  p.ronda === "Gran Final" ? REGLAS.final.goles : REGLAS.clasificatorio.goles;

/** Partido más relevante en una mesa: prioriza el que está en juego,
 *  si no, el de la ronda más temprana asignada a esa mesa. */
export function partidoDestacado(
  estadioId: string,
  partidos: Partido[] = PARTIDOS,
): Partido | undefined {
  return partidos.filter((p) => p.estadioId === estadioId).sort((a, b) => {
    const ja = a.estado === "jugando" ? 0 : 1;
    const jb = b.estado === "jugando" ? 0 : 1;
    if (ja !== jb) return ja - jb;
    return a.rondaIdx - b.rondaIdx;
  })[0];
}

/** Ronda en curso: la más temprana que aún tiene partidos sin finalizar. */
export function rondaActual(partidos: Partido[] = PARTIDOS): string {
  const pendiente = partidos.filter((p) => p.estado !== "finalizado").sort(
    (a, b) => a.rondaIdx - b.rondaIdx,
  )[0];
  return pendiente?.ronda ?? RONDAS[RONDAS.length - 1];
}

/** Conteo global por estado (para encabezados de resumen). */
export function resumenTorneo(partidos: Partido[] = PARTIDOS) {
  return {
    mesas: ESTADIOS.length,
    enJuego: partidos.filter((p) => p.estado === "jugando").length,
    finalizados: partidos.filter((p) => p.estado === "finalizado").length,
    equipos: EQUIPOS.length,
  };
}
