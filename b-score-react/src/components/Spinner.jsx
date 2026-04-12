export default function Spinner({ text = "Loading…" }) {
  return (
    <div className="page-loader">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
