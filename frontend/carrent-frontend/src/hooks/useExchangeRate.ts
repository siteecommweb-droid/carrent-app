import { useState, useEffect } from "react";
import { fetchExchangeRates } from "../services/api";

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdate: string;
}

export function useExchangeRate(base: string = "MUR") {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convert = (amount: number, from: string, to: string): number => {
    if (!rates) return amount;
    const fromRate = rates.rates[from];
    const toRate = rates.rates[to];
    if (!fromRate || !toRate) return amount;
    return (amount / fromRate) * toRate;
  };

  useEffect(() => {
    const loadRates = async () => {
      try {
        setLoading(true);
        const data = await fetchExchangeRates();
        setRates({
          base: data.base,
          rates: data.rates,
          lastUpdate: new Date().toISOString()
        });
        setError(null);
      } catch (err) {
        setError("Failed to load exchange rates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRates();
  }, [base]);

  return { rates, loading, error, convert };
}






