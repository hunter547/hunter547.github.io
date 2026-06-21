import { useLocation, useNavigate } from "react-router-dom"
import scrollTo from "../utils/scrollTo"

// On the home page, smooth-scroll to a section. From any other page, navigate
// home (skipping the intro) and scroll to that section once it has loaded.
export default function useSectionNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return selector => {
    if (location.pathname === "/") {
      scrollTo(selector)
    } else {
      navigate("/", { state: { skipIntro: true, scrollTo: selector } })
    }
  }
}
