import { useNavigate } from "react-router-dom";

export default function ResultRow({ match }) {
  const navigate = useNavigate();
  const hg = match.score?.fullTime?.home ?? 0;
  const ag = match.score?.fullTime?.away ?? 0;
  const dt = new Date(match.utcDate);
  const date = dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="result-row" onClick={() => navigate(`/match/${match.id}`)}>
      <span className="result-row__date">{date}</span>
      <div className="result-row__home">
        {match.homeTeam.crest && (
          <img
            src={match.homeTeam.crest}
            alt=""
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <span className={hg > ag ? "result-row__name--win" : ""}>
          {match.homeTeam.shortName || match.homeTeam.name}
        </span>
      </div>
      <div className="result-row__score">
        <span className={hg > ag ? "score--win" : ""}>{hg}</span>
        <span className="score-sep">–</span>
        <span className={ag > hg ? "score--win" : ""}>{ag}</span>
      </div>
      <div className="result-row__away">
        {match.awayTeam.crest && (
          <img
            src={match.awayTeam.crest}
            alt=""
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <span className={ag > hg ? "result-row__name--win" : ""}>
          {match.awayTeam.shortName || match.awayTeam.name}
        </span>
      </div>
      <span className="result-row__ht">
        HT {match.score?.halfTime?.home ?? 0}–{match.score?.halfTime?.away ?? 0}
      </span>
      <span className="result-row__arrow">→</span>
    </div>
  );
}
