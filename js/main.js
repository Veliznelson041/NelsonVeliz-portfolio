/* =============================================
   NELSON VELIZ PORTFOLIO — main.js
   Form fix (FormSubmit.co), card tilt, game
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ── Init módulos ─────────────────────────── */
  animations.initPageFlash();
  animations.initNavbar();
  animations.initMobileMenu();
  animations.initSmoothScroll();
  animations.initBackToTop();
  animations.initTyping();
  animations.initScrollReveal();
  animations.initCounters();

  /* ── Render dinámico ──────────────────────── */
  portfolioData.renderProjects();
  portfolioData.renderSkills("backend");

  /* ── Skills tabs ──────────────────────────── */
  document.querySelectorAll(".skill-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".skill-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      portfolioData.renderSkills(tab.dataset.category);
      document.querySelectorAll(".skill-card.reveal").forEach(el => {
        if (window.revealObserver) window.revealObserver.observe(el);
      });
    });
  });

  /* ── Dev Card: tilt 3D ────────────────────── */
  initCardTilt();

  /* ── Dev Card: skill bars fill ────────────── */
  initCardSkills();

  /* ── Tech strip clone (ya no aplica) ─────── */
  // (eliminado, reemplazado por tech-wall)

  /* ── Contact Form → FormSubmit.co ─────────── */
  initContactForm();

  /* ── Copy email ───────────────────────────── */
  const emailCard = document.querySelector("[data-copy-email]");
  if (emailCard) {
    emailCard.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText("veliznelson041@gmail.com")
          .then(() => window.showToast("📋 Email copiado al portapapeles"));
      }
    });
  }

  /* ── Active nav on load ───────────────────── */
  const hash = window.location.hash;
  if (hash) {
    const link = document.querySelector(`.nav-links a[href="${hash}"]`);
    if (link) link.classList.add("active");
  }

  /* ── Re-observe on resize ─────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.visible), .timeline-item:not(.visible)").forEach(el => {
        if (window.revealObserver) window.revealObserver.observe(el);
      });
    }, 200);
  });

  /* ── Bug Hunt Game ────────────────────────── */
  initGame();
});

/* ══════════════════════════════════════════════
   DEV CARD — 3D Tilt effect
   (solo desktop, no mobile)
═══════════════════════════════════════════════ */
function initCardTilt() {
  const card = document.getElementById("dev-card");
  if (!card) return;
  if (window.matchMedia("(max-width: 900px)").matches) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    const rY   =  dx * 9;
    const rX   = -dy * 7;
    card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.55s ease, box-shadow 0.3s ease";
    card.style.transform  = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  });

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.08s ease, box-shadow 0.3s ease";
  });
}

/* ── Dev Card: animar barras de skill ──────── */
function initCardSkills() {
  const fills = document.querySelectorAll(".dc-fill[data-width]");
  if (!fills.length) return;
  // Trigger on hero visible (ya está visible al cargar)
  setTimeout(() => {
    fills.forEach(f => { f.style.width = f.dataset.width + "%"; });
  }, 800);
}

/* ══════════════════════════════════════════════
   CONTACT FORM — FormSubmit.co
   
   Por qué FormSubmit y no Netlify Forms:
   Netlify Forms necesita escanear el HTML en
   el PRIMER deploy para registrar el form. Si
   no lo detectó, POST / devuelve 404 siempre.
   FormSubmit no requiere servidor — envía
   directo a tu email. Primer envío pide
   activación (email de confirmación único).
═══════════════════════════════════════════════ */
function initContactForm() {
  const form      = document.getElementById("contact-form");
  const submitBtn = document.getElementById("form-submit-btn");
  const success   = document.getElementById("form-success");
  const errorMsg  = document.getElementById("form-error");
  const counter   = document.getElementById("char-counter");
  const textarea  = document.getElementById("f-message");

  if (!form) return;

  /* Contador de caracteres */
  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 2000`;
      counter.style.color = len > 1950 ? "#f87171" : len > 1800 ? "var(--accent-amber)" : "var(--text-muted)";
    });
  }

  /* Validación */
  function validateForm() {
    const name    = document.getElementById("f-name").value.trim();
    const email   = document.getElementById("f-email").value.trim();
    const subject = document.getElementById("f-subject").value.trim();
    const message = textarea ? textarea.value.trim() : "";

    if (name.length < 2)    { showErr("f-name",    "El nombre debe tener al menos 2 caracteres."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr("f-email", "Ingresá un email válido."); return false; }
    if (subject.length < 3) { showErr("f-subject", "El asunto es demasiado corto."); return false; }
    if (message.length < 10){ showErr("f-message", "El mensaje debe tener al menos 10 caracteres."); return false; }
    return true;
  }

  function showErr(id, msg) {
    const f = document.getElementById(id);
    if (!f) return;
    f.style.borderColor = "#f87171";
    f.style.boxShadow   = "0 0 0 3px rgba(248,113,113,0.12)";
    window.showToast("⚠ " + msg);
    f.focus();
    f.addEventListener("input", () => { f.style.borderColor = ""; f.style.boxShadow = ""; }, { once: true });
  }

  /* Submit */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* Honeypot check */
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value !== "") return; // bot detectado

    if (!validateForm()) return;

    const orig = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled    = true;
    submitBtn.style.opacity = "0.7";
    if (success)  success.style.display  = "none";
    if (errorMsg) errorMsg.style.display = "none";

    try {
      /*
        FormSubmit.co — completamente gratuito.
        Primer envío: recibirás un email de activación de FormSubmit.
        Activalo una vez, y todos los mensajes futuros llegan a tu Gmail.
        No requiere cuenta ni backend.
      */
      const res = await fetch("https://formsubmit.co/ajax/veliznelson041@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":       "application/json"
        },
        body: JSON.stringify({
          name:     document.getElementById("f-name").value.trim(),
          email:    document.getElementById("f-email").value.trim(),
          subject:  document.getElementById("f-subject").value.trim(),
          message:  textarea ? textarea.value.trim() : "",
          _subject: `[Portfolio] ${document.getElementById("f-subject").value.trim()}`,
          _replyto: document.getElementById("f-email").value.trim(),
          _template:"table",
          _captcha: "false"
        })
      });

      const data = await res.json();

      if (res.ok && data.success !== "false") {
        form.reset();
        if (counter) counter.textContent = "0 / 2000";
        if (success) success.style.display = "block";
        window.showToast("✓ ¡Mensaje enviado correctamente!");
        setTimeout(() => { if (success) success.style.display = "none"; }, 5000);
      } else {
        throw new Error(data.message || "Error desconocido");
      }
    } catch (err) {
      console.error("Error al enviar:", err);
      if (errorMsg) errorMsg.style.display = "block";
      window.showToast("✗ Error al enviar. Intentá de nuevo.");
    } finally {
      submitBtn.textContent   = orig;
      submitBtn.disabled      = false;
      submitBtn.style.opacity = "1";
    }
  });
}

/* ══════════════════════════════════════════════
   BUG HUNT GAME
   Mini juego: bugs aparecen en un grid 5×4,
   hacé click para atraparlos. 20 segundos.
═══════════════════════════════════════════════ */
function initGame() {
  const modal      = document.getElementById("game-modal");
  const openBtn    = document.getElementById("open-game");
  const closeBtn   = document.getElementById("game-close");
  const startBtn   = document.getElementById("game-start");
  const restartBtn = document.getElementById("game-restart");
  const grid       = document.getElementById("game-grid");
  const scoreEl    = document.getElementById("g-score");
  const timerEl    = document.getElementById("g-timer");
  const introEl    = document.getElementById("game-intro");
  const playEl     = document.getElementById("game-play");
  const resultEl   = document.getElementById("game-result");
  const finalScore = document.getElementById("g-final-score");
  const resultMsg  = document.getElementById("g-result-msg");

  if (!modal || !grid) return;

  const COLS = 5, ROWS = 4, CELLS = COLS * ROWS;
  const MSGS = [
    { min: 0,  msg: "Ni un bug atrapaste. ¿Dormido? 😅" },
    { min: 1,  msg: "Junior detectado. Seguís aprendiendo 🌱" },
    { min: 6,  msg: "Semi-Senior en el horizonte 🔍" },
    { min: 12, msg: "Senior move. Los bugs te temen 🎯" },
    { min: 18, msg: "¡LEGENDARIO! 🏆 Estás CONTRATADO." },
  ];

  let score = 0, timeLeft = 20;
  let gameInterval = null, timerInterval = null;
  let activeBugCell = null;

  function buildGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < CELLS; i++) {
      const cell = document.createElement("div");
      cell.className = "g-cell";
      cell.addEventListener("click", onCellClick);
      grid.appendChild(cell);
    }
  }

  function onCellClick(e) {
    const cell = e.currentTarget;
    if (!cell.classList.contains("has-bug")) return;
    score++;
    if (scoreEl) scoreEl.textContent = score;
    cell.classList.remove("has-bug");
    cell.classList.add("squashed");
    cell.textContent = "💥";
    activeBugCell = null;
    setTimeout(() => { cell.textContent = ""; cell.classList.remove("squashed"); }, 280);
  }

  function spawnBug() {
    if (activeBugCell) {
      activeBugCell.textContent = "";
      activeBugCell.classList.remove("has-bug");
    }
    const cells = grid.querySelectorAll(".g-cell:not(.squashed)");
    if (!cells.length) return;
    const idx = Math.floor(Math.random() * cells.length);
    activeBugCell = cells[idx];
    activeBugCell.textContent = "🐛";
    activeBugCell.classList.add("has-bug");
  }

  function startGame() {
    score = 0; timeLeft = 20;
    if (scoreEl) scoreEl.textContent = "0";
    if (timerEl) timerEl.textContent = "20";
    introEl.style.display  = "none";
    resultEl.style.display = "none";
    playEl.style.display   = "block";

    buildGrid();
    gameInterval  = setInterval(spawnBug, 750);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;
      if (timeLeft <= 5 && timerEl) timerEl.style.color = "#f87171";
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameInterval = timerInterval = null;
    if (activeBugCell) { activeBugCell.textContent = ""; activeBugCell.classList.remove("has-bug"); activeBugCell = null; }
    if (timerEl) timerEl.style.color = "";
    playEl.style.display = "none";
    const msgObj = [...MSGS].reverse().find(m => score >= m.min) || MSGS[0];
    if (finalScore) finalScore.textContent = `${score} bugs aplastados 🐛`;
    if (resultMsg)  resultMsg.textContent  = msgObj.msg;
    resultEl.style.display = "block";
  }

  function resetModal() {
    clearInterval(gameInterval); clearInterval(timerInterval);
    gameInterval = timerInterval = null;
    introEl.style.display  = "block";
    playEl.style.display   = "none";
    resultEl.style.display = "none";
    if (timerEl) timerEl.style.color = "";
  }

  openBtn   && openBtn.addEventListener("click",    () => { modal.classList.add("open"); resetModal(); });
  closeBtn  && closeBtn.addEventListener("click",   () => { modal.classList.remove("open"); clearInterval(gameInterval); clearInterval(timerInterval); });
  startBtn  && startBtn.addEventListener("click",   startGame);
  restartBtn && restartBtn.addEventListener("click", startGame);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) { modal.classList.remove("open"); clearInterval(gameInterval); clearInterval(timerInterval); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open"); clearInterval(gameInterval); clearInterval(timerInterval);
    }
  });
}