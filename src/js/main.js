/**
 * Colater — Main JavaScript
 * GSAP ScrollTrigger animations, accordion, mobile menu, navbar scroll
 */

document.addEventListener("DOMContentLoaded", () => {
  // ─── Navbar scroll detection ───────────────────────────────────────
  const navbar = document.getElementById("navbar");
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ─── Mobile menu toggle ────────────────────────────────────────────
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const bar1 = document.getElementById("bar-1");
  const bar2 = document.getElementById("bar-2");
  const bar3 = document.getElementById("bar-3");

  if (menuToggle && mobileMenu) {
    let menuOpen = false;
    menuToggle.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle("is-open", menuOpen);
      document.body.style.overflow = menuOpen ? "hidden" : "";

      // Animate hamburger to X
      if (menuOpen) {
        bar1.style.transform = "rotate(45deg) translate(3px, 3px)";
        bar2.style.opacity = "0";
        bar3.style.transform = "rotate(-45deg) translate(3px, -3px)";
      } else {
        bar1.style.transform = "";
        bar2.style.opacity = "";
        bar3.style.transform = "";
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuOpen = false;
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
        bar1.style.transform = "";
        bar2.style.opacity = "";
        bar3.style.transform = "";
      });
    });
  }

  // ─── Accordion ─────────────────────────────────────────────────────
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const isOpen = item.classList.contains("is-open");

      // Close all
      document.querySelectorAll(".accordion-item.is-open").forEach((open) => {
        open.classList.remove("is-open");
        open.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ─── Scroll animations (CSS-based fallback / GSAP enhancement) ────
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Show everything immediately
    document.querySelectorAll("[data-animate], [data-animate-stagger]").forEach((el) => {
      el.classList.add("is-visible");
    });
    document.querySelectorAll(".agent-msg").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  // Check if GSAP is loaded
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    const stripeEase = "power3.out";

    // Animate [data-animate] elements
    document.querySelectorAll("[data-animate]").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: stripeEase,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    // Animate stagger containers
    document.querySelectorAll("[data-animate-stagger]").forEach((container) => {
      const children = container.children;
      gsap.fromTo(
        children,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: stripeEase,
          stagger: 0.1,
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    // Animate agent messages with stagger
    const agentMessages = document.querySelectorAll(".agent-msg");
    if (agentMessages.length > 0) {
      gsap.fromTo(
        agentMessages,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: stripeEase,
          stagger: 0.15,
          scrollTrigger: {
            trigger: "#agent-messages",
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  } else {
    // Fallback: Intersection Observer for CSS transitions
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -15% 0px" }
    );

    document.querySelectorAll("[data-animate], [data-animate-stagger], .agent-msg").forEach((el) => {
      observer.observe(el);
    });
  }
});
