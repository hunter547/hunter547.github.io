import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "../styles/index.scss"
import gsap from "gsap"
import { ScaleLoader } from "react-spinners"
import scrollTo from "../utils/scrollTo"
import IntroContext from "../context/Intro/IntroContext"
import App from "../components/app"

const introAnimation = (loadingStopped, onComplete) => {
  let tl = gsap.timeline()

  // Reveal the header as the animation starts (overlay still covering) so the
  // sweep uncovers it — this inline display overrides `.intro-active #header`.
  tl.set("#header", { display: "block" })
    .to(".main-text", {
      duration: 0,
      css: { color: "#f2f4f5" },
    })
    .from(".main-text", {
      duration: 1.7,
      y: 180,
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
    .to(".intro-overlay", { duration: 0, onComplete })
    .to(".main-text", {
      duration: 0,
      css: { zIndex: 9 },
    })
    .to(".float-container", {
      duration: 0,
      css: { display: "block" },
    })
}

// Apply the intro's *final* state instantly — used when returning from a niche
// page so the banner is visible without replaying the overlay reveal.
const jumpToEnd = () => {
  gsap.set(".main-text", { color: "#f2f4f5", zIndex: 9 })
  gsap.set(".main-text:first-child", { marginRight: "1%" })
  gsap.set(".main-text:nth-child(2)", { marginLeft: "1%" })
  gsap.set(".row", { overflow: "visible" })
  gsap.set(".float-container", { display: "block" })
}

const IndexPage = () => {
  const location = useLocation()
  const { completeIntro } = useContext(IntroContext)
  const skipIntro = Boolean(location.state?.skipIntro)
  const [appLoading, setAppLoading] = useState(!skipIntro)

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

  const loadingStopped = () => {
    setAppLoading(false)
  }

  // useLayoutEffect so the intro's initial state is applied before the browser
  // paints — otherwise the banner flashes at its final position (and the footer
  // shows) for one frame before the animation/overlay take over.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (skipIntro) {
        jumpToEnd()
        completeIntro()
        return
      }

      gsap.to(".float-container", {
        duration: 0,
        css: { display: "none" },
      })

      introAnimation(loadingStopped, completeIntro)
    })

    return () => ctx.revert()
  }, [skipIntro])

  // When arriving from another page's nav (e.g. Projects/About), scroll to the
  // requested section once the page has rendered and the transition settled.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return undefined
    const id = setTimeout(() => scrollTo(target), 400)
    return () => clearTimeout(id)
  }, [location.state])

  return (
    <>
      <ScaleLoader
        cssOverride={override}
        color={"#fdcbbf"}
        loading={appLoading}
      />
      <App />
    </>
  )
}

export default IndexPage
