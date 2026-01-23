import DemoNote from "./DemoNote";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <DemoNote />
        <p style={{ marginTop: "12px" }}>
          Box2Board provides analysis, trends, and market context for
          informational purposes only. Insights are not betting advice. Please
          follow local laws and play responsibly.
        </p>
      </div>
    </footer>
  );
}
