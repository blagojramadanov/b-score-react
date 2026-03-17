import { fetchStandings, LEAGUES, LEAGUE_IDS } from "../api/api.js";

export function getTableHtml() {
  return `
<section class="table-page">
  <h2 class="page-title">Standings</h2>

  <div class="league-buttons">
    <button class="league-btn active" data-id="39">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</button>
    <button class="league-btn" data-id="140">🇪🇸 La Liga</button>
    <button class="league-btn" data-id="135">🇮🇹 Serie A</button>
    <button class="league-btn" data-id="78">🇩🇪 Bundesliga</button>
    <button class="league-btn" data-id="61">🇫🇷 Ligue 1</button>
  </div>

  <div class="zone-legend">
    <span class="zone-legend__item zone-legend__item--ucl">Champions League</span>
    <span class="zone-legend__item zone-legend__item--uel">Europa League</span>
    <span class="zone-legend__item zone-legend__item--rel">Relegation</span>
  </div>

  <div id="tableContainer">
    <div class="inline-loader"><div class="spinner"></div> Loading standings…</div>
  </div>
</section>
`;
}

export function mountTable(container) {
  container.innerHTML = getTableHtml();
  let activeId = 39;

  container.querySelectorAll(".league-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".league-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeId = parseInt(btn.dataset.id);
      renderStandingsInto(document.getElementById("tableContainer"), activeId);
    });
  });

  renderStandingsInto(document.getElementById("tableContainer"), activeId);
}

export async function renderStandingsInto(el, leagueId) {
  if (!el) return;
  el.innerHTML = `<div class="inline-loader"><div class="spinner"></div> Loading…</div>`;

  const rows = await fetchStandings(leagueId);
  if (!rows || !rows.length) {
    el.innerHTML = `<div class="no-matches"><strong>Unavailable</strong>No standings data for this league.</div>`;
    return;
  }

  const total = rows.length;
  const trs = rows
    .map((row) => {
      const pos = row.rank;
      let zone = "";
      if (pos <= 4) zone = "zone-ucl";
      else if (pos <= 6) zone = "zone-uel";
      else if (pos === 7) zone = "zone-conf";
      else if (pos >= total - 2) zone = "zone-rel";

      const gd = row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff;
      const form = (row.form || "")
        .slice(-5)
        .split("")
        .map((c) => {
          const cls = c === "W" ? "dot-w" : c === "D" ? "dot-d" : "dot-l";
          return `<span class="dot ${cls}"></span>`;
        })
        .join("");

      const logo = row.team.logo
        ? `<img src="${row.team.logo}" class="team-logo-sm" alt="${row.team.name}" onerror="this.style.display='none'">`
        : "";

      return `
      <tr class="${zone}">
        <td class="pos-cell">${pos}</td>
        <td class="team-cell">${logo}<span>${row.team.name}</span></td>
        <td>${row.all.played}</td>
        <td>${row.all.win}</td>
        <td>${row.all.draw}</td>
        <td>${row.all.lose}</td>
        <td>${gd}</td>
        <td><div class="form-dots">${form}</div></td>
        <td class="pts-cell">${row.points}</td>
      </tr>`;
    })
    .join("");

  el.innerHTML = `
    <table class="standings-table">
      <thead>
        <tr>
          <th>#</th><th>Club</th><th>P</th><th>W</th>
          <th>D</th><th>L</th><th>GD</th><th>Form</th><th>Pts</th>
        </tr>
      </thead>
      <tbody>${trs}</tbody>
    </table>`;
}
