import React , { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import gsap from "gsap"
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
    gsap.fromTo('.portfolio__summary h3', {
      
    },{
      scrollTrigger: {
        trigger: '.portfolio__summary h3',
        start: 'top 95%',
        triggerActions: 'play none none none'
      },
      startTyping
    });
    gsap.fromTo('.portfolio__summary p', {
      
    },{
      scrollTrigger: {
        trigger: '.portfolio__summary p',
        start: 'top 95%',
        triggerActions: 'play none none none'
      },
      
    });
  })

  const data = useStaticQuery(graphql`
    query {
      code: file(relativePath: { eq: "code.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
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
