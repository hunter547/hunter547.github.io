import React from "react"
import "../styles/components/header.scss"
import useSectionNav from "../hooks/useSectionNav"
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar"
import Navigation from "./navigation"
import MobileMenu from "./mobileMenu"
import ThemeToggle from "./themeToggle"

const Header = () => {
  const sectionNav = useSectionNav()

  return (
    <header
      id="header"
      className="absolute inset-x-0 top-0 z-10 px-[5%] pt-2 pb-4"
    >
      <div className="relative">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href="#header"
              onClick={e => {
                e.preventDefault()
                sectionNav("#header")
              }}
              className="flex items-center gap-2 text-base font-bold tracking-[0.09375rem]"
            >
              {"{HE}"}
            </a>
          </NavbarLeft>
          <NavbarRight>
            <Navigation />
            <a
              href="/Hunter Evanoff - Full Stack Software Engineer.pdf"
              target="_blank"
              rel="noreferrer"
              className="resume-link hidden text-xs uppercase tracking-[0.109375rem] -my-[0.3125rem] md:block"
            >
              Resume
            </a>
            {/* Visible on every breakpoint. On mobile the right margin keeps it
                clear of the StaggeredMenu's fixed +/× toggle in the corner. */}
            <span className="mr-12 md:mr-0">
              <ThemeToggle />
            </span>
          </NavbarRight>
        </NavbarComponent>
      </div>
      <MobileMenu />
    </header>
  )
}

export default Header
