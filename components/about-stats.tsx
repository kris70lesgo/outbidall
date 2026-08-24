"use client";

import CountUp from "@/components/CountUp";

export function AboutStats() {
  return <div className="about-stats" aria-label="Outbidall facts"><div className="about-stat"><strong><CountUp to={4} duration={.7} /></strong><span>live listings</span></div><div className="about-stat"><strong>$<CountUp to={25} separator="," duration={1.2} /></strong><span>top bid</span></div><div className="about-stat"><strong><CountUp to={4898} separator="," duration={1.5} /></strong><span>outbound clicks</span></div></div>;
}
