/* =============================================
   NELSON VELIZ PORTFOLIO — projects.js
   Projects data & dynamic rendering
   ============================================= */

const PROJECTS = [
  {
    id: "01",
    name: "EduLink",
    tagline: "Plataforma Educativa Integral",
    status: "complete",
    statusLabel: "Completado",
    description:
      "Ecosistema digital que conecta alumnos y profesores particulares. Digitaliza el proceso completo: búsqueda, solicitud, agenda, pagos y calificaciones. Incluye chat en tiempo real, mapas interactivos y herramientas de estudio integradas.",
    features: [
      "Dashboard personalizado por rol (Alumno / Profesor / Admin)",
      "Chat en tiempo real con WebSockets (Django Channels)",
      "Mapa interactivo con profesores georreferenciados (Leaflet.js)",
      "Gestión de solicitudes con ciclo de estados completo",
      "Agenda compartida con prevención de conflictos de horario",
      "Control financiero: ingresos y gastos por clase",
      "10+ herramientas de estudio integradas (Pomodoro, calculadora, etc.)",
    ],
    tech: ["Python", "Django", "PostgreSQL", "WebSockets", "Leaflet.js", "Chart.js", "Bootstrap 5", "REST API"],
    github: "https://github.com/Veliznelson041/EduLink",
    demo: null,
  },
  {
    id: "02",
    name: "SIGRAMS",
    tagline: "Sistema de Gestión Ganadera",
    status: "dev",
    statusLabel: "En Desarrollo",
    description:
      "Plataforma interna para la Dirección de Ganadería de Catamarca. Reemplaza libros físicos de registro con un sistema digital de trazabilidad de productores, marcas, señales y movimientos de ganado.",
    features: [
      "CRUD completo: productores, marcas, señales y ganado",
      "Historial de transferencias oficiales con validaciones",
      "Panel de administrador con control de permisos y roles",
      "Filtros avanzados y vistas dinámicas en listados",
      "Geolocalización de productores ganaderos",
      "Generación de reportes PDF (en desarrollo)",
      "Módulo de estadísticas e indicadores (en desarrollo)",
    ],
    tech: ["Python", "Django", "PostgreSQL", "Bootstrap 5", "JavaScript", "HTML5 / CSS3"],
    github: "https://github.com/Veliznelson041/Proyecto-Ganaderia",
    demo: null,
  },
  {
    id: "03",
    name: "Canon de Riego",
    tagline: "Sistema de Gestión de Pagos",
    status: "dev",
    statusLabel: "En Progreso",
    description:
      "Sistema interno desarrollado en MAEMA para gestionar el pago del canon de riego provincial. Automatiza el control de pagos, usuarios y generación de comprobantes para la administración pública.",
    features: [
      "Gestión de usuarios y titular de derecho de riego",
      "Registro y seguimiento de pagos del canon",
      "Automatizaciones integradas con Trello y AppSheets",
      "Generación de comprobantes digitales",
      "Panel de control para personal administrativo",
    ],
    tech: ["Django", "PostgreSQL", "AppSheets", "Trello API", "Bootstrap"],
    github: "https://github.com/Veliznelson041",
    demo: null,
  },
];

/* ── Render Projects ────────────────────────── */
function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p) => {
    const featuresHTML = p.features
      .slice(0, 5)
      .map((f) => `<li class="feature-item">${f}</li>`)
      .join("");

    const techHTML = p.tech
      .map((t) => `<span class="tech-chip">${t}</span>`)
      .join("");

    const statusClass = p.status === "complete" ? "badge-complete" : "badge-dev";

    const githubLink = `<a href="${p.github}" target="_blank" rel="noopener" class="project-link primary">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:inline;vertical-align:-2px;margin-right:4px"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
      GitHub
    </a>`;

    const demoLink = p.demo
      ? `<a href="${p.demo}" target="_blank" rel="noopener" class="project-link">Demo →</a>`
      : `<span class="project-link" style="opacity:0.4;cursor:default;">Sin demo</span>`;

    return `
    <article class="project-card reveal reveal-scale">
      <div class="project-header">
        <div class="project-number">// ${p.id}</div>
        <h3 class="project-name">${p.name}</h3>
        <p class="project-tagline">${p.tagline}</p>
        <span class="project-badge ${statusClass}">${p.statusLabel}</span>
      </div>
      <div class="project-body">
        <p class="project-description">${p.description}</p>
        <ul class="feature-list">${featuresHTML}</ul>
      </div>
      <div class="project-tech">${techHTML}</div>
      <div class="project-footer">
        ${githubLink}
        ${demoLink}
      </div>
    </article>`;
  }).join("");

  // Re-trigger reveal observer on new elements
  if (window.revealObserver) {
    document.querySelectorAll(".reveal").forEach((el) => {
      window.revealObserver.observe(el);
    });
  }
}

/* ── Skills Data ────────────────────────────── */
const SKILLS = {
  backend: [
    { name: "Python",     icon: "🐍", level: 5 },
    { name: "Django",     icon: "🎸", level: 5 },
    { name: "REST API",   icon: "🔌", level: 4 },
    { name: "WebSockets", icon: "⚡", level: 3 },
    { name: "Java",       icon: "☕", level: 3 },
    { name: "PHP",        icon: "🐘", level: 2 },
    { name: "Node.js",    icon: "🟢", level: 2 },
  ],
  frontend: [
    { name: "HTML5",       icon: "🌐", level: 5 },
    { name: "CSS3",        icon: "🎨", level: 5 },
    { name: "JavaScript",  icon: "⚡", level: 4 },
    { name: "Bootstrap 5", icon: "🅱️", level: 5 },
    { name: "Tailwind",    icon: "💨", level: 3 },
    { name: "Chart.js",    icon: "📊", level: 4 },
    { name: "Leaflet.js",  icon: "🗺️", level: 3 },
  ],
  database: [
    { name: "PostgreSQL", icon: "🐘", level: 4 },
    { name: "MySQL",      icon: "🐬", level: 4 },
    { name: "pgAdmin4",   icon: "🛠️", level: 4 },
    { name: "phpMyAdmin", icon: "🔧", level: 3 },
  ],
  tools: [
    { name: "Git",       icon: "🔀", level: 4 },
    { name: "GitHub",    icon: "🐙", level: 4 },
    { name: "VS Code",   icon: "💻", level: 5 },
    { name: "Postman",   icon: "📮", level: 4 },
    { name: "Swagger",   icon: "📝", level: 3 },
    { name: "Nginx",     icon: "⚙️", level: 3 },
    { name: "Gunicorn",  icon: "🦄", level: 3 },
    { name: "Maltego",   icon: "🔍", level: 2 },
  ],
};

/* ── Render Skills ──────────────────────────── */
function renderSkills(category) {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  const items = SKILLS[category] || SKILLS.backend;

  grid.innerHTML = items
    .map(
      (s) => `
    <div class="skill-card reveal">
      <div class="skill-icon">${s.icon}</div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-level">
        ${[1, 2, 3, 4, 5]
          .map(
            (i) =>
              `<span class="skill-pip${i <= s.level ? " filled" : ""}"></span>`
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");

  // Re-trigger observer
  if (window.revealObserver) {
    grid.querySelectorAll(".reveal").forEach((el) => {
      window.revealObserver.observe(el);
    });
  }
}

/* ── Export ─────────────────────────────────── */
window.portfolioData = { PROJECTS, SKILLS, renderProjects, renderSkills };
