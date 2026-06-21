import React, { useContext, useEffect, useRef, useState } from "react"
import {
  createChart,
  CandlestickSeries,
  ColorType,
  LineStyle,
  createSeriesMarkers,
} from "lightweight-charts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"

const DATA_URL = `${import.meta.env.BASE_URL}data/nqFutures.json`

const HISTORY = 80 // bars of context shown before the action
const MIN_FUTURE = 300 // future bars a random date must leave (fill + resolve)
const MAX_FORWARD = 400 // cap on bars walked per Run

// Tape playback speeds (ms per bar); "Fast" matches the original cadence.
const SPEEDS = [
  { label: "Slow", ms: 350 },
  { label: "Normal", ms: 150 },
  { label: "Fast", ms: 55 },
]
const DEFAULT_SPEED = 55

const DOLLARS_PER_POINT = 20 // NQ E-mini multiplier
const round2 = n => Math.round(n * 100) / 100

// Side-cannon confetti burst (magicui pattern) — fired when a trade hits TP.
const fireSideCannons = () => {
  const end = Date.now() + 1 * 1000 // 1 second
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
  const frame = () => {
    if (Date.now() > end) return
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    })
    requestAnimationFrame(frame)
  }
  frame()
}

const fmtDate = t =>
  `${new Date(t * 1000).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} UTC`

const TradeSimulator = () => {
  const containerRef = useRef(null)
  const [themeMode] = useContext(ThemeModeContext)
  const isDark = themeMode === "theme-dark"

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  // Render state
  const [phase, setPhaseState] = useState("idle") // idle | pending | active | resolved | nofill
  const [entryInfo, setEntryInfo] = useState(null) // { time, price }
  const [pending, setPending] = useState(null) // { direction, limitPrice }
  const [trade, setTrade] = useState(null) // { direction, entryPrice, tp, sl, entryTime }
  const [result, setResult] = useState(null) // { outcome, exitPrice, exitTime, pnl }
  const [running, setRunning] = useState(false)
  const [speed, setSpeedState] = useState(DEFAULT_SPEED)

  // Imperative refs
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const markersRef = useRef(null)
  const linesRef = useRef({ entry: null, tp: null, sl: null, limit: null })
  const idxRef = useRef(null) // scenario "now" bar index
  const activeFromRef = useRef(null) // bar index the open position started from
  const phaseRef = useRef("idle")
  const pendingRef = useRef(null)
  const tradeRef = useRef(null)
  const resultRef = useRef(null)
  const dragRef = useRef(null) // 'tp' | 'sl' | 'limit' | null
  const runningRef = useRef(false)
  const intervalRef = useRef(null)
  const isDarkRef = useRef(isDark)
  const boxRef = useRef(null) // floating unrealized-PnL pill
  const lastPriceRef = useRef(null) // latest revealed close
  const rafRef = useRef(null)
  const cursorRef = useRef(null) // current bar index during playback
  const maxBarRef = useRef(null) // last bar index for the current run
  const stepRef = useRef(null) // active per-tick step function
  const speedRef = useRef(DEFAULT_SPEED)

  const setPhase = p => {
    phaseRef.current = p
    setPhaseState(p)
  }

  // ---- Data fetch ---------------------------------------------------------
  useEffect(() => {
    let active = true
    fetch(DATA_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(bars => active && setData(bars))
      .catch(err => active && setError(err.message))
    return () => {
      active = false
    }
  }, [])

  // ---- Chart helpers ------------------------------------------------------
  const clearLines = () => {
    const series = seriesRef.current
    const lines = linesRef.current
    ;["entry", "tp", "sl", "limit"].forEach(k => {
      if (lines[k]) {
        series.removePriceLine(lines[k])
        lines[k] = null
      }
    })
  }

  const stopPlayback = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    runningRef.current = false
    setRunning(false)
  }

  const followView = i =>
    chartRef.current
      .timeScale()
      .setVisibleLogicalRange({ from: i - HISTORY, to: i + 3 })

  const showScenario = idx => {
    seriesRef.current.setData(data.slice(0, idx + 1))
    markersRef.current.setMarkers([])
    clearLines()
    followView(idx)
  }

  const resetToScenario = idx => {
    stopPlayback()
    pendingRef.current = null
    tradeRef.current = null
    resultRef.current = null
    activeFromRef.current = null
    setPending(null)
    setTrade(null)
    setResult(null)
    showScenario(idx)
    setPhase("idle")
  }

  const newScenario = () => {
    if (!seriesRef.current || !data) return
    const lo = HISTORY
    const hi = data.length - MIN_FUTURE
    const idx = lo + Math.floor(Math.random() * (hi - lo))
    idxRef.current = idx
    setEntryInfo({ time: data[idx].time, price: data[idx].close })
    resetToScenario(idx)
  }

  const resetTrade = () => {
    if (idxRef.current == null) return
    resetToScenario(idxRef.current)
  }

  // Create entry/TP/SL lines + marker and mark the position active.
  const openPosition = (
    direction,
    entryPrice,
    entryIndex,
    entryTime,
    currentPrice = entryPrice
  ) => {
    const series = seriesRef.current
    const long = direction === "long"
    lastPriceRef.current = currentPrice
    clearLines()

    const sl = round2(entryPrice * (long ? 1 - 0.0025 : 1 + 0.0025))
    const tp = round2(entryPrice * (long ? 1 + 0.005 : 1 - 0.005))

    linesRef.current.entry = series.createPriceLine({
      price: entryPrice,
      color: "#64748b",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: false,
    })
    linesRef.current.tp = series.createPriceLine({
      price: tp,
      color: "#16a34a",
      lineWidth: 2,
      axisLabelVisible: true,
      title: "TP",
    })
    linesRef.current.sl = series.createPriceLine({
      price: sl,
      color: "#dc2626",
      lineWidth: 2,
      axisLabelVisible: true,
      title: "SL",
    })

    markersRef.current.setMarkers([
      {
        time: entryTime,
        position: long ? "belowBar" : "aboveBar",
        color: long ? "#16a34a" : "#dc2626",
        shape: long ? "arrowUp" : "arrowDown",
        text: long ? "BUY" : "SELL",
      },
    ])

    const t = { direction, entryPrice, tp, sl, entryTime }
    tradeRef.current = t
    activeFromRef.current = entryIndex
    pendingRef.current = null
    resultRef.current = null
    setTrade(t)
    setPending(null)
    setResult(null)
    setPhase("active")
  }

  // Market order: fills instantly at the current bar's close.
  const enterMarket = direction => {
    if (!seriesRef.current || idxRef.current == null) return
    stopPlayback()
    openPosition(
      direction,
      data[idxRef.current].close,
      idxRef.current,
      data[idxRef.current].time
    )
  }

  // Limit order: place a pending, draggable level to be tagged later.
  const placeLimit = direction => {
    const series = seriesRef.current
    if (!series || idxRef.current == null) return
    stopPlayback()
    clearLines()
    tradeRef.current = null
    resultRef.current = null
    setTrade(null)
    setResult(null)

    const close = data[idxRef.current].close
    // Default just away from price in the favorable direction.
    const limitPrice = round2(close * (direction === "long" ? 0.9985 : 1.0015))
    linesRef.current.limit = series.createPriceLine({
      price: limitPrice,
      color: "#2563eb",
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: "LIMIT",
    })

    const p = { direction, limitPrice }
    pendingRef.current = p
    setPending(p)
    setPhase("pending")
  }

  const finish = (outcome, exitPrice, exitTime) => {
    stopPlayback()
    const t = tradeRef.current
    const pnl = round2(
      t.direction === "long"
        ? exitPrice - t.entryPrice
        : t.entryPrice - exitPrice
    )
    const res = { outcome, exitPrice, exitTime, pnl }
    resultRef.current = res
    setResult(res)
    setPhase("resolved")
    if (outcome === "win") fireSideCannons()

    markersRef.current.setMarkers([
      {
        time: t.entryTime,
        position: t.direction === "long" ? "belowBar" : "aboveBar",
        color: t.direction === "long" ? "#16a34a" : "#dc2626",
        shape: t.direction === "long" ? "arrowUp" : "arrowDown",
        text: t.direction === "long" ? "BUY" : "SELL",
      },
      {
        time: exitTime,
        position: t.direction === "long" ? "aboveBar" : "belowBar",
        color: outcome === "win" ? "#16a34a" : "#dc2626",
        shape: "circle",
        text: outcome === "win" ? "TP" : outcome === "loss" ? "SL" : "EXIT",
      },
    ])
  }

  // Drive the active step function on an interval at the current speed.
  const startInterval = () => {
    runningRef.current = true
    setRunning(true)
    intervalRef.current = setInterval(() => {
      if (stepRef.current) stepRef.current()
    }, speedRef.current)
  }

  // Live speed change — restart the interval, keeping the cursor in place.
  const changeSpeed = ms => {
    speedRef.current = ms
    setSpeedState(ms)
    if (runningRef.current && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        if (stepRef.current) stepRef.current()
      }, ms)
    }
  }

  // Phase 1 step: advance until the pending limit is tagged, then pause.
  const stepFill = () => {
    const series = seriesRef.current
    const p = pendingRef.current
    if (!series || !p) return stopPlayback()
    const i = cursorRef.current
    const bar = data[i]
    series.update(bar)
    followView(i)
    const tagged =
      p.direction === "long"
        ? bar.low <= p.limitPrice
        : bar.high >= p.limitPrice
    if (tagged) {
      openPosition(p.direction, p.limitPrice, i, bar.time, bar.close) // fill + pause
      return stopPlayback()
    }
    if (i >= maxBarRef.current) {
      stopPlayback()
      const res = { outcome: "nofill" }
      resultRef.current = res
      setResult(res)
      setPhase("nofill")
      return undefined
    }
    cursorRef.current = i + 1
    return undefined
  }

  // Phase 2 step: advance the open position until TP or SL is hit.
  const stepResolve = () => {
    const series = seriesRef.current
    const t = tradeRef.current
    if (!series || !t) return stopPlayback()
    const i = cursorRef.current
    const bar = data[i]
    series.update(bar)
    followView(i)
    lastPriceRef.current = bar.close
    const long = t.direction === "long"
    const tpHit = long ? bar.high >= t.tp : bar.low <= t.tp
    const slHit = long ? bar.low <= t.sl : bar.high >= t.sl
    // Both touched in one bar -> assume SL filled first.
    if (slHit) return finish("loss", t.sl, bar.time)
    if (tpHit) return finish("win", t.tp, bar.time)
    if (i >= maxBarRef.current) return finish("open", bar.close, bar.time)
    cursorRef.current = i + 1
    return undefined
  }

  const runToFill = () => {
    if (!seriesRef.current || !pendingRef.current) return
    cursorRef.current = idxRef.current + 1
    maxBarRef.current = Math.min(data.length - 1, idxRef.current + MAX_FORWARD)
    stepRef.current = stepFill
    startInterval()
  }

  const runToResolve = () => {
    if (!seriesRef.current || !tradeRef.current || resultRef.current) return
    cursorRef.current = activeFromRef.current + 1
    maxBarRef.current = Math.min(
      data.length - 1,
      activeFromRef.current + MAX_FORWARD
    )
    stepRef.current = stepResolve
    startInterval()
  }

  const onRun = () => {
    if (runningRef.current) return
    if (phaseRef.current === "pending") runToFill()
    else if (phaseRef.current === "active") runToResolve()
  }

  // ---- Create chart once data is ready ------------------------------------
  useEffect(() => {
    if (!data) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const dark = isDarkRef.current
    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: dark ? "#cbd5e1" : "#334155",
      },
      grid: {
        vertLines: {
          color: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        },
        horzLines: {
          color: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        },
      },
      rightPriceScale: {
        borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
      },
      timeScale: {
        borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        timeVisible: true,
        secondsVisible: false,
      },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
      borderVisible: false,
      priceFormat: { type: "price", precision: 2, minMove: 0.25 },
    })

    chartRef.current = chart
    seriesRef.current = series
    markersRef.current = createSeriesMarkers(series, [])

    newScenario()

    // ---- Drag-to-modify (limit while pending; TP/SL while active) ----
    const yOf = e => e.clientY - container.getBoundingClientRect().top
    const near = (y, price) => {
      const coord = series.priceToCoordinate(price)
      return coord != null && Math.abs(y - coord) <= 7
    }
    const draggables = () => {
      if (runningRef.current || resultRef.current) return []
      if (phaseRef.current === "pending" && pendingRef.current) return ["limit"]
      if (phaseRef.current === "active" && tradeRef.current) return ["tp", "sl"]
      return []
    }
    const priceOf = key =>
      key === "limit" ? pendingRef.current.limitPrice : tradeRef.current[key]

    const onDown = e => {
      const y = yOf(e)
      const hit = draggables().find(k => near(y, priceOf(k)))
      if (!hit) return
      dragRef.current = hit
      chart.applyOptions({ handleScroll: false, handleScale: false })
      e.preventDefault()
    }

    const onMove = e => {
      const rect = container.getBoundingClientRect()
      const y = e.clientY - rect.top
      if (!dragRef.current) {
        const over =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          y >= 0 &&
          y <= rect.height
        container.style.cursor =
          over && draggables().some(k => near(y, priceOf(k)))
            ? "ns-resize"
            : "default"
        return
      }
      let price = series.coordinateToPrice(y)
      if (price == null) return
      price = round2(price)
      const key = dragRef.current
      if (key === "limit") {
        pendingRef.current.limitPrice = price
        linesRef.current.limit.applyOptions({ price })
        setPending({ ...pendingRef.current })
      } else {
        const t = tradeRef.current
        const gap = t.entryPrice * 0.0005
        const long = t.direction === "long"
        if (key === "tp") {
          price = long
            ? Math.max(price, t.entryPrice + gap)
            : Math.min(price, t.entryPrice - gap)
        } else {
          price = long
            ? Math.min(price, t.entryPrice - gap)
            : Math.max(price, t.entryPrice + gap)
        }
        t[key] = price
        linesRef.current[key].applyOptions({ price })
        setTrade({ ...t })
      }
    }

    const onUp = () => {
      if (!dragRef.current) return
      dragRef.current = null
      chart.applyOptions({ handleScroll: true, handleScale: true })
    }

    container.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    return () => {
      stopPlayback()
      container.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // ---- Live theme update (keeps the in-progress trade) --------------------
  useEffect(() => {
    isDarkRef.current = isDark
    const chart = chartRef.current
    if (!chart) return
    chart.applyOptions({
      layout: { textColor: isDark ? "#cbd5e1" : "#334155" },
      grid: {
        vertLines: {
          color: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        },
        horzLines: {
          color: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        },
      },
      rightPriceScale: {
        borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
      },
      timeScale: {
        borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
      },
    })
  }, [isDark])

  // ---- TradingView-style unrealized-PnL pill pinned to the entry line -----
  const drawBox = () => {
    const box = boxRef.current
    const series = seriesRef.current
    const chart = chartRef.current
    const t = tradeRef.current
    const container = containerRef.current
    if (!box || !series || !chart || !t || !container) return
    const coord = series.priceToCoordinate(t.entryPrice)
    if (coord == null) {
      box.style.display = "none"
      return
    }
    const cur = lastPriceRef.current ?? t.entryPrice
    const pnl = round2(
      t.direction === "long" ? cur - t.entryPrice : t.entryPrice - cur
    )
    const dollars = round2(pnl * DOLLARS_PER_POINT)
    const pos = pnl >= 0
    box.style.display = "block"
    box.style.top = `${Math.max(
      10,
      Math.min(container.clientHeight - 10, coord)
    )}px`
    box.style.right = `${chart.priceScale("right").width() + 6}px`
    box.style.borderColor = pos ? "#16a34a" : "#dc2626"
    box.style.color = pos ? "#16a34a" : "#dc2626"
    box.textContent = `${pos ? "+" : ""}${pnl} pts  ${
      pos ? "+" : ""
    }$${dollars.toLocaleString()}`
  }

  useEffect(() => {
    if (phase !== "active") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (boxRef.current) boxRef.current.style.display = "none"
      return undefined
    }
    const loop = () => {
      drawBox()
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // ---- Derived UI ---------------------------------------------------------
  const idle = phase === "idle"
  const rr =
    trade &&
    round2(
      Math.abs(trade.tp - trade.entryPrice) /
        Math.abs(trade.entryPrice - trade.sl)
    )
  const resultColor =
    result?.outcome === "win"
      ? "text-green-600"
      : result?.outcome === "loss"
      ? "text-red-600"
      : "text-muted-foreground"
  const resultLabel = {
    win: "WIN",
    loss: "LOSS",
    open: "OPEN",
    nofill: "LIMIT NOT FILLED",
  }[result?.outcome]
  const runLabel = phase === "pending" ? "▶ Run to fill" : "▶ Run trade"

  return (
    <Card className="my-12">
      <CardHeader>
        <CardTitle className="text-xl font-bold uppercase tracking-wide">
          NQ Trade Simulator
        </CardTitle>
        <CardDescription>
          Roll a random moment in the last 60 days of Nasdaq-100 futures. Take a
          market trade, or rest a limit order and run the tape until it's tagged
          — then drag the TP/SL lines and run it out to see if you win.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-[400px] w-full">
          <div ref={containerRef} className="absolute inset-0" />
          <div
            ref={boxRef}
            className="pointer-events-none absolute z-20 hidden -translate-y-1/2 whitespace-nowrap rounded border bg-card px-2 py-0.5 text-xs font-semibold"
          />
          {!data && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              {error
                ? `Failed to load chart data: ${error}`
                : "Loading NQ futures data…"}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={newScenario}
            disabled={!data || running}
          >
            🎲 New date
          </Button>
          <Button
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => enterMarket("long")}
            disabled={!data || !idle}
          >
            Buy
          </Button>
          <Button
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => enterMarket("short")}
            disabled={!data || !idle}
          >
            Sell
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => placeLimit("long")}
            disabled={!data || !idle}
          >
            Buy Limit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => placeLimit("short")}
            disabled={!data || !idle}
          >
            Sell Limit
          </Button>
          <Button
            size="sm"
            onClick={onRun}
            disabled={running || !(phase === "pending" || phase === "active")}
          >
            {runLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTrade}
            disabled={idle || running}
          >
            Reset
          </Button>

          <span className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
            Speed:
            {SPEEDS.map(s => (
              <Button
                key={s.label}
                size="sm"
                variant={speed === s.ms ? "default" : "outline"}
                onClick={() => changeSpeed(s.ms)}
              >
                {s.label}
              </Button>
            ))}
          </span>
        </div>

        {entryInfo && (
          <div className="text-sm text-muted-foreground">
            Date: <span className="font-medium">{fmtDate(entryInfo.time)}</span>{" "}
            · price {entryInfo.price}
          </div>
        )}

        {pending && phase === "pending" && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-blue-600">
              Pending {pending.direction === "long" ? "BUY" : "SELL"} LIMIT @{" "}
              {pending.limitPrice}
            </span>
            <span className="text-muted-foreground">
              drag the blue line, then Run to fill
            </span>
          </div>
        )}

        {trade && (
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span>
              Direction:{" "}
              <span className="font-semibold uppercase">{trade.direction}</span>
            </span>
            <span>Entry: {trade.entryPrice}</span>
            <span className="text-green-600">TP: {trade.tp}</span>
            <span className="text-red-600">SL: {trade.sl}</span>
            <span>R:R {rr}</span>
          </div>
        )}

        {result && (
          <div className={`text-sm font-semibold ${resultColor}`}>
            {result.outcome === "nofill" ? (
              resultLabel
            ) : (
              <>
                {resultLabel} · {result.pnl > 0 ? "+" : ""}
                {result.pnl} pts ({result.pnl > 0 ? "+" : ""}$
                {round2(result.pnl * DOLLARS_PER_POINT).toLocaleString()}) ·
                exit {result.exitPrice} @ {fmtDate(result.exitTime)}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TradeSimulator
