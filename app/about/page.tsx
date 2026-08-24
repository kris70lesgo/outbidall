import Image from "next/image";
import Link from "next/link";
import { AboutStats } from "@/components/about-stats";
import { SiteHeader } from "@/components/site-header";
import githubPfp from "@/app/githubpfp.png";

export const metadata = { title: "About — outbidall.lol", description: "Why Outbidall exists." };

export default function AboutPage() {
  return <main className="page editorial-page"><div className="shell"><SiteHeader active="about" /><article className="editorial"><h1>About</h1><p className="editorial-lede">Outbidall is a straightforward paid leaderboard for products that want to be seen. No confusing score: the rank follows the bid.</p><section><h2>Built to keep the rules obvious</h2><p>Submit your product, choose your contribution, and it takes the place that amount earns. Existing products can add to their bid whenever they want to move up.</p></section><section><p>Here&apos;s where the board stands right now:</p><AboutStats /></section><section><p><strong>Small by design.</strong> Outbidall keeps the focus on interesting products, direct discovery, and a ranking system anyone can understand in one sentence.</p></section><div className="founder"><Image src={githubPfp} width={94} height={94} alt="Krish" priority /><p><strong>Built by <a href="https://x.com/krish725_" target="_blank" rel="noreferrer">@krish725_</a></strong><br /><span>Building a direct way for new products to compete for attention.</span></p></div></article><footer className="editorial-footer">Built for products that want to outbid · <Link href="/rules">Rules</Link> · <a href="https://x.com/krish725_" target="_blank" rel="noreferrer">@krish725_</a></footer></div></main>;
}
