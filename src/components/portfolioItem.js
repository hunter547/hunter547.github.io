import React, { useEffect, useState } from "react";
import '../styles/components/portfolioItem.scss';
import '../styles/components/videoModal.scss';
import Image from "gatsby-image";
import gsap from "gsap";
import Modal from "react-modal";
import SyncLoader from "react-spinners/SyncLoader";
import { css } from "@emotion/core";

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
      Modal.setAppElement('body');
  }, []);

  const override = css`
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    margin: auto;
    transform: translate(-50%, -50%);
    border-color: #023440;
`;
  
  const [modalIsOpen,setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setLoading(true);
  }
 
  const closeModal = () => {
    setIsOpen(false);
    setLoading(false)
  }

  const stopLoad = () => {
    setLoading(false);
  }

  
  return (
    <div className={`portfolio__item ${project.classname}`}>
      <div className="portfolio__item-wrapper">
        <div className="portfolio__item-image-container">
          <Image loading="eager" className="portfolio__item-image" fluid={project.image.childImageSharp.fluid} alt={`${project.header} visual`}/>
        </div>
        <div className="portfolio__item-text-container">
          <div className="portfolio__item-bottom">
            <div className="porfolio__item-details">
              <h2>{project.header}</h2>
              <p>{project.description}</p>
            </div>
            <div className="portfolio__item-button-wrapper">
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="portfolio__item-button">GitHub</a>
              {project.applicationLink ? 
                <a href={project.applicationLink} target="_blank" rel="noreferrer" className="portfolio__item-button">Application</a> 
                : 
                null}
              <button onClick={openModal} className="portfolio__item-button">Demo</button>
            </div>
          </div>
        </div>
      </div>
      {modalIsOpen ? <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Code Demo Video"
          className="portfolio__item-modal"
        >
          <SyncLoader
            css={override}
            color={"#023440"}
            loading={loading}
          />
          <div className="video">
            <embed 
              src={project.video.URL} 
              title={project.video.title}
              className="embeded-video"
              onLoad={stopLoad}
            />
          </div>
      </Modal>
      :
      null}
      
    </div>
  )
}

export default PortfolioItem