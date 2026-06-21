import { readFileSync } from "node:fs"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { imagetools } from "vite-imagetools"

const niches = JSON.parse(
  readFileSync(new URL("./src/data/niches.json", import.meta.url))
)

export default defineConfig({
  base: "/",
  // Treat 3D models as static assets (the lanyard's card.glb).
  assetsInclude: ["**/*.glb"],
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Pre-bundle deps that are only reached through runtime dynamic imports
  // (the lazy nicheExtras chunks). Without this, Vite discovers them late and
  // triggers an on-the-fly re-optimization that aborts the in-flight import
  // ("error loading dynamically imported module"). leaflet.smoothgeodesic comes
  // in via nicheMap.jsx; lightweight-charts/canvas-confetti via tradeSimulator.jsx.
  optimizeDeps: {
    include: [
      "leaflet",
      "react-leaflet",
      "leaflet.smoothgeodesic",
      "lightweight-charts",
      "canvas-confetti",
    ],
  },
  build: {
    outDir: "dist",
  },
  // vite-react-ssg: expand the dynamic /niches/:slug route into one static
  // page per niche (the rest of the routes are pre-rendered as-is).
  ssgOptions: {
    includedRoutes(paths) {
      return paths.flatMap(path =>
        path.includes(":slug")
          ? niches.map(niche => `/niches/${niche.slug}`)
          : path
      )
    },
  },
})
