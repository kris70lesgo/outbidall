import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "outbidall.lol — the product leaderboard",
  description: "A live, paid leaderboard for products that want to move up.",
  metadataBase: new URL("https://outbidall.lol"),
  openGraph: { title: "outbidall.lol", description: "Outbid. Move up. Get discovered.", siteName: "outbidall.lol" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
