import React, { Suspense, lazy, useEffect, useRef, useState } from "react";

// Heavy Three.js/Rapier chunk — loaded only on the client, only once the badge
// scrolls near the viewport. Keeps it out of the SSR pre-render entirely.
const Lanyard = lazy(() => import("./Lanyard"));

export default function LanyardBadge({ frontImage }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  return (
    <div ref={ref} className="lanyard-canvas">
      {active && (
        <Suspense fallback={null}>
          <Lanyard
            position={[0, 0, 17]}
            fov={20}
            frontImage={frontImage}
            imageFit="cover"
          />
        </Suspense>
      )}
    </div>
  );
}
