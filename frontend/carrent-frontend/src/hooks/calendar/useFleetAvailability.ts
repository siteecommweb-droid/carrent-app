import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarApi } from "@/services/calendar/calendar.api";
import { Vehicle, CalendarEvent } from "@/types/calendar.types";
import { toast } from "react-hot-toast";

export const FLEET_AVAILABILITY_KEY = "fleet-availability";

export function useFleetAvailability(date?: Date) {
  const queryClient = useQueryClient();
  const CALENDAR_VEHICLES_KEY = "calendar-vehicles";

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: [CALENDAR_VEHICLES_KEY],
    queryFn: () => calendarApi.getVehicles(),
    staleTime: 60000,
  });

  const updateVehicleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      calendarApi.updateVehicleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_VEHICLES_KEY] });
      toast.success("Vehicle status updated");
    },
    onError: () => toast.error("Failed to update vehicle status"),
  });

  const checkOverlapMutation = useMutation({
    mutationFn: ({ start, end, carId }: { start: Date; end: Date; carId?: number }) =>
      calendarApi.checkOverlap(start, end, carId),
  });

  const getAvailableVehicles = (start: Date, end: Date): Vehicle[] => {
    if (!vehicles) return [];
    return vehicles.filter(v => v.status === "available");
  };

  const getVehicleAvailability = (vehicleId: number, start: Date, end: Date): boolean => {
    return true; // Placeholder - implement actual check
  };

  return {
    vehicles: vehicles || [],
    vehiclesLoading,
    updateVehicleStatus: updateVehicleStatusMutation.mutate,
    checkOverlap: checkOverlapMutation.mutateAsync,
    getAvailableVehicles,
    getVehicleAvailability,
    isUpdating: updateVehicleStatusMutation.isPending,
  };
}