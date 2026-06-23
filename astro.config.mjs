// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import AstroPWA from "@vite-pwa/astro";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
// Sitio 100% estático + PWA: todos los datos viven en el navegador
// (localStorage) y un service worker cachea todo, así funciona OFFLINE
// y se puede "instalar" como app de kiosko.
export default defineConfig({
  output: "static",
  // Rutas con barra final → el service worker resuelve cada página desde
  // el caché sin internet (directoryIndex). También funciona en Vercel.
  trailingSlash: "always",
  integrations: [
    react(),
    AstroPWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "Zongolica ¡Vive el Mundial!",
        short_name: "Mundialito",
        description: "Torneo de Futbolito de Mesa 2026 · Zongolica",
        lang: "es",
        theme_color: "#ff8200",
        background_color: "#0a1410",
        display: "standalone",
        orientation: "landscape",
        start_url: "/",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cachea todo lo del build, incluido el modelo 3D (~11 MB) y las fuentes.
        globPatterns: ["**/*.{html,js,css,svg,png,jpg,jpeg,webp,woff,woff2,ttf,glb,json,ico,webmanifest}"],
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
      // El SW solo corre en producción (build/preview), no en `astro dev`.
      devOptions: { enabled: false },
    }),
  ],
  // Puerto 4500 para no chocar con el proyecto h-ayuntamiento (que usa 4321).
  server: { host: true, port: 4500 },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["three", "@react-three/fiber", "@react-three/drei", "react", "react-dom"],
    },
  },
});
