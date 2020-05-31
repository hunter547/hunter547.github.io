import React from "react";
import {useStaticQuery, graphql} from "gatsby";
import { Link } from "gatsby";
import Image from "gatsby-image"




const PortfolioItems = () => {
  const data = useStaticQuery(graphql`
      query {
        allPortfolioDataJson {
          edges {
            node {
              classname
              spanID
              header
              image {
                relativePath
                childImageSharp {
                  fluid(quality:100) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              description
              githubLink
              applicationLink
            }
          }
        }
      }
  `);
  const portfolio = data.allPortfolioDataJson.edges.map(
    (project) => project.node
  );
  return (
    portfolio.map(
      (project) => (
        <div className={`portfolio__item ${project.classname}`}>
          <div className="portfolio__item-wrapper">
            <div className="portfolio__item-image-container">
              <Image className="portfolio__item-image" fluid={project.image.childImageSharp.fluid} />
            </div>
            <div className="portfolio__item-text-container">
              <div className="portfolio__item-bottom">
                <div className="porfolio__item-details">
                  <h2>{project.header}</h2>
                  <p>{project.description}</p>
                </div>
                <div className="portfolio__item-button-wrapper">
                  <a href={project.githubLink} target="_blank"  className="portfolio__item-button">GitHub</a>
                  <a href={project.applicationLink} target="_blank"  className="portfolio__item-button">Application</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    )
  )
}

export default PortfolioItems