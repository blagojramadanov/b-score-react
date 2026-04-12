import { useNavigate } from "react-router-dom";

export default function StandingsTable({ rows, leagueCode }) {
  const navigate = useNavigate();
  if (!rows)
    return <div className="error-state">Could not load standings.</div>;

  const total = rows.length;

  const zone = (pos) => {
    if (pos <= 4) return "zone-ucl";
    if (pos <= 6) return "zone-uel";
    if (pos === 7) return "zone-conf";
    if (pos >= total - 2) return "zone-rel";
    return "";
  };

  const parseForm = (form) => {
    if (!form) return [];
    if (form.includes(",")) {
      return form
        .split(",")
        .slice(-5)
        .map((c) => (c === "WIN" ? "W" : c === "DRAW" ? "D" : "L"));
    }
    return form.slice(-5).split("");
  };

  return (
    <div className="standings-wrap">
      <div className="zone-legend">
        <span className="zone-item zone-item--ucl">Champions League</span>
        <span className="zone-item zone-item--uel">Europa League</span>
        <span className="zone-item zone-item--conf">Conference</span>
        <span className="zone-item zone-item--rel">Relegation</span>
      </div>
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Club</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Form</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const z = zone(r.position);
            const gd =
              r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference;
            const form = parseForm(r.form);
            return (
              <tr
                key={r.team.id}
                className={z}
                onClick={() => navigate(`/team/${r.team.id}/${leagueCode}`)}
                style={{ cursor: "pointer" }}
              >
                <td className={`pos-cell ${z}`}>{r.position}</td>
                <td className="team-cell">
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
                <td>
                  <div className="form-dots">
                    {form.map((c, i) => (
                      <span
                        key={i}
                        className={`form-dot form-dot--${c === "W" ? "w" : c === "D" ? "d" : "l"}`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="pts-cell">{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
