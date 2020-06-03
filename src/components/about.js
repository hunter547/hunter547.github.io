import React from "react";
import Profile from "../images/IMG_6155.jpg";

const About = () => {
  return (
    <section id="about">
      <div className="about">
        <div className="about__container">
          <div className="about__picture-container">
            <img src={Profile} className="about__profile-picture" width="230px"/>
          </div>
          <div className="about__text-container">
            <h3>Meet Hunter</h3>
            <h4>An accounting graduate turned developer, coding an enjoyable career</h4>
            <p>Hi there, I'm Hunter, a driven web developer with a passion for aesthetic UI, 
              backend server processing, and web animation. I started coding in 2016 when pursing a 
              double major in Computer Information Systems to reach the 150 credits required to take 
              the CPA exam. I had completed my 120 credit accounting program, meaning I lived
              and breathed code for a year, surpassing many of my classmates on programming assignments 
              who had been taking the major for 3 years. For the first time, I was enjoying assignments and
              often went above and beyond to make my validation more robust, make a more engaging UI, or expand
              on a required feature. After graduating with a double major, I decided to pursue my new passion
              of software development.
              <br></br>
              <br></br>
              I started working as a developer at James Madison University in October, 2017. I learned
              a whole new tech stack quickly, coding app engines within my first two months and rapidly absorbing
              how to build rapport and elicit requirements from customers. I started running meetings with customers
              and developing the projects based on the requirements gathered. This job has taught me to be a better
              developer, comminicater, and write meaniful documentation. This job has also taught me the importance
              of standards surrounding test vs production instances, the move to production process, and performing
              detailed technical reviews. JMU works with the Kanban framework on major products in order to meet 
              strict deadlines. Bottomline, JMU has taught me a lot about being a knowledgable and communicative 
              developer. 
              <br></br>
              <br></br>
              JMU's CRM solution, Oracle's PeopleSoft, will be discontinued in less than 10 years. It was a wake up 
              call that my development knowledge can't be solely focused on PeopleSoft. I decided to learn the 
              most marketable development skills of full stack web development in mid 2019. I graduated from CareerFoundry's
              Full Stack Web Development bootcamp in June, 2020. During my time at the bootcamp, I spent upwards of 30
              hours a week for 8 months learning web development, along side my full time job at JMU. The course started
              from the basics of HTML and CSS all the way to a full stack web application using Node.js, a hand built API, 
              and MongoDB backend with a React and Bootstrap UI frontend. My projects are located above, please take a look.
              This web development bootcamp gave me the confidence and knowledge to realize extremely responsive and engaging
              applications on the web. With my years of coding experience prior to this course and my current knowledge of 
              web development, I can offer a large array of skills to any project.
              </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About