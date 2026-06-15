import React from "react";
import PortfolioItem from "./portfolioItem";
import portfolioData from "../data/portfolioData.json";

// Build responsive image maps at build time. Keys match the relative paths
// stored in portfolioData.json (e.g. "../images/Bouqs.png").
const srcSets = import.meta.glob("../images/*.png", {
  eager: true,
  import: "default",
  query: { w: "400;800;1200", format: "webp", as: "srcset" },
});

const fallbacks = import.meta.glob("../images/*.png", {
  eager: true,
  import: "default",
  query: { w: "800", format: "webp" },
});

const PortfolioCollection = () => {
  return portfolioData.map((project) => (
    <PortfolioItem
      project={project}
      key={project.classname}
      imageSrcSet={srcSets[project.image]}
      imageSrc={fallbacks[project.image]}
    />
  ));
};

export default PortfolioCollection;
