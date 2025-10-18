import { useState } from "react";
import { Theme } from "@radix-ui/themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <Theme
      appearance={isDark ? "dark" : "light"}
      accentColor="orange"        // Change to your preferred accent
      grayColor="slate"         // Change to your preferred neutral
      radius="large"
      scaling="100%"
      panelBackground="solid"
    >
      <div style={{ display: "flex", justifyContent: "end", padding: "1rem" }}>
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            background: "transparent",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      {children}
    </Theme>
  );
}