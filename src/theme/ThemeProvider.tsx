import React, {
  ReactNode,
  useEffect,
  createContext,
  useState,
  useContext,
} from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Apply background settings when the component mounts
  useEffect(() => {
    // You can add any initialization logic here
    // For example, check localStorage for theme preference
    const savedTheme = localStorage.getItem("theme-preference");
    if (savedTheme === "light") {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme-preference", !isDarkMode ? "dark" : "light");
    // Here you would also update the theme object with light theme values if needed
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
