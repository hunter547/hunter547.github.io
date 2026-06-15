import React from "react"
import { createRoot } from "react-dom/client"
import IndexPage from "./pages/index"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IndexPage />
  </React.StrictMode>
)
