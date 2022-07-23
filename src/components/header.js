import React, { useState, useContext } from "react";
import "../styles/components/header.scss";
import scrollTo from "gatsby-plugin-smoothscroll";
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext";

const Header = () => {
  
  const [menuClicked, setMenuClicked] = useState(false);
  const [themeMode, setThemeMode] = useContext(ThemeModeContext)
  const checked = Boolean(themeMode === "theme-dark")

  const flipClass = () => {
    setMenuClicked(!menuClicked);
  }
  
  return(
      <section id="header">
        <header>
          <div className="translate-header">
            <div className="inner-header">
              <div className="logo">
                <button onClick={() => scrollTo('#header')}>&#123;HE&#125;</button>
              </div>
              <div className="nav-and-mode-container">
                {!menuClicked && (
                  <label className="icon-switcher" >
                    <input 
                      className="control" 
                      type="checkbox" 
                      checked={checked} 
                      onChange={() => setThemeMode(`theme-${checked ? "light" : "dark"}`)} />
                    <div className="peg"></div>
                    <div className="bg"></div>
                  </label>
                )}
                <div className="navigation">
                  <nav>
                    <button onClick={() => scrollTo('#portfolio')}><span data-hover="Portfolio">Portfolio</span></button>
                    <button onClick={() => scrollTo('#about')}><span data-hover="About">About</span></button>
                    <a href="/Hunter-Evanoff-2021-Resume.pdf" target="_blank">Resume</a>
                  </nav>
                </div>
              </div>
              <div className="menu-container">
                <div className={`menu${menuClicked ? " change" : ""}`} onClick={flipClass}>
                <div id="bar1" className="bar"></div>
                <div id="bar2" className="bar"></div>
                <div id="bar3" className="bar"></div>
                </div>
                <ul className={`menu-items${menuClicked ? " change" : ""}`}>
                  <li onClick={flipClass}><button onClick={() => scrollTo('#portfolio')}>Portfolio</button></li>
                  <li onClick={flipClass}><button onClick={() => scrollTo('#about')}>About</button></li>
                  <li onClick={flipClass}><a href="/Hunter-Evanoff-2021-Resume.pdf" target="_blank">Resume</a></li>
                </ul>
                <div className={`menu-drape${menuClicked ? " drape" : ""}`}></div>
                <div className={`menu-bubble${menuClicked ? " menu-circle" : ""}`}></div>
              </div>
            </div>
          </div>
        </header>
      </section>
    )
}

export default Header
