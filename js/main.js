/* =============================================
   NELSON VELIZ PORTFOLIO — main.js
   App entry point, skills tabs, contact form
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Init all modules ─────────────────────── */
  animations.initPageFlash();
  animations.initCursor();
  animations.initNavbar();
  animations.initMobileMenu();
  animations.initSmoothScroll();
  animations.initBackToTop();
  animations.initTyping();
  animations.initTerminal();

  /* ── Render dynamic content ───────────────── */
  portfolioData.renderProjects();
  portfolioData.renderSkills("backend");

  /* ── Init observers after render ─────────── */
  animations.initScrollReveal();
  animations.initCounters();

  /* ── Skills Tab Switching ─────────────────── */
  const skillTabs = document.querySelectorAll(".skill-tab");
  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;
      portfolioData.renderSkills(category);

      // Re-observe new skill cards
      document.querySelectorAll(".skill-card.reveal").forEach((el) => {
        window.revealObserver.observe(el);
      });
    });
  });

  /* ── Contact Form ─────────────────────────── */
  const form    = document.getElementById("contact-form");
  const success = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = form.querySelector(".form-btn");
      const original = btn.textContent;
      btn.textContent = "Enviando...";
      btn.disabled    = true;

      // Simulate send (replace with real API call if needed)
      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.disabled    = false;
        if (success) {
          success.style.display = "block";
          setTimeout(() => (success.style.display = "none"), 4000);
        }
        window.showToast("✓ Mensaje enviado correctamente");
      }, 1200);
    });
  }

  /* ── Copy Email on click ──────────────────── */
  const emailCard = document.querySelector("[data-copy-email]");
  if (emailCard) {
    emailCard.addEventListener("click", () => {
      navigator.clipboard.writeText("veliznelson041@gmail.com").then(() => {
        window.showToast("📋 Email copiado al portapapeles");
      });
    });
  }

  /* ── Active nav on load ───────────────────── */
  const hash = window.location.hash;
  if (hash) {
    const link = document.querySelector(`.nav-links a[href="${hash}"]`);
    if (link) link.classList.add("active");
  }

  /* ── Lazy re-observe on resize ────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.visible), .timeline-item:not(.visible)").forEach((el) => {
        if (window.revealObserver) window.revealObserver.observe(el);
      });
    }, 200);
  });

  /* ── Tech strip duplicate for infinite scroll ── */
  const strip = document.querySelector(".tech-strip-inner");
  if (strip) {
    const clone = strip.cloneNode(true);
    strip.parentElement.appendChild(clone);
  }
});
