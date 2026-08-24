import Link from "next/link";

export default function PaymentSuccessPage() {
  return <main className="page"><div className="shell detail"><Link className="back" href="/">← Back to leaderboard</Link><p className="pixel">Payment received</p><h1>Your bid is being confirmed.</h1><p>Outbidall activates listings only after Dodo&apos;s signed payment webhook arrives. Your placement will appear on the leaderboard shortly.</p></div></main>;
}
