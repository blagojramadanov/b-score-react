import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { clearCache } from "../api/api.js";
import { LEAGUES, LEAGUE_CODES } from "../api/api.js";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = () => {
    clearCache();
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setOpen(false)}>
          <img
            src="/b-score-react/bscore.png"
            className="navbar__logo-img"
            alt="B-Score"
          />
          B<span>·</span>SCORE
        </Link>

        <nav className="navbar__nav">
          <Link className="navbar__link" to="/">
            Home
          </Link>
          {LEAGUE_CODES.map((code) => (
            <Link key={code} className="navbar__link" to={`/league/${code}`}>
              {LEAGUES[code].name}
            </Link>
          ))}
          <Link className="navbar__link" to="/players">
            Players
          </Link>
          <Link className="navbar__link" to="/about">
            About
          </Link>
        </nav>

        <div className="navbar__right">
          <button
            className="navbar__theme-toggle"
            onClick={toggle}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
          <button
            className="navbar__refresh"
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
        <div className="navbar__drawer">
          <Link
            className="navbar__drawer-link"
            to="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {LEAGUE_CODES.map((code) => (
            <Link
              key={code}
              className="navbar__drawer-link"
              to={`/league/${code}`}
              onClick={() => setOpen(false)}
            >
              {LEAGUES[code].flag} {LEAGUES[code].name}
            </Link>
          ))}
          <Link
            className="navbar__drawer-link"
            to="/players"
            onClick={() => setOpen(false)}
          >
            Players
          </Link>
          <Link
            className="navbar__drawer-link"
            to="/about"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
