import { useQuery } from "@tanstack/react-query";
import { fetchAdminAvailability } from "@/lib/api";

export function useFleetStats() {
  return useQuery({
    queryKey: ["fleet-stats"],
    queryFn: async () => {
      const start = new Date().toISOString().slice(0, 10);
      const end = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString().slice(0, 10);

      const data = await fetchAdminAvailability(start, end);

      if (!data) {
        return {
          totalcars: 0,
          rented: 0,
          available: 0,
          dueToday: 0,
          overdue: 0,
          utilisation: 0,
        };
      }

      return data;
    },
  });
}




