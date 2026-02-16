(() => {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => reducedMotionQuery.matches;

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

  function setupActiveNav() {
    const links = Array.from(document.querySelectorAll(".wf-nav-links a[href^='#']"));
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
    setupStickyNav();
    setupNavLiquidGlass();
    setupSmoothAnchors();
    setupReveal();
    setupActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
