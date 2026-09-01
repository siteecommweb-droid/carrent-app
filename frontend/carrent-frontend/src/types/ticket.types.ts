export interface TicketMessage {
  id: number;
  ticket_id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
  attachments?: string[];
}

export interface TicketAttachment {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  uploaded_at: string;
}

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed" | "pending";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketSeverity = "minor" | "major" | "critical";
export type TicketType = "booking" | "payment" | "technical" | "accident" | "deposit" | "dispute" | "general" | "carwash" | "maintenance";

export interface Ticket {
  id: number;
  reference: string;
  booking_id?: number | null;
  title: string;
  type: TicketType;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  severity: TicketSeverity;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  assigned_to_name?: string;
  category: string;
  tags: string[];
  attachments: TicketAttachment[];
  metadata?: Record<string, any>;
  first_response_at?: string;
  resolved_at?: string;
  sla_deadline?: string;
}

export interface TicketFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TicketStatus | "all";
  priority?: TicketPriority | "all";
  type?: TicketType | "all";
  assigned_to?: string | "all";
  from_date?: string;
  to_date?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  pending: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  avgResponseTime: number;
  avgResolutionTime: number;
}

export interface TicketActivity {
  id: number;
  ticket_id: number;
  action: string;
  user_id: number;
  user_name: string;
  changes: Record<string, any>;
  created_at: string;
}

export interface TicketNote {
  id: number;
  ticket_id: number;
  note: string;
  is_internal: boolean;
  created_by: string;
  created_at: string;
}