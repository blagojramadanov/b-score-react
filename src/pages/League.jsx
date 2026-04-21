import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchStandings,
  fetchMatches,
  fetchScorers,
  LEAGUES,
} from "../api/api.js";
import StandingsTable from "../components/StandingsTable.jsx";
import MatchRow from "../components/MatchRow.jsx";
import Spinner from "../components/Spinner.jsx";

export default function League() {
  const { code } = useParams();
  const meta = LEAGUES[code];
  const [tab, setTab] = useState("standings");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(null);
    setLoading(true);
    const load = async () => {
      let result = null;
      if (tab === "standings") result = await fetchStandings(code);
      if (tab === "results") result = await fetchMatches(code);
      if (tab === "scorers") result = await fetchScorers(code);
      setData(result);
      setLoading(false);
    };
    load();
  }, [code, tab]);

  if (!meta) return <div className="empty-state">League not found.</div>;

  return (
    <div className="league-page">
      <div className="page-header">
        <img
          src={meta.logo}
          alt=""
          className="page-header__logo"
          onError={(e) => (e.target.style.display = "none")}
        />
        <div>
          <h1 className="page-header__title">{meta.name}</h1>
          <span className="page-header__sub">
            {meta.country} · Season 2025/26
          </span>
        </div>
      </div>

      <div className="tab-bar">
        {["standings", "results", "scorers"].map((t) => (
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
        {loading ? (
          <Spinner />
        ) : (
          <>
            {tab === "standings" && (
              <StandingsTable rows={data} leagueCode={code} />
            )}

            {tab === "results" &&
              (!data?.length ? (
                <div className="empty-state">No results found.</div>
              ) : (
                <div className="matches-list">
                  {[...data]
                    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
                    .map((m) => (
                      <MatchRow key={m.id} match={m} />
                    ))}
                </div>
              ))}

            {tab === "scorers" &&
              (!data?.length ? (
                <div className="empty-state">No scorer data.</div>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Goals</th>
                        <th>Assists</th>
                        <th>Pen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((s, i) => (
                        <tr key={i}>
                          <td className="col-num">{i + 1}</td>
                          <td className="col-player">{s.player.name}</td>
                          <td className="col-club">
                            {s.team?.crest && (
                              <img
                                src={s.team.crest}
                                alt=""
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            )}
                            <span>
                              {s.team?.shortName || s.team?.name || "—"}
                            </span>
                          </td>
                          <td className="col-pts">{s.goals ?? 0}</td>
                          <td>{s.assists ?? 0}</td>
                          <td>{s.penalties ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
