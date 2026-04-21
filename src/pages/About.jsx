import { Link } from "react-router-dom";
import { LEAGUES, LEAGUE_CODES } from "../api/api.js";

export default function About() {
  const features = [
    {
      icon: "📋",
      title: "Lineups & Formations",
      desc: "Full starting XI with position diagrams and bench players for every match.",
    },
    {
      icon: "⚽",
      title: "Goals & Scorers",
      desc: "Every goal with scorer, assist, minute and type — penalty, own goal or open play.",
    },
    {
      icon: "🟨",
      title: "Cards & Events",
      desc: "Yellow cards, red cards, second yellows and substitutions timeline.",
    },
    {
      icon: "📊",
      title: "Full Standings",
      desc: "League tables with form guide, goal difference and European zone indicators.",
    },
    {
      icon: "🏆",
      title: "Top Scorers",
      desc: "Goals, assists and penalties for top 20 players in each league.",
    },
    {
      icon: "📅",
      title: "Full Match History",
      desc: "Every completed fixture for the entire 2025/26 season.",
    },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>
          B<span>·</span>SCORE
        </h1>
        <p>
          Football data for Europe's top 5 leagues. No live scores — just deep,
          accurate stats for the full 2025/26 season.
        </p>
      </div>

      <div className="about-features">
        {features.map((f) => (
          <div key={f.title} className="about-feature">
            <span className="about-feature__icon">{f.icon}</span>
            <div>
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="about-leagues">
        <h2>Covered Leagues</h2>
        <div className="about-league-list">
          {LEAGUE_CODES.map((code) => (
            <Link
              key={code}
              to={`/league/${code}`}
              className="about-league-item"
            >
              <img
                src={LEAGUES[code].logo}
                alt=""
                onError={(e) => (e.target.style.display = "none")}
              />
              <div>
                <strong>{LEAGUES[code].name}</strong>
                <span>
                  {LEAGUES[code].flag} {LEAGUES[code].country}
                </span>
              </div>
              <span className="about-league-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="about-data">
        <h2>Data Source</h2>
        <p>
          All data is provided by{" "}
          <a
            href="https://www.football-data.org"
            target="_blank"
            rel="noopener"
          >
            football-data.org
          </a>
          . Free tier — 10 requests per minute. Data is cached locally for 1
          hour.
        </p>
      </div>
    </div>
  );
}
