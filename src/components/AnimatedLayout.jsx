import React, { useCallback, useContext, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useLocation, useOutlet } from "react-router-dom"
import ThemeModeContextProvider from "../context/ThemeMode/ThemeModeContextProvider"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"
import IntroContext from "../context/Intro/IntroContext"
import Header from "./header"
import Footer from "./footer"
import IntroOverlay from "./introOverlay"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
}

// Freeze the outlet at mount so an exiting page keeps rendering its own
// content during the transition (the data router swaps the outlet instantly).
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

// Only the page content lives inside AnimatePresence, so the header/footer
// around it stay mounted and never transition.
function PageTransitions() {
  const location = useLocation()

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
  }, [])

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <FrozenOutlet />
      </motion.div>
    </AnimatePresence>
  )
}

function Shell() {
  const [themeMode] = useContext(ThemeModeContext)
  const location = useLocation()
  const [introDone, setIntroDone] = useState(false)
  const completeIntro = useCallback(() => setIntroDone(true), [])

  const isHome = location.pathname === "/"
  const skipIntro = Boolean(location.state?.skipIntro)
  // While the home intro runs: show the overlay, hide the footer (kept out of
  // the DOM so it can't flash), and add `.intro-active` so the header is hidden
  // via CSS (it stays mounted, so the persistent navbar never remounts).
  const showIntro = isHome && !skipIntro && !introDone
  const hideChrome = isHome && !introDone

  return (
    <IntroContext.Provider value={{ introDone, completeIntro }}>
      <div className={hideChrome ? `${themeMode} intro-active` : themeMode}>
        <div className="container">
          {showIntro && <IntroOverlay />}
          <Header />
          <div className="content-wrapper">
            <PageTransitions />
          </div>
          {!hideChrome && <Footer />}
        </div>
      </div>
    </IntroContext.Provider>
  )
}

export default function AnimatedLayout() {
  return (
    <ThemeModeContextProvider>
      <Shell />
    </ThemeModeContextProvider>
  )
}
