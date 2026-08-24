import { NextResponse } from "next/server";
import { assertPublicHostname, metadataRequestSchema, parsePublicHttpUrl } from "@/lib/validation";
import { getCache, checkRateLimit, setCache } from "@/lib/redis";
import { parseMetadata, type WebsiteMetadata } from "@/lib/metadata";

export async function POST(request: Request) {
  try {
    const { url: rawUrl } = metadataRequestSchema.parse(await request.json());
    const url = parsePublicHttpUrl(rawUrl);
    await assertPublicHostname(url);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!await checkRateLimit(`metadata-rate:${ip}`)) return NextResponse.json({ success: false, error: { code: "RATE_LIMITED", message: "Try again in a minute." } }, { status: 429 });
    const key = `metadata:${url.hostname.toLowerCase().replace(/^www\./, "")}`;
    const cached = await getCache<WebsiteMetadata>(key);
    if (cached) return NextResponse.json({ success: true, data: cached });
    const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(5000), headers: { accept: "text/html,application/xhtml+xml", "user-agent": "OutbidallMetadataBot/1.0" } });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !(contentType.includes("text/html") || contentType.includes("application/xhtml+xml"))) throw new Error("The URL did not return an HTML page.");
    const html = (await response.text()).slice(0, 512_000);
    const data = parseMetadata(html, url);
    await setCache(key, data, Number(process.env.METADATA_CACHE_TTL_SECONDS ?? 86400));
    return NextResponse.json({ success: true, data });
  } catch { return NextResponse.json({ success: false, error: { code: "METADATA_FETCH_FAILED", message: "We couldn't read this website." } }, { status: 400 }); }
}
