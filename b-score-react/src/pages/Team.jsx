import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTeam, fetchTeamMatches } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";

export default function Team() {
  const { id, leagueCode } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeam(id), fetchTeamMatches(id, leagueCode)]).then(
      ([t, m]) => {
        setTeam(t);
        setMatches(m);
        setLoading(false);
      },
    );
  }, [id, leagueCode]);

  if (loading) return <Spinner />;
  if (!team) return <div className="error-state">Team not found.</div>;

  const filtered = () => {
    if (!matches) return [];
    let list = [...matches].sort(
      (a, b) => new Date(b.utcDate) - new Date(a.utcDate),
    );
    if (filter === "home")
      return list.filter((m) => m.homeTeam.id === parseInt(id));
    if (filter === "away")
      return list.filter((m) => m.awayTeam.id === parseInt(id));
    return list;
  };

  const resultLabel = (m) => {
    const isHome = m.homeTeam.id === parseInt(id);
    const hg = m.score?.fullTime?.home ?? 0;
    const ag = m.score?.fullTime?.away ?? 0;
    const mine = isHome ? hg : ag;
    const opp = isHome ? ag : hg;
    return mine > opp ? "W" : mine < opp ? "L" : "D";
  };

  return (
    <section className="team-page">
      <div className="team-hero">
        {team.crest && (
          <img src={team.crest} className="team-hero__logo" alt={team.name} />
        )}
        <div className="team-hero__info">
          <h1 className="team-hero__name">{team.name}</h1>
          <div className="team-hero__meta">
            {team.area?.name && <span>🌍 {team.area.name}</span>}
            {team.founded && <span>📅 Founded {team.founded}</span>}
            {team.venue && <span>🏟 {team.venue}</span>}
            {team.website && (
              <a
                href={team.website}
                target="_blank"
                rel="noopener"
                style={{ color: "var(--accent)" }}
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="team-tabs">
        {["all", "home", "away"].map((f) => (
          <button
            key={f}
            className={`ttab${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="results-wrap">
        <div className="results-list">
          {filtered().length === 0 ? (
            <div className="empty-state">No matches found.</div>
          ) : (
            filtered().map((m) => {
              const isHome = m.homeTeam.id === parseInt(id);
              const opp = isHome ? m.awayTeam : m.homeTeam;
              const hg = m.score?.fullTime?.home ?? 0;
              const ag = m.score?.fullTime?.away ?? 0;
              const mine = isHome ? hg : ag;
              const oppG = isHome ? ag : hg;
              const result = resultLabel(m);
              const dt = new Date(m.utcDate);
              const date = dt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={m.id}
                  className="team-result-row"
                  onClick={() => navigate(`/match/${m.id}`)}
                >
                  <span className="team-result-row__date">{date}</span>
                  <span className="team-result-row__venue">
                    {isHome ? "H" : "A"}
                  </span>
                  <div className="team-result-row__opp">
                    {opp.crest && (
                      <img
                        src={opp.crest}
                        alt=""
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <span>{opp.shortName || opp.name}</span>
                  </div>
                  <div className="team-result-row__score">
                    <span
                      className={`result-badge result--${result.toLowerCase()}`}
                    >
                      {result}
                    </span>
                    <span className="team-result-row__goals">
                      {mine}–{oppG}
                    </span>
                  </div>
                  <span className="team-result-row__ht">
                    HT {m.score?.halfTime?.home ?? 0}–
                    {m.score?.halfTime?.away ?? 0}
                  </span>
                  <span className="team-result-row__arrow">→</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
