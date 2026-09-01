import { Ticket, TicketPriority, TicketStatus, TicketType } from "@/types/ticket.types";
import { TICKET_PRIORITY_CONFIG, TICKET_STATUS_CONFIG, TICKET_TYPE_CONFIG } from "@/constants/ticket.constants";

export function getTicketStatusInfo(status: TicketStatus) {
  return TICKET_STATUS_CONFIG[status] || TICKET_STATUS_CONFIG.open;
}

export function getTicketPriorityInfo(priority: TicketPriority) {
  return TICKET_PRIORITY_CONFIG[priority] || TICKET_PRIORITY_CONFIG.medium;
}

export function getTicketTypeInfo(type: TicketType) {
  return TICKET_TYPE_CONFIG[type] || TICKET_TYPE_CONFIG.general;
}

export function formatTicketReference(reference: string): string {
  return reference.toUpperCase();
}

export function getTicketAge(ticket: Ticket): number {
  const created = new Date(ticket.created_at);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
}

export function isTicketOverdue(ticket: Ticket): boolean {
  if (!ticket.sla_deadline) return false;
  const deadline = new Date(ticket.sla_deadline);
  const now = new Date();
  return now > deadline && ticket.status !== "resolved" && ticket.status !== "closed";
}

export function getTicketSLAStatus(ticket: Ticket): { status: "ok" | "warning" | "critical" | "overdue"; percentage: number } {
  if (!ticket.sla_deadline || ticket.status === "resolved" || ticket.status === "closed") {
    return { status: "ok", percentage: 100 };
  }
  
  const created = new Date(ticket.created_at);
  const deadline = new Date(ticket.sla_deadline);
  const now = new Date();
  const totalDuration = deadline.getTime() - created.getTime();
  const elapsed = now.getTime() - created.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  if (percentage >= 100) return { status: "overdue", percentage: 100 };
  if (percentage >= 85) return { status: "critical", percentage };
  if (percentage >= 70) return { status: "warning", percentage };
  return { status: "ok", percentage };
}

export function groupTicketsByStatus(tickets: Ticket[]): Record<TicketStatus, Ticket[]> {
  return tickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) acc[ticket.status] = [];
    acc[ticket.status].push(ticket);
    return acc;
  }, {} as Record<TicketStatus, Ticket[]>);
}

export function searchTickets(tickets: Ticket[], query: string): Ticket[] {
  const searchTerm = query.toLowerCase();
  return tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm) ||
    ticket.reference.toLowerCase().includes(searchTerm) ||
    ticket.customer_name.toLowerCase().includes(searchTerm) ||
    ticket.customer_email.toLowerCase().includes(searchTerm) ||
    ticket.description.toLowerCase().includes(searchTerm)
  );
}

export function filterTickets(tickets: Ticket[], filters: { status?: string; priority?: string; type?: string; assigned_to?: string }): Ticket[] {
  return tickets.filter(ticket => {
    if (filters.status && filters.status !== "all" && ticket.status !== filters.status) return false;
    if (filters.priority && filters.priority !== "all" && ticket.priority !== filters.priority) return false;
    if (filters.type && filters.type !== "all" && ticket.type !== filters.type) return false;
    if (filters.assigned_to === "me" && !ticket.assigned_to) return false;
    if (filters.assigned_to === "unassigned" && ticket.assigned_to) return false;
    return true;
  });
}

export function getTicketStats(tickets: Ticket[]): { total: number; open: number; inProgress: number; resolved: number; closed: number; pending: number; urgent: number; high: number; medium: number; low: number } {
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    closed: tickets.filter(t => t.status === "closed").length,
    pending: tickets.filter(t => t.status === "pending").length,
    urgent: tickets.filter(t => t.priority === "urgent").length,
    high: tickets.filter(t => t.priority === "high").length,
    medium: tickets.filter(t => t.priority === "medium").length,
    low: tickets.filter(t => t.priority === "low").length,
  };
}