import { Link } from "gatsby";
import React, { useEffect } from "react";
import "../styles/styles.scss";
import scrollTo from "gatsby-plugin-smoothscroll";
import gsap from "gsap";

class Header extends React.Component {
  
  constructor() {
    super();
    this.updateMenu = this.updateMenu.bind(this);
    this.state = {
      menuClicked: false,
      showMenu: false,
      isLoaded: false
    }
  }
  
  flipClass = () => {
    this.setState(prevState => ({
      menuClicked: !prevState.menuClicked
    }));
  }

  updateMenu = () => {
    if(window.innerWidth <= 750) {
      this.setState({
        showMenu: true,
        isLoaded: true
      });
    }
    else {
      this.setState({
        showMenu: false,
        menuClicked: false,
        isLoaded: true
      })
    }
  }

  componentDidMount() {
    this.updateMenu();
    window.addEventListener("resize", this.updateMenu)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateMenu)
  }

  render() {
    const { menuClicked, showMenu, isLoaded } = this.state;
    if (!isLoaded) return null;
    return(
      <section id="header">
        <header>
          <div className="inner-header">
            <div className="logo">
              <button onClick={() => scrollTo('#header')}>[HE]</button>
              <svg preserveAspectRatio="none" viewBox="0 0 24.006319 20.763124" className="logo-triangle">
                <path
                  vectorEffect="non-scaling-stroke"
                  d="m 23.677159,17.291125 c 0.914,1.523 -0.183,3.472 -1.967,3.472 H 2.2961592 c -1.78400004,0 -2.88100004,-1.949 -1.96700004,-3.472 L 10.038159,1.1111253 c 0.891,-1.48300002 3.041,-1.48000002 3.93,0 z" 
                />
              </svg>
            </div>
            {showMenu ? null :
            <div className="navigation">
              <nav>
                <button onClick={() => scrollTo('#portfolio')}>Portfolio</button>
                <button onClick={() => scrollTo('#about')}>About</button>
                <button onClick={() => scrollTo('#contact')}>Contact</button>
              </nav>
            </div>}
            {showMenu ? 
            <div className="menu-container">
              <div className={`menu${menuClicked ? " change" : ""}`} onClick={this.flipClass}>
              <div id="bar1" className="bar"></div>
              <div id="bar2" className="bar"></div>
              <div id="bar3" className="bar"></div>
              </div>
              <ul className={`menu-items${menuClicked ? " change" : ""}`}>
                <li onClick={this.flipClass}><button onClick={() => scrollTo('#portfolio')}>Portfolio</button></li>
                <li onClick={this.flipClass}><button onClick={() => scrollTo('#about')}>About</button></li>
                <li onClick={this.flipClass}><button onClick={() => scrollTo('#contact')}>Contact</button></li>
              </ul>
              <div className={`menu-drap${menuClicked ? " drap" : ""}`}></div>
              <div className={`menu-bubble${menuClicked ? " menu-circle" : ""}`}></div>
            </div>
            :
            null}
          </div>
        </header>
      </section>
    )
  }
}

export default Header
