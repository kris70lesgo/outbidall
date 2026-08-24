"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { normalizeDomain, normalizeUrl, type WebsiteMetadata } from "@/lib/metadata";

type Props = { value: string; onChange: (value: string) => void; onMetadata: (metadata: WebsiteMetadata | null) => void };
function Globe() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5S14.3 18.1 12 20.5C9.7 18.1 8.6 15.3 8.6 12S9.7 5.9 12 3.5Z"/></svg>; }

export function WebsiteUrlInput({ value, onChange, onMetadata }: Props) {
  const [favicon, setFavicon] = useState<string | null>(null); const [failed, setFailed] = useState(false); const [loading, setLoading] = useState(false); const lastDomain = useRef(""); const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const parsed = normalizeUrl(value); if (!parsed) { request.current?.abort(); setFavicon(null); setFailed(false); setLoading(false); onMetadata(null); return; }
    const domain = normalizeDomain(parsed.hostname); if (domain === lastDomain.current) return; lastDomain.current = domain; setFailed(false); setFavicon(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`);
    const timer = window.setTimeout(async () => { request.current?.abort(); const controller = new AbortController(); request.current = controller; setLoading(true); try { const response = await fetch("/api/metadata", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: parsed.toString() }), signal: controller.signal }); const payload = await response.json() as { success: boolean; data?: WebsiteMetadata }; if (!controller.signal.aborted && payload.success && payload.data) { if (payload.data.favicon) setFavicon(payload.data.favicon); onMetadata(payload.data); } } catch { /* A failed enrichment never blocks submission. */ } finally { if (!controller.signal.aborted) setLoading(false); } }, 400);
    return () => { window.clearTimeout(timer); };
  }, [value, onMetadata]);
  return <div className="website-field"><span className="website-icon">{favicon && !failed ? /* Arbitrary user-provided origins cannot be allowlisted for next/image. */ <img src={favicon} alt="" onError={() => { if (favicon.includes("google.com/s2")) setFailed(true); else setFavicon(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(lastDomain.current)}&sz=64`); }} /> : <Globe />}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder="Your product URL or @handle" aria-label="Your product URL or handle" autoComplete="url" />{loading && <span className="metadata-pulse" aria-label="Looking up website" />}</div>;
}
