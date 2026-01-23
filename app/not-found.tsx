import Link from "next/link";
import PageShell from "@/components/PageShell";
import Card from "@/components/Card";

export default function NotFound() {
  return (
    <PageShell>
      <section className="section">
        <Card>
          <h1 className="heroTitle">Page not found</h1>
          <p className="heroSubtitle">
            The dashboard lane you requested does not exist. Return to the home
            hub to explore today&apos;s insights.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link className="navLink navLinkActive" href="/">
              Back to home
            </Link>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
