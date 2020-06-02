import React, { useRef } from "react";
import { useIntersection } from "react-use";
import Image from "gatsby-image";
import gsap from "gsap";




const PortfolioItem = ({ project, setFade, fadeState }) => {

  const sectionRef = useRef(null);

  const intersection = useIntersection(sectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1
  })

  const fadeIn = (element) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 60,
        ease: 'power4.out',
        stagger: {
          amount: .3
        }
      },
      {
        opacity: 1,
        y: 0,
      });
    
    setFade();

  }

  const fadeOut = (element) => {
    //gsap.to(element, 10, {
    //  opacity: 0,
    //  y: -20,
    // ease: 'power4.out',
    //  stagger: {
    //    amount: .3
    //  }
    //})
  }
  intersection && fadeState && intersection.intersectionRatio === 1 ?
  fadeIn(".fadeIn")
  :
  fadeOut(".fadeIn")
  return (
    <div className={`portfolio__item ${project.classname}`}>
      <div className="portfolio__item-wrapper">
        <div ref={sectionRef} className="portfolio__item-image-container">
          <Image className="portfolio__item-image fadeIn" fluid={project.image.childImageSharp.fluid} />
        </div>
        <div className="portfolio__item-text-container">
          <div className="portfolio__item-bottom fadeIn">
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