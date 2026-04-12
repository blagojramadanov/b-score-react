export default function MatchEvents({ match }) {
  const goals = match.goals || [];
  const bookings = match.bookings || [];
  const subs = match.substitutions || [];
  const home = match.homeTeam;
  const away = match.awayTeam;

  if (!goals.length && !bookings.length && !subs.length) {
    return <div className="empty-state">No event data available.</div>;
  }

  const all = [
    ...goals.map((e) => ({ ...e, _type: "goal" })),
    ...bookings.map((e) => ({ ...e, _type: "card" })),
    ...subs.map((e) => ({ ...e, _type: "sub" })),
  ].sort((a, b) => (a.minute || 0) - (b.minute || 0));

  return (
    <div className="events-wrap">
      <div className="events-header">
        <span>{home.name}</span>
        <span></span>
        <span>{away.name}</span>
      </div>
      <div className="events-list">
        {all.map((e, i) => {
          const isHome = e.team?.id === home.id;
          const min = `${e.minute}${e.injuryTime ? "+" + e.injuryTime : ""}'`;
          let icon, player, detail;

          if (e._type === "goal") {
            icon =
              e.type === "OWN_GOAL"
                ? "⚽ OG"
                : e.type === "PENALTY"
                  ? "⚽ P"
                  : "⚽";
            player = e.scorer?.name || "";
            detail = e.assist ? `↗ ${e.assist.name}` : "";
          } else if (e._type === "card") {
            icon =
              e.card === "YELLOW_CARD"
                ? "🟨"
                : e.card === "RED_CARD"
                  ? "🟥"
                  : "🟨🟥";
            player = e.player?.name || "";
            detail = "";
          } else {
            icon = "🔄";
            player = `↑ ${e.playerIn?.name || ""} ↓ ${e.playerOut?.name || ""}`;
            detail = "";
          }

          return (
            <div
              key={i}
              className={`event-row ${isHome ? "event-row--home" : "event-row--away"}`}
            >
              {isHome ? (
                <>
                  <div className="event-row__content">
                    <span className="event-row__player">{player}</span>
                    {detail && <span className="event-assist">{detail}</span>}
                  </div>
                  <span className="event-row__icon">{icon}</span>
                  <span className="event-row__min">{min}</span>
                  <div className="event-row__spacer" />
                </>
              ) : (
                <>
                  <div className="event-row__spacer" />
                  <span className="event-row__min">{min}</span>
                  <span className="event-row__icon">{icon}</span>
                  <div className="event-row__content">
                    <span className="event-row__player">{player}</span>
                    {detail && <span className="event-assist">{detail}</span>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
