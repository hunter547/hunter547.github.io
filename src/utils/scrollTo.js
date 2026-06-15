/**
 * Smooth-scroll to an element matched by a CSS selector.
 * Replacement for gatsby-plugin-smoothscroll.
 *
 * @param {string} selector CSS selector passed to document.querySelector
 * @param {ScrollLogicalPosition} [blockPosition="start"]
 * @returns {boolean} false if no element matched, otherwise true
 */
const scrollTo = (selector, blockPosition = "start") => {
  const element = document.querySelector(selector)

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: blockPosition })
    return true
  }

  return false
}

export default scrollTo
