import React from "react"
import "../styles/components/caseItem.scss"
import { IconCloud } from "@/components/ui/icon-cloud"
import { TiltedCard } from "@/components/ui/tilted-card"

// Shared "case file" project item used by both the home portfolio and the niche
// pages. Renders an alternating two-column row (framed screenshot + write-up);
// when `icons` are provided, an interactive IconCloud fills the body's
// bottom-right open space.
const CaseItem = ({
  id,
  image,
  imageSrcSet,
  svg,
  imageSizes = "(max-width: 52rem) 90vw, 42vw",
  imageLoading = "lazy",
  eyebrow,
  title,
  description,
  githubLink,
  applicationLink,
  video,
  onVideo,
  icons,
  flip = false,
}) => {
  const hasCloud = Array.isArray(icons) && icons.length > 0

  return (
    <article
      id={id}
      className="case-item"
      data-flip={flip ? "true" : undefined}
      data-cloud={hasCloud ? "true" : undefined}
    >
      <TiltedCard className="case-item-media">
        <div className="case-item-frame" aria-hidden="true" />
        {svg && image ? (
          // Stacked media: the README's vector banner on top, the 3D pass-rate
          // surface below — together they fill the frame as a squarish block.
          // The banner stays a true SVG (loaded by URL, never rasterized).
          <div className="case-item-stack">
            <img
              className="case-item-stack-svg"
              src={svg}
              loading={imageLoading}
              alt={`${title} banner`}
            />
            <img
              className="case-item-stack-img"
              src={image}
              srcSet={imageSrcSet}
              sizes={imageSizes}
              loading={imageLoading}
              alt={`${title} 3D pass-rate surface`}
            />
          </div>
        ) : svg ? (
          // Banner-only media: a self-contained vector illustration (used for
          // library/SDK projects with no UI to screenshot). Fills the frame at
          // its natural aspect, exactly like a single screenshot would.
          <img
            className="case-item-img"
            src={svg}
            loading={imageLoading}
            alt={`${title} illustration`}
          />
        ) : (
          <img
            className="case-item-img"
            src={image}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            loading={imageLoading}
            alt={`${title} interface`}
          />
        )}
      </TiltedCard>
      <div className="case-item-body">
        {eyebrow && <p className="case-item-eyebrow">{eyebrow}</p>}
        <h3 className="case-item-title">{title}</h3>
        <p className="case-item-desc">{description}</p>
        <div className="case-item-actions">
          <div className="case-links">
            <a
              className="case-link"
              href={githubLink}
              target="_blank"
              rel="noreferrer"
            >
              Code <span>↗</span>
            </a>
            {applicationLink && (
              <a
                className="case-link"
                href={applicationLink}
                target="_blank"
                rel="noreferrer"
              >
                Live <span>↗</span>
              </a>
            )}
            {video && (
              <button
                type="button"
                className="case-link"
                onClick={() => onVideo?.(video)}
              >
                Demo <span>↗</span>
              </button>
            )}
          </div>
          {hasCloud && (
            <div className="case-item-cloud" aria-hidden="true">
              <IconCloud images={icons} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default CaseItem
