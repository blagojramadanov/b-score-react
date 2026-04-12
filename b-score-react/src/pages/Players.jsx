import { useState, useEffect } from "react";
import { fetchScorers, LEAGUES, LEAGUE_CODES } from "../api/api.js";
import Spinner from "../components/Spinner.jsx";

export default function Players() {
  const [code, setCode] = useState("PL");
  const [scorers, setScorers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setScorers(null);
    setLoading(true);
    fetchScorers(code).then((s) => {
      setScorers(s);
      setLoading(false);
    });
  }, [code]);

  return (
    <section className="players-page">
      <h1 className="page-title">Top Scorers</h1>
      <div className="league-buttons">
        {LEAGUE_CODES.map((c) => (
          <button
            key={c}
            className={`league-btn${code === c ? " active" : ""}`}
            onClick={() => setCode(c)}
          >
            {LEAGUES[c].flag} {LEAGUES[c].name}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : !scorers ? (
        <div className="error-state">No data available.</div>
      ) : (
        <div className="players-wrap">
          <table className="players-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Nationality</th>
                <th>Team</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Penalties</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((s, i) => (
                <tr key={i}>
                  <td className="rank-cell">{i + 1}</td>
                  <td className="player-cell">
                    <span>{s.player.name}</span>
                  </td>
                  <td>{s.player.nationality || "—"}</td>
                  <td className="team-cell">
                    {s.team?.crest && (
                      <img
                        src={s.team.crest}
                        alt=""
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <span>{s.team?.shortName || s.team?.name || "—"}</span>
                  </td>
                  <td className="pts-cell">{s.goals ?? 0}</td>
                  <td>{s.assists ?? 0}</td>
                  <td>{s.penalties ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
