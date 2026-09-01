import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";

/* ================= GET USER TICKETS ================= */

export function useSupportTicketsQuery() {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const response = await fetchAPI("/tickets/my");
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/* ================= GET SINGLE TICKET ================= */

export function useSupportTicketQuery(id?: number) {
  return useQuery({
    queryKey: ["support-ticket", id],
    queryFn: async () => {
      if (!id) throw new Error("Ticket ID is required");
      
      const [ticket, messages] = await Promise.all([
        fetchAPI(`/tickets/${id}`),
        fetchAPI(`/tickets/${id}/messages`),
      ]);
      
      return { ticket, messages };
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}

/* ================= CREATE TICKET ================= */

export function useCreateSupportTicketMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetchAPI("/tickets", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch tickets list
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error: any) => {
      console.error("Failed to create ticket:", error);
    },
  });
}

/* ================= SEND MESSAGE TO TICKET ================= */

export function useSendSupportMessageMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, message }: { id: number; message: string }) => {
      const response = await fetchAPI(`/tickets/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      return response;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific ticket to refresh messages
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.id] });
    },
    onError: (error: any) => {
      console.error("Failed to send message:", error);
    },
  });
}

/* ================= CLOSE TICKET ================= */

export function useCloseSupportTicketMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetchAPI(`/tickets/${id}/close`, {
        method: "PUT",
      });
      return response;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
    },
  });
}