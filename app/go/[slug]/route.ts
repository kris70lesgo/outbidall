import { NextResponse } from "next/server";
import { getListing } from "@/lib/leaderboard";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Production: send a non-blocking analytics event here, then redirect.
  const listing = await getListing(slug);
  if (!listing) return NextResponse.redirect(new URL("/", _request.url));
  return NextResponse.redirect(listing.website, 307);
}
