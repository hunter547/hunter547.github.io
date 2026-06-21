import React from "react"
import Globe from "./Globe"

// Hero-aside globe for the Mapping APIs niche, configured like the rmhe About
// page: a slow spin that zooms gently in toward Colorado.
const MappingGlobe = () => (
  <Globe
    className="w-full"
    animationDuration={0.007}
    initialZoom={0.1}
    zoomLevel={1.15}
  />
)

export default MappingGlobe
