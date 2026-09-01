import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarApi } from "@/services/calendar/calendar.api";
import { CalendarEvent, CalendarFilterParams, CalendarStats } from "@/types/calendar.types";
import { toast } from "react-hot-toast";

export const CALENDAR_EVENTS_KEY = "calendar-events";
export const CALENDAR_STATS_KEY = "calendar-stats";
export const CALENDAR_VEHICLES_KEY = "calendar-vehicles";

export function useCalendarEvents(filters?: CalendarFilterParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [CALENDAR_EVENTS_KEY, filters],
    queryFn: () => calendarApi.getEvents(filters),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  const createEventMutation = useMutation({
    mutationFn: (event: Partial<CalendarEvent>) => calendarApi.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [CALENDAR_STATS_KEY] });
      toast.success("Event created successfully");
    },
    onError: () => toast.error("Failed to create event"),
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CalendarEvent> }) =>
      calendarApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_KEY] });
      toast.success("Event updated successfully");
    },
    onError: () => toast.error("Failed to update event"),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => calendarApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [CALENDAR_STATS_KEY] });
      toast.success("Event deleted successfully");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const moveEventMutation = useMutation({
    mutationFn: ({ id, start, end }: { id: string; start: Date; end: Date }) =>
      calendarApi.moveEvent(id, start, end),
    onMutate: async ({ id, start, end }) => {
      await queryClient.cancelQueries({ queryKey: [CALENDAR_EVENTS_KEY, filters] });
      const previousEvents = queryClient.getQueryData([CALENDAR_EVENTS_KEY, filters]);
      queryClient.setQueryData([CALENDAR_EVENTS_KEY, filters], (old: CalendarEvent[] = []) =>
        old.map(e => e.id === id ? { ...e, start, end } : e)
      );
      return { previousEvents };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([CALENDAR_EVENTS_KEY, filters], context?.previousEvents);
      toast.error("Failed to move event");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_KEY] });
    },
  });

  return {
    events: data || [],
    isLoading,
    error,
    refetch,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    moveEvent: moveEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
  };
}

export function useCalendarStats() {
  return useQuery({
    queryKey: [CALENDAR_STATS_KEY],
    queryFn: () => calendarApi.getStats(),
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

export function useVehicles() {
  return useQuery({
    queryKey: [CALENDAR_VEHICLES_KEY],
    queryFn: () => calendarApi.getVehicles(),
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
}