export default function About() {
  return (
    <section className="about">
      <div className="about__hero">
        <h1 className="about__title">
          What is <em>B-Score</em>?
        </h1>
        <p className="about__lead">
          Full football data for Europe's top 5 leagues. Match history, lineups,
          scorers, cards and formations — every match of the 2025/26 season.
        </p>
      </div>
      <div className="about__features">
        {[
          {
            icon: "📋",
            title: "Match Lineups",
            desc: "Full starting XI with formation diagram, player positions and the complete bench for every match.",
          },
          {
            icon: "⚽",
            title: "Goals & Scorers",
            desc: "Every goal — who scored it, at what minute, penalty or open play, and who assisted.",
          },
          {
            icon: "🟨",
            title: "Cards & Events",
            desc: "Yellow cards, red cards, second yellows, substitutions and VAR decisions for every match.",
          },
          {
            icon: "📊",
            title: "Full Standings",
            desc: "Live league tables with wins, draws, losses, goal difference, form guide and zone indicators.",
          },
          {
            icon: "🏆",
            title: "Top Scorers",
            desc: "Goals, assists and penalties for top players in every league.",
          },
          {
            icon: "👤",
            title: "Team Profiles",
            desc: "Season stats, stadium info, home/away record and full match history for every club.",
          },
        ].map((f) => (
          <div key={f.title} className="about-card">
            <div className="about-card__icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="about__info">
        <h2>The 5 Leagues</h2>
        <ul className="leagues-list">
          <li>
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 <strong>Premier League</strong> — England's top flight, 20 clubs
          </li>
          <li>
            🇪🇸 <strong>La Liga</strong> — Spain's top flight, 20 clubs
          </li>
          <li>
            🇮🇹 <strong>Serie A</strong> — Italy's top flight, 20 clubs
          </li>
          <li>
            🇩🇪 <strong>Bundesliga</strong> — Germany's top flight, 18 clubs
          </li>
          <li>
            🇫🇷 <strong>Ligue 1</strong> — France's top flight, 18 clubs
          </li>
        </ul>
        <h2>Data</h2>
        <p>
          All data is provided by{" "}
          <a
            href="https://www.football-data.org"
            target="_blank"
            rel="noopener"
          >
            football-data.org
          </a>
          . Season shown: 2025/26.
        </p>
      </div>
    </section>
  );
}
