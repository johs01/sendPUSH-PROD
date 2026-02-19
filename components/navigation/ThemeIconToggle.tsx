"use client";

import styles from "./ThemeIconToggle.module.css";
import type { ThemeMode } from "@/lib/theme";

type ThemeIconToggleProps = {
  themeMode: ThemeMode;
  onToggle: () => void;
  id?: string;
  className?: string;
};

export function ThemeIconToggle({
  themeMode,
  onToggle,
  id,
  className
}: ThemeIconToggleProps) {
  const nextTheme = themeMode === "dark" ? "light" : "dark";
  const classes = [styles.toggle, className].filter(Boolean).join(" ");

  return (
    <button
      id={id}
      type="button"
      className={classes}
      data-theme-target={nextTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={themeMode === "dark"}
      onClick={onToggle}
    >
      <span className={styles.sun} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className={styles.moon} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
