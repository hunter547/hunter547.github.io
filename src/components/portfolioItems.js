import React from "react";
import {useStaticQuery, graphql} from "gatsby";
import Img from "gatsby-image";
import { Link } from "gatsby"

const PortfolioItems = () => {
  const data = useStaticQuery(graphql`
      query {
        allPortfolioDataJson {
          edges {
            node {
              classname
              spanID
              header
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
          <span id={project.spanID}>
            <div className="portfolio__item-wrapper">
              <div className="porfolio__item-details">
                <h2>{project.header}</h2>
                <p>{project.description}</p>
              </div>
              <div className="portfolio__button-wrapper">
                <a href={project.githubLink} target="_blank"  className="portfolio__button">GitHub</a>
                <a href={project.applicationLink} target="_blank"  className="portfolio__button">Application</a>
              </div>
            </div>
          </span>
        </div>
      )
    )
  )
}

export default PortfolioItems