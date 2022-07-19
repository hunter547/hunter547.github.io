import React, { useEffect, useState } from "react"
import "../styles/index.scss"
import gsap from "gsap"
import SEO from "../components/seo"
import IntroOverlay from "../components/introOverlay"
import ScaleLoader from "react-spinners/ScaleLoader"
import ThemeModeContextProvider from "../context/ThemeMode/ThemeModeContextProvider"
import App from "../components/app"

const introAnimation = (completeAnimation, loadingStopped) => {
  let tl = gsap.timeline()

  tl.to(".main-text", {
    duration: 0,
    css: { color: "#f2f4f5" },
  })
    .from(".main-text", {
      duration: 1.7,
      y: 120,
      ease: "power4.out",
      delay: 1,
      stagger: {
        amount: 0.4,
      },
      onStart: loadingStopped,
    })
    .to(".row", { duration: 0, css: { overflow: "visible" } })
    .to(".main-text:first-child", {
      duration: 0.6,
      marginRight: "1%",
      ease: "power4.out",
    })
    .to(".main-text:nth-child(2)", {
      duration: 0.6,
      marginLeft: "1%",
      delay: -0.6,
      ease: "power4.out",
    })
    .to(".overlay-top", {
      duration: 1.6,
      height: 0,
      ease: "expo.inOut",
      stagger: {
        amount: 0.4,
      },
    })
    .to(".intro-overlay", { duration: 0, onComplete: completeAnimation })
    .to(".main-text", {
      duration: 0,
      css: { zIndex: 9 },
    })
    .to(".float-container", {
      duration: 0,
      css: { display: "block" },
    })
    .to(".draw-triangle", {
      duration: 3,
      strokeDashoffset: 0,
    })
}

const IndexPage = () => {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [appLoading, setAppLoading] = useState(true)

  const override = {
    display: "block",
    position: "fixed",
    top: "50%",
    left: "48%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    margin: "auto",
    transform: "translate(-50%, -50%)",
    borderColor: "#fdcbbf",
    zIndex: 100,
  }

  const completeAnimation = () => {
    setAnimationComplete(true)
  }

  const loadingStopped = () => {
    setAppLoading(false)
  }

  useEffect(() => {
    gsap.to(".float-container", {
      duration: 0,
      css: { display: "none" },
    })

    introAnimation(completeAnimation, loadingStopped)
  }, [])

  return (
    <ThemeModeContextProvider>
      <ScaleLoader cssOverride={override} color={"#fdcbbf"} loading={appLoading} />
      <SEO />
      {animationComplete ? null : <IntroOverlay />}
      <App />
    </ThemeModeContextProvider>
  )
}

export default IndexPage
