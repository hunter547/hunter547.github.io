import React, { Suspense, useContext, useState, lazy } from "react"
import { Link, useParams } from "react-router-dom"
import { ClientOnly } from "vite-react-ssg"
import "../styles/index.scss"
import "../styles/components/niche.scss"
import niches from "../data/niches.json"
import portfolioData from "../data/portfolioData.json"
import LanyardBadge from "../components/lanyard/LanyardBadge"
import { nicheExtras, nicheHeroAsides } from "../components/nicheExtras"
import VideoModal from "../components/videoModal"
import CaseItem from "../components/CaseItem"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"

// Browser-only: the dot-field background paints to a canvas and reads
// window/devicePixelRatio, so keep it out of the static pre-render.
const DotField = lazy(() => import("../components/DotField"))

// Subtle dot-field tints drawn from the site palette, keyed by theme.
const dotColorsByTheme = {
  "theme-dark": {
    gradientFrom: "rgba(138, 166, 191, 0.22)", // $light-blue
    gradientTo: "rgba(242, 94, 122, 0.16)", // $light-orange
    glowColor: "transparent", // no cursor glow
  },
  "theme-light": {
    gradientFrom: "rgba(2, 52, 64, 0.20)", // $dark-blue
    gradientTo: "rgba(138, 166, 191, 0.16)", // $light-blue
    glowColor: "transparent", // no cursor glow
  },
}

// Build-time responsive images (same maps the portfolio uses). Keys match the
// relative paths in portfolioData.json (e.g. "../images/Leaflet-SmoothGeodesic-app.png").
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
// SVG banners are kept as true vectors (imported as their own URL), matching
// the home portfolio. Keys are the relative paths stored in portfolioData.json.
const svgUrls = import.meta.glob("../images/*.svg", {
  eager: true,
  import: "default",
  query: "?url",
})

const pad = n => String(n).padStart(2, "0")

const Niche = () => {
  const { slug } = useParams()
  const [themeMode] = useContext(ThemeModeContext)
  const dotColors =
    dotColorsByTheme[themeMode] || dotColorsByTheme["theme-light"]
  // The related project whose demo video is currently open (null = closed).
  const [activeVideo, setActiveVideo] = useState(null)
  const order = niches.findIndex(n => n.slug === slug)
  const niche = niches[order]

  if (!niche) {
    return (
      <main className="niche">
        <p className="niche-kicker niche__mono">Niche · 404</p>
        <hr className="niche-rule" />
        <h1 className="niche-title niche__display">Not on file.</h1>
        <p className="niche-lead">That dossier doesn&apos;t exist (yet).</p>
        <div className="niche-cta-actions" style={{ marginTop: "2rem" }}>
          <Link
            to="/"
            state={{ skipIntro: true }}
            className="niche-cta-back niche__mono"
          >
            ← Back to portfolio
          </Link>
        </div>
      </main>
    )
  }

  const related = (niche.relatedProjects || [])
    .map(cn => portfolioData.find(p => p.classname === cn))
    .filter(Boolean)
  const experience = niche.experience || []

  // Optional per-niche interactive component (e.g. the trade simulator).
  // Rendered browser-only so it never runs during the static pre-render.
  const NicheExtra = nicheExtras[niche.slug]
  // Optional per-niche hero aside (e.g. the globe for Mapping APIs).
  const HeroAside = nicheHeroAsides[niche.slug]

  return (
    <main className="niche">
      {/* ---- Masthead ---- */}
      <header
        className={`niche-hero${HeroAside ? " niche-hero--with-aside" : ""}`}
      >
        {/* ---- Dot-field background behind the hero ---- */}
        <ClientOnly>
          {() => (
            <div className="niche-hero-dots" aria-hidden="true">
              <Suspense fallback={null}>
                <DotField {...dotColors} />
              </Suspense>
            </div>
          )}
        </ClientOnly>
        <hr className="niche-rule" />
        <div className="niche-hero-main">
          <h1 className="niche-title">{niche.title}</h1>
          <p className="niche-tagline">{niche.tagline}</p>
          <p className="niche-lead">{niche.description}</p>
        </div>
        {HeroAside && (
          <div className="niche-hero-aside">
            <ClientOnly>
              {() => (
                <Suspense fallback={null}>
                  <HeroAside />
                </Suspense>
              )}
            </ClientOnly>
          </div>
        )}
      </header>

      {/* ---- Page body ---- */}
      <div className="niche-body">
        {/* ---- Capabilities ---- */}
        <section className="niche-section">
          <h2 className="niche-section-label">What I build</h2>
          <ul className="niche-caps">
            {niche.highlights.map((h, i) => (
              <li className="niche-cap" key={h}>
                <span className="niche-cap-num">{pad(i + 1)}</span>
                <span className="niche-cap-text">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Custom interactive component (per niche, optional) ---- */}
        {NicheExtra && (
          <section className="niche-section">
            <ClientOnly>
              {() => (
                <Suspense fallback={null}>
                  <NicheExtra />
                </Suspense>
              )}
            </ClientOnly>
          </section>
        )}

        {/* ---- Selected work ---- */}
        {related.length > 0 && (
          <section className="niche-section">
            <h2 className="niche-section-label">Selected work</h2>
            <div className="case-list">
              {related.map((p, i) => (
                <CaseItem
                  key={p.classname}
                  flip={i % 2 === 1}
                  image={fallbacks[p.image]}
                  imageSrcSet={srcSets[p.image]}
                  svg={p.svg ? svgUrls[p.svg] : undefined}
                  eyebrow={`Case file — ${niche.title}`}
                  title={p.header}
                  description={p.description}
                  githubLink={p.githubLink}
                  applicationLink={p.applicationLink}
                  video={p.video}
                  onVideo={setActiveVideo}
                  icons={p.icons}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---- Experience timeline ---- */}
        {experience.length > 0 && (
          <section className="niche-section">
            <h2 className="niche-section-label">Professional experience</h2>
            <ol className="niche-timeline">
              {experience.map(e => (
                <li className="niche-tl" key={`${e.company}-${e.period}`}>
                  <div className="niche-tl-content">
                    <p className="niche-tl-period">{e.period}</p>
                    <h3 className="niche-tl-role">{e.role}</h3>
                    <p className="niche-tl-company">{e.company}</p>
                    <p className="niche-tl-summary">{e.summary}</p>
                  </div>
                  <div className="niche-tl-lanyard">
                    <LanyardBadge frontImage={e.badge} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ---- Closing CTA ---- */}
        <section className="niche-cta">
          <p className="niche-cta-kicker">Let&apos;s build</p>
          <h2 className="niche-cta-title">
            Have a {niche.title.toLowerCase()} project?
          </h2>
          <div className="niche-cta-actions">
            <a className="niche-cta-btn" href="mailto:hunter547@gmail.com">
              Start a conversation <span>↗</span>
            </a>
            <Link to="/" state={{ skipIntro: true }} className="niche-cta-back">
              ← Back to portfolio
            </Link>
          </div>
        </section>
      </div>

      <VideoModal
        video={activeVideo}
        isOpen={Boolean(activeVideo)}
        onRequestClose={() => setActiveVideo(null)}
      />
    </main>
  )
}

export default Niche
