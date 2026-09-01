import {
  Globe,
  Check,
  ChevronDown,
  TrendingUp,
  Sparkles,
  Search,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useCurrency } from "@/context/CurrencyContext";

interface CurrencyItem {
  code: string;

  symbol: string;

  name: string;

  country: string;

  flag: string;
}

const currencies: CurrencyItem[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    country: "United States",
    flag: "🇺🇸",
  },

  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    country: "Europe",
    flag: "🇪🇺",
  },

  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    country: "United Kingdom",
    flag: "🇬🇧",
  },

  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    country: "Canada",
    flag: "🇨🇦",
  },

  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    country: "Australia",
    flag: "🇦🇺",
  },

  {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    country: "Dubai",
    flag: "🇦🇪",
  },

  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    country: "India",
    flag: "🇮🇳",
  },

  {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    country: "South Africa",
    flag: "🇿🇦",
  },

  {
    code: "CHF",
    symbol: "CHF",
    name: "Swiss Franc",
    country: "Switzerland",
    flag: "🇨🇭",
  },

  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    country: "Japan",
    flag: "🇯🇵",
  },

  {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    country: "China",
    flag: "🇨🇳",
  },

  {
    code: "MUR",
    symbol: "Rs",
    name: "Mauritian Rupee",
    country: "Mauritius",
    flag: "🇲🇺",
  },
];

export default function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [detectedCurrency, setDetectedCurrency] =
    useState<string | null>(null);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const currentCurrency = useMemo(() => {
    return (
      currencies.find(
        (c) => c.code === currency
      ) || currencies[0]
    );
  }, [currency]);

  const filteredCurrencies =
    currencies.filter((c) => {
      const q = search.toLowerCase();

      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    });

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "preferred_currency"
      );

    if (saved) {
      setCurrency(saved as any);
    } else {
      autoDetectCurrency();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "preferred_currency",
      currency
    );

    localStorage.setItem(
      "currency_last_changed",
      new Date().toISOString()
    );
  }, [currency]);

  useEffect(() => {
    const clickOutside = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      clickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        clickOutside
      );
  }, []);

  const autoDetectCurrency =
    async () => {
      try {
        const locale =
          Intl.DateTimeFormat()
            .resolvedOptions()
            .locale;

        if (
          locale.includes("en-US")
        ) {
          setCurrency("USD" as any);

          setDetectedCurrency("USD");
        } else if (
          locale.includes("en-GB")
        ) {
          setCurrency("GBP" as any);

          setDetectedCurrency("GBP");
        } else if (
          locale.includes("fr") ||
          locale.includes("de")
        ) {
          setCurrency("EUR" as any);

          setDetectedCurrency("EUR");
        } else {
          setCurrency("USD" as any);

          setDetectedCurrency("USD");
        }
      } catch {
        setCurrency("USD" as any);
      }
    };

  const handleCurrencyChange = (
    code: string
  ) => {
    setCurrency(code as any);

    setOpen(false);

    localStorage.setItem(
      "currency_audit_log",
      JSON.stringify({
        currency: code,

        changedAt:
          new Date().toISOString(),

        source:
          "CurrencySelect",

        userAgent:
          navigator.userAgent,
      })
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      {/* BUTTON */}
      <motion.button
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
        onClick={() =>
          setOpen(!open)
        }
        className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-white shadow-xl backdrop-blur-xl transition hover:bg-white/15"
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-300" />

          <span className="text-lg">
            {
              currentCurrency.flag
            }
          </span>

          <div className="text-left">
            <div className="text-sm font-black">
              {
                currentCurrency.code
              }
            </div>

            <div className="text-[10px] text-white/60">
              {
                currentCurrency.symbol
              }{" "}
              {
                currentCurrency.country
              }
            </div>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 transition ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </motion.button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="absolute right-0 z-50 mt-3 w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-[#071226]/95 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            {/* HEADER */}
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4 text-yellow-300" />

                    <span className="font-black">
                      Smart Currency
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-white/60">
                    Global pricing
                    intelligence
                  </div>
                </div>

                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                  LIVE FX
                </div>
              </div>

              {/* SEARCH */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search currency..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            {/* AUTO DETECT */}
            {detectedCurrency && (
              <div className="border-b border-white/10 bg-blue-500/10 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <TrendingUp className="h-4 w-4" />

                  Smart detection:
                  Recommended currency
                  based on your region
                </div>
              </div>
            )}

            {/* LIST */}
            <div className="max-h-[420px] overflow-auto">
              {filteredCurrencies.map(
                (c) => {
                  const active =
                    currency === c.code;

                  return (
                    <motion.button
                      key={c.code}
                      whileHover={{
                        backgroundColor:
                          "rgba(255,255,255,0.06)",
                      }}
                      onClick={() =>
                        handleCurrencyChange(
                          c.code
                        )
                      }
                      className="flex w-full items-center justify-between border-b border-white/5 px-5 py-4 text-left transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {c.flag}
                        </div>

                        <div>
                          <div className="font-black text-white">
                            {
                              c.code
                            }{" "}
                            •{" "}
                            {
                              c.symbol
                            }
                          </div>

                          <div className="text-xs text-white/60">
                            {c.name}
                          </div>

                          <div className="text-[10px] text-white/40">
                            {
                              c.country
                            }
                          </div>
                        </div>
                      </div>

                      {active && (
                        <Check className="h-5 w-5 text-emerald-300" />
                      )}
                    </motion.button>
                  );
                }
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-white/10 bg-black/20 px-5 py-4">
              <div className="flex items-center justify-between text-xs text-white/50">
                <div>
                  Prices update
                  dynamically
                </div>

                <div>
                  Stripe-ready •
                  Audit enabled
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}