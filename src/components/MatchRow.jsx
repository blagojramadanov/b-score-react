import { useNavigate } from "react-router-dom";

export default function MatchRow({ match }) {
  const navigate = useNavigate();
  const hg = match.score?.fullTime?.home ?? 0;
  const ag = match.score?.fullTime?.away ?? 0;
  const hhg = match.score?.halfTime?.home ?? 0;
  const hag = match.score?.halfTime?.away ?? 0;
  const dt = new Date(match.utcDate);
  const date = dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  const year = dt.getFullYear();

  return (
    <div className="match-row" onClick={() => navigate(`/match/${match.id}`)}>
      <div className="match-row__date">
        <span>{date}</span>
        <span className="match-row__year">{year}</span>
      </div>
      <div className="match-row__teams">
        <div
          className={`match-row__team ${hg > ag ? "match-row__team--winner" : ""}`}
        >
          {match.homeTeam.crest && (
            <img
              src={match.homeTeam.crest}
              alt=""
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <span>{match.homeTeam.shortName || match.homeTeam.name}</span>
        </div>
        <div className="match-row__score-block">
          <div className="match-row__score">
            <span className={hg > ag ? "score-win" : ""}>{hg}</span>
            <span className="score-sep">–</span>
            <span className={ag > hg ? "score-win" : ""}>{ag}</span>
          </div>
          <div className="match-row__ht">
            {hhg}–{hag}
          </div>
        </div>
        <div
          className={`match-row__team match-row__team--away ${ag > hg ? "match-row__team--winner" : ""}`}
        >
          {match.awayTeam.crest && (
            <img
              src={match.awayTeam.crest}
              alt=""
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <span>{match.awayTeam.shortName || match.awayTeam.name}</span>
        </div>
      </div>
      <div className="match-row__arrow">›</div>
    </div>
  );
}
