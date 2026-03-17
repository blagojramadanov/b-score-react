import { fetchTeam, fetchLastResults } from "../api/api.js";

export function getTeamHtml() {
  return `
<section class="team-page">
  <div id="teamContent">
    <div class="page-loader">
      <div class="spinner"></div>
      <p>Loading team…</p>
    </div>
  </div>
</section>
`;
}

export async function mountTeam(container, teamId) {
  container.innerHTML = getTeamHtml();
  const contentEl = document.getElementById("teamContent");

  if (!teamId) {
    contentEl.innerHTML = `<div class="no-matches"><strong>No team selected</strong>
      Navigate here via a match or standings row.</div>`;
    return;
  }

  const [teamData, results] = await Promise.all([
    fetchTeam(teamId),
    fetchLastResults(null),
  ]);

  if (!teamData) {
    contentEl.innerHTML = `<div class="no-matches"><strong>Team not found</strong>
      Could not load data for this team.</div>`;
    return;
  }

  const t = teamData.team;
  const v = teamData.venue;

  contentEl.innerHTML = `
    <div class="team-hero">
      ${t.logo ? `<img src="${t.logo}" class="team-hero__logo" alt="${t.name}">` : ""}
      <div class="team-hero__info">
        <h2 class="team-hero__name">${t.name}</h2>
        <p class="team-hero__meta">${t.country} · Founded ${t.founded || "—"}</p>
        ${v ? `<p class="team-hero__venue">${v.name}, ${v.city}</p>` : ""}
      </div>
    </div>

    <h3 class="section-label">Recent Matches</h3>
    <div id="teamResults">
      <div class="inline-loader"><div class="spinner"></div></div>
    </div>
  `;
}
