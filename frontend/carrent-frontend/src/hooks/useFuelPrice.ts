// frontend/src/hooks/useFuelPrice.ts
import { useState, useEffect } from "react";
import { fetchFuelPrices } from "../services/api";

export interface FuelPrice {
  petrol: number;
  diesel: number;
  lastUpdate: string;
}

export function useFuelPrice() {
  const [prices, setPrices] = useState<FuelPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateCost = (distanceKm: number, consumptionLPer100km: number, fuelType: "petrol" | "diesel" = "petrol"): number => {
    if (!prices) return 0;
    const litres = (distanceKm * consumptionLPer100km) / 100;
    const pricePerLiter = fuelType === "petrol" ? prices.petrol : prices.diesel;
    return litres * pricePerLiter;
  };

  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoading(true);
        const data = await fetchFuelPrices();
        setPrices({
          petrol: data.petrol,
          diesel: data.diesel,
          lastUpdate: data.lastUpdate
        });
        setError(null);
      } catch (err) {
        setError("Failed to load fuel prices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPrices();
  }, []);

  return { prices, loading, error, calculateCost };
}




