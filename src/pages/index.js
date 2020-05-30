import React from "react"
import { Link } from "gatsby"

import Header from "../components/header";
import Banner from "../components/banner";
import Portfolio from "../components/portfolio";
import Footer from "../components/footer";

const IndexPage = () => (
  <div className="container">
    <div className="content-wrapper">
      <Header />
      <Banner />
      <Portfolio />
    </div>
    <Footer />
  </div>
)

export default IndexPage
