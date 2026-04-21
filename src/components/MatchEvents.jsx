export default function MatchEvents({ match }) {
  const goals = match.goals || [];
  const bookings = match.bookings || [];
  const subs = match.substitutions || [];

  if (!goals.length && !bookings.length && !subs.length) {
    return <div className="empty-state">No event data available.</div>;
  }

  const all = [
    ...goals.map((e) => ({ ...e, _type: "goal" })),
    ...bookings.map((e) => ({ ...e, _type: "card" })),
    ...subs.map((e) => ({ ...e, _type: "sub" })),
  ].sort((a, b) => (a.minute || 0) - (b.minute || 0));

  const home = match.homeTeam;
  const away = match.awayTeam;

  return (
    <div className="events">
      <div className="events__header">
        <span>{home.name}</span>
        <span>{away.name}</span>
      </div>
      {all.map((e, i) => {
        const isHome = e.team?.id === home.id;
        const min = `${e.minute}${e.injuryTime ? "+" + e.injuryTime : ""}'`;
        let icon = "";
        let text = "";
        let sub = "";

        if (e._type === "goal") {
          icon =
            e.type === "OWN_GOAL"
              ? "⚽ OG"
              : e.type === "PENALTY"
                ? "⚽ P"
                : "⚽";
          text = e.scorer?.name || "";
          sub = e.assist ? `↗ ${e.assist.name}` : "";
        } else if (e._type === "card") {
          icon =
            e.card === "YELLOW_CARD"
              ? "🟨"
              : e.card === "RED_CARD"
                ? "🟥"
                : "🟨🟥";
          text = e.player?.name || "";
        } else {
          icon = "🔄";
          text = `↑ ${e.playerIn?.name || ""} ↓ ${e.playerOut?.name || ""}`;
        }

        return (
          <div
            key={i}
            className={`event-row event-row--${isHome ? "home" : "away"}`}
          >
            {isHome ? (
              <>
                <div className="event-row__info event-row__info--right">
                  <span className="event-row__name">{text}</span>
                  {sub && <span className="event-row__sub">{sub}</span>}
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
                <div className="event-row__info">
                  <span className="event-row__name">{text}</span>
                  {sub && <span className="event-row__sub">{sub}</span>}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
