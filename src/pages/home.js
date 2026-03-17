import {
  fetchFixturesByDate,
  getDemoFixtures,
  LEAGUES,
  LEAGUE_IDS,
} from "../api/api.js";

function getHomeHtml() {
  return `
<section class="home">

  <div class="hero">
    <div class="hero__left">
      <h1 class="hero__title">The Score.<br/><em>The Real One.</em></h1>
      <p class="hero__sub">Live results, tables and fixtures for Europe's top five leagues — fast, clean, no noise.</p>
      <a href="#scores" class="btn btn--accent">See Today's Scores</a>
    </div>
    <div class="hero__features">
      <div class="feature-card"><span class="feature-card__icon">⚡</span><h3>Real-Time Updates</h3><p>Scores refresh every 60 seconds automatically.</p></div>
      <div class="feature-card"><span class="feature-card__icon">🏆</span><h3>Top 5 Leagues</h3><p>PL · La Liga · Serie A · Bundesliga · Ligue 1.</p></div>
      <div class="feature-card"><span class="feature-card__icon">↕</span><h3>Drag to Reorder</h3><p>Arrange league panels exactly how you like.</p></div>
      <div class="feature-card"><span class="feature-card__icon">📊</span><h3>Live Standings</h3><p>Tables update the moment a final whistle blows.</p></div>
    </div>
  </div>

  <div id="scores" class="date-nav">
    <div class="container date-nav__inner">
      <button class="date-nav__arrow" id="datePrev">&#8249;</button>
      <div class="date-nav__strip" id="dateStrip"></div>
      <button class="date-nav__arrow" id="dateNext">&#8250;</button>
    </div>
  </div>

  <div class="stats-bar" id="statsBar" style="display:none">
    <div class="container stats-bar__inner">
      <div class="stat-chip"><span class="stat-chip__val" id="statLive">0</span><span class="stat-chip__lbl">Live Now</span></div>
      <div class="stat-chip"><span class="stat-chip__val" id="statMatches">0</span><span class="stat-chip__lbl">Matches</span></div>
      <div class="stat-chip"><span class="stat-chip__val" id="statGoals">0</span><span class="stat-chip__lbl">Goals</span></div>
      <div class="stat-chip stat-chip--time"><span class="stat-chip__val" id="lastRefresh">—</span><span class="stat-chip__lbl">Updated</span></div>
    </div>
  </div>

  <div class="container">
  </div>

  <div class="container">
    <div class="leagues-grid" id="leaguesGrid">
      <div class="page-loader" id="pageLoader">
        <div class="spinner"></div>
        <p>Fetching today's matches…</p>
      </div>
    </div>
  </div>

</section>`;
}

export function mountHome(container) {
  container.innerHTML = getHomeHtml();

  const state = {
    selectedDate: todayISO(),
    fixtures: [],
    leagueOrder: loadOrder(),
    timer: null,
  };

  buildDateStrip(state);
  setupArrows(state);
  loadDate(state);

  document.addEventListener(
    "bscore:navigate",
    () => {
      if (state.timer) clearInterval(state.timer);
    },
    { once: true },
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function offsetISO(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function friendlyDate(iso) {
  const d = new Date(iso + "T12:00:00");
  const off = Math.round((d - new Date()) / 86400000);
  if (off === 0) return "Today";
  if (off === -1) return "Yesterday";
  if (off === 1) return "Tomorrow";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function buildDateStrip(state) {
  const strip = document.getElementById("dateStrip");
  if (!strip) return;
  strip.innerHTML = "";
  for (let i = -3; i <= 4; i++) {
    const iso = offsetISO(i);
    const btn = document.createElement("button");
    btn.className = "date-pill" + (iso === state.selectedDate ? " active" : "");
    btn.textContent = friendlyDate(iso);
    btn.dataset.iso = iso;
    btn.addEventListener("click", () => {
      state.selectedDate = iso;
      strip
        .querySelectorAll(".date-pill")
        .forEach((p) => p.classList.toggle("active", p.dataset.iso === iso));
      loadDate(state);
    });
    strip.appendChild(btn);
  }
}

function setupArrows(state) {
  document.getElementById("datePrev")?.addEventListener("click", () => {
    const d = new Date(state.selectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    state.selectedDate = d.toISOString().slice(0, 10);
    buildDateStrip(state);
    loadDate(state);
  });
  document.getElementById("dateNext")?.addEventListener("click", () => {
    const d = new Date(state.selectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    state.selectedDate = d.toISOString().slice(0, 10);
    buildDateStrip(state);
    loadDate(state);
  });
}

async function loadDate(state) {
  if (state.timer) clearInterval(state.timer);
  await fetchAndRender(state);
  state.timer = setInterval(() => fetchAndRender(state), 60000);
}

async function fetchAndRender(state) {
  const data = await fetchFixturesByDate(state.selectedDate);
  const demoNotice = document.getElementById("demoNotice");

  if (!data) {
    state.fixtures = getDemoFixtures(state.selectedDate);
    if (demoNotice) demoNotice.style.display = "block";
  } else {
    state.fixtures = data;
    if (demoNotice) demoNotice.style.display = "none";
  }

  renderPanels(state);
  updateStats(state);
}

function updateStats(state) {
  const bar = document.getElementById("statsBar");
  if (bar) bar.style.display = "block";
  const LIVE = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE"]);
  const liveCount = state.fixtures.filter((f) =>
    LIVE.has(f.fixture.status.short),
  ).length;
  const goals = state.fixtures.reduce(
    (s, f) => s + (f.goals.home || 0) + (f.goals.away || 0),
    0,
  );
  const el = (id) => document.getElementById(id);
  if (el("statLive")) el("statLive").textContent = liveCount;
  if (el("statMatches")) el("statMatches").textContent = state.fixtures.length;
  if (el("statGoals")) el("statGoals").textContent = goals;
  if (el("lastRefresh"))
    el("lastRefresh").textContent = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const loader = el("pageLoader");
  if (loader) loader.style.display = "none";
}

function renderPanels(state) {
  const grid = document.getElementById("leaguesGrid");
  if (!grid) return;

  const collapsed = {};
  grid.querySelectorAll(".league-panel[data-league-id]").forEach((p) => {
    collapsed[p.dataset.leagueId] = p.classList.contains("panel-collapsed");
  });

  grid.innerHTML = "";
  state.leagueOrder.forEach((id) => {
    const meta = LEAGUES[id];
    const fixes = state.fixtures.filter((f) => f.league.id === id);
    grid.appendChild(buildPanel(id, meta, fixes, !!collapsed[id]));
  });
  setupDragDrop(state);
}

function buildPanel(leagueId, meta, fixtures, startCollapsed) {
  const LIVE = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE"]);
  const liveCount = fixtures.filter((f) =>
    LIVE.has(f.fixture.status.short),
  ).length;

  const panel = document.createElement("div");
  panel.className = "league-panel" + (startCollapsed ? " panel-collapsed" : "");
  panel.dataset.leagueId = leagueId;
  panel.setAttribute("draggable", "true");

  panel.innerHTML = `
    <div class="panel-header">
      <span class="panel-header__handle">⠿</span>
      <span class="panel-header__flag">${meta.flag}</span>
      <span class="panel-header__name">${meta.name}</span>
      <span class="panel-header__country">${meta.country}</span>
      ${
        liveCount > 0
          ? `<span class="panel-header__live">● ${liveCount} LIVE</span>`
          : `<span class="panel-header__count">${fixtures.length} match${fixtures.length !== 1 ? "es" : ""}</span>`
      }
      <div class="panel-header__tabs">
        <button class="panel-tab active" data-tab="matches">Matches</button>
        <button class="panel-tab" data-tab="standings">Table</button>
      </div>
      <button class="panel-header__toggle" aria-label="Toggle">▼</button>
    </div>
    <div class="panel-body">
      <div class="panel-tab-content active" data-content="matches">
        ${buildMatchListHtml(fixtures)}
      </div>
      <div class="panel-tab-content" data-content="standings">
        <div class="inline-loader">
          <div class="spinner"></div> Loading table…
        </div>
      </div>
    </div>`;

  const body = panel.querySelector(".panel-body");
  if (!startCollapsed) {
    body.style.maxHeight = "2000px";
  } else {
    body.style.maxHeight = "0";
  }

  panel.querySelectorAll(".panel-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      panel
        .querySelectorAll(".panel-tab")
        .forEach((t) => t.classList.remove("active"));
      panel
        .querySelectorAll(".panel-tab-content")
        .forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      panel
        .querySelector(`[data-content="${tab.dataset.tab}"]`)
        .classList.add("active");
      if (tab.dataset.tab === "standings")
        loadStandingsIntoPanel(leagueId, panel);
    });
  });

  panel
    .querySelector(".panel-header__toggle")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      const isNowCollapsed = panel.classList.toggle("panel-collapsed");
      body.style.maxHeight = isNowCollapsed ? "0" : "2000px";
    });

  return panel;
}

function buildMatchListHtml(fixtures) {
  if (!fixtures.length) {
    return `<div class="no-matches"><strong>No fixtures</strong>No matches scheduled for this date.</div>`;
  }
  const LIVE_ST = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE"]);
  const FT_ST = new Set(["FT", "AET", "PEN"]);

  const sorted = [...fixtures].sort((a, b) => {
    const aL = LIVE_ST.has(a.fixture.status.short) ? 0 : 1;
    const bL = LIVE_ST.has(b.fixture.status.short) ? 0 : 1;
    return aL !== bL
      ? aL - bL
      : new Date(a.fixture.date) - new Date(b.fixture.date);
  });

  return `<div class="match-list">${sorted
    .map((f) => {
      const s = f.fixture.status.short;
      const el = f.fixture.status.elapsed;
      const live = LIVE_ST.has(s);
      const ft = FT_ST.has(s);
      const ppd = s === "PST";
      const hs = f.goals.home !== null && f.goals.away !== null;
      const dt = new Date(f.fixture.date);
      const time = dt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      let timeHtml;
      if (live) {
        const pct = el ? Math.min(Math.round((el / 90) * 100), 100) : 0;
        timeHtml = `<div class="match-time match-time--live">${el ? el + "'" : "LIVE"}
        <div class="match-minute-bar"><div class="match-minute-bar__fill" style="width:${pct}%"></div></div>
        <span class="match-time__sub">${s}</span></div>`;
      } else if (ft) {
        timeHtml = `<div class="match-time match-time--ft">${date}<span class="match-time__sub">FT</span></div>`;
      } else if (ppd) {
        timeHtml = `<div class="match-time match-time--ppd">${time}<span class="match-time__sub">PPD</span></div>`;
      } else {
        timeHtml = `<div class="match-time">${time}<span class="match-time__sub">${date}</span></div>`;
      }

      const scoreHtml = hs
        ? `<div class="match-score${live ? " match-score--live" : ""}"><span>${f.goals.home}</span><span class="match-score__sep">–</span><span>${f.goals.away}</span></div>`
        : `<div class="match-score"><span class="match-score__vs">vs</span></div>`;

      const badgeClass = live
        ? "badge--live"
        : ft
          ? "badge--ft"
          : ppd
            ? "badge--ppd"
            : "badge--ns";
      const badgeTxt = live ? "LIVE" : ft ? s : ppd ? "PPD" : "NS";

      const rc = (hg, ag, home) => {
        if (hg === null || ag === null) return "";
        if (hg === ag) return "draw";
        return home ? (hg > ag ? "win" : "loss") : ag > hg ? "win" : "loss";
      };
      const hC = hs ? rc(f.goals.home, f.goals.away, true) : "";
      const aC = hs ? rc(f.goals.home, f.goals.away, false) : "";
      const ini = (n) =>
        n
          ? n
              .trim()
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 3)
              .toUpperCase()
          : "?";
      const logo = (url, name) =>
        url
          ? `<img class="team-logo" src="${url}" alt="${name}" loading="lazy" onerror="this.style.display='none'">`
          : `<span class="team-logo team-logo--ini">${ini(name)}</span>`;

      return `
      <div class="match-row">
        ${timeHtml}
        <div class="match-team">
          ${logo(f.teams.home.logo, f.teams.home.name)}
          <span class="match-team__name${hC ? " match-team__name--" + hC : ""}">${f.teams.home.name}</span>
        </div>
        ${scoreHtml}
        <div class="match-team match-team--away">
          ${logo(f.teams.away.logo, f.teams.away.name)}
          <span class="match-team__name${aC ? " match-team__name--" + aC : ""}">${f.teams.away.name}</span>
        </div>
        <div class="match-badge ${badgeClass}"><span>${badgeTxt}</span></div>
      </div>`;
    })
    .join("")}</div>`;
}

async function loadStandingsIntoPanel(leagueId, panel) {
  const { renderStandingsInto } = await import("./table.js");
  renderStandingsInto(
    panel.querySelector('[data-content="standings"]'),
    leagueId,
  );
}

function setupDragDrop(state) {
  const grid = document.getElementById("leaguesGrid");
  if (!grid) return;
  let dragSrc = null;

  grid.querySelectorAll(".league-panel").forEach((panel) => {
    panel.addEventListener("dragstart", function (e) {
      dragSrc = this;
      setTimeout(() => this.classList.add("dragging"), 0);
      e.dataTransfer.effectAllowed = "move";
    });
    panel.addEventListener("dragend", function () {
      this.classList.remove("dragging");
      grid
        .querySelectorAll(".league-panel")
        .forEach((p) => p.classList.remove("drag-over"));
      state.leagueOrder = [...grid.querySelectorAll(".league-panel")].map((p) =>
        parseInt(p.dataset.leagueId),
      );
      saveOrder(state.leagueOrder);
    });
    panel.addEventListener("dragover", function (e) {
      e.preventDefault();
      if (this !== dragSrc) this.classList.add("drag-over");
    });
    panel.addEventListener("dragleave", function () {
      this.classList.remove("drag-over");
    });
    panel.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
      if (dragSrc && this !== dragSrc) {
        const kids = [...grid.children];
        grid.insertBefore(
          dragSrc,
          kids.indexOf(dragSrc) < kids.indexOf(this) ? this.nextSibling : this,
        );
      }
    });
  });
}

function saveOrder(order) {
  try {
    localStorage.setItem("bscore_order", JSON.stringify(order));
  } catch (_) {}
}
function loadOrder() {
  try {
    const s = localStorage.getItem("bscore_order");
    if (!s) return [...LEAGUE_IDS];
    const o = JSON.parse(s);
    return o.length === LEAGUE_IDS.length && o.every((id) => LEAGUES[id])
      ? o
      : [...LEAGUE_IDS];
  } catch (_) {
    return [...LEAGUE_IDS];
  }
}
