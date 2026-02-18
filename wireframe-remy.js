// SYSTEM: REMY
(() => {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => reducedMotionQuery.matches;

  function setupThemeMode() {
    const THEME_KEY = "wf-theme-mode";
    const root = document.documentElement;
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const desktopToggle = document.getElementById("wfThemeToggle");
    const mobileToggle = document.getElementById("wfMobileThemeToggle");
    const liveRegion = document.getElementById("wfThemeLive");
    const toggles = [desktopToggle, mobileToggle].filter(
      (button) => button instanceof HTMLButtonElement
    );
    const validModes = new Set(["light", "dark"]);
    const modeLabel = {
      light: "Light",
      dark: "Dark"
    };

    let themeAnimTimer = 0;

    const validMode = (mode) => validModes.has(mode);
    const getSystemTheme = () => (systemThemeQuery.matches ? "dark" : "light");
    const normalizeMode = (mode) => (validMode(mode) ? mode : getSystemTheme());

    const getStoredMode = () => {
      try {
        return window.localStorage.getItem(THEME_KEY);
      } catch (_error) {
        return null;
      }
    };

    const setStoredMode = (mode) => {
      try {
        window.localStorage.setItem(THEME_KEY, mode);
      } catch (_error) {
        // Ignore storage failures (private mode / blocked storage).
      }
    };

    const syncThemeToggles = (mode) => {
      const nextMode = mode === "dark" ? "light" : "dark";
      const nextLabel = nextMode === "dark" ? "Switch to dark mode" : "Switch to light mode";
      const pressed = mode === "dark" ? "true" : "false";

      toggles.forEach((button) => {
        button.dataset.themeTarget = nextMode;
        button.setAttribute("aria-pressed", pressed);
        button.setAttribute("aria-label", nextLabel);
      });
    };

    const applyTheme = (
      mode,
      {
        persist = false,
        announce = false,
        animated = false
      } = {}
    ) => {
      const normalizedMode = normalizeMode(mode);

      if (animated && !prefersReducedMotion()) {
        window.clearTimeout(themeAnimTimer);
        root.classList.add("theme-animating");
        themeAnimTimer = window.setTimeout(() => {
          root.classList.remove("theme-animating");
        }, 320);
      }

      root.dataset.themeMode = normalizedMode;
      root.dataset.theme = normalizedMode;
      root.style.colorScheme = normalizedMode;

      if (persist) {
        setStoredMode(normalizedMode);
      }

      syncThemeToggles(normalizedMode);

      if (announce && liveRegion) {
        liveRegion.textContent = `Theme set to ${modeLabel[normalizedMode]} mode.`;
      }
    };

    const initialMode = normalizeMode(
      getStoredMode() || root.dataset.themeMode || root.dataset.theme
    );
    applyTheme(initialMode, { persist: true, announce: false, animated: false });

    if (!toggles.length) return;

    const toggleTheme = () => {
      const currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, {
        persist: true,
        announce: true,
        animated: true
      });
    };

    toggles.forEach((button) => {
      button.addEventListener("click", toggleTheme);
      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggleTheme();
      });
    });
  }

  function getHeaderOffset() {
    const header = document.querySelector(".wf-header");
    if (!header) return 96;

    const computed = window.getComputedStyle(header);
    const stickyTop = Number.parseFloat(computed.top) || 0;
    return Math.ceil(header.offsetHeight + stickyTop + 8);
  }

  function setupStickyNav() {
    const nav = document.getElementById("wfNav");
    if (!nav) return;

    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 10);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  function setupNavLiquidGlass() {
    const nav = document.getElementById("wfNav");
    if (!nav) return;

    const pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const setCenter = () => {
      nav.style.setProperty("--wf-nav-mx", "50%");
      nav.style.setProperty("--wf-nav-my", "50%");
    };

    setCenter();

    if (prefersReducedMotion() || !pointerFine) {
      nav.classList.remove("is-interactive");
      return;
    }

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    let rect = nav.getBoundingClientRect();

    const updateRect = () => {
      rect = nav.getBoundingClientRect();
    };

    const updateFromPointer = (event) => {
      if (!rect.width || !rect.height) return;

      const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

      nav.style.setProperty("--wf-nav-mx", `${x.toFixed(2)}%`);
      nav.style.setProperty("--wf-nav-my", `${y.toFixed(2)}%`);
    };

    const onEnter = (event) => {
      updateRect();
      nav.classList.add("is-interactive");
      updateFromPointer(event);
    };

    const onMove = (event) => {
      updateFromPointer(event);
    };

    const onLeave = () => {
      nav.classList.remove("is-interactive");
      setCenter();
    };

    nav.addEventListener("pointerenter", onEnter, { passive: true });
    nav.addEventListener("pointermove", onMove, { passive: true });
    nav.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });
  }

  function setupSmoothAnchors() {
    const links = Array.from(document.querySelectorAll("a[href^='#']"));
    if (!links.length) return;

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      link.addEventListener("click", (event) => {
        event.preventDefault();

        const offset = getHeaderOffset();
        const nextTop = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - offset
        );

        window.scrollTo({
          top: nextTop,
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });

        if (window.history?.pushState) {
          window.history.pushState(null, "", href);
        }
      });
    });
  }

  function setupReveal() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    items.forEach((item) => {
      const order = Number(item.dataset.revealOrder || 0);
      item.style.setProperty("--reveal-delay", `${Math.max(order, 0) * 55}ms`);
    });

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  function setupPricingBilling() {
    const section = document.getElementById("pricing");
    if (!section) return;

    const toggles = Array.from(section.querySelectorAll("[data-pricing-toggle]"));
    const labels = Array.from(section.querySelectorAll(".wf-pricing-billed-label"));
    const priceStacks = Array.from(section.querySelectorAll("[data-pricing-stack]"));

    if (!toggles.length || !priceStacks.length) return;

    const setBilling = (mode) => {
      const yearly = mode === "yearly";
      const offset = yearly ? "-50%" : "0%";

      toggles.forEach((toggle) => {
        const active = toggle.dataset.pricingToggle === mode;
        toggle.classList.toggle("is-active", active);
        toggle.setAttribute("aria-pressed", active ? "true" : "false");
      });

      priceStacks.forEach((stack) => {
        stack.style.transform = `translateY(${offset})`;
      });

      labels.forEach((label) => {
        label.textContent = yearly ? "yearly" : "monthly";
      });
    };

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const mode = toggle.dataset.pricingToggle === "yearly" ? "yearly" : "monthly";
        setBilling(mode);
      });
    });

    setBilling("monthly");
  }

  function setupTenantTrialForm() {
    const form = document.getElementById("wf-tenant-trial-form");
    if (!(form instanceof HTMLFormElement)) return;

    const successMessage = document.getElementById("wf-tenant-form-success");

    if (successMessage) {
      successMessage.hidden = true;
      successMessage.textContent = "";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const nameField = form.querySelector("#wf-tenant-name");
      const firstName =
        nameField && "value" in nameField
          ? String(nameField.value).trim().split(/\s+/)[0]
          : "";

      form.reset();

      if (!successMessage) return;

      successMessage.textContent = firstName
        ? `Thanks, ${firstName}. Your 30-day trial request is in. We'll reach out with next steps shortly.`
        : "Thanks. Your 30-day trial request is in. We'll reach out with next steps shortly.";
      successMessage.hidden = false;
      successMessage.focus();
    });

    form.addEventListener("input", () => {
      if (!successMessage || successMessage.hidden) return;
      successMessage.hidden = true;
      successMessage.textContent = "";
    });
  }

  function setupMobileMenu() {
    const menu = document.getElementById("wfMobileMenu");
    const toggle = document.getElementById("wfMobileMenuToggle");
    if (!(menu instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) return;

    const panel = menu.querySelector(".wf-mobile-menu-panel");
    if (!(panel instanceof HTMLElement)) return;

    const closeTargets = Array.from(menu.querySelectorAll("[data-mobile-menu-close]"));
    const menuLinks = Array.from(menu.querySelectorAll(".wf-mobile-menu-content a[href^='#']"));
    const mobileQuery = window.matchMedia("(max-width: 799.98px)");
    const openClass = "is-open";
    let restoreFocusNode = null;
    let closeTimer = 0;

    const syncAccessibility = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    };

    const getFocusableElements = () => {
      const selector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
      return Array.from(panel.querySelectorAll(selector)).filter((node) => {
        if (!(node instanceof HTMLElement)) return false;
        if (node.hasAttribute("disabled")) return false;
        return node.offsetParent !== null || node === document.activeElement;
      });
    };

    const focusFirstInteractive = () => {
      const [first] = getFocusableElements();
      if (first) {
        first.focus();
      } else {
        panel.focus();
      }
    };

    const finishClose = () => {
      menu.hidden = true;
      document.body.classList.remove("wf-mobile-menu-open");
    };

    const openMenu = () => {
      if (!mobileQuery.matches) return;

      window.clearTimeout(closeTimer);
      restoreFocusNode = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      menu.hidden = false;
      document.body.classList.add("wf-mobile-menu-open");

      window.requestAnimationFrame(() => {
        menu.classList.add(openClass);
        syncAccessibility(true);
        focusFirstInteractive();
      });
    };

    const closeMenu = ({ restoreFocus = true, immediate = false } = {}) => {
      window.clearTimeout(closeTimer);
      menu.classList.remove(openClass);
      syncAccessibility(false);

      const finalize = () => {
        finishClose();
        if (restoreFocus && restoreFocusNode instanceof HTMLElement) {
          restoreFocusNode.focus();
        }
        restoreFocusNode = null;
      };

      if (immediate || prefersReducedMotion()) {
        finalize();
      } else {
        closeTimer = window.setTimeout(finalize, 300);
      }
    };

    const onToggleClick = () => {
      const isOpen = !menu.hidden && menu.classList.contains(openClass);
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggle.addEventListener("click", onToggleClick);

    closeTargets.forEach((target) => {
      target.addEventListener("click", () => {
        closeMenu();
      });
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu({ restoreFocus: false, immediate: true });
      });
    });

    // Keep keyboard users inside the drawer while it is open.
    menu.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || menu.hidden || !menu.classList.contains(openClass)) return;

      const focusables = getFocusableElements();
      if (!focusables.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menu.hidden || !menu.classList.contains(openClass)) return;
      event.preventDefault();
      closeMenu();
    });

    const handleViewportChange = () => {
      if (mobileQuery.matches) return;
      closeMenu({ restoreFocus: false, immediate: true });
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else {
      mobileQuery.addListener(handleViewportChange);
    }
    window.addEventListener("resize", handleViewportChange, { passive: true });

    syncAccessibility(false);
    finishClose();
  }

  function setupActiveNav() {
    const links = Array.from(
      document.querySelectorAll(".wf-nav-links a[href^='#'], .wf-mobile-menu-links a[href^='#']")
    );
    if (!links.length) return;

    const sections = [];
    links.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      if (!id) return;
      const section = document.getElementById(id);
      if (!section) return;
      sections.push({ id, section, link });
    });

    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", active);
      });
    };

    let ticking = false;

    const update = () => {
      const marker = window.scrollY + getHeaderOffset();
      let currentId = sections[0]?.id;

      for (const item of sections) {
        if (item.section.offsetTop <= marker) {
          currentId = item.id;
        } else {
          break;
        }
      }

      if (currentId) setActive(currentId);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  function init() {
    setupThemeMode();
    setupStickyNav();
    setupNavLiquidGlass();
    setupSmoothAnchors();
    setupMobileMenu();
    setupReveal();
    setupPricingBilling();
    setupTenantTrialForm();
    setupActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
