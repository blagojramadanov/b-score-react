const API_KEY = "8243ec99557b450a9c932eca7d54fa06";
const BASE = "https://api.football-data.org/v4";

const ALLOWED_ORIGIN = "https://blagojramadanov.github.io";

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, X-Auth-Token, X-Unfold-Goals, X-Unfold-Bookings, X-Unfold-Lineups, X-Unfold-Subs",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname + url.search;

    const apiRes = await fetch(`${BASE}${path}`, {
      headers: {
        "X-Auth-Token": API_KEY,
        "X-Unfold-Goals": request.headers.get("X-Unfold-Goals") || "",
        "X-Unfold-Bookings": request.headers.get("X-Unfold-Bookings") || "",
        "X-Unfold-Lineups": request.headers.get("X-Unfold-Lineups") || "",
        "X-Unfold-Subs": request.headers.get("X-Unfold-Subs") || "",
      },
    });

    const body = await apiRes.text();
    const headers = new Headers({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Cache-Control": "public, max-age=300",
    });

    return new Response(body, { status: apiRes.status, headers });
  },
};
