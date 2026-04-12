export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__logo">
          B<span>·</span>SCORE
        </span>
        <p>
          Data:{" "}
          <a
            href="https://www.football-data.org"
            target="_blank"
            rel="noopener"
          >
            football-data.org
          </a>{" "}
          · Season 2025/26
        </p>
        <p className="footer__note">© {new Date().getFullYear()} B-Score</p>
      </div>
    </footer>
  );
}
