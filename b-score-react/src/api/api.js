const IS_DEV = import.meta.env.DEV;
const BASE = IS_DEV ? "/api" : import.meta.env.VITE_WORKER_URL;
const KEY = import.meta.env.VITE_API_KEY;
const RATE_DELAY = 6000;
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_VER = "v2";

export const LEAGUES = {
  PL: {
    name: "Premier League",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    logo: "https://crests.football-data.org/PL.png",
  },
  PD: {
    name: "La Liga",
    country: "Spain",
    flag: "🇪🇸",
    logo: "https://crests.football-data.org/PD.png",
  },
  SA: {
    name: "Serie A",
    country: "Italy",
    flag: "🇮🇹",
    logo: "https://crests.football-data.org/SA.png",
  },
  BL1: {
    name: "Bundesliga",
    country: "Germany",
    flag: "🇩🇪",
    logo: "https://crests.football-data.org/BL1.png",
  },
  FL1: {
    name: "Ligue 1",
    country: "France",
    flag: "🇫🇷",
    logo: "https://crests.football-data.org/FL1.png",
  },
};

export const LEAGUE_CODES = ["PL", "PD", "SA", "BL1", "FL1"];

(function bustCache() {
  try {
    if (localStorage.getItem("bscore_ver") !== CACHE_VER) {
      Object.keys(localStorage).forEach((k) => localStorage.removeItem(k));
      localStorage.setItem("bscore_ver", CACHE_VER);
    }
  } catch {}
})();

let lastCall = 0;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function lsGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function lsSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

async function call(path) {
  const cached = lsGet(path);
  if (cached) return cached;
  const since = Date.now() - lastCall;
  if (since < RATE_DELAY) await wait(RATE_DELAY - since);
  lastCall = Date.now();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const isMatch = path.startsWith("/matches/");
    const r = await fetch(`${BASE}${path}`, {
      headers: {
        "X-Auth-Token": KEY,
        ...(isMatch
          ? {
              "X-Unfold-Goals": "true",
              "X-Unfold-Bookings": "true",
              "X-Unfold-Lineups": "true",
              "X-Unfold-Subs": "true",
            }
          : {}),
      },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) {
      console.warn(`[API] ${r.status} ${path}`);
      return null;
    }
    const json = await r.json();
    lsSet(path, json);
    return json;
  } catch (e) {
    clearTimeout(t);
    console.warn("[API]", path, e.message);
    return null;
  }
}

export const fetchStandings = async (code) => {
  const d = await call(`/competitions/${code}/standings`);
  return d?.standings?.find((s) => s.type === "TOTAL")?.table || null;
};

export const fetchMatches = async (code) => {
  const d = await call(`/competitions/${code}/matches?status=FINISHED`);
  return d?.matches || null;
};

export const fetchScorers = async (code) => {
  const d = await call(`/competitions/${code}/scorers?limit=20`);
  return d?.scorers || null;
};

export const fetchMatch = async (id) => call(`/matches/${id}`);

export const fetchTeam = async (id) => call(`/teams/${id}`);

export const fetchTeamMatches = async (teamId, code) => {
  const d = await call(
    `/teams/${teamId}/matches?competitions=${code}&status=FINISHED&limit=30`,
  );
  return d?.matches || null;
};

export function clearCache() {
  try {
    Object.keys(localStorage)
      .filter(
        (k) =>
          k.startsWith("/competitions") ||
          k.startsWith("/matches") ||
          k.startsWith("/teams"),
      )
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}
