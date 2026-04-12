function posLabel(pos) {
  if (!pos) return "?";
  if (pos === "Goalkeeper") return "GK";
  if (pos.includes("Back") || pos.includes("Defence")) return "D";
  if (pos.includes("Midfield")) return "M";
  return "F";
}

function Formation({ players, formation }) {
  const rows = formation.split("-").map(Number);
  rows.unshift(1);
  let idx = 0;
  const grid = rows.map((count, ri) => {
    const row = players.slice(idx, idx + count);
    idx += count;
    return (
      <div key={ri} className="formation-row">
        {row.map((p) => (
          <div key={p.id} className="formation-player">
            <div className="formation-player__circle">
              {p.shirtNumber ?? "?"}
            </div>
            <span className="formation-player__name">
              {(p.name || "").split(" ").pop()}
            </span>
          </div>
        ))}
      </div>
    );
  });
  return <div className="formation-grid">{grid.reverse()}</div>;
}

function TeamLineup({ team }) {
  const xi = team.lineup || [];
  const bench = team.bench || [];
  const formation = team.formation || "";

  return (
    <div className="lineup-team">
      <div className="lineup-team__header">
        {team.crest && (
          <img
            src={team.crest}
            alt=""
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <span className="lineup-team__name">{team.name}</span>
        {formation && (
          <span className="lineup-team__formation">{formation}</span>
        )}
      </div>
      {formation && xi.length > 0 && (
        <Formation players={xi} formation={formation} />
      )}
      <div className="lineup-players">
        <h4>Starting XI</h4>
        <div className="player-list">
          {xi.map((p) => (
            <div key={p.id} className="player-item">
              <span className="player-item__num">{p.shirtNumber ?? "—"}</span>
              <span className={`player-item__pos pos--${posLabel(p.position)}`}>
                {posLabel(p.position)}
              </span>
              <span className="player-item__name">{p.name}</span>
            </div>
          ))}
        </div>
        {bench.length > 0 && (
          <>
            <h4>Bench</h4>
            <div className="player-list player-list--bench">
              {bench.map((p) => (
                <div key={p.id} className="player-item player-item--bench">
                  <span className="player-item__num">
                    {p.shirtNumber ?? "—"}
                  </span>
                  <span
                    className={`player-item__pos pos--${posLabel(p.position)}`}
                  >
                    {posLabel(p.position)}
                  </span>
                  <span className="player-item__name">{p.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function LineupGrid({ match }) {
  const home = match.homeTeam;
  const away = match.awayTeam;

  if (!home.lineup?.length && !away.lineup?.length) {
    return <div className="empty-state">No lineup data available.</div>;
  }

  return (
    <div className="lineups-wrap">
      <TeamLineup team={home} />
      <TeamLineup team={away} />
    </div>
  );
}
