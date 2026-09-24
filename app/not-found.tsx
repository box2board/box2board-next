import Link from "next/link";
export default function NotFound() { return <div className="container notFound"><span>404</span><p className="kicker">Out of bounds</p><h1>That page isn’t on the board.</h1><p>The route may have moved, or the feature is not part of the current Box2Board lineup.</p><Link className="actionLink" href="/">Back to today’s scores →</Link></div>; }
