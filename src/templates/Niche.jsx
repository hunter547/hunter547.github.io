import React, { Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClientOnly } from "vite-react-ssg";
import "../styles/index.scss";
import "../styles/components/niche.scss";
import niches from "../data/niches.json";
import portfolioData from "../data/portfolioData.json";
import LanyardBadge from "../components/lanyard/LanyardBadge";
import { nicheExtras } from "../components/nicheExtras";
import VideoModal from "../components/videoModal";

// Build-time responsive images (same maps the portfolio uses). Keys match the
// relative paths in portfolioData.json (e.g. "../images/Leaflet-SmoothGeodesic-app.png").
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

const pad = (n) => String(n).padStart(2, "0");

const Niche = () => {
  const { slug } = useParams();
  // The related project whose demo video is currently open (null = closed).
  const [activeVideo, setActiveVideo] = useState(null);
  const order = niches.findIndex((n) => n.slug === slug);
  const niche = niches[order];

  if (!niche) {
    return (
      <main className="niche">
        <p className="niche-kicker niche__mono">Niche · 404</p>
        <hr className="niche-rule" />
        <h1 className="niche-title niche__display">Not on file.</h1>
        <p className="niche-lead">That dossier doesn&apos;t exist (yet).</p>
        <div className="niche-cta-actions" style={{ marginTop: "2rem" }}>
          <Link to="/" state={{ skipIntro: true }} className="niche-cta-back niche__mono">
            ← Back to portfolio
          </Link>
        </div>
      </main>
    );
  }

  const related = (niche.relatedProjects || [])
    .map((cn) => portfolioData.find((p) => p.classname === cn))
    .filter(Boolean);
  const experience = niche.experience || [];

  // Optional per-niche interactive component (e.g. the trade simulator).
  // Rendered browser-only so it never runs during the static pre-render.
  const NicheExtra = nicheExtras[niche.slug];

  return (
    <main className="niche">
      {/* ---- Masthead ---- */}
      <header className="niche-hero">
        <hr className="niche-rule" />
        <h1 className="niche-title">{niche.title}</h1>
        <p className="niche-tagline">{niche.tagline}</p>
        <p className="niche-lead">{niche.description}</p>
      </header>

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
          <div className="niche-work">
            {related.map((p, i) => (
              <article className="niche-case" data-flip={i % 2 === 1} key={p.classname}>
                <div className="niche-case-media">
                  <div className="niche-case-frame">
                    <img
                      src={fallbacks[p.image]}
                      srcSet={srcSets[p.image]}
                      sizes="(max-width: 52rem) 90vw, 42vw"
                      loading="lazy"
                      alt={`${p.header} interface`}
                    />
                  </div>
                </div>
                <div className="niche-case-body">
                  <p className="niche-case-eyebrow">Case file — {niche.title}</p>
                  <h3 className="niche-case-title">{p.header}</h3>
                  <p className="niche-case-desc">{p.description}</p>
                  <div className="case-links">
                    <a className="case-link" href={p.githubLink} target="_blank" rel="noreferrer">
                      Code <span>↗</span>
                    </a>
                    {p.applicationLink && (
                      <a className="case-link" href={p.applicationLink} target="_blank" rel="noreferrer">
                        Live <span>↗</span>
                      </a>
                    )}
                    {p.video && (
                      <button
                        type="button"
                        className="case-link"
                        onClick={() => setActiveVideo(p.video)}
                      >
                        Demo <span>↗</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---- Experience timeline ---- */}
      {experience.length > 0 && (
        <section className="niche-section">
          <h2 className="niche-section-label">Professional experience</h2>
          <ol className="niche-timeline">
            {experience.map((e) => (
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

      <VideoModal
        video={activeVideo}
        isOpen={Boolean(activeVideo)}
        onRequestClose={() => setActiveVideo(null)}
      />
    </main>
  );
};

export default Niche;
