import React from "react"
import { Button } from "@/components/ui/button"

// Temporary demo proving shadcn-ui renders and tracks the site's light/dark
// theme (via the .theme-dark bridge in styles/tailwind.css). Safe to delete.
const ShadcnDemo = () => {
  return (
    <div className="my-8 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-6 text-card-foreground">
      <span className="mr-2 text-sm text-muted-foreground">shadcn/ui demo:</span>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}

export default ShadcnDemo
