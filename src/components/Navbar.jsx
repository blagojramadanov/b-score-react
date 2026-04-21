import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { clearCache, LEAGUES, LEAGUE_CODES } from "../api/api.js";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const handleRefresh = () => {
    clearCache();
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setOpen(false)}>
          <img
            src="/b-score-react/bscore.png"
            className="navbar__logo-img"
            alt=""
          />
          B<span>·</span>SCORE
        </Link>

        <nav className="navbar__nav">
          <Link className="navbar__link" to="/">
            Home
          </Link>
          {LEAGUE_CODES.map((code) => (
            <Link key={code} className="navbar__link" to={`/league/${code}`}>
              {LEAGUES[code].flag} {LEAGUES[code].name}
            </Link>
          ))}
          <Link className="navbar__link" to="/players">
            Players
          </Link>
          <Link className="navbar__link" to="/about">
            About
          </Link>
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__icon-btn"
            onClick={toggle}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
          <button
            className="navbar__icon-btn"
            onClick={handleRefresh}
            title="Refresh data"
          >
            ↺
          </button>
          <button className="navbar__burger" onClick={() => setOpen((o) => !o)}>
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="navbar__mobile">
          <Link
            className="navbar__mobile-link"
            to="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {LEAGUE_CODES.map((code) => (
            <Link
              key={code}
              className="navbar__mobile-link"
              to={`/league/${code}`}
              onClick={() => setOpen(false)}
            >
              {LEAGUES[code].flag} {LEAGUES[code].name}
            </Link>
          ))}
          <Link
            className="navbar__mobile-link"
            to="/players"
            onClick={() => setOpen(false)}
          >
            Players
          </Link>
          <Link
            className="navbar__mobile-link"
            to="/about"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
