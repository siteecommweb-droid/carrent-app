import { TicketStatus, TicketPriority, TicketType } from "@/types/ticket.types";
import { AlertCircle, Clock, CheckCircle, XCircle, Flag, Car, CreditCard, Wrench, AlertTriangle, HelpCircle, Droplets, Settings } from "lucide-react";

export const TICKET_STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: any }> = {
  open: { label: "Open", color: "text-yellow-800", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", icon: AlertCircle },
  "in-progress": { label: "In Progress", color: "text-blue-800", bgColor: "bg-blue-50", borderColor: "border-blue-200", icon: Clock },
  resolved: { label: "Resolved", color: "text-green-800", bgColor: "bg-green-50", borderColor: "border-green-200", icon: CheckCircle },
  closed: { label: "Closed", color: "text-gray-800", bgColor: "bg-gray-50", borderColor: "border-gray-200", icon: XCircle },
  pending: { label: "Pending", color: "text-purple-800", bgColor: "bg-purple-50", borderColor: "border-purple-200", icon: Clock },
};

export const TICKET_PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bgColor: string; icon: any; sortOrder: number }> = {
  low: { label: "Low", color: "text-gray-700", bgColor: "bg-gray-100", icon: Flag, sortOrder: 1 },
  medium: { label: "Medium", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: Flag, sortOrder: 2 },
  high: { label: "High", color: "text-orange-700", bgColor: "bg-orange-100", icon: Flag, sortOrder: 3 },
  urgent: { label: "Urgent", color: "text-red-700", bgColor: "bg-red-100", icon: Flag, sortOrder: 4 },
};

export const TICKET_TYPE_CONFIG: Record<TicketType, { label: string; color: string; bgColor: string; icon: any }> = {
  booking: { label: "Booking Issue", color: "text-blue-700", bgColor: "bg-blue-100", icon: Car },
  payment: { label: "Payment Problem", color: "text-green-700", bgColor: "bg-green-100", icon: CreditCard },
  technical: { label: "Technical Issue", color: "text-purple-700", bgColor: "bg-purple-100", icon: Settings },
  accident: { label: "Accident Report", color: "text-red-700", bgColor: "bg-red-100", icon: AlertTriangle },
  deposit: { label: "Deposit Refund", color: "text-orange-700", bgColor: "bg-orange-100", icon: CreditCard },
  dispute: { label: "Dispute", color: "text-pink-700", bgColor: "bg-pink-100", icon: AlertCircle },
  general: { label: "General Inquiry", color: "text-gray-700", bgColor: "bg-gray-100", icon: HelpCircle },
  carwash: { label: "Car Wash Request", color: "text-teal-700", bgColor: "bg-teal-100", icon: Droplets },
  maintenance: { label: "Maintenance Request", color: "text-indigo-700", bgColor: "bg-indigo-100", icon: Wrench },
};

export const TICKET_SORT_OPTIONS = [
  { value: "created_at_desc", label: "Newest First" },
  { value: "created_at_asc", label: "Oldest First" },
  { value: "updated_at_desc", label: "Recently Updated" },
  { value: "priority_desc", label: "Highest Priority" },
  { value: "status_asc", label: "By Status" },
];

export const TICKET_FILTER_PRESETS = [
  { id: "all", label: "All Tickets", filters: {} },
  { id: "my_tickets", label: "Assigned to Me", filters: { assigned_to: "me" } },
  { id: "unassigned", label: "Unassigned", filters: { assigned_to: "none" } },
  { id: "urgent", label: "Urgent & High", filters: { priority: ["urgent", "high"] } },
  { id: "overdue", label: "Overdue SLA", filters: { overdue: true } },
];

export const TICKET_REFRESH_INTERVAL = 30000; // 30 seconds
export const TICKET_PAGE_SIZE = 20;
export const TICKET_MAX_ATTACHMENTS = 10;
export const TICKET_MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "text/plain"];