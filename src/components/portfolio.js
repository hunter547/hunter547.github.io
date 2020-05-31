import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import { Link } from "gatsby"
import PortfolioItems from "./portfolioItems"

const Portfolio = () => {
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
          <h3>Development Projects</h3>
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
          <PortfolioItems />
        </div>
      </div>
    </section>
  )
}

export default Portfolio
