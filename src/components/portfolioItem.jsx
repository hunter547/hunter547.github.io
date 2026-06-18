import React, { useEffect, useState } from "react";
import '../styles/components/portfolioItem.scss';
import '../styles/components/videoModal.scss';
import gsap from "gsap";
import Modal from "react-modal";
import { SyncLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      Modal.setAppElement('body');
  }, []);

  const override = {
    display: "block",
    position: "fixed",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    margin: "auto",
    transform: "translate(-50%, -50%)",
    borderColor: "#023440",
  }

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
          <CardFooter className="flex-wrap gap-3 px-0">
            <Button asChild variant="outline" size="sm">
              <a href={project.githubLink} target="_blank" rel="noreferrer">Code</a>
            </Button>
            {project.applicationLink ?
              <Button asChild variant="outline" size="sm">
                <a href={project.applicationLink} target="_blank" rel="noreferrer">Application</a>
              </Button>
              :
              null}
            <Button onClick={openModal} size="sm">Demo</Button>
          </CardFooter>
        </div>
      </div>
      {modalIsOpen ? <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Code Demo Video"
          className="portfolio__item-modal"
        >
          <SyncLoader
            cssOverride={override}
            color={"#023440"}
            loading={loading}
          />
          <div className="video">
            <iframe
              src={project.video.URL}
              title={project.video.title}
              className="embeded-video"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={stopLoad}
            />
          </div>
      </Modal>
      :
      null}

    </Card>
  );
}

export default PortfolioItem
