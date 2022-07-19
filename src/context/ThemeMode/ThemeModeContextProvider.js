import React, { useState } from "react";
import ThemeModeContext from "./ThemeModeContext";

const ThemeModeContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("theme-light")
  return (
    <ThemeModeContext.Provider value={[ themeMode, setThemeMode ]}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export default ThemeModeContextProvider