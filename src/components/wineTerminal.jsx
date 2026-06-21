import React, { useContext, useEffect, useState } from "react"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"

// Hero-aside for the Wine Containerization niche: a faux terminal that streams a
// `docker run` boot log of a Windows app coming up on Linux — Wine creating a
// prefix, DXVK/VKD3D bringing up the DirectX→Vulkan bridge, drivers binding, and
// the app launching. It types once at full readable width (caret left blinking),
// an inked frame draws around it, then it zooms out and settles onto the back of
// the whale where the logo's cargo cubes used to sit. Kept monochrome (black /
// gray / white, theme-aware) to match the other niche extras. SSR-safe; render
// under ClientOnly like the others.

// DECK_TOP: how far down the whale image (%) the flat back/waterline sits — the
// whale is pulled up by this much so its deck meets the terminal's base.
const DECK_TOP = 46
// Scale the terminal shrinks to once it's parked on the whale's back. Smaller =
// zoomed out further (reads as cargo); the terminal types at full size (1).
const ZOOM_OUT = 0.42
// How far left (% of terminal width) the parked terminal slides so it sits over
// the whale's back rather than butting up against the tail on the right.
const DECK_SHIFT = 11
// Overall size of the whole whale + terminal composition within the aside.
const SCENE_WIDTH = "100%"
// Whale size on its own, as a % of the scene width — independent of the terminal.
const WHALE_WIDTH = 85

// Reveal stages played out after the boot log finishes typing.
const STAGE = { TYPING: 0, FRAME: 1, ZOOM: 2, WHALE: 3 }

// The boot sequence. `tone` picks the line colour (see palette below) so the log
// reads like real output — a command, dim layer notes, a fixme stub, an [ok],
// and the launch line — without per-character span colouring.
const LINES = [
  { tone: "prompt", text: "$ docker run --gpus all wine-merlot:latest" },
  { tone: "dim", text: "==> layers: ubuntu:24.04 · wine-10.0 · dxvk · vkd3d" },
  { tone: "normal", text: "wine: created prefix at /opt/wine/pfx" },
  { tone: "fixme", text: "fixme:vkd3d-shader: unsupported op, ignoring" },
  { tone: "normal", text: "dxvk: Vulkan 1.3 device — RADV (radeonsi)" },
  { tone: "normal", text: "vkd3d: D3D12 → Vulkan bridge online" },
  { tone: "ok", text: "[ ok ] drivers bound · controllers mapped" },
  { tone: "accent", text: "▶ launched — near-native, no Windows in sight" },
]

// --- timing ---
const CHAR_MS = 18 // per-character type speed
const PROMPT_CHAR_MS = 32 // the command line types a touch slower for effect
const LINE_PAUSE = 160 // pause after a line locks in
const PROMPT_PAUSE = 360 // longer beat after the command, before output streams

const WineTerminal = () => {
  const [themeMode] = useContext(ThemeModeContext)
  const isDark = themeMode === "theme-dark"
  const ink = isDark ? "#f2f4f5" : "#0d0b0a"
  // ink as comma-separated rgb, for translucent gray shades.
  const inkRgb = isDark ? "242,244,245" : "13,11,10"
  // Per-tone colours — monochrome only (ink, two grays, or the muted var) so the
  // log reads with hierarchy without leaving black/gray/white.
  const palette = {
    prompt: ink,
    normal: ink,
    dim: "var(--muted)",
    fixme: `rgba(${inkRgb},0.45)`,
    ok: ink,
    accent: ink,
  }
  // Three faint, monochrome title-bar dots (was the red/yellow/green lights).
  const dots = [
    `rgba(${inkRgb},0.28)`,
    `rgba(${inkRgb},0.2)`,
    `rgba(${inkRgb},0.13)`,
  ]

  // Lines already committed, plus the line currently being typed.
  const [done, setDone] = useState([])
  const [current, setCurrent] = useState({ tone: "prompt", text: "" })
  // Reveal choreography after the log finishes (see STAGE).
  const [stage, setStage] = useState(STAGE.TYPING)

  useEffect(() => {
    let active = true
    let timer
    const wait = ms =>
      new Promise(resolve => {
        timer = setTimeout(resolve, ms)
      })

    const run = async () => {
      for (let li = 0; li < LINES.length && active; li++) {
        const line = LINES[li]
        const speed = line.tone === "prompt" ? PROMPT_CHAR_MS : CHAR_MS
        for (let c = 1; c <= line.text.length && active; c++) {
          setCurrent({ tone: line.tone, text: line.text.slice(0, c) })
          await wait(speed)
        }
        if (!active) return
        // On the last line, leave it as the caret's home; otherwise commit it
        // and reset the active line for the next one.
        if (li === LINES.length - 1) break
        setDone(d => [...d, line])
        setCurrent({ tone: line.tone, text: "" })
        await wait(line.tone === "prompt" ? PROMPT_PAUSE : LINE_PAUSE)
      }

      // Boot log done (caret still blinking) — play the reveal.
      await wait(600)
      if (!active) return
      setStage(STAGE.FRAME) // Docker-blue frame draws in
      await wait(750)
      if (!active) return
      setStage(STAGE.ZOOM) // terminal zooms out onto deck size
      await wait(650)
      if (!active) return
      setStage(STAGE.WHALE) // the whale surfaces up against its base
    }
    run()

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [])

  const lineStyle = tone => ({
    color: palette[tone],
    fontWeight: tone === "prompt" || tone === "accent" ? 600 : 400,
    whiteSpace: "pre",
    overflow: "hidden",
    textOverflow: "ellipsis",
  })

  const framed = stage >= STAGE.FRAME
  const zoomed = stage >= STAGE.ZOOM
  const whaleUp = stage >= STAGE.WHALE

  return (
    <div style={{ position: "relative", width: SCENE_WIDTH, margin: "0 auto" }}>
      {/* The terminal — full readable width while typing, then zoomed out onto
          the whale's back (origin center-bottom keeps its base on the deck). */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          background: "var(--card)",
          borderRadius: "12px",
          overflow: "hidden",
          // Border lives from the start (transparent) so colouring it in never
          // shifts layout.
          border: `2px solid ${framed ? ink : "transparent"}`,
          boxShadow: framed ? `0 12px 36px rgba(${inkRgb},0.18)` : "none",
          transformOrigin: "center bottom",
          transform: zoomed
            ? `translateX(-${DECK_SHIFT}%) scale(${ZOOM_OUT})`
            : "scale(1)",
          transition:
            "transform 0.7s cubic-bezier(0.22,1,0.36,1), border-color 0.6s ease, box-shadow 0.6s ease",
          fontFamily:
            "var(--mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)",
        }}
      >
        {/* Title bar — the terminal's identity, kept minimal. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.6rem 0.85rem",
          }}
        >
          <span style={dot(dots[0])} />
          <span style={dot(dots[1])} />
          <span style={dot(dots[2])} />
          <span
            style={{
              marginLeft: "0.4rem",
              fontSize: "0.6rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            merlot — wine + dxvk
          </span>
        </div>

        {/* Log area. Height reserves every line so streaming never reflows. */}
        <div
          style={{
            padding: "0 0.85rem 0.9rem",
            fontSize: "0.68rem",
            lineHeight: 1.7,
            minHeight: `${LINES.length * 1.7 * 0.68 + 0.9}rem`,
          }}
        >
          {done.map((line, i) => (
            <div key={i} style={lineStyle(line.tone)}>
              {line.text}
            </div>
          ))}
          <div style={lineStyle(current.tone)}>
            {current.text}
            <span
              style={{
                display: "inline-block",
                width: "0.5em",
                height: "1em",
                marginLeft: "1px",
                verticalAlign: "text-bottom",
                background: palette[current.tone] || ink,
                animation: "wine-caret 1s steps(1) infinite",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes wine-caret {
            0%, 50% { opacity: 1; }
            50.01%, 100% { opacity: 0; }
          }
        `}</style>
      </div>

      {/* The whale (cubes removed) rises up so its flat back meets the terminal's
          base — the terminal rides where the cargo cubes used to sit. The
          negative margin pulls the deck waterline up to the terminal bottom. The
          SVG is used as a mask and inked with `ink`, so it goes black/white with
          the theme instead of staying Docker blue. */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 1,
          width: `${WHALE_WIDTH}%`,
          aspectRatio: "1 / 1",
          // Centre the whale and pull it up so its deck (DECK_TOP% down its own
          // height) meets the terminal's base, whatever WHALE_WIDTH is.
          margin: `-${(DECK_TOP * WHALE_WIDTH) / 100}% auto 0`,
          background: ink,
          WebkitMaskImage: "url(/icons/docker-whale.svg)",
          maskImage: "url(/icons/docker-whale.svg)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          opacity: whaleUp ? 1 : 0,
          transform: whaleUp ? "translateY(0)" : "translateY(5%)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      />
    </div>
  )
}

// Traffic-light dot for the title bar.
const dot = color => ({
  width: "9px",
  height: "9px",
  borderRadius: "50%",
  background: color,
  display: "inline-block",
})

export default WineTerminal
