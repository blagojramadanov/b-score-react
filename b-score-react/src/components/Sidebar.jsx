import { NavLink } from "react-router-dom";
import { LEAGUES, LEAGUE_CODES } from "../api/api.js";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <div className="sidebar__title">Leagues</div>
        {LEAGUE_CODES.map((code) => (
          <NavLink
            key={code}
            to={`/league/${code}`}
            className={({ isActive }) =>
              `sidebar__item${isActive ? " active" : ""}`
            }
          >
            <img
              src={LEAGUES[code].logo}
              alt=""
              className="sidebar__item-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="sidebar__item-name">{LEAGUES[code].name}</span>
            <span className="sidebar__item-country">
              {LEAGUES[code].country}
            </span>
          </NavLink>
        ))}
      </div>
      <div className="sidebar__section">
        <div className="sidebar__title">More</div>
        <NavLink
          to="/players"
          className={({ isActive }) =>
            `sidebar__item${isActive ? " active" : ""}`
          }
        >
          <span className="sidebar__item-icon">⚽</span>
          <span className="sidebar__item-name">Top Scorers</span>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `sidebar__item${isActive ? " active" : ""}`
          }
        >
          <span className="sidebar__item-icon">ℹ</span>
          <span className="sidebar__item-name">About</span>
        </NavLink>
      </div>
    </aside>
  );
}
