import { NextResponse } from "next/server";
import { markContributionFailed, markContributionSucceeded } from "@/lib/leaderboard";
import { unwrapDodoWebhook } from "@/lib/payments/dodo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const event = unwrapDodoWebhook(await request.text(), request.headers);
    if (!event.payment?.paymentRecordId) return NextResponse.json({ received: true });
    if (event.type === "payment.succeeded") {
      await markContributionSucceeded({
        paymentId: event.payment.paymentRecordId,
        providerCaptureId: event.payment.paymentId,
        payerEmail: event.payment.payerEmail,
        metadata: event.payment.metadata,
      });
    } else if (event.type === "payment.failed" || event.type === "payment.cancelled") {
      await markContributionFailed(event.payment.paymentRecordId);
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }
}
