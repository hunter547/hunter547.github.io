import React from "react";
import "../styles/styles.scss";
import scrollTo from "gatsby-plugin-smoothscroll";
import { Link } from "gatsby";
import GithubSVG from '../images/github.svg';
import LinkedInSVG from '../images/linkedin.svg';
import MediumSVG from '../images/medium.svg';

const Footer = () => {
  return(
    <section id="footer">
      <div className="footer">
        <div className="footer__left-content">
          <p>2020 &copy; | Created by Hunter Evanoff</p>
        </div>
        <div className="footer__right-content">
          <a href="https://www.github.com/hunter547" target="_blank"><img src={GithubSVG} className="footer__icon" /></a>
          <a href="https://www.linkedin.com/in/hunterevanoff" target="_blank"><img src={LinkedInSVG} className="footer__icon" /></a>
          <a href="https://medium.com/@hunterevanoff" target="_blank"><img src={MediumSVG} className="footer__icon" /></a>
        </div>
      </div>
    </section>
  )
}

export default Footer
