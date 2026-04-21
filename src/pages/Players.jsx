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
    <div className="players-page">
      <div className="page-header">
        <h1 className="page-header__title">Top Scorers</h1>
        <span className="page-header__sub">Season 2025/26</span>
      </div>

      <div className="league-switcher">
        {LEAGUE_CODES.map((c) => (
          <button
            key={c}
            className={`league-switcher__btn${code === c ? " active" : ""}`}
            onClick={() => setCode(c)}
          >
            <img
              src={LEAGUES[c].logo}
              alt=""
              onError={(e) => (e.target.style.display = "none")}
            />
            <span>{LEAGUES[c].name}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : !scorers ? (
        <div className="empty-state">No data available.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table scorers-table">
            <thead>
              <tr>
                <th className="col-num">#</th>
                <th className="col-player">Player</th>
                <th>Nationality</th>
                <th className="col-club">Team</th>
                <th className="col-pts">Goals</th>
                <th>Assists</th>
                <th>Pen</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((s, i) => (
                <tr key={i}>
                  <td className="col-num">{i + 1}</td>
                  <td className="col-player">
                    <strong>{s.player.name}</strong>
                  </td>
                  <td className="col-nat">{s.player.nationality || "—"}</td>
                  <td className="col-club">
                    {s.team?.crest && (
                      <img
                        src={s.team.crest}
                        alt=""
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <span>{s.team?.shortName || s.team?.name || "—"}</span>
                  </td>
                  <td className="col-pts">{s.goals ?? 0}</td>
                  <td>{s.assists ?? 0}</td>
                  <td>{s.penalties ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
