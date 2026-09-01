import { fetchAPI } from "@/lib/api";
import { Ticket, TicketMessage, TicketStats, TicketFilterParams, TicketActivity, TicketNote } from "@/types/ticket.types";

const BASE_URL = "/admin/tickets";

export const ticketApi = {
  async getTickets(params?: TicketFilterParams): Promise<{ data: Ticket[]; total: number; stats: TicketStats }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status && params.status !== "all") queryParams.append("status", params.status);
    if (params?.priority && params.priority !== "all") queryParams.append("priority", params.priority);
    if (params?.type && params.type !== "all") queryParams.append("type", params.type);
    if (params?.assigned_to && params.assigned_to !== "all") queryParams.append("assigned_to", params.assigned_to);
    if (params?.from_date) queryParams.append("from_date", params.from_date);
    if (params?.to_date) queryParams.append("to_date", params.to_date);
    
    const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL;
    const response = await fetchAPI(url);
    return response;
  },

  async getTicket(id: number): Promise<Ticket> {
    return fetchAPI(`${BASE_URL}/${id}`);
  },

  async getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
    const response = await fetchAPI(`${BASE_URL}/${ticketId}/messages`);
    return response.data || response;
  },

  async createTicket(data: FormData): Promise<Ticket> {
    return fetchAPI(BASE_URL, {
      method: "POST",
      body: data,
      headers: {},
    });
  },

  async sendMessage(ticketId: number, data: FormData): Promise<TicketMessage> {
    return fetchAPI(`${BASE_URL}/${ticketId}/messages`, {
      method: "POST",
      body: data,
      headers: {},
    });
  },

  async updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket> {
    return fetchAPI(`${BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: number, status: string): Promise<Ticket> {
    return fetchAPI(`${BASE_URL}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async updatePriority(id: number, priority: string): Promise<Ticket> {
    return fetchAPI(`${BASE_URL}/${id}/priority`, {
      method: "PATCH",
      body: JSON.stringify({ priority }),
    });
  },

  async assignTicket(id: number, assignedTo: string): Promise<Ticket> {
    return fetchAPI(`${BASE_URL}/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ assigned_to: assignedTo }),
    });
  },

  async addNote(id: number, note: string, isInternal: boolean): Promise<TicketNote> {
    return fetchAPI(`${BASE_URL}/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note, is_internal: isInternal }),
    });
  },

  async getActivities(id: number): Promise<TicketActivity[]> {
    const response = await fetchAPI(`${BASE_URL}/${id}/activities`);
    return response.data || response;
  },

  async getStats(): Promise<TicketStats> {
    const response = await fetchAPI(`${BASE_URL}/stats`);
    return response.data || response;
  },

  async deleteAttachment(id: number, attachmentId: number): Promise<void> {
    await fetchAPI(`${BASE_URL}/${id}/attachments/${attachmentId}`, {
      method: "DELETE",
    });
  },

  async bulkUpdate(ids: number[], data: Partial<Ticket>): Promise<Ticket[]> {
    return fetchAPI(`${BASE_URL}/bulk`, {
      method: "PATCH",
      body: JSON.stringify({ ids, ...data }),
    });
  },
};