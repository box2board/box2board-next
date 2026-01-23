export default function LeagueLoading() {
  return (
    <div className="section">
      <div className="grid" style={{ gap: "16px" }}>
        <div className="skeleton" style={{ width: "60%", height: "20px" }} />
        <div className="skeleton" style={{ width: "100%", height: "16px" }} />
        <div className="skeleton" style={{ width: "80%", height: "16px" }} />
      </div>
    </div>
  );
}
