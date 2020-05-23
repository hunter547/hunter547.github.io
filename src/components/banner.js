import React from "react";
import ReactSVG from '../../assets/smooth-triangle.svg';
import BannerTypewriter from './bannerTypewriter';

const Banner = () => {
  const skills = ["React", "JavaScript", "CSS", "Gatsby","Redux"]
  return (
    <div className="banner">
      <div className="container">
        <div className="row">
            <div className="main-text">Hunter Evanoff</div>
            <div className="fade-in">
              <div className="float">
                <img src={ReactSVG} className="react-icon spin" />
              </div>
            </div>
        </div>
        <BannerTypewriter dataText={skills}/>
        <div className="scroll">
          <span>Scroll down</span>
        </div>
      </div>
      <div className="fixed-misc">Full Stack Web Developer</div>
    </div>
  )
}

export default Banner