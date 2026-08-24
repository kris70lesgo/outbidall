import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

type SiteHeaderProps = { active?: "about" | "rules" | "leaderboard" };
export function SiteHeader({ active }: SiteHeaderProps) {
  return <header className="header"><Link className="brand" href="/"><span className="mark"><BrandMark /></span><span className="wordmark">outbidall.lol</span></Link><nav className="nav" aria-label="Main navigation"><Link href="/" aria-current={active === "leaderboard" ? "page" : undefined}>Leaderboard</Link><Link href="/about" aria-current={active === "about" ? "page" : undefined}>About</Link><Link href="/rules" aria-current={active === "rules" ? "page" : undefined}>Rules</Link></nav></header>;
}
