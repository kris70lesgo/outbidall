# Outbidall Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a distinctive dark paid-product leaderboard for outbidall.lol with a runnable front end and secure, deployable backend seams.

**Architecture:** Use Next.js App Router with server components for public pages and isolated client components for bid controls and motion. Keep Supabase and payment access server-only; ship a demo data fallback so local development remains useful before credentials are configured.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Zod, Supabase PostgreSQL, PayPal abstraction, Upstash-ready cache interface.

---

### Task 1: Bootstrap the app shell

**Files:** Create `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`.

1. Configure a minimal Next.js project with pinned runtime dependencies.
2. Implement dark global tokens, responsive typography, and Outbidall metadata/favicon.
3. Run `npm run build`; expected result: a clean production build.

### Task 2: Build the landing leaderboard experience

**Files:** Create `app/page.tsx`, `components/brand-mark.tsx`, `components/bid-composer.tsx`, `components/stat-strip.tsx`, `components/leaderboard-card.tsx`.

1. Render the app-specific logo, hero media treatment, bid composer, stat strip, and a ranked product card.
2. Add accessible, reduced-motion-aware transitions and usable client-side bid interactions.
3. Run `npm run lint` and visually inspect the local page.

### Task 3: Add product and outbound paths

**Files:** Create `app/product/[slug]/page.tsx`, `app/go/[slug]/route.ts`, `lib/demo-data.ts`.

1. Provide a listing detail page driven by shared demo data.
2. Route external clicks through a server redirect endpoint.
3. Verify with `npm run build`.

### Task 4: Establish backend contracts and database schema

**Files:** Create `lib/validation.ts`, `lib/payments/provider.ts`, `lib/payments/paypal.ts`, `app/api/metadata/route.ts`, `supabase/migrations/20260823000000_outbidall_initial.sql`.

1. Validate all public inputs with Zod and protect metadata fetches against private-network SSRF.
2. Create provider-neutral payment types; leave any payment mutation server-only.
3. Define RLS-protected tables, indexes, and atomic bid-application function.
4. Exercise validation unit checks and inspect the migration manually before applying it to a remote project.

### Task 5: Add deployment guidance and final verification

**Files:** Create `.env.example`, `README.md`.

1. Document required environment variables and safe setup flow.
2. Run `npm run lint` and `npm run build`.
3. Report the runnable result and any Supabase setup still requiring account credentials.
