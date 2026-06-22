import React, { useEffect, useState } from "react"
import "../styles/components/portfolio.scss"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import gsap from "gsap"
import PortfolioCollection from "./portfolioCollection"
import Typewriter from "./typewriter"
import VideoModal from "./videoModal"

const Portfolio = () => {
  const [doType, setDoType] = useState(false)
  // The project demo video currently open (null = closed), lifted here so a
  // single modal serves every case item — matching the niche pages.
  const [activeVideo, setActiveVideo] = useState(null)

  if (typeof window !== `undefined`) {
    gsap.registerPlugin(ScrollTrigger)
    gsap.core.globals("ScrollTrigger", ScrollTrigger)
  }
  gsap.registerPlugin(ScrollTrigger)

  const startTyping = () => {
    setDoType(true)
  }

  useEffect(() => {
    gsap.to(".portfolio__summary h3", {
      scrollTrigger: {
        trigger: ".portfolio__summary h3",
        start: "top 99%",
        triggerActions: "play none none none",
      },
      onComplete: startTyping,
    })
    gsap.from(
      ".portfolio__summary p",
      {},
      {
        scrollTrigger: {
          trigger: ".portfolio__summary p",
          start: "top 99%",
          triggerActions: "play none none none",
        },
      }
    )
  })

  return (
    <section id="portfolio">
      <div className="portfolio">
        <div className="portfolio__summary">
          {!doType ? (
            <h3></h3>
          ) : (
            <h3>
              <Typewriter dataText="Development Projects" />
            </h3>
          )}
          <p>
            This is what I build on my own time. Lately my projects have
            gravitated toward financial markets and AI — multi-agent systems
            where LLMs trade against each other, Monte Carlo simulators for
            prop-firm risk, and bridges that turn closed desktop trading
            platforms into programmable APIs. They reach across the whole stack,
            from Kafka data pipelines and MySQL backends to React dashboards and
            an open-source mapping package, and even down to running
            Windows-only software headless on Linux through Wine.
          </p>
          {/*
          <div className="btn-row">
            <Link to="/work">View projects</Link>
          </div> */}
        </div>
        <div className="portfolio__grid case-list">
          <PortfolioCollection onVideo={setActiveVideo} />
        </div>
      </div>
      <VideoModal
        video={activeVideo}
        isOpen={Boolean(activeVideo)}
        onRequestClose={() => setActiveVideo(null)}
      />
    </section>
  )
}

export default Portfolio
