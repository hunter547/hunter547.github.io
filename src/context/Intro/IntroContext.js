import { createContext } from "react";

// Shared so the home page can tell the persistent layout when the intro is
// finished — the layout hides the footer (and shows the overlay) until then.
const IntroContext = createContext({
  introDone: true,
  completeIntro: () => {},
});

export default IntroContext;
