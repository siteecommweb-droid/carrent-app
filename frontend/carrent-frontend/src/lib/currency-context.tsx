import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchExchangeRates } from "./currency-api";

export type Currency = "MUR" | "USD" | "EUR" | "GBP" | "JPY";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (murAmount: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("MUR");
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchExchangeRates().then((data) => {
      setRates(data || {});
    });
  }, []);

  function convert(mur: number) {
    if (currency === "MUR") return mur;

    const rate = rates[currency];

    if (!rate) return mur;

    return mur * rate;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);

  if (!ctx) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return ctx;
}




