import React , { useEffect, useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import PortfolioCollection from "./portfolioCollection";
import Typewriter from "./typewriter";

const Portfolio = () => {

  const [doType, setDoType] = useState(false);

  if (typeof window !== `undefined`) {
    gsap.registerPlugin(ScrollTrigger)
    gsap.core.globals("ScrollTrigger", ScrollTrigger)
  }
  gsap.registerPlugin(ScrollTrigger);

  const startTyping = () => {
    setDoType(true);
  }

  useEffect(() => {
    gsap.to('.portfolio__summary h3', {
      scrollTrigger: {
        trigger: '.portfolio__summary h3',
        start: 'top 99%',
        triggerActions: 'play none none none',
      },
     onComplete : startTyping
    });
    gsap.from('.portfolio__summary p', {
      
    },{
      scrollTrigger: {
        trigger: '.portfolio__summary p',
        start: 'top 99%',
        triggerActions: 'play none none none'
      },
      
    });
  })

  return (
    <section id="portfolio">
      <div className="portfolio">
        <div className="portfolio__summary">
          {!doType ? 
            <h3></h3>
            :
            <h3><Typewriter dataText="Development Projects" /></h3>}
          <p>
            I've been working on a variety of projects that have helped me
            gain proficiency with different web application frameworks,
            programming languages, and server side processing. My most recent
            projects have heavily focused on React and React Native.
          </p>{/*
          <div className="btn-row">
            <Link to="/work">View projects</Link>
          </div> */}
        </div>
        <div className="portfolio__grid">
          <PortfolioCollection />
        </div>
      </div>
    </section>
  )
}

export default Portfolio
