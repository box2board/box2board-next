import Badge from "./Badge";

export default function DemoNote() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Badge variant="warn">Demo data</Badge>
      <span>
        All data shown is mock and intended to illustrate future analytics
        workflows.
      </span>
    </div>
  );
}
