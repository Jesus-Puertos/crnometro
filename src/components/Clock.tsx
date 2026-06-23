import { useEffect, useState } from "react";

/** Reloj de pared en vivo para la barra superior. */
export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = now
    ? now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";
  const ss = now ? now.toLocaleTimeString("es-MX", { second: "2-digit" }).padStart(2, "0") : "--";
  const fecha = now
    ? now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div className="flex flex-col items-end leading-none">
      <div className="flex items-baseline gap-1 tabular">
        <span className="text-2xl font-black text-white">{hh}</span>
        <span className="text-sm font-bold text-mundo-green-neon">:{ss}</span>
      </div>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-[.18em] text-white/45 first-letter:uppercase">
        {fecha}
      </span>
    </div>
  );
}
