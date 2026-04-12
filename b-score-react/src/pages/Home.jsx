import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStandings, LEAGUES, LEAGUE_CODES } from "../api/api.js";
import MiniTable from "../components/MiniTable.jsx";

export default function Home() {
  const [standings, setStandings] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      for (const code of LEAGUE_CODES) {
        if (cancelled) break;
        const rows = await fetchStandings(code);
        if (!cancelled) setStandings((prev) => ({ ...prev, [code]: rows }));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="home">
      <div className="hero">
        <div className="hero__inner">
          <div className="hero__left">
            <div className="hero__badge">2025 / 26 Season</div>
            <h1 className="hero__title">
              The Score.
              <br />
              <em>The Real One.</em>
            </h1>
            <p className="hero__sub">
              Full match history, lineups, scorers, cards and standings for
              Europe's top 5 leagues.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--accent" to="/league/PL">
                Explore Leagues
              </Link>
              <Link className="btn btn--ghost" to="/about">
                About B-Score
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-val">5</span>
                <span className="hero__stat-lbl">Leagues</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-val">98</span>
                <span className="hero__stat-lbl">Teams</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-val">380+</span>
                <span className="hero__stat-lbl">Matches</span>
              </div>
            </div>
          </div>
          <div className="hero__image-wrap">
            <img
              src="/b-score-react/topleagues.jpg"
              alt="Top Leagues"
              className="hero__image"
            />
            <div className="hero__image-overlay" />
          </div>
        </div>
      </div>

      <div className="features-bar">
        <div className="container features-bar__inner">
          {[
            {
              icon: "📋",
              title: "Lineups",
              desc: "Starting XI & bench for every match",
            },
            {
              icon: "⚽",
              title: "Scorers",
              desc: "Goals, assists & minute by minute",
            },
            {
              icon: "🟨",
              title: "Cards",
              desc: "Yellow, red & all match events",
            },
            {
              icon: "📊",
              title: "Standings",
              desc: "Full tables with form & zones",
            },
          ].map((f) => (
            <div key={f.title} className="features-bar__item">
              <span className="features-bar__icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="home__leagues">
        <div className="container">
          <div className="home__leagues-header">
            <h2 className="section-title">Top 5 Leagues</h2>
            <span className="home__season-badge">Season 2025/26</span>
          </div>
          <div className="league-cards">
            {LEAGUE_CODES.map((code) => (
              <Link key={code} className="league-card" to={`/league/${code}`}>
                <div className="league-card__top">
                  <div className="league-card__logo-wrap">
                    <img
                      className="league-card__logo"
                      src={LEAGUES[code].logo}
                      alt={LEAGUES[code].name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <span
                      className="league-card__logo-fallback"
                      style={{ display: "none" }}
                    >
                      {LEAGUES[code].flag}
                    </span>
                  </div>
                  <div className="league-card__info">
                    <span className="league-card__name">
                      {LEAGUES[code].name}
                    </span>
                    <span className="league-card__country">
                      {LEAGUES[code].flag} {LEAGUES[code].country}
                    </span>
                  </div>
                  <span className="league-card__arrow">→</span>
                </div>
                <div className="league-card__standings">
                  <MiniTable rows={standings[code]} code={code} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="players-banner">
        <div className="players-banner__img-wrap">
          <img
            src="/b-score-react/players.jpg"
            alt="Players"
            className="players-banner__img"
          />
          <div className="players-banner__overlay" />
        </div>
        <div className="players-banner__content container">
          <div className="players-banner__text">
            <h2>Track Every Player</h2>
            <p>
              Goals, assists, cards and season stats for every player across all
              five leagues.
            </p>
            <Link className="btn btn--accent" to="/league/PL">
              View Standings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
