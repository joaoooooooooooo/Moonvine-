import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "mvds-theme";

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(nextTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = nextTheme === "system" ? getSystemTheme() : nextTheme;
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
}

export function useThemePreference() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) ?? "system";
  });

  useEffect(() => {
    applyTheme(theme);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      if (theme === "system") {
        applyTheme("system");
      }
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    resolvedTheme: theme === "system" ? getSystemTheme() : theme,
    setTheme,
    theme,
  };
}
