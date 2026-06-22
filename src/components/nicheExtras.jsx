import { lazy } from "react"

// Optional, per-niche interactive component keyed by niche slug. Each entry is
// lazy-loaded and rendered browser-only (see Niche.jsx) so the static SSG
// pre-render never evaluates browser-only modules like lightweight-charts or
// canvas-confetti. To give a niche its own custom component, add one line here
// — the Niche template stays generic.
export const nicheExtras = {
  "trading-apis": lazy(() => import("./tradeSimulator")),
  "mapping-apis": lazy(() => import("./nicheMap")),
}

// Optional, per-niche component rendered in the open space beside the hero
// masthead. Same lazy + browser-only treatment as nicheExtras.
export const nicheHeroAsides = {
  "trading-apis": lazy(() => import("./candlePrinter")),
  "mapping-apis": lazy(() => import("./mappingGlobe")),
  "dockerized-wine": lazy(() => import("./wineTerminal")),
}
