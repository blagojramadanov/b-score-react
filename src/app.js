function getShellHtml() {
  return `
<div class="app-shell">

  <header class="navbar">
    <div class="container navbar__inner">
      <a class="navbar__logo" data-nav="home">B<span>·</span>SCORE</a>
      <nav class="navbar__nav">
        <a class="navbar__link active" data-nav="home">Scores</a>
        <a class="navbar__link" data-nav="live"><span class="pulse-dot"></span> Live</a>
        <a class="navbar__link" data-nav="leagues">Leagues</a>
        <a class="navbar__link" data-nav="table">Tables</a>
        <a class="navbar__link" data-nav="about">About</a>
      </nav>
      <div class="navbar__right">
        <div class="navbar__quota" title="API requests used today">
          <span id="quotaUsed">0</span>/<span id="quotaMax">100</span> req
        </div>
        <button class="navbar__burger" id="navBurger" aria-label="Menu">☰</button>
      </div>
    </div>
    <div class="navbar__drawer" id="navDrawer">
      <a class="navbar__drawer-link" data-nav="home">Scores</a>
      <a class="navbar__drawer-link" data-nav="live">Live</a>
      <a class="navbar__drawer-link" data-nav="leagues">Leagues</a>
      <a class="navbar__drawer-link" data-nav="table">Tables</a>
      <a class="navbar__drawer-link" data-nav="about">About</a>
    </div>
  </header>

  <main class="page-content container" id="pageContent">
    <div class="page-loader">
      <div class="spinner"></div>
      <p>Loading…</p>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <span class="footer__logo">B<span>·</span>SCORE</span>
      <p>Data: <a href="https://www.api-football.com" target="_blank" rel="noopener">API-Football</a></p>
      <p class="footer__note">© <span id="footerYear"></span> B-Score. For informational use only.</p>
    </div>
  </footer>

</div>`;
}

const ROUTES = {
  home: () => import("./pages/home.js").then((m) => m.mountHome),
  live: () => import("./pages/live.js").then((m) => m.mountLive),
  leagues: () => import("./pages/leagues.js").then((m) => m.mountLeagues),
  table: () => import("./pages/table.js").then((m) => m.mountTable),
  team: () => import("./pages/team.js").then((m) => m.mountTeam),
  about: () => import("./pages/about.js").then((m) => m.mountAbout),
};

export function initApp(rootEl) {
  rootEl.innerHTML = getShellHtml();
  document.getElementById("footerYear").textContent = new Date().getFullYear();

  window.addEventListener("bscore:quota", (e) => {
    const u = document.getElementById("quotaUsed");
    const m = document.getElementById("quotaMax");
    if (u) u.textContent = e.detail.used;
    if (m) m.textContent = e.detail.limit;
  });

  const burger = document.getElementById("navBurger");
  const drawer = document.getElementById("navDrawer");
  burger?.addEventListener("click", (e) => {
    e.stopPropagation();
    drawer.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#navDrawer") && !e.target.closest("#navBurger")) {
      drawer?.classList.remove("open");
    }
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-nav]");
    if (!link) return;
    e.preventDefault();
    navigateTo(link.dataset.nav);
    drawer?.classList.remove("open");
  });

  const page = window.location.hash.replace(/^#\/?/, "") || "home";
  navigateTo(ROUTES[page] ? page : "home");
}

async function navigateTo(page) {
  document.dispatchEvent(new CustomEvent("bscore:navigate"));

  document
    .querySelectorAll("[data-nav]")
    .forEach((el) => el.classList.toggle("active", el.dataset.nav === page));

  window.location.hash = page;
  window.scrollTo({ top: 0, behavior: "smooth" });

  const content = document.getElementById("pageContent");
  if (!content) return;
  content.innerHTML = `<div class="page-loader"><div class="spinner"></div><p>Loading…</p></div>`;

  try {
    const getMount = ROUTES[page];
    if (!getMount) {
      navigateTo("home");
      return;
    }
    const mount = await getMount();
    mount(content);
  } catch (err) {
    console.error("[App] Route error:", err);
    content.innerHTML = `<div class="no-matches"><strong>Error</strong>Could not load this page.</div>`;
  }
}

window.__bscoreNav = navigateTo;
