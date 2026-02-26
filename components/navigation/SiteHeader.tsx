"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const shellRef = useRef<HTMLDivElement | null>(null);
  const { themeMode, toggleTheme } = useThemeMode();

  useEffect(() => {
    const updateSticky = () => {
      setScrolled(window.scrollY > 10);
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
    const liveRegion = document.getElementById("wfThemeLive");

    if (liveRegion) {
      liveRegion.textContent = `Theme set to ${themeMode} mode.`;
    }
  }, [themeMode]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const pointerFineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setCenter = () => {
      shell.style.setProperty("--wf-nav-mx", "50%");
      shell.style.setProperty("--wf-nav-my", "50%");
    };

    const disableInteractive = () => {
      shell.classList.remove(styles.interactive);
      setCenter();
    };

    if (!pointerFineQuery.matches || reducedMotionQuery.matches) {
      disableInteractive();
      return;
    }

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    let rect = shell.getBoundingClientRect();

    const updateRect = () => {
      rect = shell.getBoundingClientRect();
    };

    const updateFromPointer = (event: PointerEvent) => {
      if (!rect.width || !rect.height) {
        return;
      }

      const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

      shell.style.setProperty("--wf-nav-mx", `${x.toFixed(2)}%`);
      shell.style.setProperty("--wf-nav-my", `${y.toFixed(2)}%`);
    };

    const onPointerEnter = (event: PointerEvent) => {
      updateRect();
      shell.classList.add(styles.interactive);
      updateFromPointer(event);
    };

    const onPointerMove = (event: PointerEvent) => {
      updateFromPointer(event);
    };

    const onPointerLeave = () => {
      shell.classList.remove(styles.interactive);
      setCenter();
    };

    setCenter();
    shell.addEventListener("pointerenter", onPointerEnter, { passive: true });
    shell.addEventListener("pointermove", onPointerMove, { passive: true });
    shell.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    return () => {
      shell.removeEventListener("pointerenter", onPointerEnter);
      shell.removeEventListener("pointermove", onPointerMove);
      shell.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", updateRect);
      disableInteractive();
    };
  }, []);

  const shellClassName = useMemo(
    () => [styles.shell, scrolled ? styles.scrolled : ""].filter(Boolean).join(" "),
    [scrolled]
  );

  return (
    <header className={styles.header}>
      <a className="skip-link" href="#hero">
        Skip to hero
      </a>
      <span id="wfThemeLive" className="visually-hidden" aria-live="polite" />

      <Container>
        <div ref={shellRef} className={shellClassName}>
          <div className={`${styles.glass} ${styles.glassFilter}`} aria-hidden="true" />
          <div className={`${styles.glass} ${styles.glassOverlay}`} aria-hidden="true" />
          <div className={`${styles.glass} ${styles.glassSpecular}`} aria-hidden="true" />
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
