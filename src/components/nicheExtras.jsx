import { lazy } from "react";

// Optional, per-niche interactive component keyed by niche slug. Each entry is
// lazy-loaded and rendered browser-only (see Niche.jsx) so the static SSG
// pre-render never evaluates browser-only modules like lightweight-charts or
// canvas-confetti. To give a niche its own custom component, add one line here
// — the Niche template stays generic.
export const nicheExtras = {
  "trading-platforms": lazy(() => import("./tradeSimulator")),
  "mapping-apis": lazy(() => import("./nicheMap")),
};
