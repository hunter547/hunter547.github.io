import React, { useState } from "react";
import {useStaticQuery, graphql} from "gatsby";
import PortfolioItem from "./portfolioItem";




const PortfolioCollection = () => {
  const [doFade, setDoFade] = useState(true);

  const setFade = () => {
    setDoFade(false);
  }
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
        <PortfolioItem project={project} 
                       setFade={setFade} 
                       fadeState={doFade} 
                       key={project.classname} 
        />
      )
    )
  )
}

export default PortfolioCollection