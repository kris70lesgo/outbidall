"use client";

import { useEffect, useRef, useState } from "react";

type CategorySelectProps = { value: string; onChange: (value: string) => void };
const options = [{ value: "", label: "Choose a category" }, { value: "productivity", label: "Productivity" }];

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [open, setOpen] = useState(false); const root = useRef<HTMLDivElement>(null); const selected = options.find(option => option.value === value) ?? options[0];
  useEffect(() => { const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <div className="category-select" ref={root}><button type="button" className="category-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(next => !next)}>{selected.label}<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg></button>{open && <div className="category-menu" role="listbox" aria-label="Choose a category">{options.map(option => <button key={option.value || "all"} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}</div>}</div>;
}
