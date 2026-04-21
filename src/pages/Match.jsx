import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMatch } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";
import MatchEvents from "../components/MatchEvents.jsx";
import LineupGrid from "../components/LineupGrid.jsx";

export default function Match() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  if (!match) return <div className="empty-state">Match not found.</div>;

  const hg = match.score?.fullTime?.home ?? 0;
  const ag = match.score?.fullTime?.away ?? 0;
  const hhg = match.score?.halfTime?.home ?? 0;
  const hag = match.score?.halfTime?.away ?? 0;
  const dt = new Date(match.utcDate);
  const dateStr = dt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="match-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="match-hero">
        <div className="match-hero__meta">
          {match.competition?.emblem && (
            <img src={match.competition.emblem} alt="" />
          )}
          <span>{match.competition?.name}</span>
          <span className="match-hero__dot">·</span>
          <span>Matchday {match.matchday}</span>
          <span className="match-hero__dot">·</span>
          <span>{dateStr}</span>
        </div>

        <div className="match-hero__scoreboard">
          <div className="match-hero__team">
            {match.homeTeam.crest && (
              <img
                src={match.homeTeam.crest}
                alt=""
                className="match-hero__crest"
              />
            )}
            <span className="match-hero__name">{match.homeTeam.name}</span>
          </div>

          <div className="match-hero__center">
            <div className="match-hero__score">
              <span className={hg > ag ? "score-win" : ""}>{hg}</span>
              <span className="score-sep">–</span>
              <span className={ag > hg ? "score-win" : ""}>{ag}</span>
            </div>
            <div className="match-hero__ht">
              HT {hhg}–{hag}
            </div>
            <div className="match-hero__status">FT</div>
          </div>

          <div className="match-hero__team match-hero__team--away">
            {match.awayTeam.crest && (
              <img
                src={match.awayTeam.crest}
                alt=""
                className="match-hero__crest"
              />
            )}
            <span className="match-hero__name">{match.awayTeam.name}</span>
          </div>
        </div>

        <div className="match-hero__details">
          {match.venue && <span>📍 {match.venue}</span>}
          {match.referees?.length > 0 && (
            <span>👤 {match.referees[0].name}</span>
          )}
        </div>
      </div>

      <div className="tab-bar">
        {["events", "lineups"].map((t) => (
          <button
            key={t}
            className={`tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === "events" && <MatchEvents match={match} />}
        {tab === "lineups" && <LineupGrid match={match} />}
      </div>
    </div>
  );
}
