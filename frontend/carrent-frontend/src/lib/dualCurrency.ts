// AM38 DUAL CURRENCY ENGINE — MUR + USD always shown together, always in sync.
// One rate source. Auto-refreshes from live API, falls back to stored rate.
import { useEffect, useState } from "react";

const FALLBACK_RATE = 46.5; // MUR per 1 USD
const KEY = "am38_usd_mur_rate";

export function getRate(): number {
  const saved = Number(localStorage.getItem(KEY));
  return saved > 10 && saved < 200 ? saved : FALLBACK_RATE;
}

export async function refreshRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    const rate = Number(data?.rates?.MUR);
    if (rate > 10 && rate < 200) {
      localStorage.setItem(KEY, String(rate));
      return rate;
    }
  } catch {}
  return getRate();
}

export function murToUsd(mur: number, rate = getRate()) {
  return mur / rate;
}
export function usdToMur(usd: number, rate = getRate()) {
  return usd * rate;
}
export function fmtMUR(mur: number) {
  return `Rs ${Math.round(mur).toLocaleString()}`;
}
export function fmtUSD(usd: number) {
  return `$${usd.toFixed(2)}`;
}
/** "Rs 1,500 ≈ $32.26" — the AM38 twin-price string used everywhere */
export function fmtDual(mur: number, rate = getRate()) {
  return `${fmtMUR(mur)} ≈ ${fmtUSD(murToUsd(mur, rate))}`;
}

export function useLiveRate() {
  const [rate, setRate] = useState(getRate());
  useEffect(() => {
    refreshRate().then(setRate);
    const id = setInterval(() => refreshRate().then(setRate), 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return rate;
}