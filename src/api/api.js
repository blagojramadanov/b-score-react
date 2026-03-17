const BASE_URL = "https://v3.football.api-sports.io";
const API_KEY = "ba6b3aedb4932b10a34022851ae731e0";
const SEASON = 2024;
const TIMEOUT = 10000;

// Top-5 league IDs (API-Football)
export const LEAGUES = {
  39: { name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  140: { name: "La Liga", country: "Spain", flag: "🇪🇸" },
  135: { name: "Serie A", country: "Italy", flag: "🇮🇹" },
  78: { name: "Bundesliga", country: "Germany", flag: "🇩🇪" },
  61: { name: "Ligue 1", country: "France", flag: "🇫🇷" },
};

export const LEAGUE_IDS = [39, 140, 135, 78, 61];

async function apiFetch(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "x-apisports-key": API_KEY },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const remaining = res.headers.get("x-ratelimit-requests-remaining");
    const limit = res.headers.get("x-ratelimit-requests-limit");
    if (remaining !== null) {
      window.dispatchEvent(
        new CustomEvent("bscore:quota", {
          detail: {
            used: (parseInt(limit) || 100) - (parseInt(remaining) || 0),
            limit: parseInt(limit) || 100,
          },
        }),
      );
    }

    const json = await res.json();
    if (json.errors && Object.keys(json.errors).length) {
      console.warn("[API] error response:", json.errors);
      return null;
    }
    return json;
  } catch (err) {
    clearTimeout(timer);
    console.warn("[API] fetch failed:", path, err.message);
    return null;
  }
}

export async function fetchFixturesByDate(date) {
  const data = await apiFetch(`/fixtures?date=${date}&timezone=Europe/London`);
  if (!data || !Array.isArray(data.response)) return null;
  return data.response.filter((f) => LEAGUES[f.league.id]);
}

export async function fetchLiveFixtures() {
  const ids = LEAGUE_IDS.join("-");
  const data = await apiFetch(`/fixtures?live=${ids}`);
  if (!data || !Array.isArray(data.response)) return null;
  return data.response;
}

/**
 * League standings table.
 * @param {number} leagueId
 */
export async function fetchStandings(leagueId) {
  const data = await apiFetch(`/standings?league=${leagueId}&season=${SEASON}`);
  try {
    return data.response[0].league.standings[0];
  } catch (_) {
    return null;
  }
}

/**
 * Recent results (last 10) for a league.
 * @param {number} leagueId
 */
export async function fetchLastResults(leagueId) {
  const data = await apiFetch(
    `/fixtures?league=${leagueId}&season=${SEASON}&last=10&status=FT`,
  );
  if (!data || !Array.isArray(data.response)) return null;
  return data.response;
}

/**
 * Next fixtures (next 10) for a league.
 * @param {number} leagueId
 */
export async function fetchNextFixtures(leagueId) {
  const data = await apiFetch(
    `/fixtures?league=${leagueId}&season=${SEASON}&next=10`,
  );
  if (!data || !Array.isArray(data.response)) return null;
  return data.response;
}

/**
 * Team info + squad.
 * @param {number} teamId
 */
export async function fetchTeam(teamId) {
  const data = await apiFetch(`/teams?id=${teamId}`);
  try {
    return data.response[0];
  } catch (_) {
    return null;
  }
}

/**
 * Top scorers for a league.
 * @param {number} leagueId
 */
export async function fetchTopScorers(leagueId) {
  const data = await apiFetch(
    `/players/topscorers?league=${leagueId}&season=${SEASON}`,
  );
  if (!data || !Array.isArray(data.response)) return null;
  return data.response;
}

export function getDemoFixtures(date) {
  const mk = (id, lgId, home, away, hg, ag, status, elapsed) => ({
    fixture: {
      id,
      date: `${date}T20:00:00+00:00`,
      status: { short: status, elapsed: elapsed || null },
    },
    league: {
      id: lgId,
      name: LEAGUES[lgId].name,
      country: LEAGUES[lgId].country,
      logo: "",
      flag: "",
    },
    teams: {
      home: { id: id * 10, name: home, logo: "" },
      away: { id: id * 10 + 1, name: away, logo: "" },
    },
    goals: { home: hg, away: ag },
  });
  return [
    mk(1, 39, "Arsenal", "Chelsea", 2, 1, "FT", 90),
    mk(2, 39, "Liverpool", "Man City", 1, 1, "FT", 90),
    mk(3, 39, "Newcastle", "Aston Villa", null, null, "NS", null),
    mk(4, 140, "Real Madrid", "Barcelona", 2, 1, "FT", 90),
    mk(5, 140, "Atletico Madrid", "Sevilla", null, null, "NS", null),
    mk(6, 135, "Inter Milan", "Juventus", 1, 0, "FT", 90),
    mk(7, 135, "AC Milan", "Napoli", 2, 2, "FT", 90),
    mk(8, 78, "Bayern Munich", "Dortmund", 3, 1, "1H", 38),
    mk(9, 78, "Leverkusen", "RB Leipzig", null, null, "NS", null),
    mk(10, 61, "PSG", "Marseille", 4, 1, "FT", 90),
    mk(11, 61, "Monaco", "Lyon", null, null, "2H", 67),
  ];
}
