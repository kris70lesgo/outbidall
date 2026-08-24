import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDollars } from "@/lib/demo-data";
import { getListing } from "@/lib/leaderboard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const listing = await getListing(slug); return listing ? { title: `${listing.name} — outbidall.lol`, description: listing.description } : {}; }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const listing = await getListing(slug); if (!listing) notFound();
  return <main className="page"><div className="shell detail"><Link className="back" href="/">← Back to leaderboard</Link><p className="pixel">{formatDollars(listing.bidCents)}</p><h1>{listing.name}</h1><p>{listing.description}</p><p>Category: {listing.category} · {listing.clicks.toLocaleString()} outbound clicks</p><a className="refresh" href={`/go/${listing.slug}`}>Visit {listing.domain} ↗</a></div></main>;
}
