export type WebsiteMetadata = { url: string; canonicalUrl: string | null; domain: string; hostname: string; title: string | null; description: string | null; favicon: string | null; ogImage: string | null };

export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("@")) return null;
  try { const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`); return ["http:", "https:"].includes(url.protocol) ? url : null; } catch { return null; }
}

export function normalizeDomain(hostname: string) { return hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, ""); }
export function resolveUrl(value: string | null | undefined, base: URL) { try { return value ? new URL(value, base).toString() : null; } catch { return null; } }

export function parseMetadata(html: string, pageUrl: URL): WebsiteMetadata {
  const attribute = (tag: string, key: string, value: string) => { const match = tag.match(new RegExp(`${key}\\s*=\\s*["']${value}["'][^>]*content\\s*=\\s*["']([^"']+)["']|content\\s*=\\s*["']([^"']+)["'][^>]*${key}\\s*=\\s*["']${value}["']`, "i")); return match?.[1] ?? match?.[2] ?? null; };
  const meta = (name: string) => attribute(html, "(?:name|property)", name);
  const tag = (regex: RegExp) => html.match(regex)?.[1]?.trim() ?? null;
  const iconTag = html.match(/<link\b[^>]*\brel\s*=\s*["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i)?.[0] ?? html.match(/<link\b[^>]*\bhref\s*=\s*["'][^"']+["'][^>]*\brel\s*=\s*["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i)?.[0];
  const faviconHref = iconTag?.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
  const hostname = pageUrl.hostname;
  return { url: pageUrl.toString(), canonicalUrl: resolveUrl(tag(/<link\b[^>]*\brel\s*=\s*["']canonical["'][^>]*\bhref\s*=\s*["']([^"']+)["']/i), pageUrl), domain: normalizeDomain(hostname), hostname, title: meta("og:title") ?? tag(/<title[^>]*>([^<]{1,250})<\/title>/i) ?? normalizeDomain(hostname), description: meta("og:description") ?? meta("description"), favicon: resolveUrl(faviconHref, pageUrl) ?? `${pageUrl.origin}/favicon.ico`, ogImage: resolveUrl(meta("og:image"), pageUrl) };
}
