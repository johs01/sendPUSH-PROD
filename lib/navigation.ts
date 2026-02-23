export const PRIMARY_SECTION_IDS = [
  "features",
  "comparison",
  "process",
  "faq"
] as const;

export const getHeaderOffset = (fallback = 96) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const header = document.querySelector("header");
  if (!header) {
    return fallback;
  }

  const styles = window.getComputedStyle(header);
  const top = Number.parseFloat(styles.top) || 0;
  return Math.ceil(header.getBoundingClientRect().height + top + 12);
};

export const scrollToAnchor = (targetId: string) => {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const offset = getHeaderOffset();
  const top = Math.max(target.getBoundingClientRect().top + window.scrollY - offset, 0);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top,
    behavior: reducedMotion ? "auto" : "smooth"
  });
};
