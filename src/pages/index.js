import React, { useEffect } from "react"
import gsap from "gsap"
import Header from "../components/header";
import Banner from "../components/banner";
import Portfolio from "../components/portfolio";
import Footer from "../components/footer";
import About from "../components/about";
import IntroOverlay from "../components/introOverlay";

const IndexPage = () => {
  useEffect(() => {
    // Prevent initial load flashing
    gsap.to('body', 0, {css:{visibility:'visible'}});
    gsap.to('.react-icon, .fade-in, .float', 0, {css:{display:'none'}})

    let tl = gsap.timeline();

    tl.from(".main-text", 1, {
      y: 100,
      ease: "power4.out",
      delay: 1,
      skewY: 3,
      stagger: {
        amount: 0.3
      },
      opacity: 0,
      }).to('.main-text:first-child', 0.6, {
        marginRight: '1.5%',
        ease: "power4.out"
      }).to('.main-text:nth-child(2)', 0.6, {
        marginLeft: '1.5%',
        delay: -0.6,
        ease: "power4.out"
      }).to('.overlay-top', 1.6, {
        height: 0,
        ease: 'expo.inOut',
        stagger: {
          amount: 0.4
        }
      }).to('.intro-overlay', 0, {
        css:{ display:'none' }
      }).to('.main-text', 0, {
        css: { zIndex: 9}
      }).to('.react-icon, .fade-in, .float', 0, {css:{display:'block'}});
  }, [])
  return(
    <>
    <IntroOverlay />
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
