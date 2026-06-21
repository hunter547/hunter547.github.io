import React, { useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

// Springy 3D tilt wrapper. Tracks the pointer over its bounds and rotates the
// inner layer toward the cursor; children live in a shared `preserve-3d` space
// so anything with its own `translateZ` (e.g. the screenshot) floats above the
// rest, giving a layered, parallax-style depth on hover.
const springValues = { damping: 30, stiffness: 100, mass: 2 }

export function TiltedCard({
  children,
  className,
  perspective = 900,
  rotateAmplitude = 11,
  scaleOnHover = 1.04,
}) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
  }

  function handleMouseLeave() {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: `${perspective}px` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilted-card-inner"
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default TiltedCard
