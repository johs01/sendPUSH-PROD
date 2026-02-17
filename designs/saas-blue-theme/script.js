// SYSTEM: SAAS-BLUE
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = reducedMotionQuery.matches;

let startCarousel = () => {};
let stopCarousel = () => {};
let refreshRoi = () => {};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function formatCounterValue(element, value) {
  const decimals = Number(element.dataset.counterDecimals || 0);
  const prefix = element.dataset.counterPrefix || "";
  const suffix = element.dataset.counterSuffix || "";
  const safeValue = Number.isFinite(value) ? value : 0;

  const formatted = safeValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  element.textContent = `${prefix}${formatted}${suffix}`;
}

function setupStickyNav() {
  const siteNav = document.getElementById("siteNav");
  if (!siteNav) return;

  const setStickyState = () => {
    siteNav.classList.toggle("scrolled", window.scrollY > 12);
  };

  setStickyState();
  window.addEventListener("scroll", setStickyState, { passive: true });
}

function setupRevealAnimation() {
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if (!revealElements.length) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function setupCounters() {
  const counters = Array.from(document.querySelectorAll("[data-counter-target]"));
  if (!counters.length) return;

  const animateCounter = (element) => {
    if (element.dataset.counterDone === "true") return;
    element.dataset.counterDone = "true";

    const target = Number(element.dataset.counterTarget || 0);
    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      formatCounterValue(element, target);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const easeOutCubic = (time) => 1 - Math.pow(1 - time, 3);

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - start) / duration, 1);
      const currentValue = target * easeOutCubic(progress);
      formatCounterValue(element, currentValue);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        formatCounterValue(element, target);
      }
    };

    requestAnimationFrame(tick);
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((counter) => animateCounter(counter));
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function setupUseCaseTabs() {
  const tabList = document.querySelector(".tab-list[role='tablist']");
  if (!tabList) return;

  const tabs = Array.from(tabList.querySelectorAll("[role='tab']"));
  if (!tabs.length) return;

  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  const activateTab = (nextTab, focusTab = false) => {
    tabs.forEach((tab, index) => {
      const isSelected = tab === nextTab;
      const panel = panels[index];

      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.tabIndex = isSelected ? 0 : -1;
      if (panel) panel.hidden = !isSelected;
    });

    if (focusTab) nextTab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      let targetIndex = null;

      if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = tabs.length - 1;

      if (targetIndex === null) return;

      event.preventDefault();
      activateTab(tabs[targetIndex], true);
    });
  });
}

function setupPricingToggle() {
  const billingToggle = document.getElementById("billing-toggle");
  if (!billingToggle) return;

  const priceValues = Array.from(document.querySelectorAll(".price-value[data-price-monthly]"));
  const yearlyNotes = Array.from(document.querySelectorAll("[data-yearly-note]"));

  const updateBilling = () => {
    const yearly = billingToggle.checked;

    priceValues.forEach((price) => {
      const monthlyValue = price.dataset.priceMonthly || "0";
      const yearlyValue = price.dataset.priceYearly || monthlyValue;
      price.textContent = yearly ? yearlyValue : monthlyValue;
    });

    yearlyNotes.forEach((note) => {
      note.hidden = !yearly;
    });

    refreshRoi();
  };

  billingToggle.addEventListener("change", updateBilling);
  updateBilling();
}

function setupRoiCalculator() {
  const form = document.getElementById("roi-form");
  if (!form) return;

  const inputs = {
    members: document.getElementById("roi-members"),
    order: document.getElementById("roi-order"),
    visits: document.getElementById("roi-visits"),
    lift: document.getElementById("roi-lift"),
    margin: document.getElementById("roi-margin")
  };

  const outputs = {
    revenue: document.getElementById("roi-revenue"),
    profit: document.getElementById("roi-profit"),
    annual: document.getElementById("roi-annual"),
    percent: document.getElementById("roi-percent"),
    payback: document.getElementById("roi-payback")
  };

  const parseInput = (input, fallback = 0) => {
    const value = Number(input?.value);
    return Number.isFinite(value) ? value : fallback;
  };

  const getGrowthPlanCost = () => {
    const billingToggle = document.getElementById("billing-toggle");
    const growthPlanPrice = document.querySelector(".pricing-card.recommended .price-value");
    if (!growthPlanPrice) return 399;

    const monthly = Number(growthPlanPrice.dataset.priceMonthly || 399);
    const yearly = Number(growthPlanPrice.dataset.priceYearly || monthly);
    return billingToggle?.checked ? yearly : monthly;
  };

  const calculate = () => {
    const members = Math.max(0, parseInput(inputs.members, 0));
    const order = Math.max(0, parseInput(inputs.order, 0));
    const visits = Math.max(0, parseInput(inputs.visits, 0));
    const lift = Math.max(0, parseInput(inputs.lift, 0));
    const margin = Math.min(100, Math.max(0, parseInput(inputs.margin, 0)));

    const monthlyOrderVolume = members * visits;
    const incrementalOrders = monthlyOrderVolume * (lift / 100);
    const incrementalRevenue = incrementalOrders * order;
    const incrementalProfit = incrementalRevenue * (margin / 100);
    const planCost = getGrowthPlanCost();
    const netMonthlyProfit = incrementalProfit - planCost;
    const annualNetImpact = netMonthlyProfit * 12;
    const monthlyRoi = planCost > 0 ? (netMonthlyProfit / planCost) * 100 : 0;
    const paybackDays = incrementalProfit > 0 ? planCost / (incrementalProfit / 30) : Infinity;

    outputs.revenue.textContent = currencyFormatter.format(incrementalRevenue);
    outputs.profit.textContent = currencyFormatter.format(netMonthlyProfit);
    outputs.annual.textContent = currencyFormatter.format(annualNetImpact);
    outputs.percent.textContent = `${monthlyRoi >= 0 ? "+" : ""}${monthlyRoi.toFixed(0)}%`;
    outputs.payback.textContent = Number.isFinite(paybackDays) ? `${Math.max(1, Math.round(paybackDays))} days` : "N/A";
  };

  Object.values(inputs).forEach((input) => {
    if (!input) return;
    input.addEventListener("input", calculate);
  });

  refreshRoi = calculate;
  calculate();
}

function setupTestimonialCarousel() {
  const carousel = document.getElementById("testimonialCarousel");
  if (!carousel) return;

  const shell = carousel.closest(".testimonial-shell") || carousel;
  const track = carousel.querySelector(".testimonial-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".testimonial-slide"));
  const prevButton = shell.querySelector("[data-carousel-prev]");
  const nextButton = shell.querySelector("[data-carousel-next]");
  const dots = Array.from(shell.querySelectorAll("[data-carousel-dot]"));
  if (!slides.length) return;

  let currentIndex = 0;
  let timerId = null;

  const setSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", slideIndex === currentIndex ? "false" : "true");
    });

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
    });
  };

  stopCarousel = () => {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = null;
  };

  startCarousel = () => {
    if (reducedMotion || slides.length < 2) return;
    stopCarousel();
    timerId = window.setInterval(() => setSlide(currentIndex + 1), 6000);
  };

  prevButton?.addEventListener("click", () => {
    setSlide(currentIndex - 1);
    startCarousel();
  });

  nextButton?.addEventListener("click", () => {
    setSlide(currentIndex + 1);
    startCarousel();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.carouselDot);
      if (!Number.isInteger(index)) return;
      setSlide(index);
      startCarousel();
    });
  });

  shell.addEventListener("mouseenter", stopCarousel);
  shell.addEventListener("mouseleave", startCarousel);
  shell.addEventListener("focusin", stopCarousel);
  shell.addEventListener("focusout", (event) => {
    const nextFocusTarget = event.relatedTarget;
    if (!(nextFocusTarget instanceof Node) || !shell.contains(nextFocusTarget)) {
      startCarousel();
    }
  });

  setSlide(0);
  startCarousel();
}

function setupFaqAccordion() {
  const faqButtons = Array.from(document.querySelectorAll(".faq-trigger"));
  if (!faqButtons.length) return;

  const setFaqState = (button, expanded) => {
    const parent = button.closest(".faq-item");
    const panelId = button.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!parent || !panel) return;

    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    panel.setAttribute("aria-hidden", expanded ? "false" : "true");
    parent.classList.toggle("is-open", expanded);
    panel.style.maxHeight = expanded ? `${panel.scrollHeight}px` : "0px";
  };

  faqButtons.forEach((button) => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    setFaqState(button, expanded);
  });

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => setFaqState(otherButton, false));
      if (!isExpanded) setFaqState(button, true);
    });
  });

  window.addEventListener("resize", () => {
    const openButton = faqButtons.find((button) => button.getAttribute("aria-expanded") === "true");
    if (!openButton) return;

    const panelId = openButton.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  });
}

setupStickyNav();
setupRevealAnimation();
setupCounters();
setupUseCaseTabs();
setupPricingToggle();
setupRoiCalculator();
setupTestimonialCarousel();
setupFaqAccordion();

if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", (event) => {
    reducedMotion = event.matches;
    if (reducedMotion) {
      stopCarousel();
    } else {
      startCarousel();
    }
  });
} else if (typeof reducedMotionQuery.addListener === "function") {
  reducedMotionQuery.addListener((event) => {
    reducedMotion = event.matches;
    if (reducedMotion) {
      stopCarousel();
    } else {
      startCarousel();
    }
  });
}
