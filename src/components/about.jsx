import React, { useEffect, useState } from "react"
import "../styles/components/about.scss"
import gsap from "gsap"
import Typewriter from "./typewriter"
import portraitSrcSet from "../images/IMG_6155.jpg?w=300;600;900&format=webp&as=srcset"
import portraitSrc from "../images/IMG_6155.jpg?w=600&format=webp"

const About = () => {
  const [doType, setDoType] = useState(false)

  const startTyping = () => {
    setDoType(true)
  }

  useEffect(() => {
    gsap.to(".about__text-container h3", {
      scrollTrigger: {
        trigger: ".about__text-container",
        start: "top 99%",
        triggerActions: "play none none none",
      },
      onComplete: startTyping,
    })
  })
  return (
    <section id="about">
      <div className="about">
        <div className="about__container">
          <div className="about__picture-container">
            <div className="about__picture-frame">
              <img
                src={portraitSrc}
                srcSet={portraitSrcSet}
                sizes="(max-width: 600px) 90vw, 232px"
                loading="eager"
                className="about__profile-picture"
                alt="Image of Hunter Evanoff"
              />
            </div>
          </div>
          <div className="about__text-container">
            {!doType ? (
              <h3></h3>
            ) : (
              <h3>
                <Typewriter dataText="Meet Hunter" />
              </h3>
            )}
            <h4>
              An accounting graduate turned developer, coding an enjoyable
              career
            </h4>
            <p>
              I'm a driven web developer with a passion for aesthetic UI, server
              side processing, and web animation. I’ve been working as a
              software developer for the past 5 years. With a demonstrated
              history of building scalable consumer applications in the
              government, public, and private sector, my exposure to developing
              different kinds of applications is expansive. This background has
              made me adaptable in shifting environments, high attention to
              detail on customer needs, and efficient at researching the right
              tools to get the job done.
            </p>
            <p>
              In my free time, I enjoy spending time with my wife, my son, and
              our two Great Danes. I have a 1985 motorcycle that I've been
              repairing and retrofitting as a hobby. I get to occasionally ride
              it when it's in the mood. I enjoy 3D modeling with Blender to make
              photorealistic models. Finally, not surprisingly, I love coding
              and creating immersive apps outside of work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
