import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchStandings,
  fetchMatches,
  fetchScorers,
  LEAGUES,
} from "../api/api.js";
import StandingsTable from "../components/StandingsTable.jsx";
import ResultRow from "../components/ResultRow.jsx";
import Spinner from "../components/Spinner.jsx";

const TABS = ["standings", "results", "scorers"];

export default function League() {
  const { code } = useParams();
  const meta = LEAGUES[code];
  const [tab, setTab] = useState("standings");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(null);
    setLoading(true);
    loadTab(tab);
  }, [code, tab]);

  async function loadTab(t) {
    setLoading(true);
    let result = null;
    if (t === "standings") result = await fetchStandings(code);
    if (t === "results") result = await fetchMatches(code);
    if (t === "scorers") result = await fetchScorers(code);
    setData(result);
    setLoading(false);
  }

  if (!meta) return <div className="error-state">League not found.</div>;

  return (
    <section className="league-page">
      <div className="league-hero">
        <span className="league-hero__flag">{meta.flag}</span>
        <div>
          <h1 className="league-hero__name">{meta.name}</h1>
          <span className="league-hero__country">
            {meta.country} · Season 2025/26
          </span>
        </div>
      </div>

      <div className="league-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`ltab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div id="leagueTabContent">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {tab === "standings" && (
              <StandingsTable rows={data} leagueCode={code} />
            )}
            {tab === "results" &&
              (data?.length ? (
                <div className="results-wrap">
                  <div className="results-list">
                    {[...data]
                      .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
                      .map((m) => (
                        <ResultRow key={m.id} match={m} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">No results found.</div>
              ))}
            {tab === "scorers" &&
              (data?.length ? (
                <div className="players-wrap">
                  <table className="players-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Goals</th>
                        <th>Assists</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((s, i) => (
                        <tr key={i}>
                          <td className="rank-cell">{i + 1}</td>
                          <td className="player-cell">
                            <span>{s.player.name}</span>
                          </td>
                          <td className="team-cell">
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
                          <td className="pts-cell">{s.goals ?? 0}</td>
                          <td>{s.assists ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">No scorer data.</div>
              ))}
          </>
        )}
      </div>
    </section>
  );
}
