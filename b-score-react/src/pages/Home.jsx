import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchStandings, LEAGUES, LEAGUE_CODES } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";

export default function Home() {
  const [standings, setStandings] = useState({});
  const [activeLeague, setActiveLeague] = useState("PL");
  const navigate = useNavigate();

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

  const rows = standings[activeLeague];

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__hero-text">
          <h1>
            B<span>·</span>SCORE
          </h1>
          <p>
            Match history, lineups, scorers &amp; standings for Europe's top 5
            leagues — Season 2025/26
          </p>
        </div>
        <div className="home__hero-leagues">
          {LEAGUE_CODES.map((code) => (
            <Link
              key={code}
              to={`/league/${code}`}
              className="hero-league-badge"
            >
              <img
                src={LEAGUES[code].logo}
                alt=""
                onError={(e) => (e.target.style.display = "none")}
              />
              <span>{LEAGUES[code].name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="home__content">
        <div className="home__standings-widget">
          <div className="widget-header">
            <span className="widget-header__title">Standings</span>
            <div className="widget-header__tabs">
              {LEAGUE_CODES.map((code) => (
                <button
                  key={code}
                  className={`widget-tab${activeLeague === code ? " active" : ""}`}
                  onClick={() => setActiveLeague(code)}
                >
                  <img
                    src={LEAGUES[code].logo}
                    alt=""
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="widget-body">
            {!rows ? (
              <Spinner text="" />
            ) : (
              <>
                <table className="mini-standings">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Club</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((r) => (
                      <tr
                        key={r.team.id}
                        onClick={() =>
                          navigate(`/team/${r.team.id}/${activeLeague}`)
                        }
                      >
                        <td className="col-num">{r.position}</td>
                        <td className="col-club">
                          {r.team.crest && (
                            <img
                              src={r.team.crest}
                              alt=""
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}
                          <span>{r.team.shortName || r.team.name}</span>
                        </td>
                        <td>{r.playedGames}</td>
                        <td>{r.won}</td>
                        <td>{r.draw}</td>
                        <td>{r.lost}</td>
                        <td>
                          {r.goalDifference > 0
                            ? `+${r.goalDifference}`
                            : r.goalDifference}
                        </td>
                        <td className="col-pts">{r.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link to={`/league/${activeLeague}`} className="widget-footer">
                  Full table — {LEAGUES[activeLeague].name} →
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="home__info">
          <div className="info-card">
            <h3>What is B-Score?</h3>
            <p>
              Full match data for Europe's top 5 leagues. Standings, scorers,
              lineups, cards and results — all in one place.
            </p>
          </div>
          <div className="info-features">
            {[
              { icon: "📋", label: "Lineups & Formations" },
              { icon: "⚽", label: "Goals & Scorers" },
              { icon: "🟨", label: "Cards & Events" },
              { icon: "📊", label: "Full Standings" },
              { icon: "🏆", label: "Top Scorers" },
              { icon: "📅", label: "Match History" },
            ].map((f) => (
              <div key={f.label} className="info-feature">
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
          <div className="league-grid">
            {LEAGUE_CODES.map((code) => (
              <Link key={code} to={`/league/${code}`} className="league-pill">
                <img
                  src={LEAGUES[code].logo}
                  alt=""
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div>
                  <strong>{LEAGUES[code].name}</strong>
                  <span>{LEAGUES[code].country}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
