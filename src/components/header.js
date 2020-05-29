import { Link } from "gatsby"
import React from "react"
import "../styles/styles.scss"

class Header extends React.Component {
  state = {
    menuClicked: false
  }
  
  flipClass = () => {
    this.setState(prevState => ({
      menuClicked: !prevState.menuClicked
    }));
  }

  render() {
    const { menuClicked } = this.state;
    return(
      <header>
        <div className="inner-header">
          <div className="logo">
            <Link to="/">[HE]</Link>
          </div>
          <div className="navigation">
            <nav>
              <Link to="/#portfolio">Portfolio</Link>
              <Link to="/#about">About</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
            <div className={`menu${menuClicked ? " change" : ""}`} onClick={this.flipClass}>
              <div id="bar1" className="bar"></div>
              <div id="bar2" className="bar"></div>
              <div id="bar3" className="bar"></div>
            </div>
            <ul className={`menu-items${menuClicked ? " change" : ""}`}>
              <li onClick={this.flipClass}><Link to="/#portfolio">Portfolio</Link></li>
              <li onClick={this.flipClass}><Link to="/#about">About</Link></li>
              <li onClick={this.flipClass}><Link to="/contact">Contact</Link></li>
            </ul>
            <div className={`menu-bubble${menuClicked ? " menu-circle" : ""}`}></div>
          </div>
      </header>
    )
  }
}

export default Header
