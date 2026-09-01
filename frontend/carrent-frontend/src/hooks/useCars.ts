import { useCallback, useEffect, useMemo, useState } from "react";
import { cars as fallbackcars } from "@/data/cars";

export type carsfilter = {
  category: string;
  fuel: string;
  seats: string;
  popular: boolean;
  price: number;
  avGroup?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function normalizecarsPayload(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.cars)) return payload.cars;
  return [];
}

export function usecars(initialfilter: carsfilter) {
  const stableInitialfilter = useMemo(() => initialfilter, [initialfilter]);

  const [cars, setcars] = useState<any[]>(fallbackcars);
  const [filter, setfilter] = useState<carsfilter>(stableInitialfilter);
  const [loading, setLoading] = useState<boolean>(Boolean(API_BASE_URL));
  const [error, setError] = useState<string>("");

  const fetchcars = useCallback(async () => {
    if (!API_BASE_URL) {
      setcars(fallbackcars);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/cars`);
      if (!response.ok) throw new Error();

      const payload = await response.json();
      const normalized = normalizecarsPayload(payload);

      if (normalized.length === 0) {
        setcars(fallbackcars);
        setError("API empty → fallback used");
      } else {
        setcars(normalized);
      }
    } catch {
      setcars(fallbackcars);
      setError("API offline → fallback used");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchcars();
  }, [fetchcars]);

  const updatefilter = useCallback((patch: Partial<carsfilter>) => {
    setfilter((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetfilter = useCallback(() => {
    setfilter(stableInitialfilter);
  }, [stableInitialfilter]);

  const filteredcars = useMemo(() => {
    return cars.filter((c: any) => {
      if (filter.category !== "all" && c.category !== filter.category) return false;
      if (filter.fuel !== "all" && c.fuel !== filter.fuel) return false;
      if (filter.seats !== "all" && String(c.seats) !== filter.seats) return false;
      if (filter.popular && !c.popular) return false;
      if (filter.price && c.price > filter.price) return false;
      if (filter.avGroup && c.avGroup !== filter.avGroup) return false;
      return true;
    });
  }, [cars, filter]);

  return {
    cars: filteredcars,
    filter,
    loading,
    error,
    updatefilter,
    resetfilter,
    refetch: fetchcars,
  };
}




