import React, { createContext, useContext, useState } from "react";
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
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark((s) => !s);

  return (
    <Theme
      appearance={isDark ? "dark" : "light"}
      accentColor="pink"
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