(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupStickyNav() {
    const nav = document.getElementById("wfNav");
    if (!nav) return;

    const update = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setupReveal() {
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    items.forEach((item) => {
      const order = Number(item.dataset.revealOrder || 0);
      item.style.setProperty("--reveal-delay", `${Math.max(order, 0) * 70}ms`);
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  function init() {
    setupStickyNav();
    setupReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
