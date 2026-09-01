import { CalendarEventType, CalendarEventStatus, VehicleStatus } from "@/types/calendar.types";

export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  booking: "#10b981",
  ticket: "#8b5cf6",
  maintenance: "#f97316",
  wash: "#06b6d4",
  repair: "#ef4444",
  blocked: "#6b7280",
  delivery: "#3b82f6",
  pickup: "#f59e0b",
  inspection: "#ec4899",
  service: "#14b8a6",
};

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  booking: "Booking",
  ticket: "Ticket",
  maintenance: "Maintenance",
  wash: "Car Wash",
  repair: "Repair",
  blocked: "Blocked",
  delivery: "Delivery",
  pickup: "Pickup",
  inspection: "Inspection",
  service: "Service",
};

export const EVENT_STATUS_COLORS: Record<CalendarEventStatus, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  "in-progress": "#3b82f6",
  completed: "#6b7280",
  cancelled: "#ef4444",
  missed: "#dc2626",
};

export const EVENT_STATUS_LABELS: Record<CalendarEventStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  missed: "Missed",
};

export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  available: "#10b981",
  rented: "#3b82f6",
  maintenance: "#f97316",
  cleaning: "#06b6d4",
  blocked: "#ef4444",
  reserved: "#8b5cf6",
};

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Available",
  rented: "Rented",
  maintenance: "In Maintenance",
  cleaning: "Cleaning",
  blocked: "Blocked",
  reserved: "Reserved",
};

export const CALENDAR_VIEWS = ["month", "week", "day", "agenda"] as const;
export const CALENDAR_REFRESH_INTERVAL = 30000;
export const EVENT_OVERLAP_WARNING_THRESHOLD = 30; // minutes