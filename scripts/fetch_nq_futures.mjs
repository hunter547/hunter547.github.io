#!/usr/bin/env node
// Fetch Nasdaq-100 futures (NQ=F) 5-minute candles for the last 60 days from
// the Yahoo Finance chart API using the JS fetch API, and write them to
// public/data/nqFutures.json in the shape consumed by lightweight-charts:
// a sorted list of {time, open, high, low, close} where `time` is a UTC unix
// timestamp in seconds.
//
// This runs in Node (server-side), so Yahoo's lack of CORS headers is a
// non-issue — a browser fetch of the same URL would be blocked. Yahoo limits
// 5-minute intraday history to the most recent 60 days, so this is a static
// snapshot; re-run to refresh.
//
// Usage:  node scripts/fetch_nq_futures.mjs   (or: npm run data:nq)

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TICKER = "NQ=F"; // E-mini Nasdaq-100 futures
const RANGE = "60d"; // max range Yahoo allows for 5m bars
const INTERVAL = "5m";

const dir = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(dir, "..", "public", "data", "nqFutures.json");

const round2 = (n) => Math.round(n * 100) / 100;

const url =
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(TICKER)}` +
  `?interval=${INTERVAL}&range=${RANGE}`;

const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!res.ok) {
  console.error(`Yahoo request failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const json = await res.json();
const result = json?.chart?.result?.[0];
if (!result) {
  console.error("No chart result:", json?.chart?.error ?? "unknown error");
  process.exit(1);
}

const timestamps = result.timestamp ?? [];
const quote = result.indicators.quote[0];

const seen = new Set();
const bars = [];
for (let i = 0; i < timestamps.length; i += 1) {
  const time = timestamps[i];
  const open = quote.open[i];
  const high = quote.high[i];
  const low = quote.low[i];
  const close = quote.close[i];
  // Skip gap rows (nulls) and duplicate timestamps.
  if (open == null || high == null || low == null || close == null) continue;
  if (seen.has(time)) continue;
  seen.add(time);
  bars.push({
    time,
    open: round2(open),
    high: round2(high),
    low: round2(low),
    close: round2(close),
  });
}

bars.sort((a, b) => a.time - b.time);

await mkdir(dirname(OUT_PATH), { recursive: true });
await writeFile(OUT_PATH, JSON.stringify(bars));

console.log(`Wrote ${bars.length} bars to ${OUT_PATH}`);
console.log(`Range: ${bars[0]?.time} .. ${bars.at(-1)?.time} (unix seconds, UTC)`);
