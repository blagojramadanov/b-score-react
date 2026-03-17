import { fetchLiveFixtures, getDemoFixtures, LEAGUES } from "../api/api.js";

export function getLiveHtml() {
  return `
<section class="live-page">
  <div class="live-page__header">
    <h2 class="page-title">
      <span class="pulse-dot"></span> Live Scores
    </h2>
    <span class="live-page__updated">Updated: <span id="liveUpdated">—</span></span>
  </div>

  <div class="live-notice" id="liveNotice" style="display:none">
    No live matches right now. Check back during match times or
    <a href="#" data-nav="home">view today's fixtures</a>.
  </div>

  <div id="liveGrid" class="live-grid">
    <div class="page-loader">
      <div class="spinner"></div>
      <p>Checking for live matches…</p>
    </div>
  </div>
</section>
`;
}

export function mountLive(container) {
  container.innerHTML = getLiveHtml();
  let timer = null;

  async function refresh() {
    const grid = document.getElementById("liveGrid");
    if (!grid) return;

    const fixtures = await fetchLiveFixtures();
    document.getElementById("liveUpdated").textContent =
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const list = fixtures || [];
    if (!list.length) {
      grid.innerHTML = "";
      document.getElementById("liveNotice").style.display = "block";
      return;
    }
    document.getElementById("liveNotice").style.display = "none";

    const byLeague = {};
    list.forEach((f) => {
      if (!byLeague[f.league.id])
        byLeague[f.league.id] = { league: f.league, matches: [] };
      byLeague[f.league.id].matches.push(f);
    });

    grid.innerHTML = Object.values(byLeague)
      .map(({ league, matches }) => {
        const meta = LEAGUES[league.id] || { flag: "🌐", name: league.name };
        const cards = matches
          .map((f) => {
            const el = f.fixture.status.elapsed;
            const s = f.fixture.status.short;
            const pct = el ? Math.min(Math.round((el / 90) * 100), 100) : 0;
            const logo = (url) =>
              url
                ? `<img src="${url}" class="team-logo" alt="" loading="lazy" onerror="this.style.display='none'">`
                : "";
            return `
          <div class="live-card">
            <div class="live-card__minute">
              ${el ? `${el}'` : s}
              <div class="match-minute-bar"><div class="match-minute-bar__fill" style="width:${pct}%"></div></div>
            </div>
            <div class="live-card__teams">
              <div class="live-card__team">
                ${logo(f.teams.home.logo)}
                <span>${f.teams.home.name}</span>
              </div>
              <div class="live-card__score">
                <span>${f.goals.home ?? 0}</span>
                <span class="live-card__sep">–</span>
                <span>${f.goals.away ?? 0}</span>
              </div>
              <div class="live-card__team live-card__team--away">
                ${logo(f.teams.away.logo)}
                <span>${f.teams.away.name}</span>
              </div>
            </div>
          </div>`;
          })
          .join("");

        return `
        <div class="live-league">
          <div class="live-league__header">
            <span>${meta.flag}</span>
            <span>${meta.name}</span>
            <span class="live-league__count">${matches.length} live</span>
          </div>
          ${cards}
        </div>`;
      })
      .join("");
  }

  refresh();
  timer = setInterval(refresh, 30000);

  document.addEventListener("bscore:navigate", () => clearInterval(timer), {
    once: true,
  });
}
