import { z } from "zod";
import { lookup } from "node:dns/promises";

export const metadataRequestSchema = z.object({ url: z.string().min(1).max(2048) });
const privateHosts = ["localhost", "localhost.localdomain", "metadata.google.internal"];

export function parsePublicHttpUrl(value: string) {
  const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
  if (!(url.protocol === "http:" || url.protocol === "https:")) throw new Error("Only HTTP(S) URLs are supported.");
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  const privateV4 = /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;
  const privateV6 = host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd");
  if (privateHosts.includes(host) || privateV4.test(host) || privateV6) throw new Error("Private or internal URLs are not allowed.");
  return url;
}

export async function assertPublicHostname(url: URL) {
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  for (const { address } of addresses) {
    const privateV4 = /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address);
    const privateV6 = address === "::1" || address.startsWith("fe80:") || address.startsWith("fc") || address.startsWith("fd");
    if (privateV4 || privateV6) throw new Error("Private or internal URLs are not allowed.");
  }
}
