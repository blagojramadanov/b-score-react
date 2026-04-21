import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTeam, fetchTeamMatches } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";
import MatchRow from "../components/MatchRow.jsx";

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
  if (!team) return <div className="empty-state">Team not found.</div>;

  const teamId = parseInt(id);
  const filtered = () => {
    if (!matches) return [];
    const sorted = [...matches].sort(
      (a, b) => new Date(b.utcDate) - new Date(a.utcDate),
    );
    if (filter === "home")
      return sorted.filter((m) => m.homeTeam.id === teamId);
    if (filter === "away")
      return sorted.filter((m) => m.awayTeam.id === teamId);
    return sorted;
  };

  const wins =
    matches?.filter((m) => {
      const isHome = m.homeTeam.id === teamId;
      const hg = m.score?.fullTime?.home ?? 0;
      const ag = m.score?.fullTime?.away ?? 0;
      return isHome ? hg > ag : ag > hg;
    }).length ?? 0;
  const draws =
    matches?.filter(
      (m) => (m.score?.fullTime?.home ?? 0) === (m.score?.fullTime?.away ?? 0),
    ).length ?? 0;
  const losses = (matches?.length ?? 0) - wins - draws;

  return (
    <div className="team-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="team-hero">
        {team.crest && (
          <img src={team.crest} alt={team.name} className="team-hero__crest" />
        )}
        <div className="team-hero__info">
          <h1 className="team-hero__name">{team.name}</h1>
          <div className="team-hero__meta">
            {team.area?.name && <span>🌍 {team.area.name}</span>}
            {team.founded && <span>📅 Est. {team.founded}</span>}
            {team.venue && <span>🏟 {team.venue}</span>}
            {team.website && (
              <a
                href={team.website}
                target="_blank"
                rel="noopener"
                className="team-hero__link"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {matches && (
        <div className="team-stats">
          <div className="team-stat">
            <span className="team-stat__val team-stat__val--win">{wins}</span>
            <span className="team-stat__lbl">Wins</span>
          </div>
          <div className="team-stat">
            <span className="team-stat__val team-stat__val--draw">{draws}</span>
            <span className="team-stat__lbl">Draws</span>
          </div>
          <div className="team-stat">
            <span className="team-stat__val team-stat__val--loss">
              {losses}
            </span>
            <span className="team-stat__lbl">Losses</span>
          </div>
          <div className="team-stat">
            <span className="team-stat__val">{matches.length}</span>
            <span className="team-stat__lbl">Played</span>
          </div>
        </div>
      )}

      <div className="tab-bar">
        {["all", "home", "away"].map((f) => (
          <button
            key={f}
            className={`tab${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="matches-list">
        {filtered().length === 0 ? (
          <div className="empty-state">No matches found.</div>
        ) : (
          filtered().map((m) => <MatchRow key={m.id} match={m} />)
        )}
      </div>
    </div>
  );
}
