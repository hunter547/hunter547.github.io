import React, { useContext, useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"
// The personal journey the map narrates, stop by stop, before zooming out to
// the world. Each leg flies from the previous stop to the next.
import JOURNEY from "../data/journey.json"

// Center of Colorado Springs, CO ([lat, lng]) — the source of the global arcs
// and the final journey stop.
const COLORADO_SPRINGS = [38.8339, -104.8214]

// Timeline tuning.
const CITY_ZOOM = 11 // zoom level for each journey stop
const END_ZOOM = 2 // world view the global arcs are shown at
const STOP_HOLD = 1900 // ms paused at each stop to read its tooltip
const LEG_DURATION = 2.5 // seconds for each stop-to-stop flyTo
const FLY_DURATION = 4.5 // seconds for the final zoom-out to the world

const CONNECT_MESSAGE = "Looking to connect with people around the world"

// Tooltip markup for a journey stop.
const stopTooltip = ({ label, caption }) =>
  `<strong>${label}</strong><br />${caption}`

// Great-circle routes drawn out from Colorado Springs to cities worldwide.
const ROUTES = [
  { dest: [51.5074, -0.1278], color: "teal", label: "London" },
  { dest: [35.6762, 139.6503], color: "orange", label: "Tokyo" },
  { dest: [-33.8688, 151.2093], color: "darkslateblue", label: "Sydney" },
  { dest: [-23.5505, -46.6333], color: "green", label: "São Paulo" },
  { dest: [-33.9249, 18.4241], color: "crimson", label: "Cape Town" },
]

// leaflet.smoothgeodesic is a plugin that augments the *global* `window.L`
// rather than importing Leaflet itself. Vite serves Leaflet's ESM build, which
// never assigns window.L, so we expose it first, then load the plugin (lazily,
// once) — this also keeps the plugin out of the SSR/pre-render pass.
let smoothGeodesicPromise
const ensureSmoothGeodesic = () => {
  if (typeof window !== "undefined" && !window.L) window.L = L
  if (!smoothGeodesicPromise) {
    smoothGeodesicPromise = import("leaflet.smoothgeodesic")
  }
  return smoothGeodesicPromise
}

// The shorter great-circle path can cross the antimeridian, so the drawn line
// ends in a different world copy than the destination's literal longitude
// (e.g. Tokyo via the Pacific lands near -220°, not +139°). Shift the marker's
// longitude onto the same copy as the path endpoint so the dot sits on the arc.
const shortestLng = (srcLng, destLng) =>
  srcLng + ((((destLng - srcLng) % 360) + 540) % 360) - 180

// Animated SmoothGeodesic path options (ported from the reference site's util).
const getPathOptions = (color, delay) => ({
  color,
  weight: 3,
  animate: {
    duration: 2500,
    iterations: 1,
    easing: "ease-in-out",
    direction: "alternate",
    delay,
  },
})

// Narrates the journey (Falls Church → Harrisonburg → Colorado Springs) with
// flyTo + tooltips, then zooms out to the world and draws the global geodesic
// arcs. Replays the whole sequence on `drawKey`.
function GeodesicRoutes({ drawKey }) {
  const map = useMap()

  useEffect(() => {
    let active = true
    let holdTimer
    let rafId
    const layers = []
    const tooltips = []
    const pluginReady = ensureSmoothGeodesic()

    // ---- promisified primitives, all cancellable via `active` ----
    const wait = ms => new Promise(resolve => (holdTimer = setTimeout(resolve, ms)))
    // flyTo handles pan+zoom legs smoothly; resolve when the motion settles.
    const flyTo = (center, zoom) =>
      new Promise(resolve => {
        map.once("moveend", resolve)
        map.flyTo(center, zoom, { duration: LEG_DURATION })
      })
    // Leaflet's flyTo eases a *same-center* zoom unevenly and snaps the final
    // delta (the "cut" at the end). Tween it ourselves with an even ease that
    // lands exactly on END_ZOOM, driving each frame through the same internal
    // _move({ flyTo: true }) path flyTo uses — that CSS-scales the existing
    // tiles and streams in new zoom levels, so tiles stay visible (plain
    // setView per frame resets the view and shows only the gray background).
    const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const center = L.latLng(COLORADO_SPRINGS)
    const zoomOut = () =>
      new Promise(resolve => {
        const startTime = performance.now()
        const dur = FLY_DURATION * 1000
        map._moveStart(true, false)
        const frame = now => {
          if (!active) {
            map._moveEnd(true)
            return resolve()
          }
          const t = Math.min(1, (now - startTime) / dur)
          if (t < 1) {
            map._move(center, CITY_ZOOM + (END_ZOOM - CITY_ZOOM) * easeInOut(t), {
              flyTo: true,
            })
            rafId = requestAnimationFrame(frame)
          } else {
            map._move(center, END_ZOOM)._moveEnd(true)
            resolve()
          }
        }
        rafId = requestAnimationFrame(frame)
      })

    const addStop = stop => {
      const marker = L.circleMarker(stop.coords, {
        radius: 6,
        color: "#fff",
        weight: 2,
        fillColor: "#2563eb",
        fillOpacity: 1,
      })
        .bindTooltip(stopTooltip(stop), {
          permanent: true,
          direction: "top",
          offset: [0, -6],
        })
        .addTo(map)
      layers.push(marker)
      tooltips.push(marker)
      return marker
    }

    const drawArcs = () =>
      pluginReady.then(() => {
        if (!active) return
        ROUTES.forEach(({ dest, color, label }, i) => {
          layers.push(
            L.smoothGeodesic(
              COLORADO_SPRINGS,
              dest,
              65,
              getPathOptions(color, i * 600)
            ).addTo(map)
          )
          layers.push(
            L.circleMarker(
              [dest[0], shortestLng(COLORADO_SPRINGS[1], dest[1])],
              {
                radius: 4,
                color: "#fff",
                weight: 2,
                fillColor: color,
                fillOpacity: 1,
              }
            )
              .bindTooltip(label)
              .addTo(map)
          )
        })
      })

    // ---- the story ----
    const run = async () => {
      let lastMarker
      for (let i = 0; i < JOURNEY.length; i++) {
        const stop = JOURNEY[i]
        if (i === 0) map.setView(stop.coords, CITY_ZOOM, { animate: false })
        else await flyTo(stop.coords, CITY_ZOOM)
        if (!active) return
        lastMarker = addStop(stop)
        await wait(STOP_HOLD)
        if (!active) return
      }
      // Tidy the pinned tooltips, and rebind the hometown stops as hover-only
      // so they stay discoverable on the dots at the world view.
      tooltips.forEach((m, i) => {
        m.closeTooltip()
        if (i < JOURNEY.length - 1) {
          m.unbindTooltip()
          m.bindTooltip(stopTooltip(JOURNEY[i]), {
            direction: "top",
            offset: [0, -6],
          })
        }
      })
      await zoomOut()
      if (!active) return
      // The call-to-action appears in the same beat the arcs start reaching out,
      // and stays pinned over Colorado Springs.
      lastMarker.setTooltipContent(CONNECT_MESSAGE)
      lastMarker.openTooltip()
      drawArcs()
    }
    run()

    return () => {
      active = false
      clearTimeout(holdTimer)
      if (rafId) cancelAnimationFrame(rafId)
      // On a route change, react-leaflet's MapContainer may remove the map (and
      // delete its panes) before this child effect cleans up. Calling into a
      // removed map throws ("el is undefined" from getPosition on the missing
      // map pane), so only stop/clean up while the map is still live.
      if (map._mapPane) {
        map.stop() // halt any in-flight animation
        layers.forEach(layer => map.removeLayer(layer))
      }
    }
  }, [map, drawKey])

  return null
}

const NicheMap = () => {
  const [themeMode] = useContext(ThemeModeContext)
  const isDark = themeMode === "theme-dark"
  // Force a redraw of the animated arcs on demand (Replay button).
  const [drawKey, setDrawKey] = useState(0)

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"

  return (
    <Card className="my-12 overflow-hidden p-0">
      <div className="relative h-[420px] w-full">
        <MapContainer
          className="h-full w-full"
          center={JOURNEY[0].coords}
          zoom={CITY_ZOOM}
          scrollWheelZoom={false}
        >
          <TileLayer
            key={isDark ? "dark" : "light"}
            url={tileUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <GeodesicRoutes drawKey={drawKey} />
        </MapContainer>
        <Button
          size="sm"
          variant="secondary"
          className="absolute right-3 top-3 z-[1000]"
          onClick={() => setDrawKey(k => k + 1)}
        >
          ↻ Replay story
        </Button>
      </div>
    </Card>
  )
}

export default NicheMap
