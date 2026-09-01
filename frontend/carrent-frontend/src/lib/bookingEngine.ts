import { createBooking } from "@/lib/api";
import {
  generateBookingRef,
  getInitialTicketStatus,
} from "./ticketEngine";

export async function createBookingWithTicket(data: any) {
  const partner = data.partnerCode || "WEB";

  const bookingRef = generateBookingRef(partner);

  const payload = {
    ...data,
    bookingRef,
    ticketStatus: getInitialTicketStatus(),
    partnerCode: partner,
  };

  const res = await createBooking(payload);

  return res || {
    ...payload,
    id: Date.now(),
  };
}




