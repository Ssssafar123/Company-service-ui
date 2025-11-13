import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme } from "@radix-ui/themes";

type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
};

const ThemeToggleContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeToggle = () => {
  const ctx = useContext(ThemeToggleContext);
  if (!ctx) throw new Error("useThemeToggle must be used within ThemeProvider");
  return ctx;
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage or default to light mode
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => {
    setIsDark((s) => !s);
  };

  return (
    <Theme
      appearance={isDark ? "dark" : "light"}
      accentColor="gray"
      grayColor="slate"
      radius="large"
      scaling="100%"
      panelBackground="solid"
    >
      <ThemeToggleContext.Provider value={{ isDark, toggle }}>
        {children}
      </ThemeToggleContext.Provider>
    </Theme>
  );
}