import Link from "next/link";

export default async function SubmitPage({ searchParams }: { searchParams: Promise<{ url?: string; bid?: string; category?: string }> }) {
  const { url, bid, category } = await searchParams;
  return <main className="page"><div className="shell detail"><Link className="back" href="/">← Back to leaderboard</Link><p className="pixel">Submission review</p><h1>Ready to outbid?</h1><p>{url ? `We’ll prepare ${url} for a $${bid ?? "5"} bid.` : "Enter a website URL to start a listing."}</p>{category && <p>Category: {category}</p>}<p className="microcopy">Website details are recognized automatically; payment and activation remain server-verified.</p></div></main>;
}
