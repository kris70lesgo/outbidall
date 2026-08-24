import "server-only";
import { createClient } from "@supabase/supabase-js";
import { fallbackListings, type LeaderboardListing } from "@/lib/demo-data";
import { assertPublicHostname, parsePublicHttpUrl } from "@/lib/validation";
import { normalizeDomain } from "@/lib/metadata";

type ListingRow = { slug: string; name: string; website_url: string; normalized_domain: string; short_description: string | null; total_bid_cents: number; total_clicks: number; last_bid_at: string | null; categories: { name: string } | { name: string }[] | null };

function timeAgo(value: string | null) { if (!value) return "recently"; const hours = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 3_600_000)); return hours < 24 ? `${hours} hour${hours === 1 ? "" : "s"} ago` : `${Math.floor(hours / 24)} day${Math.floor(hours / 24) === 1 ? "" : "s"} ago`; }
function mapListing(row: ListingRow): LeaderboardListing { const category = Array.isArray(row.categories) ? row.categories[0] : row.categories; return { slug: row.slug, name: row.name, website: row.website_url, domain: row.normalized_domain, description: row.short_description ?? "", bidCents: row.total_bid_cents, clicks: row.total_clicks, createdLabel: timeAgo(row.last_bid_at), category: category?.name ?? "Other" }; }

function serverClient() { const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null; }
export async function getLeaderboard(): Promise<LeaderboardListing[]> { const supabase = serverClient(); if (!supabase) return fallbackListings; const { data, error } = await supabase.from("listings").select("slug,name,website_url,normalized_domain,short_description,total_bid_cents,total_clicks,last_bid_at,categories(name)").eq("status", "active").order("total_bid_cents", { ascending: false }); return error || !data?.length ? fallbackListings : (data as ListingRow[]).map(mapListing); }
export async function getListing(slug: string) { return (await getLeaderboard()).find(listing => listing.slug === slug) ?? null; }

type ContributionInput = { url: string; amountCents: number; category?: string };
type Contribution = { paymentId: string; amountCents: number };

function database() {
  const client = serverClient();
  if (!client) throw new Error("The database is not configured.");
  return client;
}

function categoryDetails(value?: string) {
  const name = value?.trim().replace(/\b\w/g, character => character.toUpperCase()) || "AI";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "ai";
  return { name, slug };
}

function listingName(hostname: string) {
  return hostname.replace(/^www\./, "").split(".")[0].replace(/[-_]+/g, " ").replace(/\b\w/g, character => character.toUpperCase());
}

export async function createPendingContribution(input: ContributionInput): Promise<Contribution> {
  const url = parsePublicHttpUrl(input.url);
  await assertPublicHostname(url);
  const supabase = database();
  const domain = normalizeDomain(url.hostname);
  const category = categoryDetails(input.category);
  const { data: categoryRow, error: categoryError } = await supabase.from("categories").upsert(category, { onConflict: "slug" }).select("id").single();
  if (categoryError || !categoryRow) throw new Error("Unable to prepare the listing category.");

  const { data: existing, error: listingLookupError } = await supabase.from("listings").select("id").eq("normalized_domain", domain).maybeSingle();
  if (listingLookupError) throw new Error("Unable to look up the listing.");
  let listingId = existing?.id as string | undefined;
  if (!listingId) {
    const slug = `${domain.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 8)}`;
    const { data: listing, error: listingError } = await supabase.from("listings").insert({
      slug,
      name: listingName(url.hostname),
      website_url: url.origin,
      normalized_domain: domain,
      short_description: `Discover ${domain} on Outbidall.`,
      category_id: categoryRow.id,
      status: "pending",
    }).select("id").single();
    if (listingError || !listing) throw new Error("Unable to prepare the listing.");
    listingId = listing.id as string;
  }

  const { data: bid, error: bidError } = await supabase.from("bids").insert({ listing_id: listingId, amount_cents: input.amountCents, provider: "dodo", status: "pending" }).select("id").single();
  if (bidError || !bid) throw new Error("Unable to prepare the bid.");
  const { data: payment, error: paymentError } = await supabase.from("payments").insert({
    provider: "dodo",
    provider_order_id: `pending-${crypto.randomUUID()}`,
    listing_id: listingId,
    bid_id: bid.id,
    amount_cents: input.amountCents,
    status: "pending",
  }).select("id").single();
  if (paymentError || !payment) throw new Error("Unable to prepare the payment.");
  const { error: bidPaymentError } = await supabase.from("bids").update({ payment_id: payment.id }).eq("id", bid.id);
  if (bidPaymentError) throw new Error("Unable to link the bid to its payment.");
  return { paymentId: payment.id as string, amountCents: input.amountCents };
}

export async function markContributionCheckoutCreated(paymentId: string, sessionId: string) {
  const { error } = await database().from("payments").update({ provider_order_id: sessionId, raw_metadata: { checkout_session_id: sessionId }, updated_at: new Date().toISOString() }).eq("id", paymentId).eq("status", "pending");
  if (error) throw new Error("Unable to save the checkout session.");
}

export async function markContributionFailed(paymentId: string) {
  const supabase = database();
  const { data: payment } = await supabase.from("payments").select("bid_id").eq("id", paymentId).eq("status", "pending").maybeSingle();
  if (!payment) return;
  await supabase.from("payments").update({ status: "failed", updated_at: new Date().toISOString() }).eq("id", paymentId).eq("status", "pending");
  await supabase.from("bids").update({ status: "failed" }).eq("id", payment.bid_id).eq("status", "pending");
}

export async function markContributionSucceeded(input: { paymentId: string; providerCaptureId: string; amountCents: number; currency: string; payerEmail: string | null; metadata: Record<string, string> }) {
  const supabase = database();
  const { data: payment, error: paymentError } = await supabase.from("payments").select("id,status,amount_cents").eq("id", input.paymentId).eq("provider", "dodo").maybeSingle();
  if (paymentError || !payment) throw new Error("Unknown Dodo payment.");
  if (payment.status === "completed") return;
  if (input.currency !== "USD" || input.amountCents < payment.amount_cents) throw new Error("Dodo payment amount does not match the bid.");
  const { error: updateError } = await supabase.from("payments").update({
    provider_capture_id: input.providerCaptureId,
    payer_email: input.payerEmail,
    raw_metadata: input.metadata,
    updated_at: new Date().toISOString(),
  }).eq("id", input.paymentId).eq("status", "pending");
  if (updateError) throw new Error("Unable to record the Dodo payment.");
  const { error: completionError } = await supabase.rpc("apply_completed_bid", { p_payment_id: input.paymentId });
  if (completionError) throw new Error("Unable to activate the completed bid.");
}
