import "../styles/Board.css";
import { useState, useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  return (
    <Component {...pageProps} darkMode={darkMode} setDarkMode={setDarkMode} />
  );
}
