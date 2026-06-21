import "./styles/tailwind.css"
import "./styles/index.scss"
import { ViteReactSSG } from "vite-react-ssg"
import { routes } from "./routes"

export const createRoot = ViteReactSSG({ routes })
