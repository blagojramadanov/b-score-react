import { useNavigate } from "react-router-dom";

const ZONES = (pos, total) => {
  if (pos <= 4) return "ucl";
  if (pos <= 6) return "uel";
  if (pos === 7) return "conf";
  if (pos >= total - 2) return "rel";
  return "";
};

const parseForm = (form) => {
  if (!form) return [];
  if (form.includes(","))
    return form
      .split(",")
      .slice(-5)
      .map((c) => (c === "WIN" ? "W" : c === "DRAW" ? "D" : "L"));
  return form.slice(-5).split("");
};

export default function StandingsTable({ rows, leagueCode }) {
  const navigate = useNavigate();
  if (!rows?.length)
    return <div className="empty-state">No standings available.</div>;

  return (
    <div className="table-wrap">
      <table className="data-table standings-table">
        <thead>
          <tr>
            <th className="col-pos">#</th>
            <th className="col-team">Club</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th className="col-form">Form</th>
            <th className="col-pts">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const zone = ZONES(r.position, rows.length);
            const gd =
              r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference;
            const form = parseForm(r.form);
            return (
              <tr
                key={r.team.id}
                className={zone ? `zone-${zone}` : ""}
                onClick={() => navigate(`/team/${r.team.id}/${leagueCode}`)}
              >
                <td
                  className={`col-pos ${zone ? `zone-marker zone-marker--${zone}` : ""}`}
                >
                  {r.position}
                </td>
                <td className="col-team">
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
                <td>{r.goalsFor}</td>
                <td>{r.goalsAgainst}</td>
                <td>{gd}</td>
                <td className="col-form">
                  {form.map((c, i) => (
                    <span
                      key={i}
                      className={`form-dot form-dot--${c === "W" ? "w" : c === "D" ? "d" : "l"}`}
                    >
                      {c}
                    </span>
                  ))}
                </td>
                <td className="col-pts">{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="zone-legend">
        <span className="zone-legend__item ucl">Champions League</span>
        <span className="zone-legend__item uel">Europa League</span>
        <span className="zone-legend__item conf">Conference</span>
        <span className="zone-legend__item rel">Relegation</span>
      </div>
    </div>
  );
}
