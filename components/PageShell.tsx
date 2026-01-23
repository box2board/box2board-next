interface PageShellProps {
  children?: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return <div className="container">{children}</div>;
}
