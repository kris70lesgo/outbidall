# outbidall.lol

Paid competitive leaderboard built with Next.js App Router. The local app includes a polished demo board; production persistence and payment capture are server-side seams ready for Supabase and PayPal.

## Run

1. Copy `.env.example` to `.env.local` and populate credentials when ready.
2. `npm install`
3. `npm run dev`

## Database

Apply `supabase/migrations/20260823000000_outbidall_initial.sql` through the Supabase SQL editor or CLI. The schema enables RLS and intentionally exposes only safe public read policies. Payment completion must be invoked from a trusted server process after PayPal capture verification.

## Dodo Payments

Dodo checkout sessions are product-based. Create a one-time USD contribution product in Dodo, configure `DODO_CONTRIBUTION_PRODUCT_ID`, and add a webhook signing key before enabling payment collection. The API key and webhook key must remain server-only.

## Security

Metadata discovery rejects local and private addresses and applies a timeout/content-type check. Configure production rate limiting and PayPal webhook verification before accepting payments.
