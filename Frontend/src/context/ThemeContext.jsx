import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext =
  createContext();

export const ThemeProvider = ({
  children,
}) => {
  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "darkMode"
        ) === "true"
      );
    });

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      darkMode
    );

    if (darkMode) {
      document.body.classList.add(
        "dark-theme"
      );
    } else {
      document.body.classList.remove(
        "dark-theme"
      );
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);