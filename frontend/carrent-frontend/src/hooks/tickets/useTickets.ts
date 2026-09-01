import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/services/tickets/ticket.api";
import { Ticket, TicketFilterParams, TicketStats } from "@/types/ticket.types";
import { toast } from "react-hot-toast";

export const TICKETS_QUERY_KEY = "tickets";
export const TICKET_STATS_QUERY_KEY = "ticket-stats";

export function useTickets(filters?: TicketFilterParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [TICKETS_QUERY_KEY, filters],
    queryFn: () => ticketApi.getTickets(filters),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Ticket> }) =>
      ticketApi.updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TICKET_STATS_QUERY_KEY] });
      toast.success("Ticket updated successfully");
    },
    onError: () => {
      toast.error("Failed to update ticket");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ticketApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: [TICKETS_QUERY_KEY] });
      const previousTickets = queryClient.getQueryData([TICKETS_QUERY_KEY, filters]);
      queryClient.setQueryData([TICKETS_QUERY_KEY, filters], (old: any) => ({
        ...old,
        data: old?.data?.map((t: Ticket) =>
          t.id === id ? { ...t, status: status as any } : t
        ),
      }));
      return { previousTickets };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([TICKETS_QUERY_KEY, filters], context?.previousTickets);
      toast.error("Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TICKET_STATS_QUERY_KEY] });
    },
  });

  const assignTicketMutation = useMutation({
    mutationFn: ({ id, assignedTo }: { id: number; assignedTo: string }) =>
      ticketApi.assignTicket(id, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      toast.success("Ticket assigned successfully");
    },
    onError: () => {
      toast.error("Failed to assign ticket");
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, data }: { ids: number[]; data: Partial<Ticket> }) =>
      ticketApi.bulkUpdate(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_QUERY_KEY] });
      toast.success("Bulk update completed");
    },
    onError: () => {
      toast.error("Failed to perform bulk update");
    },
  });

  return {
    tickets: data?.data || [],
    total: data?.total || 0,
    stats: data?.stats,
    isLoading,
    error,
    refetch,
    updateTicket: updateTicketMutation.mutate,
    updateTicketAsync: updateTicketMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutate,
    updateStatusAsync: updateStatusMutation.mutateAsync,
    assignTicket: assignTicketMutation.mutate,
    assignTicketAsync: assignTicketMutation.mutateAsync,
    bulkUpdate: bulkUpdateMutation.mutate,
    isUpdating: updateTicketMutation.isPending,
    isAssigning: assignTicketMutation.isPending,
  };
}

export function useTicketStats() {
  return useQuery({
    queryKey: [TICKET_STATS_QUERY_KEY],
    queryFn: () => ticketApi.getStats(),
    staleTime: 60000,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });
}