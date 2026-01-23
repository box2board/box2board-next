type BadgeVariant = "info" | "success" | "warn";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = "info" }: BadgeProps) {
  const variantClass =
    variant === "success"
      ? "badgeSuccess"
      : variant === "warn"
      ? "badgeWarn"
      : "badgeInfo";

  return <span className={`badge ${variantClass}`}>{children}</span>;
}
