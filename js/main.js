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
      portfolioData.renderSkills(tab.dataset.category);
      document.querySelectorAll(".skill-card.reveal").forEach((el) => {
        if (window.revealObserver) window.revealObserver.observe(el);
      });
    });
  });

  /* ══════════════════════════════════════════
     CONTACT FORM — Netlify Forms via fetch
     Funciona en producción (netlify.com).
     En localhost muestra la animación pero
     no envía (no hay servidor Netlify local).
  ══════════════════════════════════════════ */
  const form      = document.getElementById("contact-form");
  const submitBtn = document.getElementById("form-submit-btn");
  const success   = document.getElementById("form-success");
  const errorMsg  = document.getElementById("form-error");
  const counter   = document.getElementById("char-counter");
  const textarea  = document.getElementById("message");

  /* ── Contador de caracteres ─────────────── */
  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 2000`;
      counter.style.color = len > 1800
        ? "var(--accent-amber)"
        : len > 1950
          ? "#f87171"
          : "var(--text-muted)";
    });
  }

  /* ── Validación cliente ─────────────────── */
  function validateForm() {
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = textarea ? textarea.value.trim() : "";

    if (name.length < 2)    { showFieldError("name",    "El nombre debe tener al menos 2 caracteres."); return false; }
    if (!isValidEmail(email)){ showFieldError("email",   "Ingresá un email válido."); return false; }
    if (subject.length < 3) { showFieldError("subject", "El asunto es demasiado corto."); return false; }
    if (message.length < 10){ showFieldError("message", "El mensaje debe tener al menos 10 caracteres."); return false; }

    return true;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = "#f87171";
    field.style.boxShadow   = "0 0 0 3px rgba(248,113,113,0.12)";
    window.showToast("⚠ " + msg);
    field.focus();

    // Auto-limpiar estilo al escribir
    field.addEventListener("input", () => {
      field.style.borderColor = "";
      field.style.boxShadow   = "";
    }, { once: true });
  }

  /* ── Submit handler ─────────────────────── */
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Verificar honeypot — si está lleno, es un bot
      const botField = form.querySelector('[name="bot-field"]');
      if (botField && botField.value !== "") {
        console.warn("Bot detectado — submission ignorada.");
        return;
      }

      // Validar campos
      if (!validateForm()) return;

      // UI de carga
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled    = true;
      submitBtn.style.opacity = "0.7";
      if (success)  success.style.display  = "none";
      if (errorMsg) errorMsg.style.display  = "none";

      try {
        /* ── Envío a Netlify Forms ──────────
           Netlify detecta automáticamente este
           endpoint cuando el form tiene data-netlify="true"
        ─────────────────────────────────── */
        const formData = new FormData(form);
        const encoded  = new URLSearchParams(formData).toString();

        const response = await fetch("/", {
          method:  "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body:    encoded,
        });

        if (response.ok) {
          // ✅ Éxito
          form.reset();
          if (counter) counter.textContent = "0 / 2000";
          if (success) success.style.display = "block";
          window.showToast("✓ ¡Mensaje enviado correctamente!");
          setTimeout(() => {
            if (success) success.style.display = "none";
          }, 5000);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }

      } catch (err) {
        console.error("Error al enviar el formulario:", err);
        if (errorMsg) errorMsg.style.display = "block";
        window.showToast("✗ Error al enviar. Intentá de nuevo.");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled    = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  /* ── Copy Email on click ──────────────────── */
  const emailCard = document.querySelector("[data-copy-email]");
  if (emailCard) {
    emailCard.addEventListener("click", (e) => {
      // Solo copiar si no se está siguiendo el href
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("veliznelson041@gmail.com").then(() => {
          window.showToast("📋 Email copiado al portapapeles");
        });
      }
    });
  }

  /* ── Active nav on load ─────────────────── */
  const hash = window.location.hash;
  if (hash) {
    const link = document.querySelector(`.nav-links a[href="${hash}"]`);
    if (link) link.classList.add("active");
  }

  /* ── Lazy re-observe on resize ──────────── */
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