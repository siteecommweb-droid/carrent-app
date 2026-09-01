export function updateBookingLifecycle(bookings: any[]) {
  const now = new Date();

  return bookings.map((b) => {
    const dropoff = new Date(b.dropoffDate);

    if (b.status === "Confirmed" && dropoff < now) {
      return { ...b, status: "Completed" };
    }

    return b;
  });
}







