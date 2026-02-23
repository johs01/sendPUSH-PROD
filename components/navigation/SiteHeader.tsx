"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { ThemeIconToggle } from "@/components/navigation/ThemeIconToggle";
import { navItems } from "@/lib/content";
import { PRIMARY_SECTION_IDS, getHeaderOffset, scrollToAnchor } from "@/lib/navigation";
import { useThemeMode } from "@/lib/theme";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(PRIMARY_SECTION_IDS[0]);
  const [scrolled, setScrolled] = useState(false);
  const { themeMode, toggleTheme } = useThemeMode();

  useEffect(() => {
    const updateSticky = () => {
      setScrolled(window.scrollY > 16);
    };

    const updateActive = () => {
      const marker = window.scrollY + getHeaderOffset();

      for (let index = PRIMARY_SECTION_IDS.length - 1; index >= 0; index -= 1) {
        const id = PRIMARY_SECTION_IDS[index];
        const section = document.getElementById(id);

        if (!section) {
          continue;
        }

        if (section.offsetTop <= marker) {
          setActiveId(id);
          break;
        }
      }
    };

    updateSticky();
    updateActive();

    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        updateSticky();
        updateActive();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const liveRegion = document.getElementById("wfThemeLive");
    root.dataset.theme = themeMode;
    root.dataset.themeMode = themeMode;
    root.style.colorScheme = themeMode;

    if (liveRegion) {
      liveRegion.textContent = `Theme set to ${themeMode} mode.`;
    }
  }, [themeMode]);

  const shellClassName = useMemo(
    () => [styles.shell, scrolled ? styles.scrolled : ""].filter(Boolean).join(" "),
    [scrolled]
  );

  return (
    <header className={styles.header}>
      <a className="skip-link" href="#hero">
        Skip to hero
      </a>

      <Container className={shellClassName}>
        <div className={styles.navContent}>
          <a className={styles.brand} href="#hero">
            <span className={styles.brandDot} aria-hidden="true"></span>
            <span>SetupFlow</span>
          </a>

          <nav className={styles.links} aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeId === item.id ? styles.active : ""}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToAnchor(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <ThemeIconToggle id="wfThemeToggle" themeMode={themeMode} onToggle={toggleTheme} />
            <Button href="#tenant-trial-cta" size="lg" className={styles.startButton}>
              Start Free
            </Button>
            <button
              type="button"
              id="wfMobileMenuToggle"
              className={styles.mobileMenuToggle}
              aria-label="Open menu"
              aria-controls="wfMobileMenu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu
        open={mobileMenuOpen}
        navItems={navItems}
        activeId={activeId}
        onClose={() => setMobileMenuOpen(false)}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
      />
    </header>
  );
}
