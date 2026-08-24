import "server-only";
import { createClient } from "@supabase/supabase-js";
import { fallbackListings, type LeaderboardListing } from "@/lib/demo-data";

type ListingRow = { slug: string; name: string; website_url: string; normalized_domain: string; short_description: string | null; total_bid_cents: number; total_clicks: number; last_bid_at: string | null; categories: { name: string } | { name: string }[] | null };

function timeAgo(value: string | null) { if (!value) return "recently"; const hours = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 3_600_000)); return hours < 24 ? `${hours} hour${hours === 1 ? "" : "s"} ago` : `${Math.floor(hours / 24)} day${Math.floor(hours / 24) === 1 ? "" : "s"} ago`; }
function mapListing(row: ListingRow): LeaderboardListing { const category = Array.isArray(row.categories) ? row.categories[0] : row.categories; return { slug: row.slug, name: row.name, website: row.website_url, domain: row.normalized_domain, description: row.short_description ?? "", bidCents: row.total_bid_cents, clicks: row.total_clicks, createdLabel: timeAgo(row.last_bid_at), category: category?.name ?? "Other" }; }

function serverClient() { const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null; }
export async function getLeaderboard(): Promise<LeaderboardListing[]> { const supabase = serverClient(); if (!supabase) return fallbackListings; const { data, error } = await supabase.from("listings").select("slug,name,website_url,normalized_domain,short_description,total_bid_cents,total_clicks,last_bid_at,categories(name)").eq("status", "active").order("total_bid_cents", { ascending: false }); return error || !data?.length ? fallbackListings : (data as ListingRow[]).map(mapListing); }
export async function getListing(slug: string) { return (await getLeaderboard()).find(listing => listing.slug === slug) ?? null; }
