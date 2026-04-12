import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMatch } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";
import MatchEvents from "../components/MatchEvents.jsx";
import LineupGrid from "../components/LineupGrid.jsx";

const TABS = ["events", "lineups"];

export default function Match() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("events");

  useEffect(() => {
    fetchMatch(id).then((m) => {
      setMatch(m);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Spinner />;
  if (!match) return <div className="error-state">Match not found.</div>;

  const hg = match.score?.fullTime?.home ?? 0;
  const ag = match.score?.fullTime?.away ?? 0;
  const dt = new Date(match.utcDate);
  const dateStr = dt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="match-page">
      <div className="match-header">
        <div className="match-header__league">
          {match.competition?.emblem && (
            <img src={match.competition.emblem} alt="" />
          )}
          <span>
            {match.competition?.name} · Matchday {match.matchday}
          </span>
        </div>
        <div className="match-header__date">{dateStr}</div>
        <div className="match-header__scoreboard">
          <div className="match-header__team">
            {match.homeTeam.crest && (
              <img
                src={match.homeTeam.crest}
                className="match-header__badge"
                alt=""
              />
            )}
            <span className="match-header__team-name">
              {match.homeTeam.name}
            </span>
          </div>
          <div className="match-header__score">
            <span className={hg > ag ? "score--win" : ""}>{hg}</span>
            <span className="score-sep">–</span>
            <span className={ag > hg ? "score--win" : ""}>{ag}</span>
            <div className="match-header__ht">
              HT {match.score?.halfTime?.home ?? 0}–
              {match.score?.halfTime?.away ?? 0}
            </div>
          </div>
          <div className="match-header__team match-header__team--away">
            {match.awayTeam.crest && (
              <img
                src={match.awayTeam.crest}
                className="match-header__badge"
                alt=""
              />
            )}
            <span className="match-header__team-name">
              {match.awayTeam.name}
            </span>
          </div>
        </div>
        {match.venue && (
          <div className="match-header__venue">📍 {match.venue}</div>
        )}
        {match.referees?.length > 0 && (
          <div className="match-header__referee">
            👤 {match.referees[0].name}
          </div>
        )}
      </div>

      <div className="match-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`mtab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="match-tab-content">
        {tab === "events" && <MatchEvents match={match} />}
        {tab === "lineups" && <LineupGrid match={match} />}
      </div>
    </section>
  );
}
