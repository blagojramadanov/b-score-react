import { useNavigate } from "react-router-dom";

export default function MiniTable({ rows, code }) {
  const navigate = useNavigate();
  if (!rows)
    return (
      <div className="league-card__loading">
        <div className="spinner spinner--sm" />
        <span>Loading…</span>
      </div>
    );

  return (
    <>
      <table className="mini-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Club</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map((r) => (
            <tr key={r.team.id}>
              <td className="mini-table__pos">{r.position}</td>
              <td className="mini-table__team">
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
              <td className="mini-table__pts">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="mini-table__more"
        onClick={() => navigate(`/league/${code}`)}
      >
        Full table →
      </div>
    </>
  );
}
