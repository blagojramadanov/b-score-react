import {
  fetchStandings,
  fetchLastResults,
  LEAGUES,
  LEAGUE_IDS,
} from "../api/api.js";

export function getLeaguesHtml() {
  return `
<section class="leagues">
  <h2 class="page-title">Top Leagues</h2>

  <div class="league-buttons">
    <button class="league-btn active" data-id="39">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</button>
    <button class="league-btn" data-id="140">🇪🇸 La Liga</button>
    <button class="league-btn" data-id="135">🇮🇹 Serie A</button>
    <button class="league-btn" data-id="78">🇩🇪 Bundesliga</button>
    <button class="league-btn" data-id="61">🇫🇷 Ligue 1</button>
  </div>

  <div class="leagues-content">
    <div class="leagues-content__table">
      <h3 class="section-label">Standings</h3>
      <table id="league-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody id="standings-body">
          <tr><td colspan="8" class="loading-cell"><div class="spinner"></div></td></tr>
        </tbody>
      </table>
    </div>

    <div class="leagues-content__results">
      <h3 class="section-label">Recent Results</h3>
      <div id="matches"></div>
    </div>
  </div>
</section>
`;
}

export function mountLeagues(container) {
  container.innerHTML = getLeaguesHtml();
  let activeId = 39;

  container.querySelectorAll(".league-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".league-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeId = parseInt(btn.dataset.id);
      loadLeague(activeId);
    });
  });

  loadLeague(activeId);
}

async function loadLeague(id) {
  loadStandings(id);
  loadResults(id);
}

async function loadStandings(id) {
  const tbody = document.getElementById("standings-body");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="8" class="loading-cell"><div class="spinner"></div></td></tr>`;

  const rows = await fetchStandings(id);
  if (!rows || !rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-cell">No standings data available.</td></tr>`;
    return;
  }

  const total = rows.length;
  tbody.innerHTML = rows
    .map((row) => {
      const pos = row.rank;
      let zone = "";
      if (pos <= 4) zone = "zone-ucl";
      else if (pos <= 6) zone = "zone-uel";
      else if (pos >= total - 2) zone = "zone-rel";

      const gd = row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff;
      const logo = row.team.logo
        ? `<img src="${row.team.logo}" class="team-logo-sm" alt="${row.team.name}" onerror="this.style.display='none'">`
        : "";

      return `
      <tr class="${zone}">
        <td class="pos-cell">${pos}</td>
        <td class="team-cell">
          ${logo}
          <span>${row.team.name}</span>
        </td>
        <td>${row.all.played}</td>
        <td>${row.all.win}</td>
        <td>${row.all.draw}</td>
        <td>${row.all.lose}</td>
        <td>${gd}</td>
        <td class="pts-cell">${row.points}</td>
      </tr>`;
    })
    .join("");
}

async function loadResults(id) {
  const matchesEl = document.getElementById("matches");
  if (!matchesEl) return;
  matchesEl.innerHTML = `<div class="inline-loader"><div class="spinner"></div> Loading results…</div>`;

  const fixtures = await fetchLastResults(id);
  if (!fixtures || !fixtures.length) {
    matchesEl.innerHTML = `<div class="no-matches"><strong>No results</strong>No recent matches found.</div>`;
    return;
  }

  matchesEl.innerHTML = fixtures
    .map((f) => {
      const dt = new Date(f.fixture.date);
      const date = dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      const rc = (hg, ag, home) => {
        if (hg === ag) return "draw";
        return home ? (hg > ag ? "win" : "loss") : ag > hg ? "win" : "loss";
      };
      const hC = rc(f.goals.home, f.goals.away, true);
      const aC = rc(f.goals.home, f.goals.away, false);
      const homeLogo = f.teams.home.logo
        ? `<img src="${f.teams.home.logo}" class="team-logo" alt="" onerror="this.style.display='none'">`
        : "";
      const awayLogo = f.teams.away.logo
        ? `<img src="${f.teams.away.logo}" class="team-logo" alt="" onerror="this.style.display='none'">`
        : "";
      return `
      <div class="result-row">
        <span class="result-row__date">${date}</span>
        <div class="result-row__home">
          ${homeLogo}
          <span class="result-row__name result-row__name--${hC}">${f.teams.home.name}</span>
        </div>
        <div class="result-row__score">
          <span>${f.goals.home}</span>
          <span class="result-row__sep">–</span>
          <span>${f.goals.away}</span>
        </div>
        <div class="result-row__away">
          ${awayLogo}
          <span class="result-row__name result-row__name--${aC}">${f.teams.away.name}</span>
        </div>
      </div>`;
    })
    .join("");
}
