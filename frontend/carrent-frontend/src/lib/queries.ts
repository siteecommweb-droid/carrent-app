import { useQuery } from "@tanstack/react-query";
import {
  fetchCars,
  fetchMe,
  fetchCarById,
} from "./api";

export function useCarsQuery() {
  return useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });
}

export function useCarBookedRangesQuery(
  carId: number | string | null
) {
  return useQuery({
    queryKey: ["car-details", carId],
    queryFn: () =>
      fetchCarById(String(carId)),
    enabled: !!carId,
  });
}

export function useMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled,
  });
}