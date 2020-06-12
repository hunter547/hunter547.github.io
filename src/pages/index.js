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


const introAnimation = (completeAnimation) => {
  let tl = gsap.timeline();

  tl.from(".main-text", 1.7, {
    y: 120,
    ease: "power4.out",
    delay: 1,
    stagger: {
      amount: 0.4
    },
    }).to('.row', 0, {css:{overflow:'visible'}
    }).to('.main-text:first-child', 0.6, {
      marginRight: '1%',
      ease: "power4.out"
    }).to('.main-text:nth-child(2)', 0.6, {
      marginLeft: '1%',
      delay: -0.6,
      ease: "power4.out"
    }).to('.overlay-top', 1.6, {
      height: 0,
      ease: 'expo.inOut',
      stagger: {
        amount: 0.4
      }
    }).to('.intro-overlay', 0, {
      onComplete: completeAnimation
    }).to('.main-text', 0, {
      css: { zIndex: 9}
    }).to('.react-icon, .fade-in, .float', 0, {css:{display:'block'}
    }).to('.draw-triangle', 3, {
      strokeDashoffset: 0,
    }).to('.draw-triangle', 1, {
      fill: '#023440',
      delay: -0.5
    });
}

{/*.to('.logo-triangle', 3, {
      strokeDashoffset: 0,
      delay: -3
    })*/}

{/*.to('.logo-triangle', 1, {
      fill: '#023440',
      delay: -1
    })*/}

const IndexPage = () => {

  const [animationComplete, setAnimationComplete] = useState(false);

  const completeAnimation = () => {
    setAnimationComplete(true);
  }
  
  useEffect(() => {
    // Prevent initial load flashing
    gsap.to('html, body', 0, {css:{backgroundColor:'#f2f4f5'}});
    gsap.to('.react-icon, .fade-in, .float', 0, {css:{display:'none'}});

    introAnimation(completeAnimation)
  }, [])
  return(
    <>
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
