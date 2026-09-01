import type { BookingRecord } from "@/types/booking";

export function generateInvoice(booking: BookingRecord) {
  const text = `
INVOICE

Name: ${booking.fullName}
Reference: ${booking.reference}
Car: ${booking.car.name}
Total: MUR ${booking.price.grandTotalMUR}
`;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${booking.reference}-invoice.txt`;
  a.click();
  URL.revokeObjectURL(url);
}







