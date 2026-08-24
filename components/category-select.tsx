"use client";

import { useEffect, useRef, useState } from "react";

type CategorySelectProps = { value: string; onChange: (value: string) => void };
const options = [
  { value: "ai-agents-infrastructure", label: "AI Agents & Infrastructure", icon: "▣" },
  { value: "seo-ai-visibility", label: "SEO & AI Visibility", icon: "◉" },
  { value: "ai-media-generation", label: "AI Media Generation", icon: "✦" },
  { value: "marketing-advertising", label: "Marketing & Advertising", icon: "⚑" },
  { value: "developer-tools", label: "Developer Tools", icon: "</>" },
  { value: "productivity", label: "Productivity", icon: "✧" },
  { value: "crypto-web3-investing", label: "Crypto, Web3 & Investing", icon: "₿" },
  { value: "business-finance-legal", label: "Business, Finance & Legal", icon: "⚖" },
  { value: "security-privacy-compliance", label: "Security, Privacy & Compliance", icon: "◇" },
  { value: "health-fitness-wellness", label: "Health, Fitness & Wellness", icon: "♡" },
  { value: "social-creator-tools", label: "Social Media & Creator Tools", icon: "↗" },
  { value: "hiring-jobs-careers", label: "Hiring, Jobs & Careers", icon: "▤" },
  { value: "education-learning", label: "Education & Learning", icon: "⌂" },
  { value: "ecommerce-retail", label: "Ecommerce & Retail", icon: "⌑" },
  { value: "domains-web-assets", label: "Domains & Web Assets", icon: "◎" },
];

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [open, setOpen] = useState(false); const root = useRef<HTMLDivElement>(null); const selected = options.find(option => option.value === value);
  useEffect(() => { const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <div className="category-select" ref={root}><button type="button" className="category-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(next => !next)}><span>{selected ? <><i aria-hidden="true">{selected.icon}</i>{selected.label}</> : "Category"}</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg></button>{open && <div className="category-menu" role="listbox" aria-label="Category">{options.map(option => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }}><i aria-hidden="true">{option.icon}</i>{option.label}</button>)}</div>}</div>;
}
