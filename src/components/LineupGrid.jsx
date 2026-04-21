const posLabel = (pos) => {
  if (!pos) return "?";
  if (pos === "Goalkeeper") return "GK";
  if (pos.includes("Back") || pos.includes("Defence")) return "D";
  if (pos.includes("Midfield")) return "M";
  return "F";
};

function Formation({ players, formation }) {
  const rows = [1, ...formation.split("-").map(Number)];
  let idx = 0;
  return (
    <div className="formation">
      {rows
        .map((count, ri) => {
          const row = players.slice(idx, idx + count);
          idx += count;
          return (
            <div key={ri} className="formation__row">
              {row.map((p) => (
                <div key={p.id} className="formation__player">
                  <div className="formation__circle">
                    {p.shirtNumber ?? "?"}
                  </div>
                  <span>{(p.name || "").split(" ").pop()}</span>
                </div>
              ))}
            </div>
          );
        })
        .reverse()}
    </div>
  );
}

function TeamPanel({ team }) {
  const xi = team.lineup || [];
  const bench = team.bench || [];
  return (
    <div className="lineup-panel">
      <div className="lineup-panel__header">
        {team.crest && (
          <img
            src={team.crest}
            alt=""
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <strong>{team.name}</strong>
        {team.formation && (
          <span className="lineup-panel__formation">{team.formation}</span>
        )}
      </div>
      {team.formation && xi.length > 0 && (
        <Formation players={xi} formation={team.formation} />
      )}
      <div className="lineup-panel__list">
        <div className="lineup-panel__list-title">Starting XI</div>
        {xi.map((p) => (
          <div key={p.id} className="lineup-player">
            <span className="lineup-player__num">{p.shirtNumber ?? "—"}</span>
            <span className={`lineup-player__pos pos-${posLabel(p.position)}`}>
              {posLabel(p.position)}
            </span>
            <span className="lineup-player__name">{p.name}</span>
          </div>
        ))}
        {bench.length > 0 && (
          <>
            <div className="lineup-panel__list-title">Bench</div>
            {bench.map((p) => (
              <div key={p.id} className="lineup-player lineup-player--bench">
                <span className="lineup-player__num">
                  {p.shirtNumber ?? "—"}
                </span>
                <span
                  className={`lineup-player__pos pos-${posLabel(p.position)}`}
                >
                  {posLabel(p.position)}
                </span>
                <span className="lineup-player__name">{p.name}</span>
              </div>
            ))}
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
    <div className="lineups-grid">
      <TeamPanel team={home} />
      <TeamPanel team={away} />
    </div>
  );
}
