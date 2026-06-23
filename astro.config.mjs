// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
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
