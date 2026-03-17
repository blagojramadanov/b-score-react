export function getAboutHtml() {
  return `
<section class="about">

  <div class="about__hero">
    <h1 class="about__title">What is <em>B-Score</em>?</h1>
    <p class="about__lead">
      B-Score is a fast, clean football scores app focused exclusively on
      Europe's five biggest leagues. No ads, no filler — just the data you
      need, the moment you need it.
    </p>
  </div>

  <div class="about__features">
    <div class="about-card">
      <div class="about-card__icon">⚡</div>
      <h3>Real-Time Scores</h3>
      <p>
        Match data refreshes automatically every 60 seconds on the home and
        live pages — 30 seconds when a match is actively in play.
      </p>
    </div>
    <div class="about-card">
      <div class="about-card__icon">🏆</div>
      <h3>Top 5 Leagues Only</h3>
      <p>
        Premier League · La Liga · Serie A · Bundesliga · Ligue 1.
        No clutter from minor competitions — just the matches people care about.
      </p>
    </div>
    <div class="about-card">
      <div class="about-card__icon">↕</div>
      <h3>Drag-and-Drop Panels</h3>
      <p>
        On the home screen, drag league panels into any order you like.
        Your preference is saved locally so it persists between visits.
      </p>
    </div>
    <div class="about-card">
      <div class="about-card__icon">📊</div>
      <h3>Live Standings</h3>
      <p>
        Full league tables with form guides, goal difference and zone
        indicators for Champions League, Europa League and relegation spots.
      </p>
    </div>
    <div class="about-card">
      <div class="about-card__icon">📅</div>
      <h3>Date Navigation</h3>
      <p>
        Browse results from the past week or fixtures a week ahead using
        the date strip at the top of the scores page.
      </p>
    </div>
    <div class="about-card">
      <div class="about-card__icon">🔴</div>
      <h3>Dedicated Live Page</h3>
      <p>
        The Live tab shows every in-progress match across all five leagues
        at a glance, with a live minute bar for each game.
      </p>
    </div>
  </div>

  <div class="about__data">
    <h2>Data Source</h2>
    <p>
      All football data is provided by
      <a href="https://www.api-football.com" target="_blank" rel="noopener">API-Football</a>
      (RapidAPI). The free tier allows 100 requests per day — B-Score batches
      calls efficiently to stay within this limit under normal usage.
    </p>
    <p>
      If the app shows demo data, the daily quota has likely been reached.
      Upgrade to a paid API plan or come back tomorrow.
    </p>
  </div>

  <div class="about__tech">
    <h2>Built With</h2>
    <ul class="tech-list">
      <li><strong>Vite</strong> — lightning-fast dev server &amp; bundler</li>
      <li><strong>Vanilla JavaScript</strong> — no framework dependencies</li>
      <li><strong>SCSS</strong> — modular, variable-driven styles</li>
      <li><strong>API-Football v3</strong> — live football data</li>
      <li><strong>HTML5 Drag-and-Drop API</strong> — native panel reordering</li>
    </ul>
  </div>

</section>
`;
}

export function mountAbout(container) {
  container.innerHTML = getAboutHtml();
}
