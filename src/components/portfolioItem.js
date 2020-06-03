import React, { useRef, useEffect } from "react";
import Image from "gatsby-image";
import gsap from "gsap";

const PortfolioItem = ({ project }) => {

  useEffect(() => {
    gsap.fromTo('.portfolio__item-image, .portfolio__item-bottom',
      {
        opacity: 0,
        y: 60,
        ease: 'power4.out',
        stagger: {
          amount: .3
        }
      },
      {
        scrollTrigger: {
          trigger: '.portfolio__grid',
          start: 'top 60%',
          triggerActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
      }); 
  }, []);

  
  return (
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
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="portfolio__item-button">GitHub</a>
              <a href={project.applicationLink} target="_blank" rel="noreferrer" className="portfolio__item-button">Application</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioItem