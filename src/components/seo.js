import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const SEO = () => {
  const data = useStaticQuery(graphql`
  {
    site {
      siteMetadata {
        title
        description
        author
        url
      }
    }
  }
`);

  const {
    title,
    description,
    author,
    url
  } = data.site.siteMetadata;

  return (
    <Helmet
      title = {title}
      titleTemplate={`%s | Developer`}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:image`,
          content: `https://evanoff.dev/ogImage.png`
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: description,
        },
      ]}
      link={[
        {
          rel: 'canonical',
          href: url
        }
      ]}
    />
  )

}

export default SEO