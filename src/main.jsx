import React from "react"
import { createRoot } from "react-dom/client"
import "./styles/tailwind.css"
import IndexPage from "./pages/index"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IndexPage />
  </React.StrictMode>
)
