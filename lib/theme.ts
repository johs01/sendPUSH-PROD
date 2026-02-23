"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "wf-theme-mode";
const THEME_EVENT = "wf-theme-change";
const THEME_ANIMATION_CLASS = "theme-animating";
const THEME_ANIMATION_DURATION_MS = 320;

let themeAnimationTimer: number | null = null;

const isThemeMode = (value: string | null): value is ThemeMode => value === "light" || value === "dark";

const setDomTheme = (mode: ThemeMode, { animated = false }: { animated?: boolean } = {}) => {
  const root = document.documentElement;

  if (animated) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      if (themeAnimationTimer !== null) {
        window.clearTimeout(themeAnimationTimer);
      }

      root.classList.add(THEME_ANIMATION_CLASS);
      themeAnimationTimer = window.setTimeout(() => {
        root.classList.remove(THEME_ANIMATION_CLASS);
        themeAnimationTimer = null;
      }, THEME_ANIMATION_DURATION_MS);
    }
  }

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
    setDomTheme(stored, { animated: false });

    const handleExternalTheme = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeMode>;
      if (customEvent.detail) {
        setThemeMode(customEvent.detail);
        setDomTheme(customEvent.detail, { animated: false });
      }
    };

    window.addEventListener(THEME_EVENT, handleExternalTheme);
    return () => window.removeEventListener(THEME_EVENT, handleExternalTheme);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    setDomTheme(mode, { animated: true });
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
