import { useCallback, useEffect, useState } from "react";

export function useCarDetails(id?: string) {
  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCar = useCallback(async () => {
    if (!id) {
      setCar(null);
      setLoading(false);
      setError("Invalid car ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`http://localhost:8000/api/cars/${id}`);
      const data = await res.json();

      setCar(data.data || data || null);
    } catch (err: any) {
      setError(err?.message || "Failed to load car details.");
      setCar(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  return {
    car,
    loading,
    error,
    refetch: fetchCar,
  };
}




