import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/redis";
import { createPendingContribution, markContributionCheckoutCreated, markContributionFailed } from "@/lib/leaderboard";
import { createDodoCheckout, validateDodoProductAmount } from "@/lib/payments/dodo";

const contributionSchema = z.object({
  url: z.string().min(1).max(2048),
  bid: z.number().int().min(5).max(999_999),
  category: z.string().max(60).optional(),
});

function siteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""); }

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!await checkRateLimit(`checkout-rate:${ip}`, 5)) return NextResponse.json({ error: "Try again in a minute." }, { status: 429 });
    const { url, bid, category } = contributionSchema.parse(await request.json());
    await validateDodoProductAmount(bid * 100);
    const contribution = await createPendingContribution({ url, amountCents: bid * 100, category });
    try {
      const origin = siteUrl();
      const checkout = await createDodoCheckout({
        amountCents: contribution.amountCents,
        paymentRecordId: contribution.paymentId,
        returnUrl: `${origin}/submit/success`,
        cancelUrl: `${origin}/?payment=cancelled`,
      });
      await markContributionCheckoutCreated(contribution.paymentId, checkout.sessionId);
      return NextResponse.json({ checkoutUrl: checkout.checkoutUrl });
    } catch (error) {
      await markContributionFailed(contribution.paymentId);
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
