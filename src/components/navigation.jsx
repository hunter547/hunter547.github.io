import React from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"
import useSectionNav from "../hooks/useSectionNav"
import portfolioData from "../data/portfolioData.json"
import niches from "../data/niches.json"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function Navigation() {
  const sectionNav = useSectionNav()
  const go = (e, selector) => {
    e.preventDefault()
    sectionNav(selector)
  }

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-xs uppercase tracking-[0.109375rem]">
            Projects
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[36rem] grid-cols-[.8fr_1fr_1fr] grid-rows-3 gap-3 p-4">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    href="#portfolio"
                    onClick={e => go(e, "#portfolio")}
                    className="from-muted/40 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      Development Projects
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      A selection of full-stack apps, packages, and experiments
                      I&apos;ve built.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {portfolioData.map(project => (
                <ListItem
                  key={project.classname}
                  title={project.header}
                  href="#portfolio"
                  onClick={e => go(e, "#portfolio")}
                >
                  {project.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-xs uppercase tracking-[0.109375rem]">
            Niches
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[30rem] grid-cols-[.8fr_1fr] grid-rows-3 gap-3 p-4">
              <li className="row-span-3">
                <div className="from-muted/40 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 select-none">
                  <div className="mt-4 mb-2 text-lg font-medium">Niches</div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    Focused areas I design and build specialized web apps for.
                  </p>
                </div>
              </li>
              {niches.map(niche => (
                <ListItem
                  key={niche.slug}
                  title={niche.title}
                  to={`/niches/${niche.slug}`}
                >
                  {niche.tagline}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              "text-xs uppercase tracking-[0.109375rem]"
            )}
            asChild
          >
            <a href="#about" onClick={e => go(e, "#about")}>
              About
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({ className, title, children, to, ...props }) {
  const classes = cn(
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
    className
  )
  const content = (
    <>
      <div className="text-sm leading-none font-medium">{title}</div>
      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
        {children}
      </p>
    </>
  )

  return (
    <li>
      <NavigationMenuLink asChild>
        {to ? (
          <Link to={to} data-slot="list-item" className={classes}>
            {content}
          </Link>
        ) : (
          <a data-slot="list-item" className={classes} {...props}>
            {content}
          </a>
        )}
      </NavigationMenuLink>
    </li>
  )
}
