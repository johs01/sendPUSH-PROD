"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "wf-theme-mode";
const THEME_EVENT = "wf-theme-change";

const isThemeMode = (value: string | null): value is ThemeMode => value === "light" || value === "dark";

const setDomTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.themeMode = mode;
  root.style.colorScheme = mode;
};

const readStoredTheme = (): ThemeMode => {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    if (isThemeMode(value)) {
      return value;
    }
  } catch {
    // ignore storage issues
  }

  return "light";
};

export const saveTheme = (mode: ThemeMode) => {
  try {
    window.localStorage.setItem(THEME_KEY, mode);
  } catch {
    // ignore storage issues
  }
};

export const useThemeMode = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeMode(stored);
    setDomTheme(stored);

    const handleExternalTheme = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setThemeMode(customEvent.detail);
        setDomTheme(customEvent.detail);
      }
    };

    window.addEventListener(THEME_EVENT, handleExternalTheme);
    return () => window.removeEventListener(THEME_EVENT, handleExternalTheme);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    setDomTheme(mode);
    saveTheme(mode);
    window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: mode }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(themeMode === "dark" ? "light" : "dark");
  }, [setTheme, themeMode]);

  const nextTheme = useMemo<ThemeMode>(() => (themeMode === "dark" ? "light" : "dark"), [themeMode]);

  return {
    themeMode,
    nextTheme,
    setTheme,
    toggleTheme
  };
};
