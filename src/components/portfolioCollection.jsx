import React from "react"
import CaseItem from "./CaseItem"
import portfolioData from "../data/portfolioData.json"

// Build responsive image maps at build time. Keys match the relative paths
// stored in portfolioData.json (e.g. "../images/Leaflet-SmoothGeodesic-app.png").
const srcSets = import.meta.glob("../images/*.png", {
  eager: true,
  import: "default",
  query: { w: "400;800;1200", format: "webp", as: "srcset" },
})

const fallbacks = import.meta.glob("../images/*.png", {
  eager: true,
  import: "default",
  query: { w: "800", format: "webp" },
})

// SVGs are kept as true vectors (no rasterization) — imported as their own URL
// and rendered straight into an <img>. Keys match the relative paths in
// portfolioData.json (e.g. "../images/prop-risk-geometry-banner.svg").
const svgUrls = import.meta.glob("../images/*.svg", {
  eager: true,
  import: "default",
  query: "?url",
})

const PortfolioCollection = ({ onVideo }) => {
  return portfolioData.map((project, index) => (
    <CaseItem
      key={project.classname}
      flip={index % 2 === 1}
      image={fallbacks[project.image]}
      imageSrcSet={srcSets[project.image]}
      svg={project.svg ? svgUrls[project.svg] : undefined}
      imageLoading={index === 0 ? "eager" : "lazy"}
      eyebrow="Project"
      title={project.header}
      description={project.description}
      githubLink={project.githubLink}
      applicationLink={project.applicationLink}
      video={project.video}
      onVideo={onVideo}
      icons={project.icons}
    />
  ))
}

export default PortfolioCollection
