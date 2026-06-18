import { readFileSync } from "node:fs"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { imagetools } from "vite-imagetools"

const niches = JSON.parse(
  readFileSync(new URL("./src/data/niches.json", import.meta.url)),
)

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
  },
  // vite-react-ssg: expand the dynamic /niches/:slug route into one static
  // page per niche (the rest of the routes are pre-rendered as-is).
  ssgOptions: {
    includedRoutes(paths) {
      return paths.flatMap((path) =>
        path.includes(":slug")
          ? niches.map((niche) => `/niches/${niche.slug}`)
          : path,
      )
    },
  },
})
