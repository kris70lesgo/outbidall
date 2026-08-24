export type LeaderboardListing = { slug: string; name: string; website: string; domain: string; description: string; bidCents: number; clicks: number; createdLabel: string; category: string };

export const fallbackListings: LeaderboardListing[] = [
  { slug: "nex-ai", name: "Nex", website: "https://nex.ai/", domain: "nex.ai", description: "A focused AI workspace for teams that want to move from idea to execution faster.", bidCents: 2500, clicks: 1847, createdLabel: "about 2 hours ago", category: "AI" },
  { slug: "archal-ai", name: "Archal", website: "https://archal.ai/", domain: "archal.ai", description: "An AI product built for clear thinking, faster workflows, and practical momentum.", bidCents: 2100, clicks: 1324, createdLabel: "about 5 hours ago", category: "AI" },
  { slug: "tsenta", name: "Tsenta", website: "https://tsenta.com/", domain: "tsenta.com", description: "A modern tool for building and shipping smarter customer experiences.", bidCents: 1700, clicks: 986, createdLabel: "1 day ago", category: "AI" },
  { slug: "context-dev", name: "Context", website: "https://www.context.dev/", domain: "context.dev", description: "Developer context that helps technical teams stay aligned and move with confidence.", bidCents: 1200, clicks: 741, createdLabel: "2 days ago", category: "AI" },
];

export function formatDollars(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100); }
