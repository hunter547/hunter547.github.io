import React, { useEffect, useState } from "react";
import '../styles/components/portfolioItem.scss';
import gsap from "gsap";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import VideoModal from "./videoModal";

const PortfolioItem = ({ project, imageSrc, imageSrcSet }) => {

  useEffect(() => {
    gsap.fromTo('.portfolio__item-image, .portfolio__item-body',
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

  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <Card className={`portfolio__item ${project.classname} gap-0 overflow-hidden py-0`}>
      <div className="portfolio__item-image-container">
        <img
          src={imageSrc}
          srcSet={imageSrcSet}
          sizes="(max-width: 768px) 90vw, 45vw"
          loading="eager"
          className="portfolio__item-image opacity-0"
          alt={`${project.header} visual`} />
      </div>
      <div className="portfolio__item-text-container portfolio__item-body grow opacity-0">
        <div className="portfolio__item-text-inner flex grow flex-col rounded-[0.5rem] p-5">
          <CardHeader className="grow gap-3 px-0">
            <CardTitle className="text-xl font-bold uppercase tracking-wide">
              {project.header}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {project.description}
            </CardDescription>
          </CardHeader>
          <div className="case-links">
            <a className="case-link" href={project.githubLink} target="_blank" rel="noreferrer">
              Code <span>↗</span>
            </a>
            {project.applicationLink && (
              <a className="case-link" href={project.applicationLink} target="_blank" rel="noreferrer">
                Live <span>↗</span>
              </a>
            )}
            {project.video && (
              <button type="button" className="case-link" onClick={openModal}>
                Demo <span>↗</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <VideoModal
        video={project.video}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      />
    </Card>
  );
}

export default PortfolioItem
