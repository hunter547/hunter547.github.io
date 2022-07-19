import React, { useContext } from "react"
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext"
import About from "./about"
import Banner from "./banner"
import Footer from "./footer"
import Header from "./header"
import Portfolio from "./portfolio"

const App = () => {
  const [themeMode,] = useContext(ThemeModeContext)
  return (
    <div className={themeMode}>
      <div className="container">
        <div className="content-wrapper">
          <Header />
          <Banner />
          <Portfolio />
          <About />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
