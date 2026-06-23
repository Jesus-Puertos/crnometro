// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
// Sitio 100% estático: todos los datos viven en el navegador (localStorage),
// así se despliega en Vercel/Netlify/cualquier hosting estático sin servidor.
export default defineConfig({
  output: "static",
  integrations: [react()],
  // Puerto 4500 para no chocar con el proyecto h-ayuntamiento (que usa 4321).
  server: { host: true, port: 4500 },
  vite: {
    plugins: [tailwindcss()],
    // three.js + its addons ship as ESM; keep them out of SSR optimize noise
    ssr: { noExternal: ["three", "@react-three/fiber", "@react-three/drei"] },
    // Pre-bundle the heavy 3D deps at startup so the dev server doesn't
    // re-optimize mid-session (which causes 504 "Outdated Optimize Dep").
    optimizeDeps: {
      include: ["three", "@react-three/fiber", "@react-three/drei", "react", "react-dom"],
    },
  },
});
