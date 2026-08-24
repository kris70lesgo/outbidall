"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { WebsiteUrlInput } from "@/components/website-url-input";
import { CategorySelect } from "@/components/category-select";
import type { WebsiteMetadata } from "@/lib/metadata";

const minimum = 5;

export function BidComposer({ startingBid = 30 }: { startingBid?: number }) {
  const [bid, setBid] = useState(startingBid);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [metadata, setMetadata] = useState<WebsiteMetadata | null>(null);
  const reduced = useReducedMotion();
  const rank = useMemo(() => bid >= startingBid ? 1 : 2, [bid, startingBid]);
  const transition: Transition = reduced ? { duration: 0 } : { duration: .85, delay: .12, ease: [0.22, 1, .36, 1] as const };

  function change(delta: number) { setBid(value => Math.max(minimum, value + delta)); }
  function submit(event: React.FormEvent) { event.preventDefault(); if (url) window.location.assign(`/submit?url=${encodeURIComponent(url)}&bid=${bid}&category=${encodeURIComponent(category)}`); }
  const updateMetadata = useCallback((next: WebsiteMetadata | null) => setMetadata(next), []);

  return <>
    <motion.div className="claim pixel" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
      <span>Claim #{rank} for</span>
      <span className="amount"><button type="button" aria-label="Decrease bid" onClick={() => change(-5)}>−</button><span>$</span><input aria-label="Bid in US dollars" inputMode="numeric" value={bid} onChange={e => setBid(Math.max(minimum, Number(e.target.value.replace(/\D/g, "")) || minimum))} /><button type="button" aria-label="Increase bid" onClick={() => change(5)}>+</button></span>
    </motion.div>
    <p className="hint"><strong>New spots start at $5.</strong> Paying less than the #1 price still puts you on the board at whatever place that bid can take.</p>
    <form className="outbid-form" onSubmit={submit}><WebsiteUrlInput value={url} onChange={setUrl} onMetadata={updateMetadata} /><CategorySelect value={category} onChange={setCategory} /><button disabled={!url}>Outbid</button></form>
    <p className="microcopy">Already on the list? Enter the same URL or @handle and up your bid.</p>
    {metadata && <div className="metadata-preview" aria-live="polite"><span className="preview-domain">{metadata.domain}</span><strong>{metadata.title}</strong>{metadata.description && <span>{metadata.description}</span>}</div>}
  </>;
}
