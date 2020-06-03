import React from "react";
import ReactSVG from '../../assets/smooth-triangle.svg';
import BannerTypewriter from './bannerTypewriter';

const Banner = () => {
  const skills = ["React", "JavaScript", "CSS", "Gatsby","Redux"];
  return (
    <div className="banner">
      <div className="row">
          <div className="main-text">Hunter</div>
          <div className="main-text">Evanoff</div>
          <div className="fade-in">
            <div className="float">
              <img src={ReactSVG} className="react-icon spin" width="300px"/>
            </div>
          </div>
        <BannerTypewriter dataText={skills}/>
      </div>
      <div className="scroll">
        <span>Scroll down</span>
      </div>
        {/*<div className="fixed-misc">Full Stack Web Developer</div>*/}
    </div>
  )
}

export default Banner