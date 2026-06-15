import React from "react";
import "../styles/components/footer.scss";
import GithubSVG from '../images/github.svg';
import LinkedInSVG from '../images/linkedin.svg';
import MediumSVG from '../images/medium.svg';

const Footer = () => {
  return(
    <section id="footer">
      <div className="footer">
        <div className="footer__left-content">
          <p>{new Date().getFullYear()} &copy; | Created by Hunter Evanoff</p>
        </div>
        <div className="footer__right-content">
          <a href="https://www.github.com/hunter547" target="_blank" rel="noreferrer"><img src={GithubSVG} alt="Github icon" className="footer__icon" width="32px"/></a>
          <a href="https://www.linkedin.com/in/hunterevanoff" target="_blank" rel="noreferrer"><img src={LinkedInSVG} alt="LinkedIn icon" className="footer__icon" width="32px"/></a>
          <a href="https://medium.com/@hunterevanoff" target="_blank" rel="noreferrer"><img src={MediumSVG} alt="Medium icon" className="footer__icon" width="32px"/></a>
        </div>
      </div>
    </section>
  )
}

export default Footer
