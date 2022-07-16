import React from "react";
import {useStaticQuery, graphql} from "gatsby";
import PortfolioItem from "./portfolioItem";




const PortfolioCollection = () => {

  const data = useStaticQuery(graphql`{
  allPortfolioDataJson {
    edges {
      node {
        classname
        header
        image {
          relativePath
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        description
        githubLink
        applicationLink
        video {
          URL
          title
        }
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