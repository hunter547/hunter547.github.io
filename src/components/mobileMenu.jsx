import React, { useContext, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"

import StaggeredMenu from "./StaggeredMenu"
import useSectionNav from "../hooks/useSectionNav"
import niches from "../data/niches.json"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"

// Mirror the desktop navigation: Projects (scroll), each niche (route),
// About (scroll), and the resume PDF (new tab).
const menuItems = [
  { label: "Projects", link: "#portfolio", ariaLabel: "Jump to projects" },
  ...niches.map(niche => ({
    label: niche.title,
    link: `/niches/${niche.slug}`,
    ariaLabel: `View ${niche.title}`,
  })),
  { label: "About", link: "#about", ariaLabel: "Jump to the about section" },
  {
    label: "Resume",
    link: "/Hunter Evanoff - Full Stack Software Engineer.pdf",
    ariaLabel: "Open resume in a new tab",
    external: true,
  },
]

const socialItems = [
  { label: "GitHub", link: "https://www.github.com/hunter547" },
  { label: "LinkedIn", link: "https://www.linkedin.com/in/hunterevanoff" },
  { label: "Medium", link: "https://medium.com/@hunterevanoff" },
]

const MobileMenu = () => {
  const navigate = useNavigate()
  const sectionNav = useSectionNav()
  const [themeMode] = useContext(ThemeModeContext)

  // gsap drives the panel via useLayoutEffect, so only mount after hydration
  // to avoid SSR/hydration mismatches with the static markup.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const handleItemClick = (e, item) => {
    if (item.link.startsWith("#")) {
      e.preventDefault()
      sectionNav(item.link)
    } else if (item.external) {
      e.preventDefault()
      window.open(item.link, "_blank", "noopener,noreferrer")
    } else if (item.link.startsWith("/")) {
      e.preventDefault()
      navigate(item.link)
    }
  }

  const dark = themeMode === "theme-dark"

  // Portal to <body> so the fixed overlay is anchored to the viewport and isn't
  // trapped inside the header's (absolute, z-10) stacking context.
  return createPortal(
    <div className="md:hidden">
      <StaggeredMenu
        position="right"
        isFixed
        displayLogo={false}
        items={menuItems}
        socialItems={socialItems}
        onItemClick={handleItemClick}
        colors={["#023440", "#0a5566"]}
        accentColor="#ce0057"
        menuButtonColor={dark ? "#fff" : "#023440"}
        openMenuButtonColor="#111"
      />
    </div>,
    document.body
  )
}

export default MobileMenu
