"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/primitives/Button";
import { ThemeIconToggle } from "@/components/navigation/ThemeIconToggle";
import type { NavItem } from "@/lib/content";
import type { ThemeMode } from "@/lib/theme";
import { scrollToAnchor } from "@/lib/navigation";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  open: boolean;
  navItems: NavItem[];
  activeId: string;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onClose: () => void;
};

export function MobileMenu({
  open,
  navItems,
  activeId,
  themeMode,
  onToggleTheme,
  onClose
}: MobileMenuProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])");
    firstFocusable?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleTabTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusables = panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              "a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex='-1'])"
            )
          )
        : [];

      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabTrap);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabTrap);
      lastFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} aria-hidden={!open}>
      <button className={styles.backdrop} type="button" aria-label="Close menu" onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label="Mobile navigation" ref={panelRef}>
        <div className={styles.headerRow}>
          <a className={styles.brand} href="#hero" onClick={onClose}>
            <span className={styles.brandDot} aria-hidden="true"></span>
            <span>SetupFlow</span>
          </a>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={styles.themeRow}>
          <p>Theme</p>
          <ThemeIconToggle id="wfMobileThemeToggle" themeMode={themeMode} onToggle={onToggleTheme} />
        </div>

        <nav className={styles.links} aria-label="Mobile navigation links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeId === item.id ? styles.active : ""}
              onClick={(event) => {
                event.preventDefault();
                scrollToAnchor(item.id);
                onClose();
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button className={styles.menuCta} href="#tenant-trial-cta" onClick={onClose}>
          Start Free
        </Button>
      </aside>
    </div>
  );
}
