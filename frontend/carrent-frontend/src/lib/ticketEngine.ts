export type TicketStatus =
  | "created"
  | "awaiting_allocation"
  | "allocated"
  | "assigned_to_staff"
  | "delivery_in_progress"
  | "delivery_submitted"
  | "admin_delivery_review"
  | "ready_for_rental"
  | "return_in_progress"
  | "return_submitted"
  | "admin_return_review"
  | "completed"
  | "closed"
  | "under_review"
  | "resolved_with_charge";

export type PartnerCode = "WEB" | "DC" | "CJ" | "RT" | "WL";

export function generateBookingRef(partner: PartnerCode) {
  const random = Math.floor(Math.random() * 100000);
  return `AM38-${partner}-${random}`;
}

export function getInitialTicketStatus(): TicketStatus {
  return "created";
}

export function nextStatusAfterDelivery(): TicketStatus {
  return "delivery_submitted";
}

export function nextStatusAfterReturn(): TicketStatus {
  return "return_submitted";
}




