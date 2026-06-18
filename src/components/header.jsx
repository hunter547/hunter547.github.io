import React, { useCallback, useRef, useState } from "react"
import "../styles/components/header.scss"
import { Menu } from "lucide-react"
import scrollTo from "../utils/scrollTo"
import { Button } from "@/components/ui/button"
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Navigation from "./navigation"
import ThemeToggle from "./themeToggle"

const SHEET_CLOSE_DURATION = 300

const mobileLinks = [
  { text: "Portfolio", href: "#portfolio" },
  { text: "About", href: "#about" },
]

const Header = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const timeoutRef = useRef(null)

  // Close the sheet first, then scroll once it has animated out.
  const handleMobileLinkClick = useCallback((e, selector) => {
    e.preventDefault()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setSheetOpen(false)
    timeoutRef.current = setTimeout(
      () => scrollTo(selector),
      SHEET_CLOSE_DURATION
    )
  }, [])

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
                scrollTo("#header")
              }}
              className="flex items-center gap-2 text-base font-bold tracking-[0.09375rem]"
            >
              {"{HE}"}
            </a>
          </NavbarLeft>
          <NavbarRight>
            <Navigation />
            <a
              href="/Hunter-Evanoff-2021-Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="resume-link hidden text-xs uppercase tracking-[0.109375rem] -my-[0.3125rem] md:block"
            >
              Resume
            </a>
            <ThemeToggle />
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="grid gap-6 p-6 text-lg font-medium">
                  <a
                    href="#header"
                    className="flex items-center gap-2 text-xl font-bold"
                    onClick={e => handleMobileLinkClick(e, "#header")}
                  >
                    Hunter Evanoff
                  </a>
                  {mobileLinks.map(link => (
                    <a
                      key={link.text}
                      href={link.href}
                      className="text-muted-foreground uppercase tracking-[0.109375rem] hover:text-foreground"
                      onClick={e => handleMobileLinkClick(e, link.href)}
                    >
                      {link.text}
                    </a>
                  ))}
                  <a
                    href="/Hunter-Evanoff-2021-Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground uppercase tracking-[0.109375rem] hover:text-foreground"
                  >
                    Resume
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  )
}

export default Header
