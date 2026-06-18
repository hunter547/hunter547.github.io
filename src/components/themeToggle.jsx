import React, { useContext } from "react";
import "../styles/components/header.scss";
import ThemeModeContext from "../context/ThemeMode/ThemeModeContext";

// The original hand-built sun/moon slider, relocated into the navbar.
const ThemeToggle = () => {
  const [themeMode, setThemeMode] = useContext(ThemeModeContext);
  const checked = themeMode === "theme-dark";

  return (
    <label className="icon-switcher">
      <input
        className="control"
        type="checkbox"
        checked={checked}
        onChange={() => setThemeMode(`theme-${checked ? "light" : "dark"}`)}
      />
      <div className="peg"></div>
      <div className="bg"></div>
    </label>
  );
};

export default ThemeToggle;
