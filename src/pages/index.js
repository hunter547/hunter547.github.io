import React from "react"
import { Link } from "gatsby"

import Header from "../components/header";
import Banner from "../components/banner";
import Portfolio from "../components/portfolio";

const IndexPage = () => (
  <div className="container">
    <Header />
    <Banner />
    <Portfolio />
  </div>
)

export default IndexPage
