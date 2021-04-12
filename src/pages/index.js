import React, { useEffect, useState } from "react";
import '../styles/index.scss';
import gsap from "gsap"
import Header from "../components/header";
import Banner from "../components/banner";
import Portfolio from "../components/portfolio";
import Footer from "../components/footer";
import About from "../components/about";
import SEO from "../components/seo";
import IntroOverlay from "../components/introOverlay";
import ScaleLoader from "react-spinners/ScaleLoader";
import { css } from "@emotion/core";


const introAnimation = (completeAnimation, loadingStopped) => {
  let tl = gsap.timeline();

  tl.to('.main-text',  {
      duration: 0,
      css: {color: '#f2f4f5'},
    }).from(".main-text",  {
      duration: 1.7,
      y: 120,
      ease: "power4.out",
      delay: 1,
      stagger: {
        amount: 0.4
      },
      onStart: loadingStopped
    }).to('.row', {duration: 0, css:{overflow:'visible'}
    }).to('.main-text:first-child',  {
      duration: 0.6,
      marginRight: '1%',
      ease: "power4.out"
    }).to('.main-text:nth-child(2)',  {
      duration: 0.6,
      marginLeft: '1%',
      delay: -0.6,
      ease: "power4.out"
    }).to('.overlay-top',  {
      duration: 1.6,
      height: 0,
      ease: 'expo.inOut',
      stagger: {
        amount: 0.4
      }
    }).to('.intro-overlay', {duration: 0,
      onComplete: completeAnimation
    }).to('.main-text',  {
      duration: 0,
      css: { zIndex: 9}
    }).to('.react-icon, .fade-in, .float',  {
      duration: 0,
      css:{display:'block'}
    }).to('.draw-triangle',  {
      duration: 3,
      strokeDashoffset: 0,
    }).to('.draw-triangle',  {
      duration: 1,
      fill: '#023440',
      delay: 0.5
    });
}

const IndexPage = () => {

  const [animationComplete, setAnimationComplete] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  const override = css`
    display: block;
    position: fixed;
    top: 50%;
    left: 48%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    margin: auto;
    transform: translate(-50%, -50%);
    border-color: #fdcbbf;
    z-index: 100;
    opacity: .8;
`;

  const completeAnimation = () => {
    setAnimationComplete(true);
  }

  const loadingStopped = () => {
    setAppLoading(false)
  }
  
  useEffect(() => {
    // Prevent initial load flashing
    gsap.to('html, body', {duration: 0, css:{backgroundColor:'#f2f4f5'}});
    gsap.to('.react-icon, .fade-in, .float', {duration: 0, css:{display:'none'}});

    introAnimation(completeAnimation, loadingStopped)
  }, [])
  return(
    <>
      {
        /* If the user is at the top of the page when loading, show loading bars. */
        document.body.scrollTop === 0 && (
          <ScaleLoader
            css={override}
            color={"#fdcbbf"}
            loading={appLoading}
          />
        )
      }
      <SEO />
      { animationComplete ? null : <IntroOverlay /> }
      <div className="container">
        <div className="content-wrapper">
          <Header />
          <Banner />
          <Portfolio />
          <About />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default IndexPage
