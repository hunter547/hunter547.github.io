import React from "react";
import {useStaticQuery, graphql} from "gatsby";
import PortfolioItem from "./portfolioItem";




const PortfolioCollection = () => {

  const data = useStaticQuery(graphql`
      query {
        allPortfolioDataJson {
          edges {
            node {
              classname
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
        <PortfolioItem project={project} key={project.classname} 
        />
      )
    )
  )
}

export default PortfolioCollection