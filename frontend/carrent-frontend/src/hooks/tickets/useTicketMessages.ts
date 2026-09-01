import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketApi } from "@/services/tickets/ticket.api";
import { TicketMessage } from "@/types/ticket.types";
import { toast } from "react-hot-toast";

export const TICKET_MESSAGES_QUERY_KEY = "ticket-messages";

export function useTicketMessages(ticketId: number | null) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [TICKET_MESSAGES_QUERY_KEY, ticketId],
    queryFn: () => (ticketId ? ticketApi.getTicketMessages(ticketId) : Promise.resolve([])),
    enabled: !!ticketId,
    staleTime: 10000,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: number; data: FormData }) =>
      ticketApi.sendMessage(ticketId, data),
    onMutate: async ({ ticketId, data }) => {
      await queryClient.cancelQueries({ queryKey: [TICKET_MESSAGES_QUERY_KEY, ticketId] });
      const previousMessages = queryClient.getQueryData([TICKET_MESSAGES_QUERY_KEY, ticketId]);
      
      const optimisticMessage: TicketMessage = {
        id: Date.now(),
        ticket_id: ticketId,
        message: data.get("message") as string,
        is_admin: true,
        created_at: new Date().toISOString(),
        attachments: [],
      };
      
      queryClient.setQueryData([TICKET_MESSAGES_QUERY_KEY, ticketId], (old: TicketMessage[] = []) => [...old, optimisticMessage]);
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData([TICKET_MESSAGES_QUERY_KEY, variables.ticketId], context?.previousMessages);
      toast.error("Failed to send message");
    },
    onSettled: (_, __, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: [TICKET_MESSAGES_QUERY_KEY, ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  return {
    messages: data || [],
    isLoading,
    error,
    refetch,
    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}