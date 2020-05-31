import React from "react"
import { Link } from "gatsby"

import Header from "../components/header";
import Banner from "../components/banner";
import Portfolio from "../components/portfolio";
import Footer from "../components/footer";
import About from "../components/about";

const IndexPage = () => (
  <div className="container">
    <div className="content-wrapper">
      <Header />
      <Banner />
      <Portfolio />
      <About />
    </div>
    <Footer />
  </div>
)

export default IndexPage
