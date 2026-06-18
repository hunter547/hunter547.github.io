import React from "react"
import About from "./about"
import Banner from "./banner"
import Portfolio from "./portfolio"
import TradeSimulator from "./tradeSimulator"

// The home page content only. The theme wrapper, container, header and footer
// are provided by the persistent layout (AnimatedLayout).
const App = () => {
  return (
    <>
      <Banner />
      <Portfolio />
      <TradeSimulator />
      <About />
    </>
  )
}

export default App
