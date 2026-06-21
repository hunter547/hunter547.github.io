import React from "react"
import "../styles/components/caseItem.scss"
import { IconCloud } from "@/components/ui/icon-cloud"

// Shared "case file" project item used by both the home portfolio and the niche
// pages. Renders an alternating two-column row (framed screenshot + write-up);
// when `icons` are provided, an interactive IconCloud fills the body's
// bottom-right open space.
const CaseItem = ({
  image,
  imageSrcSet,
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
      className="case-item"
      data-flip={flip ? "true" : undefined}
      data-cloud={hasCloud ? "true" : undefined}
    >
      <div className="case-item-media">
        <div className="case-item-frame">
          <img
            src={image}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            loading={imageLoading}
            alt={`${title} interface`}
          />
        </div>
      </div>
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
