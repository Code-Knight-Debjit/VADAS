const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const metricValues = document.querySelectorAll(".metric-value");
const sections = document.querySelectorAll("main section[id]");
const demoForms = document.querySelectorAll(".tool-form, .contact-form");
const ghostButtons = document.querySelectorAll(".button-ghost");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const metricObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const metric = entry.target;
      const target = Number(metric.dataset.target);
      const duration = 1400;
      const startTime = performance.now();

      const animateMetric = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        metric.textContent = Math.floor(progress * target);

        if (progress < 1) {
          requestAnimationFrame(animateMetric);
        } else {
          metric.textContent = target;
        }
      };

      requestAnimationFrame(animateMetric);
      metricObserver.unobserve(metric);
    });
  },
  { threshold: 0.7 }
);

metricValues.forEach((metric) => metricObserver.observe(metric));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  {
    threshold: 0.4,
    rootMargin: "-15% 0px -35% 0px"
  }
);

sections.forEach((section) => sectionObserver.observe(section));

demoForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton.textContent;
    const mode = form.dataset.demo || "contact";

    submitButton.disabled = true;
    submitButton.textContent = mode === "encode"
      ? "Encoding Demo Ready"
      : mode === "decode"
        ? "Decoding Demo Ready"
        : "Message Sent";

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
      form.reset();
    }, 1800);
  });
});

ghostButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const originalLabel = button.textContent;
    button.textContent = originalLabel.includes("Copy") ? "Link Copied" : "Download Ready";

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1500);
  });
});
