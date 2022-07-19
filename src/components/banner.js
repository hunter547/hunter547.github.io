import React from "react";
import '../styles/components/banner.scss';
import LoopTypewriter from './loopTypewriter';
import scrollTo from "gatsby-plugin-smoothscroll";

const Banner = () => {
  const skills = ["React", "JavaScript", "CSS", "Gatsby","Redux"];
  return (
    <div className="banner">
      <div className="row">
          <div className="main-text">Hunter</div>
          <div className="main-text">Evanoff</div>
          <div className="float-container">
              <svg preserveAspectRatio="none" viewBox="0 0 24.006319 20.763124" className="draw-triangle triangle-fill spin">
                <path
                  vectorEffect="non-scaling-stroke"
                  d="m 23.677159,17.291125 c 0.914,1.523 -0.183,3.472 -1.967,3.472 H 2.2961592 c -1.78400004,0 -2.88100004,-1.949 -1.96700004,-3.472 L 10.038159,1.1111253 c 0.891,-1.48300002 3.041,-1.48000002 3.93,0 z" 
                />
              </svg>
          </div>
        <LoopTypewriter dataText={skills} />
      </div>
      <button className="scroll-label" onClick={() => scrollTo('#portfolio')}><span></span>Scroll</button>
        {/*<div className="fixed-misc">Full Stack Web Developer</div>*/}
    </div>
  )
}

export default Banner