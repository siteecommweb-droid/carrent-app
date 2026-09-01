// src/context/CurrencyContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
  rates: Record<string, number> | null;
  loading: boolean;
  convert: (amount: number, fromCurrency?: string) => number;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const SYMBOLS: Record<string, string> = {
  MUR: "Rs", USD: "$", EUR: "€", GBP: "£", INR: "₹", ZAR: "R", AED: "د.إ", CNY: "¥", JPY: "¥", CAD: "$", AUD: "$"
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("MUR");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency");
    if (saved && SYMBOLS[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/MUR");
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        console.error("Currency API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 3600000); // Refresh every hour
    return () => clearInterval(interval);
  }, []);

  // Update currency and save to localStorage
  const updateCurrency = (code: string) => {
    if (SYMBOLS[code]) {
      setCurrencyState(code);
      localStorage.setItem("preferredCurrency", code);
    }
  };

  // Convert amount from MUR to selected currency
  const convert = (amount: number, fromCurrency: string = "MUR"): number => {
    if (!rates || currency === fromCurrency) return amount;
    const fromRate = rates[fromCurrency];
    const toRate = rates[currency];
    if (!fromRate || !toRate) return amount;
    return (amount / fromRate) * toRate;
  };

  // Format price with currency symbol
  const formatPrice = (amount: number): string => {
    if (amount === undefined || amount === null) return `${SYMBOLS[currency] || currency} 0`;
    const converted = convert(amount);
    const symbol = SYMBOLS[currency] || currency;
    return `${symbol} ${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: updateCurrency,
        rates,
        loading,
        convert,
        formatPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}




