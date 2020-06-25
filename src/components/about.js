import React, { useEffect, useState } from "react";
import '../styles/components/about.scss';
import { useStaticQuery, graphql } from "gatsby";
import Image from "gatsby-image";
import gsap from "gsap";
import Typewriter from "./typewriter";

const About = () => {
  const [doType, setDoType] = useState(false);

  const startTyping = () => {
    setDoType(true);
  }

  useEffect(() => {
    gsap.to('.about__text-container h3', {
      scrollTrigger: {
        trigger: '.about__text-container',
        start: 'top 99%',
        triggerActions: 'play none none none'
      },
      onComplete: startTyping
    });
  });
  const data = useStaticQuery(graphql`
      query {
        portrait: file(relativePath: { eq: "IMG_6155.jpg" }) {
          childImageSharp {
            fluid(quality:100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
  `);
  return (
    <section id="about">
      <div className="about">
        <div className="about__container">
          <div className="about__picture-container">
            <div className="about__picture-frame">
              <Image loading="eager" fluid={data.portrait.childImageSharp.fluid} className="about__profile-picture" />
            </div>
          </div>
          <div className="about__text-container">
            {!doType ? 
             <h3></h3>
             :
             <h3><Typewriter dataText="Meet Hunter" /></h3>
            }
            <h4>An accounting graduate turned developer, coding an enjoyable career</h4>
            <p>
              Hi there, I'm Hunter, a driven web developer with a passion for aesthetic UI, 
              server side processing, and web animation. I’ve been working as a software 
              developer during the past 3 years for James Madison University. In that time I've developed and pushed many projects
              from beginning to end, collaborated with customers and coworkers in a team setting, written detailed documentation, 
              use code versioning tools, and test products thoroughly for quality assurance.
            </p>
            <p>
              I also completed CareerFoundry's
              Full Stack Web Development bootcamp. During my time at the bootcamp, I spent upwards of 30
              hours a week for 8 months learning web development, along side my full time job at JMU. The course started
              from the basics of HTML and CSS all the way to a full stack web application using Node.js, a hand built API, 
              and MongoDB backend with a React and Bootstrap UI frontend. My projects are located above, please take a look. 
              With my years of coding experience prior to this course and my current knowledge of web development, I can offer 
              a large array of skills to any project.
            </p>
            <p>
              In my free time, I enjoy spending time with my wife, and our great dane Zeus. We all enjoy hiking in the 
              Appalachian range or sitting around the campfire together. I have a 1985 motorcycle that I've been repairing and retrofitting 
              as a hobby. I get to occasionally ride it when it's in the mood. I also enjoy 3D modeling with Blender 
              to make photorealistic models. Finally, not surprisingly, I love coding and creating immersive apps outside of work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About