interface ResponsiveTableProps {
  headers: string[];
  children?: React.ReactNode;
}

export default function ResponsiveTable({
  headers,
  children,
}: ResponsiveTableProps) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
