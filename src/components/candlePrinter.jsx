import React, { useContext, useEffect, useRef } from "react"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"

// Hero-aside for the Trading Platforms niche: a faux live tape that prints OHLC
// candlesticks the way a real chart would — the rightmost candle forms tick by
// tick, locks in, and the tape scrolls left to make room for the next one.
//
// Candle styling follows the classic hollow convention:
//   • Bullish (close ≥ open): inked border + wicks, hollow (surface-filled) body
//   • Bearish (close < open):  inked border + wicks, inked (filled) body
// "Ink" is black in light mode (per the brief) and flips to the off-white
// foreground in dark mode so it stays legible; "surface" is the card colour the
// hollow bodies are punched out of. Browser-only (canvas) — render under
// ClientOnly.

// --- tape tuning ---------------------------------------------------------
const TICK_MS = 95 // ms between simulated price updates
const TICKS_PER_CANDLE = 6 // price updates before a candle closes
const MAX_CANDLES = 20 // visible candles before the tape scrolls left
const VOLATILITY = 0.9 // per-tick price step magnitude
const DRIFT = 0.04 // gentle upward bias so the series wanders, not flatlines
const SCALE_EASE = 0.12 // how quickly the y-axis chases a new min/max

const rand = () => Math.random() - 0.5

// Seed a candle that opens where the previous one closed.
const newCandle = open => ({ open, high: open, low: open, close: open })

const CandlePrinter = () => {
  const [themeMode] = useContext(ThemeModeContext)
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext("2d")

    const isDark = themeMode === "theme-dark"
    const ink = isDark ? "#f2f4f5" : "#0d0b0a"
    const surface = isDark ? "#023440" : "#f2f4f5"
    const grid = isDark ? "rgba(242,244,245,0.10)" : "rgba(13,11,10,0.08)"

    // --- simulation state ---
    let price = 100
    const candles = [newCandle(price)]
    let ticks = 0
    // Eased y-axis bounds, so a fresh extreme glides into frame.
    let displayMin = price - 4
    let displayMax = price + 4

    // --- canvas sizing (high-DPI aware) ---
    let cssW = 0
    let cssH = 0
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      cssW = wrap.clientWidth
      cssH = wrap.clientHeight
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // Advance the forming candle by one tick; close it out when it's mature.
    const tick = () => {
      price += rand() * VOLATILITY + DRIFT
      const c = candles[candles.length - 1]
      c.close = price
      c.high = Math.max(c.high, price)
      c.low = Math.min(c.low, price)
      ticks += 1
      if (ticks >= TICKS_PER_CANDLE) {
        ticks = 0
        candles.push(newCandle(price))
        if (candles.length > MAX_CANDLES) candles.shift()
      }
    }

    const padX = 14
    const padY = 16

    const draw = () => {
      const w = cssW
      const h = cssH
      ctx.clearRect(0, 0, w, h)

      // Ease the y-axis toward the visible price extremes (with headroom).
      let lo = Infinity
      let hi = -Infinity
      for (const c of candles) {
        if (c.low < lo) lo = c.low
        if (c.high > hi) hi = c.high
      }
      const pad = Math.max((hi - lo) * 0.12, 0.5)
      const targetMin = lo - pad
      const targetMax = hi + pad
      displayMin += (targetMin - displayMin) * SCALE_EASE
      displayMax += (targetMax - displayMax) * SCALE_EASE

      const chartW = w - padX * 2
      const chartH = h - padY * 2
      const range = displayMax - displayMin || 1
      const yOf = p => padY + (1 - (p - displayMin) / range) * chartH

      // Faint horizontal grid for a charting feel.
      ctx.strokeStyle = grid
      ctx.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const gy = Math.round(padY + (chartH * i) / 4) + 0.5
        ctx.beginPath()
        ctx.moveTo(padX, gy)
        ctx.lineTo(padX + chartW, gy)
        ctx.stroke()
      }

      // Candle geometry. The forming candle progress nudges the whole tape left
      // by a fraction of a slot so new candles slide in rather than snap.
      const slot = chartW / MAX_CANDLES
      const bodyW = Math.max(slot * 0.6, 2)
      const progress =
        candles.length >= MAX_CANDLES ? ticks / TICKS_PER_CANDLE : 0
      const offset = -progress * slot

      ctx.lineWidth = 1.25
      ctx.strokeStyle = ink

      candles.forEach((c, i) => {
        const cx = padX + offset + slot * (i + 0.5)
        if (cx < padX - bodyW || cx > padX + chartW + bodyW) return

        const yHigh = yOf(c.high)
        const yLow = yOf(c.low)
        const yOpen = yOf(c.open)
        const yClose = yOf(c.close)
        const bullish = c.close >= c.open

        // Wick: high → low through the candle's centre.
        const wx = Math.round(cx) + 0.5
        ctx.beginPath()
        ctx.moveTo(wx, yHigh)
        ctx.lineTo(wx, yLow)
        ctx.stroke()

        // Body: at least 1px tall so dojis still read as a candle.
        const top = Math.min(yOpen, yClose)
        const bh = Math.max(Math.abs(yClose - yOpen), 1)
        const bx = Math.round(cx - bodyW / 2) + 0.5
        ctx.fillStyle = bullish ? surface : ink
        ctx.fillRect(bx, top, bodyW, bh)
        ctx.strokeRect(bx, top, bodyW, bh)
      })

      // Live last-price line, tracking the forming candle's close.
      const last = candles[candles.length - 1]
      const ly = Math.round(yOf(last.close)) + 0.5
      ctx.strokeStyle = ink
      ctx.globalAlpha = 0.45
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(padX, ly)
      ctx.lineTo(padX + chartW, ly)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    let raf
    let lastTick = 0
    const loop = now => {
      if (now - lastTick >= TICK_MS) {
        tick()
        lastTick = now
      }
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [themeMode])

  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div ref={wrapRef} style={{ width: "100%", aspectRatio: "4 / 3" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </div>
  )
}

export default CandlePrinter
