import React, { useEffect } from "react"
import { Link } from "gatsby"
import gsap from "gsap"
import Header from "../components/header";
import Banner from "../components/banner";
import Portfolio from "../components/portfolio";
import Footer from "../components/footer";
import About from "../components/about";
import IntroOverlay from "../components/introOverlay";

const IndexPage = () => {
  useEffect(() => {
    // Prevent flashing
    gsap.to('body', 0, {css:{visibility:'visible'}});

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
    }).to('.overlay-top', 1.6, {
      height: 0,
      ease: 'expo.inOut',
      stagger: {
        amount: 0.4
      }
    }).to('.overlay-bottom', 1.6, {
      width: 0,
      ease: 'expo.inOut',
      delay: -.8,
      stagger: {
        amount: 0.4
      }
    })
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
