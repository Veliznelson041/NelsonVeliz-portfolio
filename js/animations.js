/* =============================================
   NELSON VELIZ PORTFOLIO — animations.js
   Scroll reveal, cursor, typing, counters
   ============================================= */

/* ── Custom Cursor ──────────────────────────── */
function initCursor() {
  const dot  = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = "a, button, .skill-card, .project-card, .info-card, .contact-link-card";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity  = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity  = "1";
    ring.style.opacity = "1";
  });
}

/* ── Scroll Reveal ──────────────────────────── */
function initScrollReveal() {
  const options = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  };

  window.revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        window.revealObserver.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll(".reveal, .timeline-item").forEach((el) => {
    window.revealObserver.observe(el);
  });
}

/* ── Typing Effect ──────────────────────────── */
function initTyping() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const phrases = [
    "Desarrollador Full Stack",
    "Técnico en Desarrollo de Software",
    "Estudiante de Ciberseguridad",
    "Apasionado por el OSINT",
    "Backend con Python & Django",
    "Catamarca, Argentina 🇦🇷",
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        paused   = true;
        setTimeout(() => { paused = false; }, 1800);
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = paused ? 0 : deleting ? 45 : 85;
    setTimeout(tick, speed);
  }

  setTimeout(tick, 1200);
}

/* ── Counter Animation ──────────────────────── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (target / duration) * 16;
  const raf = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || "");
      clearInterval(raf);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || "");
    }
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => obs.observe(c));
}

/* ── Navbar Scroll Effect ───────────────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const links = navbar.querySelectorAll(".nav-links a[href^='#']");

  window.addEventListener("scroll", () => {
    // Scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlight
    const scrollPos = window.scrollY + 120;
    links.forEach((link) => {
      const id      = link.getAttribute("href").replace("#", "");
      const section = document.getElementById(id);
      if (!section) return;
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/* ── Mobile Menu ────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ── Back to Top ────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ── Toast Notification ─────────────────────── */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
window.showToast = showToast;

/* ── Terminal Typewriter Lines ──────────────── */
function initTerminal() {
  const lines = document.querySelectorAll(".t-line[data-delay]");
  lines.forEach((line) => {
    line.style.opacity = "0";
    const delay = parseInt(line.dataset.delay, 10);
    setTimeout(() => {
      line.style.transition = "opacity 0.3s ease";
      line.style.opacity = "1";
    }, delay);
  });
}

/* ── Smooth Anchor Scroll ───────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ── Page Flash ─────────────────────────────── */
function initPageFlash() {
  const flash = document.createElement("div");
  flash.className = "page-flash";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 700);
}

/* ── Export init ────────────────────────────── */
window.animations = {
  initCursor,
  initScrollReveal,
  initTyping,
  initCounters,
  initNavbar,
  initMobileMenu,
  initBackToTop,
  initTerminal,
  initSmoothScroll,
  initPageFlash,
};
