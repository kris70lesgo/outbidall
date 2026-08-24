"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [{ symbol: "@", value: "1,284", label: "Online now" }, { symbol: "+", value: "248.1K", label: "Visitors since launch" }, { symbol: "#", value: "24", label: "Live listings" }, { symbol: ">", value: "26.4K", label: "Outbound clicks" }];
export function StatStrip() {
  const ref = useRef<HTMLElement>(null); const visible = useInView(ref, { once: true }); const reduced = useReducedMotion(); const [ready, setReady] = useState(false);
  useEffect(() => { if (visible || reduced) setReady(true); }, [visible, reduced]);
  return <section ref={ref} className="stats" aria-label="Live platform statistics">{stats.map((stat, index) => <motion.div className="stat" key={stat.label} initial={reduced ? false : { opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 + index * .08, duration: .6 }}><div className="stat-symbol pixel">{stat.symbol}</div><div className="stat-value">{stat.value}</div><div className="stat-label">{stat.label}</div></motion.div>)}</section>;
}
