"use client";

import { useEffect, useRef, useState } from "react";
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
  const closeTimerRef = useRef<number | null>(null);
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      window.requestAnimationFrame(() => {
        setVisible(true);
      });
      return;
    }

    setVisible(false);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const closeDelay = reducedMotion ? 0 : 300;

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setRendered(false);
      closeTimerRef.current = null;
    }, closeDelay);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!visible) {
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

    document.body.classList.add("wf-mobile-menu-open");
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabTrap);

    return () => {
      document.body.classList.remove("wf-mobile-menu-open");
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabTrap);
      lastFocusedRef.current?.focus();
    };
  }, [visible, onClose]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 799.98px)");
    const handleViewportChange = () => {
      if (mobileQuery.matches) {
        return;
      }
      onClose();
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else {
      mobileQuery.addListener(handleViewportChange);
    }

    window.addEventListener("resize", handleViewportChange, { passive: true });

    return () => {
      if (typeof mobileQuery.removeEventListener === "function") {
        mobileQuery.removeEventListener("change", handleViewportChange);
      } else {
        mobileQuery.removeListener(handleViewportChange);
      }
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [onClose]);

  if (!rendered) {
    return null;
  }

  return (
    <div id="wfMobileMenu" className={`${styles.overlay} ${visible ? styles.open : ""}`} aria-hidden={!visible}>
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
