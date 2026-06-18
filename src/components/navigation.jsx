import React from "react"

import { cn } from "@/lib/utils"
import scrollTo from "../utils/scrollTo"
import portfolioData from "../data/portfolioData.json"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const handleScroll = (e, selector) => {
  e.preventDefault()
  scrollTo(selector)
}

export default function Navigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem className="flex">
          <NavigationMenuTrigger className="text-xs uppercase tracking-[0.109375rem]">
            Projects
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[36rem] grid-cols-[.8fr_1fr_1fr] grid-rows-3 gap-3 p-4">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    href="#portfolio"
                    onClick={e => handleScroll(e, "#portfolio")}
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
                  onClick={e => handleScroll(e, "#portfolio")}
                >
                  {project.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex">
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              "text-xs uppercase tracking-[0.109375rem]"
            )}
            asChild
          >
            <a href="#about" onClick={e => handleScroll(e, "#about")}>
              About
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({ className, title, children, ...props }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
