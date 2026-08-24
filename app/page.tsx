import { BidComposer } from "@/components/bid-composer";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { SiteHeader } from "@/components/site-header";
import { getLeaderboard } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listings = await getLeaderboard(); const nextTopBid = Math.floor((listings[0]?.bidCents ?? 0) / 100) + 5;
  return <main className="page"><div className="video-band"><video autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" /></video></div><div className="shell"><SiteHeader active="leaderboard" /><section className="hero"><p className="eyebrow">Products that are built to move.</p><BidComposer startingBid={nextTopBid} /></section><section id="leaderboard"><div className="category-tabs" role="tablist" aria-label="Filter leaderboard"><button className="category-tab active" role="tab" aria-selected="true">▦&nbsp; All</button><button className="category-tab" role="tab" aria-selected="false">◈&nbsp; AI</button></div><div className="section-head"><span>Leaderboard</span><button className="refresh">Refresh</button></div><div className="listing-stack">{listings.map((listing, index) => <LeaderboardCard key={listing.slug} listing={listing} rank={index + 1} />)}</div><p className="pager">1 – {listings.length} of {listings.length}</p></section><section className="revenue">The current top bid is<strong className="pixel">$25</strong>with four products on the board.</section></div></main>;
}
