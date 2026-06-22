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
              An accounting graduate turned full-stack engineer, coding an
              enjoyable career
            </h4>
            <p>
              I'm a full-stack engineer drawn to aesthetic UI, server-side
              processing, and the systems work in between. For the past eight
              years I've shipped scalable consumer applications across the
              government, public, and private sectors — currently building
              backend APIs and recommendation systems for Samsung's Gaming Hub,
              which streams games to smart TVs for over 100 million monthly
              users. Before that I built cyber resiliency platforms, government
              cloud applications, and security dashboards for NORAD, the Air
              Force, and Space Force. That range has made me adaptable in
              shifting environments, attentive to what customers actually need,
              and quick to find the right tool for the job.
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
