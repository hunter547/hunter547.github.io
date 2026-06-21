import { useEffect, useRef } from "react"
import createGlobe from "cobe"
import { useMotionValue, useSpring } from "motion/react"

// Ported from the rmhe-vite About page. A cobe globe that spins from the far
// side of the world to Colorado, easing in a zoom, then becomes drag-to-rotate
// via spring physics. Browser-only (WebGL) — render under ClientOnly.
export default function Globe({
  className,
  animationDuration = 0.008,
  initialZoom = 1.0,
  zoomLevel = 1.6,
}) {
  const canvasRef = useRef(null)
  const scaleRef = useRef(1)
  const animationCompleteRef = useRef(false)
  const pointerInteracting = useRef(null)
  const pointerInteractingY = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const pointerInteractionMovementY = useRef(0)

  // Spring-based physics for smooth dragging.
  const r = useMotionValue(0)
  const t = useMotionValue(0)
  const springR = useSpring(r, { stiffness: 280, damping: 40, mass: 1 })
  const springT = useSpring(t, { stiffness: 280, damping: 40, mass: 1 })

  useEffect(() => {
    if (!canvasRef.current) return

    let width = 0
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth
    }
    window.addEventListener("resize", onResize)

    requestAnimationFrame(() => {
      onResize()
      setTimeout(onResize, 100)
    })

    const locationToAngles = (lat, long) => [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ]

    const denverLat = 39.7392
    const denverLon = -104.9903
    const [targetPhi, targetTheta] = locationToAngles(denverLat, denverLon)

    let currentPhi = targetPhi + Math.PI
    let currentTheta = 0
    const targetThetaView = targetTheta

    let animationComplete = false
    let scale = initialZoom
    const targetScale = zoomLevel
    let phiAtAnimationEnd = 0
    let thetaAtAnimationEnd = 0

    const doublePi = Math.PI * 2

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.8, 0.8, 0.8],
      markerColor: [0.77, 0.11, 0.2],
      glowColor: [0.8, 0.8, 0.8],
      markers: [{ location: [38.8339, -104.8214], size: 0.08 }],
      onRender: state => {
        state.width = width * 2
        state.height = width * 2

        if (!animationComplete) {
          const distPositive = (targetPhi - currentPhi + doublePi) % doublePi
          const distNegative = (currentPhi - targetPhi + doublePi) % doublePi

          if (
            Math.min(distPositive, distNegative) < 0.05 &&
            Math.abs(scale - targetScale) < 0.05
          ) {
            scale = targetScale
            phiAtAnimationEnd = currentPhi
            thetaAtAnimationEnd = currentTheta
            pointerInteractionMovement.current = 0
            pointerInteractionMovementY.current = 0
            animationComplete = true
            animationCompleteRef.current = true
          } else {
            const rotationProgress =
              1 - Math.min(distPositive, distNegative) / Math.PI

            if (distPositive < distNegative) {
              currentPhi += distPositive * animationDuration
            } else {
              currentPhi -= distNegative * animationDuration
            }

            currentTheta = targetThetaView * rotationProgress

            const zoomEaseProgress = 1 - Math.pow(1 - rotationProgress, 3)
            scale = initialZoom + (targetScale - initialZoom) * zoomEaseProgress
          }
        } else {
          state.phi = phiAtAnimationEnd + springR.get()
          currentTheta = thetaAtAnimationEnd + springT.get()
        }

        if (!animationComplete) state.phi = currentPhi
        state.theta = currentTheta
        state.scale = 1

        scaleRef.current = scale
        if (canvasRef.current) {
          canvasRef.current.style.transform = `scale(${scale})`
        }
      },
    })

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
        canvasRef.current.style.transform = `scale(${initialZoom})`
      }
    }, 0)

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [animationDuration, initialZoom, zoomLevel, springR, springT])

  return (
    <div style={{ overflow: "visible", width: "100%", aspectRatio: "1" }}>
      <canvas
        ref={canvasRef}
        className={className}
        onPointerDown={e => {
          if (!animationCompleteRef.current) return
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current
          pointerInteractingY.current =
            e.clientY - pointerInteractionMovementY.current
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
        }}
        onPointerUp={() => {
          if (!animationCompleteRef.current) return
          pointerInteracting.current = null
          pointerInteractingY.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = "grab"
        }}
        onPointerOut={() => {
          if (!animationCompleteRef.current) return
          pointerInteracting.current = null
          pointerInteractingY.current = null
          if (canvasRef.current) canvasRef.current.style.cursor = "grab"
        }}
        onMouseMove={e => {
          if (!animationCompleteRef.current) return
          if (
            pointerInteracting.current !== null &&
            pointerInteractingY.current !== null
          ) {
            const deltaX = e.clientX - pointerInteracting.current
            const deltaY = e.clientY - pointerInteractingY.current
            pointerInteractionMovement.current = deltaX
            pointerInteractionMovementY.current = deltaY
            r.set(deltaX / 200)
            t.set(deltaY / 300)
          }
        }}
        onTouchMove={e => {
          if (!animationCompleteRef.current) return
          if (
            pointerInteracting.current !== null &&
            pointerInteractingY.current !== null &&
            e.touches[0]
          ) {
            const deltaX = e.touches[0].clientX - pointerInteracting.current
            const deltaY = e.touches[0].clientY - pointerInteractingY.current
            pointerInteractionMovement.current = deltaX
            pointerInteractionMovementY.current = deltaY
            r.set(deltaX / 100)
            t.set(deltaY / 150)
          }
          e.preventDefault()
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0,
          transition: "opacity 1s ease",
          overflow: "visible",
          transformOrigin: "center center",
          cursor: "grab",
          touchAction: "none",
        }}
      />
    </div>
  )
}
