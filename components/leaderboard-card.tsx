import Image from "next/image";
import Link from "next/link";
import { formatDollars, type LeaderboardListing } from "@/lib/demo-data";

export function LeaderboardCard({ listing, rank }: { listing: LeaderboardListing; rank: number }) {
  return <Link className={`listing ${rank === 1 ? "listing-top" : ""}`} href={`/product/${listing.slug}`} aria-label={`View ${listing.name}, rank ${rank}`}><span className="rank">#{rank}</span><Image className="listing-icon" src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(listing.domain)}&sz=64`} width={64} height={64} alt={`${listing.name} logo`} unoptimized /><span className="listing-main"><span className="listing-title">{listing.name}</span><span className="listing-description">{listing.description}</span><span className="listing-meta">{listing.createdLabel} <span aria-hidden="true">·</span> {listing.category} <span aria-hidden="true">·</span> <b>{listing.clicks.toLocaleString()} clicks</b></span></span><span className="listing-amount">{formatDollars(listing.bidCents)}</span></Link>;
}
