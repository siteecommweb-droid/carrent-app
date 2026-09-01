type Booking = {
  carId: string;
  name: string;
  pricePerDay: number;
  days: number;
  total: number;
  createdAt: string;
};

const STORAGE_KEY = "am38_bookings";

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBooking(b: Booking) {
  const existing = getBookings();
  const updated = [b, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearBookings() {
  localStorage.removeItem(STORAGE_KEY);
}




