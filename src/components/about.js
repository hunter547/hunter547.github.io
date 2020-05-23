import React from "react";
import {useStaticQuery, graphql} from "gatsby";
import Img from "gatsby-image";
import { Link } from "gatsby"

const About = () => {
  const data = useStaticQuery(graphql`
    query {
      code: file(relativePath: { eq: "code.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }  
  `)
  return (
    <section id="about">
      <div className="about">
        <div className="container">
          <div className="inner-section">
            <div className="content">
              <h3>The ability to develop</h3>
              <p>It is a long established fact that a reader will be distracted by
                the readable content of a page when looking at its layout. The
                point of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters, as opposed to using ‘Content here,
                content here’, making it look like readable English. Many desktop
                publishing packages and web page editors now use Lorem Ipsum as
                their default model text, and a search for ‘lorem ipsum’ will
                uncover many web sites still in their infancy. Various versions
                have evolved over the years, sometimes by accident, sometimes on
                purpose (injected humour and the like).</p>
                <div className="btn-row">
                  <Link to="/work">View projects</Link>
                </div>
            </div>
          </div>
        </div>
        <div className="black-box"></div>
        <div className="black-box overlay"></div>
      </div>
    </section>
    
  )
}

export default About