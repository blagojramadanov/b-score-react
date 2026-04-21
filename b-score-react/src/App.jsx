import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import League from "./pages/League.jsx";
import Match from "./pages/Match.jsx";
import Team from "./pages/Team.jsx";
import Players from "./pages/Players.jsx";
import About from "./pages/About.jsx";

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem("bscore_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/league/:code" element={<League />} />
            <Route path="/match/:id" element={<Match />} />
            <Route path="/team/:id/:leagueCode" element={<Team />} />
            <Route path="/players" element={<Players />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
